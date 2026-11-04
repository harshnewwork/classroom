-- ==============================================================================
-- Classroom Booking — Mentors Studio Admin Panel Database Schema
-- Supabase / PostgreSQL Setup Script
--
-- This script configures:
-- 1. `rooms` table (seeded with 11 cabins from cabins.js)
-- 2. `room_status_history` audit log table (populated via trigger)
-- 3. `admins` authorization table
-- 4. `enquiries` table (persisting public booking form submissions)
-- 5. `time_slots` table (canonical 10 fixed daily session slots)
-- 6. `room_slot_bookings` table (per-room, per-date, per-slot availability)
-- 7. `slot_booking_history` audit log table (date & slot level change tracking)
-- 8. Helper functions and trigger handlers
-- 9. Strict Row Level Security (RLS) policies
-- 10. Supabase Realtime publication for live synchronization
-- ==============================================================================

-- ==============================================================================
-- 1. ROOMS TABLE
-- ==============================================================================
create table if not exists public.rooms (
  id text primary key,
  name text not null,
  capacity integer not null,
  type text not null,
  is_booked boolean not null default false,
  booked_note text,
  updated_at timestamptz not null default now(),
  updated_by text
);

comment on table public.rooms is 'Fixed studio rooms with booking status toggled by studio administrators';
comment on column public.rooms.id is 'Matches existing cabin id (e.g. A, ARTS, BALCONY)';
comment on column public.rooms.is_booked is 'True if marked as booked/occupied, false if available';
comment on column public.rooms.booked_note is 'Optional free-text note (e.g. educator name, batch, time window)';
comment on column public.rooms.updated_by is 'Email or UID of admin who last modified this room';

-- ==============================================================================
-- 2. ROOM STATUS HISTORY AUDIT LOG TABLE
-- ==============================================================================
create table if not exists public.room_status_history (
  id bigint generated always as identity primary key,
  room_id text not null references public.rooms(id) on delete cascade,
  is_booked boolean not null,
  note text,
  changed_by text,
  changed_at timestamptz not null default now()
);

comment on table public.room_status_history is 'Audit trail of legacy room status changes';

create index if not exists idx_room_status_history_room_id on public.room_status_history(room_id);
create index if not exists idx_room_status_history_changed_at on public.room_status_history(changed_at desc);

-- ==============================================================================
-- 3. ADMINS AUTHORIZATION TABLE
-- ==============================================================================
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Authorized administrators allowed to access the room status and enquiries panel';

-- Helper function: check if authenticated user is in public.admins
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admins
    where id = auth.uid()
  );
$$;

-- ==============================================================================
-- 4. ENQUIRIES TABLE (Public Form Submissions)
-- ==============================================================================
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  subject text not null,
  student_type text not null,
  batch_size integer not null check (batch_size > 0),
  cabin_capacity text,
  days text not null,
  time_slot text not null,
  notes text,
  submitted_via text not null check (submitted_via in ('whatsapp', 'copy')),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'declined')),
  admin_note text,
  assigned_room_id text references public.rooms(id) on delete set null,
  booking_date date,
  slot_id text references public.time_slots(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

comment on table public.enquiries is 'Public lead-gen enquiries submitted via the booking form';
create index if not exists idx_enquiries_assigned_room_id on public.enquiries(assigned_room_id);
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);
create index if not exists idx_enquiries_booking_date on public.enquiries(booking_date);
create index if not exists idx_enquiries_slot_id on public.enquiries(slot_id);

-- ==============================================================================
-- 5. TIME SLOTS TABLE (Canonical 10 fixed daily session slots)
-- ==============================================================================
create table if not exists public.time_slots (
  id text primary key,
  label text not null unique,
  session_group text not null check (session_group in ('Morning', 'Evening')),
  start_time text not null,
  end_time text not null,
  duration text not null,
  sort_order integer not null unique
);

comment on table public.time_slots is 'Canonical recurring daily session slots from Booking and Timings';

insert into public.time_slots (id, label, session_group, start_time, end_time, duration, sort_order)
values
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
on conflict (id) do update set
  label = excluded.label,
  session_group = excluded.session_group,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  duration = excluded.duration,
  sort_order = excluded.sort_order;

-- ==============================================================================
-- 6. ROOM SLOT BOOKINGS TABLE (Availability per room + date + time slot)
-- ==============================================================================
create table if not exists public.room_slot_bookings (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.rooms(id) on delete cascade,
  booking_date date not null,
  slot_id text not null references public.time_slots(id) on delete cascade,
  is_booked boolean not null default true,
  note text,
  enquiry_id uuid references public.enquiries(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text,
  constraint unq_room_date_slot unique (room_id, booking_date, slot_id)
);

comment on table public.room_slot_bookings is 'Per-date, per-slot room booking availability records';
-- Ensure column exists if table was created in an earlier migration
alter table public.room_slot_bookings 
  add column if not exists enquiry_id uuid references public.enquiries(id) on delete set null;

create index if not exists idx_room_slot_bookings_date on public.room_slot_bookings(booking_date);
create index if not exists idx_room_slot_bookings_room_date on public.room_slot_bookings(room_id, booking_date);
create index if not exists idx_room_slot_bookings_slot on public.room_slot_bookings(slot_id);
create index if not exists idx_room_slot_bookings_enquiry on public.room_slot_bookings(enquiry_id);

-- ==============================================================================
-- 7. SLOT BOOKING HISTORY AUDIT LOG TABLE
-- ==============================================================================
create table if not exists public.slot_booking_history (
  id bigint generated always as identity primary key,
  room_id text not null references public.rooms(id) on delete cascade,
  booking_date date not null,
  slot_id text not null references public.time_slots(id) on delete cascade,
  action text not null, -- 'BOOKED', 'FREED', 'NOTE_UPDATED'
  note text,
  changed_by text,
  changed_at timestamptz not null default now()
);

comment on table public.slot_booking_history is 'Audit trail of every date and slot level change';
create index if not exists idx_slot_booking_history_room_date on public.slot_booking_history(room_id, booking_date);
create index if not exists idx_slot_booking_history_changed_at on public.slot_booking_history(changed_at desc);

-- ==============================================================================
-- 8. TRIGGER FUNCTIONS
-- ==============================================================================

-- Trigger: auto-update updated_at on rooms
create or replace function public.handle_room_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  if new.updated_by is null or new.updated_by = old.updated_by then
    new.updated_by = coalesce(auth.jwt()->>'email', auth.uid()::text, old.updated_by, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_room_updated_at on public.rooms;
create trigger trg_room_updated_at
before update on public.rooms
for each row
execute function public.handle_room_updated_at();

-- Trigger: auto-update updated_at on enquiries
create or replace function public.handle_enquiry_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  if new.updated_by is null or new.updated_by = old.updated_by then
    new.updated_by = coalesce(auth.jwt()->>'email', auth.uid()::text, old.updated_by, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enquiry_updated_at on public.enquiries;
create trigger trg_enquiry_updated_at
before update on public.enquiries
for each row
execute function public.handle_enquiry_updated_at();

-- Trigger: audit log on room_slot_bookings changes
create or replace function public.handle_slot_booking_history()
returns trigger
language plpgsql
security definer
as $$
declare
  v_action text;
  v_room_id text;
  v_date date;
  v_slot_id text;
  v_note text;
  v_user text;
begin
  if (TG_OP = 'INSERT') then
    v_action := case when new.is_booked then 'BOOKED' else 'FREED' end;
    v_room_id := new.room_id;
    v_date := new.booking_date;
    v_slot_id := new.slot_id;
    v_note := new.note;
    v_user := coalesce(new.updated_by, auth.jwt()->>'email', auth.uid()::text, 'admin');
  elsif (TG_OP = 'UPDATE') then
    if (old.is_booked is distinct from new.is_booked) then
      v_action := case when new.is_booked then 'BOOKED' else 'FREED' end;
    else
      v_action := 'NOTE_UPDATED';
    end if;
    v_room_id := new.room_id;
    v_date := new.booking_date;
    v_slot_id := new.slot_id;
    v_note := new.note;
    v_user := coalesce(new.updated_by, auth.jwt()->>'email', auth.uid()::text, 'admin');
  elsif (TG_OP = 'DELETE') then
    v_action := 'FREED';
    v_room_id := old.room_id;
    v_date := old.booking_date;
    v_slot_id := old.slot_id;
    v_note := old.note;
    v_user := coalesce(auth.jwt()->>'email', auth.uid()::text, 'admin');
  end if;

  insert into public.slot_booking_history (
    room_id,
    booking_date,
    slot_id,
    action,
    note,
    changed_by,
    changed_at
  ) values (
    v_room_id,
    v_date,
    v_slot_id,
    v_action,
    v_note,
    v_user,
    now()
  );

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_slot_booking_history on public.room_slot_bookings;
create trigger trg_slot_booking_history
after insert or update or delete on public.room_slot_bookings
for each row
execute function public.handle_slot_booking_history();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.rooms enable row level security;
alter table public.room_status_history enable row level security;
alter table public.admins enable row level security;
alter table public.enquiries enable row level security;
alter table public.time_slots enable row level security;
alter table public.room_slot_bookings enable row level security;
alter table public.slot_booking_history enable row level security;

-- Rooms policies
drop policy if exists "Admins can view rooms" on public.rooms;
create policy "Admins can view rooms"
  on public.rooms
  for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can update rooms" on public.rooms;
create policy "Admins can update rooms"
  on public.rooms
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Disallow client insert rooms" on public.rooms;
create policy "Disallow client insert rooms"
  on public.rooms
  for insert
  to authenticated
  with check (false);

drop policy if exists "Disallow client delete rooms" on public.rooms;
create policy "Disallow client delete rooms"
  on public.rooms
  for delete
  to authenticated
  using (false);

-- Admins table policy
drop policy if exists "Admins can view admins" on public.admins;
create policy "Admins can view admins"
  on public.admins
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

-- Enquiries policies
drop policy if exists "Allow public to insert enquiries" on public.enquiries;
create policy "Allow public to insert enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can view enquiries" on public.enquiries;
create policy "Admins can view enquiries"
  on public.enquiries
  for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
  on public.enquiries
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries"
  on public.enquiries
  for delete
  to authenticated
  using ((select public.is_admin()));

-- Time slots policies (Readable by all authenticated/anon users)
drop policy if exists "Allow reading time slots" on public.time_slots;
create policy "Allow reading time slots"
  on public.time_slots
  for select
  to anon, authenticated
  using (true);

-- Room slot bookings policies (Admin only)
drop policy if exists "Admins can view slot bookings" on public.room_slot_bookings;
create policy "Admins can view slot bookings"
  on public.room_slot_bookings
  for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can insert slot bookings" on public.room_slot_bookings;
create policy "Admins can insert slot bookings"
  on public.room_slot_bookings
  for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update slot bookings" on public.room_slot_bookings;
create policy "Admins can update slot bookings"
  on public.room_slot_bookings
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete slot bookings" on public.room_slot_bookings;
create policy "Admins can delete slot bookings"
  on public.room_slot_bookings
  for delete
  to authenticated
  using ((select public.is_admin()));

-- Slot booking history policies
drop policy if exists "Admins can view slot booking history" on public.slot_booking_history;
create policy "Admins can view slot booking history"
  on public.slot_booking_history
  for select
  to authenticated
  using ((select public.is_admin()));

-- ==============================================================================
-- 10. SUPABASE REALTIME CONFIGURATION
-- ==============================================================================
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end;
$$;

alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.enquiries;
alter publication supabase_realtime add table public.room_slot_bookings;

-- ==============================================================================
-- 11. SEED ROOMS DATA (11 fixed rooms from src/data/cabins.js)
-- ==============================================================================
insert into public.rooms (id, name, capacity, type, is_booked, booked_note)
values
  ('A', 'Cabin A', 6, 'Standard', false, null),
  ('B', 'Cabin B', 6, 'Standard', false, null),
  ('C', 'Cabin C', 6, 'Standard', false, null),
  ('D', 'Cabin D', 8, 'Standard', false, null),
  ('E', 'Cabin E', 10, 'Medium', false, null),
  ('F', 'Cabin F', 10, 'Medium', false, null),
  ('G', 'Cabin G', 12, 'Large', false, null),
  ('H', 'Cabin H', 12, 'Large', false, null),
  ('I', 'Cabin I', 24, 'Seminar', false, null),
  ('ARTS', 'Arts & Crafts Area', 16, 'Open Area', false, null),
  ('BALCONY', 'Balcony / Botany Area', 10, 'Open Area', false, null)
on conflict (id) do update set
  name = excluded.name,
  capacity = excluded.capacity,
  type = excluded.type;
