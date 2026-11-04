# Mentors Studio — Admin Panel & Supabase Backend Setup

This guide documents the setup, database migration, and operational procedures for the hidden admin panel, calendar date/time-slot room availability, and background enquiry synchronization.

---

## 1. Architecture Overview

- **Frontend Route:** `/#/manage-rooms-7f2a` (hash-routed, strictly unlinked from public navigation, footer, and sitemaps).
- **Backend / Database:** Supabase (PostgreSQL with Row Level Security).
- **Client Library:** `@supabase/supabase-js`.
- **Availability Grain:** Date + Time-Slot level (`room_slot_bookings`) uniquely constrained on `(room_id, booking_date, slot_id)`.
- **Canonical Time Slots:** 10 recurring daily slots (5 Morning sessions 10:00 AM – 3:28 PM, 5 Evening sessions 3:30 PM – 8:29 PM) stored in `public.time_slots`.
- **Realtime Sync:** Supabase Realtime channels (`public:rooms`, `public:enquiries`, and `public:room_slot_bookings`) propagate slot changes and new form submissions to all open admin tabs instantly.
- **Audit Trails:**
  - `slot_booking_history`: logs every slot booking, cancellation, and note edit.
  - `room_status_history`: legacy room status changes.
- **Form Persistence:** Public forms in `Booking.jsx` and `ContactPage.jsx` save leads into `enquiries` table in the background (fire-and-forget) without altering or blocking the existing WhatsApp/clipboard copy actions.

---

## 2. Supabase Migration (Calendar + Time-Slot + Enquiry Synchronization)

Run this SQL block in your **Supabase Dashboard → SQL Editor** to create or upgrade the calendar availability tables, canonical slots, enquiry booking columns, and audit triggers:

```sql
-- ==============================================================================
-- 1. ADD DATE AND SLOT COLUMNS TO ENQUIRIES TABLE
-- ==============================================================================
ALTER TABLE public.enquiries 
  ADD COLUMN IF NOT EXISTS booking_date date,
  ADD COLUMN IF NOT EXISTS slot_id text;

CREATE INDEX IF NOT EXISTS idx_enquiries_booking_date ON public.enquiries(booking_date);
CREATE INDEX IF NOT EXISTS idx_enquiries_slot_id ON public.enquiries(slot_id);

-- ==============================================================================
-- 2. TIME SLOTS TABLE & SEED (Canonical 10 fixed daily slots)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.time_slots (
  id text PRIMARY KEY,
  label text NOT NULL UNIQUE,
  session_group text NOT NULL CHECK (session_group IN ('Morning', 'Evening')),
  start_time text NOT NULL,
  end_time text NOT NULL,
  duration text NOT NULL,
  sort_order integer NOT NULL UNIQUE
);

INSERT INTO public.time_slots (id, label, session_group, start_time, end_time, duration, sort_order)
VALUES
  ('M1', 'Session 1: 10:00 – 11:00 am', 'Morning', '10:00', '11:00', '60 min', 1),
  ('M2', 'Session 2: 11:07 am – 12:07 pm', 'Morning', '11:07', '12:07', '60 min', 2),
  ('M3', 'Session 3: 12:14 – 1:14 pm', 'Morning', '12:14', '13:14', '60 min', 3),
  ('M4', 'Session 4: 1:21 – 2:21 pm', 'Morning', '1:21', '2:21', '60 min', 4),
  ('M5', 'Session 5: 2:28 – 3:28 pm', 'Morning', '2:28', '3:28', '60 min', 5),
  ('E1', 'Session 1: 3:30 – 4:25 pm (evening)', 'Evening', '3:30', '4:25', '55 min', 6),
  ('E2', 'Session 2: 4:31 – 5:26 pm (evening)', 'Evening', '4:31', '5:26', '55 min', 7),
  ('E3', 'Session 3: 5:32 – 6:27 pm (evening)', 'Evening', '5:32', '6:27', '55 min', 8),
  ('E4', 'Session 4: 6:33 – 7:28 pm (evening)', 'Evening', '6:33', '7:28', '55 min', 9),
  ('E5', 'Session 5: 7:34 – 8:29 pm (evening)', 'Evening', '7:34', '8:29', '55 min', 10)
ON CONFLICT (id) DO UPDATE SET
  label = excluded.label,
  session_group = excluded.session_group,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  duration = excluded.duration,
  sort_order = excluded.sort_order;

-- ==============================================================================
-- 3. ROOM SLOT BOOKINGS TABLE (Availability per room + date + time slot)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.room_slot_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  slot_id text NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  is_booked boolean NOT NULL DEFAULT true,
  note text,
  enquiry_id uuid REFERENCES public.enquiries(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text,
  CONSTRAINT unq_room_date_slot UNIQUE (room_id, booking_date, slot_id)
);

-- Ensure column exists if table was created in an earlier migration
ALTER TABLE public.room_slot_bookings 
  ADD COLUMN IF NOT EXISTS enquiry_id uuid REFERENCES public.enquiries(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_room_slot_bookings_date ON public.room_slot_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_room_slot_bookings_room_date ON public.room_slot_bookings(room_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_room_slot_bookings_slot ON public.room_slot_bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_room_slot_bookings_enquiry ON public.room_slot_bookings(enquiry_id);

-- Foreign key constraint to enquiries.slot_id if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_enquiries_slot'
  ) THEN
    ALTER TABLE public.enquiries 
      ADD CONSTRAINT fk_enquiries_slot 
      FOREIGN KEY (slot_id) REFERENCES public.time_slots(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ==============================================================================
-- 4. SLOT BOOKING HISTORY AUDIT LOG TABLE & TRIGGER
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.slot_booking_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id text NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  slot_id text NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  action text NOT NULL, -- 'BOOKED', 'FREED', 'NOTE_UPDATED'
  note text,
  changed_by text,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_slot_booking_history_room_date ON public.slot_booking_history(room_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_slot_booking_history_changed_at ON public.slot_booking_history(changed_at DESC);

CREATE OR REPLACE FUNCTION public.handle_slot_booking_history()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_action text;
  v_room_id text;
  v_date date;
  v_slot_id text;
  v_note text;
  v_user text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    v_action := CASE WHEN new.is_booked THEN 'BOOKED' ELSE 'FREED' END;
    v_room_id := new.room_id;
    v_date := new.booking_date;
    v_slot_id := new.slot_id;
    v_note := new.note;
    v_user := coalesce(new.updated_by, auth.jwt()->>'email', auth.uid()::text, 'admin');
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (old.is_booked IS DISTINCT FROM new.is_booked) THEN
      v_action := CASE WHEN new.is_booked THEN 'BOOKED' ELSE 'FREED' END;
    ELSE
      v_action := 'NOTE_UPDATED';
    END IF;
    v_room_id := new.room_id;
    v_date := new.booking_date;
    v_slot_id := new.slot_id;
    v_note := new.note;
    v_user := coalesce(new.updated_by, auth.jwt()->>'email', auth.uid()::text, 'admin');
  ELSIF (TG_OP = 'DELETE') THEN
    v_action := 'FREED';
    v_room_id := old.room_id;
    v_date := old.booking_date;
    v_slot_id := old.slot_id;
    v_note := old.note;
    v_user := coalesce(auth.jwt()->>'email', auth.uid()::text, 'admin');
  END IF;

  INSERT INTO public.slot_booking_history (
    room_id,
    booking_date,
    slot_id,
    action,
    note,
    changed_by,
    changed_at
  ) VALUES (
    v_room_id,
    v_date,
    v_slot_id,
    v_action,
    v_note,
    v_user,
    now()
  );

  RETURN coalesce(new, old);
END;
$$;

DROP TRIGGER IF EXISTS trg_slot_booking_history ON public.room_slot_bookings;
CREATE TRIGGER trg_slot_booking_history
AFTER INSERT OR UPDATE OR DELETE ON public.room_slot_bookings
FOR EACH ROW
EXECUTE FUNCTION public.handle_slot_booking_history();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_slot_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_booking_history ENABLE ROW LEVEL SECURITY;

-- Time slots: readable
DROP POLICY IF EXISTS "Allow reading time slots" ON public.time_slots;
CREATE POLICY "Allow reading time slots"
  ON public.time_slots
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Room slot bookings: authenticated admins only
DROP POLICY IF EXISTS "Admins can view slot bookings" ON public.room_slot_bookings;
CREATE POLICY "Admins can view slot bookings"
  ON public.room_slot_bookings
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can insert slot bookings" ON public.room_slot_bookings;
CREATE POLICY "Admins can insert slot bookings"
  ON public.room_slot_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can update slot bookings" ON public.room_slot_bookings;
CREATE POLICY "Admins can update slot bookings"
  ON public.room_slot_bookings
  FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can delete slot bookings" ON public.room_slot_bookings;
CREATE POLICY "Admins can delete slot bookings"
  ON public.room_slot_bookings
  FOR DELETE
  TO authenticated
  USING ((SELECT public.is_admin()));

-- Slot booking history: admin read only
DROP POLICY IF EXISTS "Admins can view slot booking history" ON public.slot_booking_history;
CREATE POLICY "Admins can view slot booking history"
  ON public.slot_booking_history
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

-- ==============================================================================
-- 6. REALTIME PUBLICATION & RELOAD SCHEMA CACHE
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_slot_bookings;
NOTIFY pgrst, 'reload schema';
```
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admins can delete slot bookings" ON public.room_slot_bookings;
CREATE POLICY "Admins can delete slot bookings"
  ON public.room_slot_bookings
  FOR DELETE
  TO authenticated
  USING ((SELECT public.is_admin()));

-- Slot booking history: admin read only
DROP POLICY IF EXISTS "Admins can view slot booking history" ON public.slot_booking_history;
CREATE POLICY "Admins can view slot booking history"
  ON public.slot_booking_history
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

-- ==============================================================================
-- 5. REALTIME PUBLICATION & RELOAD SCHEMA CACHE
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_slot_bookings;
NOTIFY pgrst, 'reload schema';
```

---

## 3. Admin Panel Calendar & Matrix Features

### Room Availability Calendar Matrix (`/#/manage-rooms-7f2a`)
- **Date Selector:**
  - Prev / Next day steppers (`<` and `>`).
  - "Today" quick shortcut.
  - Native calendar picker (`<input type="date">`).
  - Formatted display (e.g. `Wednesday, 4 Nov 2026`).
- **Room × Slot Grid:**
  - Rows: All 11 rooms with cabin badge, name, capacity, and occupancy chip for that date (e.g. `Free all day`, `2/10 Booked`).
  - Columns: 10 daily fixed time slots grouped into **Morning Sessions** (10:00 AM – 3:28 PM) and **Evening Sessions** (3:30 PM – 8:29 PM).
- **Cell Actions:**
  - Click on an Available cell (`+`): opens a modal to book the slot on that date with an optional teacher/batch note (e.g. "Dr. Verma — Physics").
  - Click on a Booked cell: opens slot details modal showing who booked it and when, allowing the admin to edit the note or free up/cancel the booking.
- **Single Source of Truth:**
  - Availability is computed dynamically per selected calendar date from `room_slot_bookings`. No conflicting or duplicate sources of truth.
  - Switching dates immediately queries and displays that date's slots with zero stale data.
- **Audit Log:**
  - Click **Audit Log** to inspect all slot bookings and cancellations chronologically with admin user identity and teacher notes.
