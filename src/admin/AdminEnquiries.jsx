import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  TIME_SLOTS,
  findSlotByString,
  getSlotById,
  formatDateDisplay,
} from './timeSlots';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  Edit2,
  Trash2,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Inbox,
  DoorOpen,
  ExternalLink,
  Calendar,
  CalendarDays,
  AlertTriangle,
} from 'lucide-react';

function formatRelativeTime(dateString) {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

function formatFullDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.length === 10) return `91${cleaned}`;
  return cleaned;
}

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getOffsetDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AdminEnquiries({ rooms = [], user, showToast, onNavigateToCalendar }) {
  const [enquiries, setEnquiries] = useState([]);
  const [slotBookings, setSlotBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ACTIVE'); // 'ACTIVE' (new+contacted), 'ALL', 'new', 'contacted', 'confirmed', 'declined'
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Per-enquiry scheduling drafts: { [enquiryId]: { date: string, slotId: string, roomId: string } }
  const [schedules, setSchedules] = useState({});

  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Delete confirmation modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Overwrite conflict modal
  const [conflictModalData, setConflictModalData] = useState(null); // { enquiry, schedule, existingBooking }

  // Fetch all slot bookings to cross-check calendar conflicts live
  const fetchSlotBookings = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('room_slot_bookings')
        .select('*');

      if (!error && data) {
        setSlotBookings(data);
      }
    } catch {
      // Table might not exist yet or offline
    }
  }, []);

  // Fetch all enquiries from Supabase
  const fetchEnquiries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setErrorMsg(null);

    try {
      if (!supabase) return;
      const { data, error: fetchErr } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setEnquiries(data || []);
      await fetchSlotBookings();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch enquiries');
      if (showToast) showToast(err.message || 'Failed to fetch enquiries', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fetchSlotBookings, showToast]);

  // Set up Supabase Realtime subscription on 'enquiries' and 'room_slot_bookings'
  useEffect(() => {
    let ignore = false;

    async function initialLoad() {
      try {
        if (!supabase) return;
        const { data, error: fetchErr } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchErr) throw fetchErr;
        if (!ignore && data) {
          setEnquiries(data);
        }
        await fetchSlotBookings();
      } catch (err) {
        if (!ignore) {
          setErrorMsg(err.message || 'Failed to fetch enquiries');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initialLoad();

    if (!supabase) return;

    const enquiriesChannel = supabase
      .channel('admin-enquiries-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enquiries' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEnquiries((prev) => [payload.new, ...prev.filter((e) => e.id !== payload.new.id)]);
            if (showToast) {
              showToast(`New enquiry received from ${payload.new.name}!`, 'success');
            }
          } else if (payload.eventType === 'UPDATE') {
            setEnquiries((prev) =>
              prev.map((e) => (e.id === payload.new.id ? { ...e, ...payload.new } : e))
            );
          } else if (payload.eventType === 'DELETE') {
            setEnquiries((prev) => prev.filter((e) => e.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const slotsChannel = supabase
      .channel('admin-enquiries-slots-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_slot_bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSlotBookings((prev) => [...prev.filter((b) => b.id !== payload.new.id), payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setSlotBookings((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          } else if (payload.eventType === 'DELETE') {
            setSlotBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(enquiriesChannel);
      supabase.removeChannel(slotsChannel);
    };
  }, [fetchSlotBookings, showToast]);

  // Helper to get active schedule parameters for an enquiry
  const getEnquirySchedule = useCallback((enquiry) => {
    const draft = schedules[enquiry.id];
    if (draft) return draft;

    const defaultDate = enquiry.booking_date || getTodayString();
    const defaultSlot = enquiry.slot_id || findSlotByString(enquiry.time_slot)?.id || 'M1';
    const defaultRoom = enquiry.assigned_room_id || '';

    return {
      date: defaultDate,
      slotId: defaultSlot,
      roomId: defaultRoom,
    };
  }, [schedules]);

  // Update schedule field draft for an enquiry
  const updateScheduleDraft = (enquiryId, patch) => {
    setSchedules((prev) => {
      const current = prev[enquiryId] || {};
      return {
        ...prev,
        [enquiryId]: { ...current, ...patch },
      };
    });
  };

  // Check live conflict for given room, date, and slot
  const checkSlotStatus = useCallback((roomId, dateStr, slotId, currentEnquiryId) => {
    if (!roomId || !dateStr || !slotId) return { state: 'INCOMPLETE' };

    const existing = slotBookings.find(
      (b) =>
        b.room_id === roomId &&
        b.booking_date === dateStr &&
        b.slot_id === slotId &&
        b.is_booked
    );

    if (!existing) {
      return { state: 'AVAILABLE' };
    }

    if (existing.enquiry_id === currentEnquiryId) {
      return { state: 'CONFIRMED_FOR_ME', booking: existing };
    }

    return { state: 'CONFLICT', booking: existing };
  }, [slotBookings]);

  // Execute confirm and book slot in calendar
  const executeBooking = async (enquiry, schedule) => {
    const { roomId, date, slotId } = schedule;
    setActionLoadingId(enquiry.id);

    const prevEnquiries = [...enquiries];
    const prevBookings = [...slotBookings];

    const slotNote = `${enquiry.name} — ${enquiry.subject} (${enquiry.batch_size} students)`;

    // 1. Optimistic UI update
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiry.id
          ? {
              ...e,
              status: 'confirmed',
              assigned_room_id: roomId,
              booking_date: date,
              slot_id: slotId,
              updated_at: new Date().toISOString(),
              updated_by: user?.email || 'admin',
            }
          : e
      )
    );

    try {
      // 2. Persist room_slot_bookings in Supabase
      if (supabase) {
        const slotPayload = {
          room_id: roomId,
          booking_date: date,
          slot_id: slotId,
          is_booked: true,
          note: slotNote,
          enquiry_id: enquiry.id,
          updated_at: new Date().toISOString(),
          updated_by: user?.email || 'admin',
        };

        const { error: slotErr } = await supabase
          .from('room_slot_bookings')
          .upsert([slotPayload], { onConflict: 'room_id,booking_date,slot_id' });

        if (slotErr) {
          if (slotErr.code === 'PGRST205' || slotErr.message.includes('does not exist')) {
            throw new Error(
              "Table 'public.room_slot_bookings' not found. Please run the migration script in Supabase SQL Editor."
            );
          }
          throw slotErr;
        }

        // Clean up previous booking if changed
        if (
          enquiry.assigned_room_id &&
          enquiry.booking_date &&
          enquiry.slot_id &&
          (enquiry.assigned_room_id !== roomId ||
            enquiry.booking_date !== date ||
            enquiry.slot_id !== slotId)
        ) {
          await supabase
            .from('room_slot_bookings')
            .delete()
            .match({
              room_id: enquiry.assigned_room_id,
              booking_date: enquiry.booking_date,
              slot_id: enquiry.slot_id,
              enquiry_id: enquiry.id,
            });
        }

        // 3. Update enquiries record
        const enquiryUpdates = {
          status: 'confirmed',
          assigned_room_id: roomId,
          updated_at: new Date().toISOString(),
          updated_by: user?.email || 'admin',
        };

        let updateRes = await supabase
          .from('enquiries')
          .update({
            ...enquiryUpdates,
            booking_date: date,
            slot_id: slotId,
          })
          .eq('id', enquiry.id);

        if (updateRes.error) {
          if (updateRes.error.message.includes('column') && updateRes.error.message.includes('does not exist')) {
            updateRes = await supabase
              .from('enquiries')
              .update(enquiryUpdates)
              .eq('id', enquiry.id);
          } else {
            throw updateRes.error;
          }
        }
      }

      await fetchSlotBookings();

      const slotObj = getSlotById(slotId);
      const roomObj = rooms.find((r) => r.id === roomId);

      if (showToast) {
        showToast(
          `✓ Booking Confirmed! Cabin ${roomObj ? roomObj.name : roomId} reserved for ${enquiry.name} on ${formatDateDisplay(date)} (${slotObj ? slotObj.shortTime : slotId}).`,
          'success'
        );
      }
    } catch (err) {
      setEnquiries(prevEnquiries);
      setSlotBookings(prevBookings);
      if (showToast) {
        showToast(`Failed to confirm booking: ${err.message}`, 'error');
      }
    } finally {
      setActionLoadingId(null);
      setConflictModalData(null);
    }
  };

  // Handle click on "Confirm & Book Room"
  const handleConfirmClick = (enquiry) => {
    const schedule = getEnquirySchedule(enquiry);
    if (!schedule.roomId) {
      if (showToast) showToast('Please select a cabin to assign for this booking.', 'error');
      return;
    }
    if (!schedule.date) {
      if (showToast) showToast('Please select a valid booking date.', 'error');
      return;
    }
    if (!schedule.slotId) {
      if (showToast) showToast('Please select a session time slot.', 'error');
      return;
    }

    const status = checkSlotStatus(schedule.roomId, schedule.date, schedule.slotId, enquiry.id);
    if (status.state === 'CONFLICT') {
      setConflictModalData({
        enquiry,
        schedule,
        existingBooking: status.booking,
      });
      return;
    }

    executeBooking(enquiry, schedule);
  };

  // Handle freeing up or releasing a confirmed slot
  const handleReleaseSlot = async (enquiry) => {
    setActionLoadingId(enquiry.id);
    const prevEnquiries = [...enquiries];
    const prevBookings = [...slotBookings];

    const currentRoomId = enquiry.assigned_room_id;
    const currentDate = enquiry.booking_date;
    const currentSlotId = enquiry.slot_id;

    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiry.id
          ? {
              ...e,
              status: 'contacted',
              booking_date: null,
              slot_id: null,
              updated_at: new Date().toISOString(),
              updated_by: user?.email || 'admin',
            }
          : e
      )
    );

    try {
      if (supabase) {
        if (currentRoomId && currentDate && currentSlotId) {
          await supabase
            .from('room_slot_bookings')
            .delete()
            .match({
              room_id: currentRoomId,
              booking_date: currentDate,
              slot_id: currentSlotId,
            });
        }

        const updates = {
          status: 'contacted',
          updated_at: new Date().toISOString(),
          updated_by: user?.email || 'admin',
        };

        let res = await supabase
          .from('enquiries')
          .update({
            ...updates,
            booking_date: null,
            slot_id: null,
          })
          .eq('id', enquiry.id);

        if (res.error && res.error.message.includes('column')) {
          await supabase.from('enquiries').update(updates).eq('id', enquiry.id);
        }
      }

      await fetchSlotBookings();

      if (showToast) {
        showToast(`Slot released. Booking status changed back to Contacted.`, 'success');
      }
    } catch (err) {
      setEnquiries(prevEnquiries);
      setSlotBookings(prevBookings);
      if (showToast) {
        showToast(`Failed to release slot: ${err.message}`, 'error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status update handler (for Contacted, Declined, New)
  const handleUpdateStatus = async (enquiryId, newStatus) => {
    setActionLoadingId(enquiryId);
    const prevEnquiries = [...enquiries];
    const enquiry = enquiries.find((e) => e.id === enquiryId);

    const updates = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      updated_by: user?.email || 'admin',
    };

    if (newStatus === 'new') {
      updates.booking_date = null;
      updates.slot_id = null;
    }

    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, ...updates } : e))
    );

    try {
      if (supabase) {
        if ((newStatus === 'declined' || newStatus === 'new') && enquiry?.assigned_room_id && enquiry?.booking_date && enquiry?.slot_id) {
          await supabase
            .from('room_slot_bookings')
            .delete()
            .match({
              room_id: enquiry.assigned_room_id,
              booking_date: enquiry.booking_date,
              slot_id: enquiry.slot_id,
            });
          await fetchSlotBookings();
        }

        let { error: updateErr } = await supabase
          .from('enquiries')
          .update(updates)
          .eq('id', enquiryId);

        if (updateErr && updateErr.message.includes('column')) {
          const fallbackUpdates = {
            status: newStatus,
            updated_at: new Date().toISOString(),
            updated_by: user?.email || 'admin',
          };
          updateErr = (await supabase.from('enquiries').update(fallbackUpdates).eq('id', enquiryId)).error;
        }

        if (updateErr) throw updateErr;
      }

      const statusLabels = {
        contacted: 'marked as Contacted',
        confirmed: 'Confirmed',
        declined: 'Declined (calendar slot released)',
        new: 'marked as New',
      };

      if (showToast) {
        showToast(`Enquiry ${statusLabels[newStatus] || newStatus}.`, 'success');
      }
    } catch (err) {
      setEnquiries(prevEnquiries);
      if (showToast) {
        showToast(`Failed to update status: ${err.message}`, 'error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Save internal admin note
  const handleSaveAdminNote = async (enquiry) => {
    const trimmed = noteDraft.trim() || null;
    setActionLoadingId(enquiry.id);
    setEditingNoteId(null);

    const prevEnquiries = [...enquiries];
    const updates = {
      admin_note: trimmed,
      updated_at: new Date().toISOString(),
      updated_by: user?.email || 'admin',
    };

    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiry.id ? { ...e, ...updates } : e))
    );

    try {
      if (supabase) {
        const { error: updateErr } = await supabase
          .from('enquiries')
          .update(updates)
          .eq('id', enquiry.id);

        if (updateErr) throw updateErr;
      }

      if (showToast) {
        showToast('Admin note saved.', 'success');
      }
    } catch (err) {
      setEnquiries(prevEnquiries);
      if (showToast) {
        showToast(`Failed to save note: ${err.message}`, 'error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async (enquiryId) => {
    setActionLoadingId(enquiryId);
    setDeleteConfirmId(null);
    const prevEnquiries = [...enquiries];
    const enquiry = enquiries.find((e) => e.id === enquiryId);

    setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));

    try {
      if (supabase) {
        if (enquiry?.assigned_room_id && enquiry?.booking_date && enquiry?.slot_id) {
          await supabase
            .from('room_slot_bookings')
            .delete()
            .match({
              room_id: enquiry.assigned_room_id,
              booking_date: enquiry.booking_date,
              slot_id: enquiry.slot_id,
            });
          await fetchSlotBookings();
        }

        const { error: delErr } = await supabase
          .from('enquiries')
          .delete()
          .eq('id', enquiryId);

        if (delErr) throw delErr;
      }

      if (showToast) {
        showToast('Enquiry deleted.', 'success');
      }
    } catch (err) {
      setEnquiries(prevEnquiries);
      if (showToast) {
        showToast(`Failed to delete enquiry: ${err.message}`, 'error');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metric counts
  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const contactedCount = enquiries.filter((e) => e.status === 'contacted').length;
  const confirmedCount = enquiries.filter((e) => e.status === 'confirmed').length;
  const declinedCount = enquiries.filter((e) => e.status === 'declined').length;
  const activePendingCount = newCount + contactedCount;

  // Filtered enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      let matchesStatus = true;
      if (statusFilter === 'ACTIVE') {
        matchesStatus = item.status === 'new' || item.status === 'contacted';
      } else if (statusFilter !== 'ALL') {
        matchesStatus = item.status === statusFilter;
      }

      const query = search.trim().toLowerCase();
      if (!query) return matchesStatus;

      const matchesSearch =
        item.name?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.subject?.toLowerCase().includes(query) ||
        item.student_type?.toLowerCase().includes(query) ||
        item.days?.toLowerCase().includes(query) ||
        item.time_slot?.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query) ||
        item.admin_note?.toLowerCase().includes(query) ||
        item.assigned_room_id?.toLowerCase().includes(query) ||
        item.booking_date?.toLowerCase().includes(query) ||
        item.slot_id?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, search, statusFilter]);

  return (
    <div className="space-y-6">
      
      {/* Error message banner if query failed */}
      {errorMsg && (
        <div className="p-4 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] text-xs flex items-center justify-between font-body">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#9B3329]" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => fetchEnquiries(false)}
            className="px-2.5 py-1 bg-[#F8D7D4] hover:bg-[#F2B8B4] text-[#9B3329] rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* New Enquiries */}
        <div
          onClick={() => setStatusFilter('new')}
          className={`cursor-pointer border rounded-sm p-4 transition-all shadow-2xs ${
            statusFilter === 'new'
              ? 'bg-[#FBF0DA] border-[#C9A96B] shadow-xs'
              : 'bg-[#F7F2EA] border-[#DDD0B8] hover:border-[#C9A96B]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A8883F]">
              New Enquiries
            </span>
            <span className="w-2 h-2 rounded-full bg-[#C9A96B] animate-ping" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-display font-bold text-[#1A1A1A]">{newCount}</span>
            <span className="font-mono text-[10px] text-[#7A6A50]">Pending</span>
          </div>
        </div>

        {/* Contacted */}
        <div
          onClick={() => setStatusFilter('contacted')}
          className={`cursor-pointer border rounded-sm p-4 transition-all shadow-2xs ${
            statusFilter === 'contacted'
              ? 'bg-[#EAF2F8] border-[#A8C6DF] shadow-xs'
              : 'bg-[#F7F2EA] border-[#DDD0B8] hover:border-[#C9A96B]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#356B98]">
              Contacted
            </span>
            <MessageCircle className="w-3.5 h-3.5 text-[#356B98]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-display font-bold text-[#1A1A1A]">{contactedCount}</span>
            <span className="font-mono text-[10px] text-[#7A6A50]">Discussion</span>
          </div>
        </div>

        {/* Confirmed */}
        <div
          onClick={() => setStatusFilter('confirmed')}
          className={`cursor-pointer border rounded-sm p-4 transition-all shadow-2xs ${
            statusFilter === 'confirmed'
              ? 'bg-[#E8F2E4] border-[#A6CFA0] shadow-xs'
              : 'bg-[#F7F2EA] border-[#DDD0B8] hover:border-[#C9A96B]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2A3A20]">
              Confirmed
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2A3A20]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-display font-bold text-[#2A3A20]">{confirmedCount}</span>
            <span className="font-mono text-[10px] text-[#2A3A20]/80">On Calendar</span>
          </div>
        </div>

        {/* Declined */}
        <div
          onClick={() => setStatusFilter('declined')}
          className={`cursor-pointer border rounded-sm p-4 transition-all shadow-2xs ${
            statusFilter === 'declined'
              ? 'bg-[#FFF1F0] border-[#F8D7D4] shadow-xs'
              : 'bg-[#F7F2EA] border-[#DDD0B8] hover:border-[#C9A96B]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9B3329]">
              Declined
            </span>
            <XCircle className="w-3.5 h-3.5 text-[#9B3329]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-display font-bold text-[#9B3329]">{declinedCount}</span>
            <span className="font-mono text-[10px] text-[#7A6A50]">Not booked</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-3 sm:p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center bg-[#FAF6F0] p-1 rounded-sm border border-[#DDD0B8] text-xs gap-1 font-mono">
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'ACTIVE'
                ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            <span>Action Required</span>
            {activePendingCount > 0 && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded-sm font-bold ${
                statusFilter === 'ACTIVE' ? 'bg-[#1A1A1A] text-[#F7F2EA]' : 'bg-[#EADCC8] text-[#3E2F1F]'
              }`}>
                {activePendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'new'
                ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            <span>New</span>
            {newCount > 0 && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded-sm font-bold ${
                statusFilter === 'new' ? 'bg-[#1A1A1A] text-[#F7F2EA]' : 'bg-[#EADCC8] text-[#3E2F1F]'
              }`}>
                {newCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
              statusFilter === 'contacted'
                ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            Contacted ({contactedCount})
          </button>

          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
              statusFilter === 'confirmed'
                ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>

          <button
            onClick={() => setStatusFilter('declined')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
              statusFilter === 'declined'
                ? 'bg-[#9B3329] text-white font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            Declined ({declinedCount})
          </button>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#EADCC8] text-[#1A1A1A] font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            All ({enquiries.length})
          </button>
        </div>

        {/* Search input & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A89880] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, subject, slot..."
              className="w-full bg-white border border-[#DDD0B8] rounded-sm pl-9 pr-8 py-1.5 text-xs text-[#1A1A1A] placeholder-[#A89880] focus:outline-none focus:border-[#C9A96B] transition-colors font-body"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-[#A89880] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => fetchEnquiries(false)}
            disabled={loading}
            title="Refresh enquiries list"
            className="p-2 text-[#7A6A50] hover:text-[#1A1A1A] bg-[#FAF6F0] border border-[#DDD0B8] hover:bg-[#EADCC8] rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Enquiries List */}
      {loading && enquiries.length === 0 ? (
        <div className="py-20 text-center text-[#7A6A50] flex flex-col items-center justify-center gap-3 font-body">
          <RefreshCw className="w-8 h-8 animate-spin text-[#C9A96B]" />
          <p className="text-sm font-medium">Loading form enquiries...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-12 text-center text-[#7A6A50] shadow-2xs font-body">
          <Inbox className="w-10 h-10 mx-auto text-[#A89880] mb-2" />
          <p className="text-sm font-display font-semibold text-[#1A1A1A]">
            {enquiries.length === 0
              ? 'No enquiries submitted yet'
              : 'No enquiries match this filter'}
          </p>
          <p className="font-mono text-xs text-[#A89880] mt-1 max-w-sm mx-auto">
            {enquiries.length === 0
              ? 'Submissions made on the public website will instantly appear here via Realtime.'
              : 'Try clearing your search query or selecting a different status tab above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredEnquiries.map((enquiry) => {
            const isActionLoading = actionLoadingId === enquiry.id;
            const isEditingNote = editingNoteId === enquiry.id;
            const waNumber = cleanPhoneForWhatsApp(enquiry.phone);

            // Active scheduling selection for this ticket
            const schedule = getEnquirySchedule(enquiry);
            const slotObj = getSlotById(schedule.slotId);
            const assignedRoom = rooms.find((r) => r.id === schedule.roomId);

            // Check availability and conflict status
            const slotStatus = checkSlotStatus(
              schedule.roomId,
              schedule.date,
              schedule.slotId,
              enquiry.id
            );

            // Status styling
            const statusConfig = {
              new: {
                bg: 'bg-[#FBF0DA]',
                border: 'border-[#C9A96B]',
                text: 'text-[#5A4A2A]',
                dot: 'bg-[#C9A96B]',
                label: 'New Enquiry',
              },
              contacted: {
                bg: 'bg-[#EAF2F8]',
                border: 'border-[#A8C6DF]',
                text: 'text-[#2C5270]',
                dot: 'bg-[#356B98]',
                label: 'In Discussion',
              },
              confirmed: {
                bg: 'bg-[#E8F2E4]',
                border: 'border-[#A6CFA0]',
                text: 'text-[#2A3A20]',
                dot: 'bg-[#2A3A20]',
                label: 'Confirmed on Calendar',
              },
              declined: {
                bg: 'bg-[#FFF1F0]',
                border: 'border-[#F8D7D4]',
                text: 'text-[#9B3329]',
                dot: 'bg-[#9B3329]',
                label: 'Declined',
              },
            }[enquiry.status] || {
              bg: 'bg-[#FAF6F0]',
              border: 'border-[#DDD0B8]',
              text: 'text-[#7A6A50]',
              dot: 'bg-[#A89880]',
              label: enquiry.status,
            };

            const isConfirmed = enquiry.status === 'confirmed';

            return (
              <div
                key={enquiry.id}
                className={`bg-[#F7F2EA] border rounded-sm overflow-hidden transition-all duration-200 shadow-2xs ${
                  isConfirmed
                    ? 'border-[#A6CFA0]'
                    : enquiry.status === 'new'
                    ? 'border-[#C9A96B]'
                    : 'border-[#DDD0B8]'
                }`}
              >
                {/* Header bar */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD0B8] bg-[#FAF6F0]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    
                    {/* Status Pill */}
                    <span
                      className={`px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </span>

                    {/* Submitted via badge */}
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-medium flex items-center gap-1 border ${
                        enquiry.submitted_via === 'whatsapp'
                          ? 'bg-[#EAF7EE] text-[#1D7736] border-[#A3DCB3]'
                          : 'bg-[#FAF6F0] text-[#7A6A50] border-[#DDD0B8]'
                      }`}
                    >
                      {enquiry.submitted_via === 'whatsapp' ? (
                        <>
                          <MessageCircle className="w-3 h-3 text-[#1D7736]" />
                          <span>via WhatsApp</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#C9A96B]" />
                          <span>via Copy Request</span>
                        </>
                      )}
                    </span>

                    {/* Relative timestamp */}
                    <span
                      title={formatFullDateTime(enquiry.created_at)}
                      className="text-xs text-[#7A6A50] flex items-center gap-1 font-mono"
                    >
                      <Clock className="w-3 h-3 text-[#A89880]" />
                      {formatRelativeTime(enquiry.created_at)}
                    </span>
                  </div>

                  {/* Top quick actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setDeleteConfirmId(enquiry.id)}
                      disabled={isActionLoading}
                      title="Delete enquiry"
                      className="p-1.5 text-[#A89880] hover:text-[#9B3329] hover:bg-[#FFF1F0] rounded-sm transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Details Grid */}
                <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Left Column: Contact & Educator Lead Requirements (6 cols) */}
                  <div className="lg:col-span-6 space-y-4">
                    
                    {/* Name & Contact Row */}
                    <div>
                      <h3 className="text-xl font-display font-bold text-[#1A1A1A] tracking-tight flex items-center gap-2">
                        <span>{enquiry.name}</span>
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-[#7A6A50]">
                        {/* Phone */}
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="flex items-center gap-1.5 hover:text-[#1A1A1A] font-mono transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#A89880]" />
                          <span>{enquiry.phone}</span>
                        </a>

                        {/* WhatsApp direct chat link */}
                        {waNumber && (
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#1D7736] hover:text-[#145726] transition-colors font-medium font-mono"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Chat</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        {/* Email */}
                        {enquiry.email ? (
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors font-mono"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#A89880]" />
                            <span>{enquiry.email}</span>
                          </a>
                        ) : (
                          <span className="text-[#A89880] italic">No email provided</span>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Card */}
                    <div className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-3.5 space-y-3 text-xs">
                      {/* Teaching subject */}
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A6A50] block mb-0.5">
                          Teaching Subject / Course
                        </span>
                        <p className="text-[#1A1A1A] font-display font-semibold text-sm">
                          {enquiry.subject}
                        </p>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#DDD0B8]">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A6A50] block">
                            Student Category
                          </span>
                          <span className="text-[#1A1A1A] font-medium">{enquiry.student_type}</span>
                        </div>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A6A50] block">
                            Batch Size
                          </span>
                          <span className="text-[#1A1A1A] font-mono font-medium">{enquiry.batch_size} students</span>
                        </div>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A6A50] block">
                            Cabin Request
                          </span>
                          <span className="text-[#1A1A1A] font-medium">
                            {enquiry.cabin_capacity || 'Not specified'}
                          </span>
                        </div>
                      </div>

                      {/* Educator's Requested Schedule */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#DDD0B8]">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A6A50] block">
                            Requested Days
                          </span>
                          <span className="text-[#3E2F1F] font-semibold">{enquiry.days}</span>
                        </div>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A6A50] block">
                            Requested Session Time
                          </span>
                          <span className="text-[#3E2F1F] font-semibold font-mono">{enquiry.time_slot}</span>
                        </div>
                      </div>

                      {/* Educator notes if any */}
                      {enquiry.notes && (
                        <div className="pt-2 border-t border-[#DDD0B8]">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A6A50] block mb-1">
                            Educator Notes / Requirements
                          </span>
                          <p className="text-[#1A1A1A] italic bg-white p-2.5 rounded-sm border border-[#DDD0B8] font-body">
                            "{enquiry.notes}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Internal Admin Note Box */}
                    <div className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase font-bold tracking-[0.2em] text-[#7A6A50]">
                          Internal Admin Note
                        </span>
                        {!isEditingNote && (
                          <button
                            onClick={() => {
                              setEditingNoteId(enquiry.id);
                              setNoteDraft(enquiry.admin_note || '');
                            }}
                            className="font-mono text-[11px] text-[#A8883F] hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>{enquiry.admin_note ? 'Edit' : 'Add Note'}</span>
                          </button>
                        )}
                      </div>

                      {isEditingNote ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="e.g. Spoke to educator, confirmed whiteboard setup required..."
                            rows={2}
                            autoFocus
                            className="w-full bg-white border border-[#C9A96B] rounded-sm p-2 text-xs text-[#1A1A1A] placeholder-[#A89880] focus:outline-none font-body"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 rounded-sm bg-transparent hover:bg-[#EADCC8] border border-[#DDD0B8] text-[#7A6A50] text-xs font-mono transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveAdminNote(enquiry)}
                              disabled={isActionLoading}
                              className="px-3 py-1 rounded-sm bg-[#C9A96B] hover:bg-[#D4B87A] text-[#1A1A1A] font-semibold text-xs flex items-center gap-1 transition-colors border border-[#C9A96B] cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>Save Note</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          className={`text-xs ${
                            enquiry.admin_note
                              ? 'text-[#1A1A1A]'
                              : 'text-[#A89880] italic'
                          }`}
                        >
                          {enquiry.admin_note || 'No internal notes added yet.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Interactive Session Date, Time Slot & Cabin Allocation (6 cols) */}
                  <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                    
                    {/* Live Calendar Booking Command Center */}
                    <div className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-4 space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-[#DDD0B8] pb-3">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-[#C9A96B]" />
                          <h4 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A6A50]">
                            Calendar & Session Allocation
                          </h4>
                        </div>
                        {isConfirmed && (
                          <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider bg-[#E8F2E4] text-[#2A3A20] border border-[#A6CFA0]">
                            ✓ Active On Calendar
                          </span>
                        )}
                      </div>

                      {/* 1. Booking Date Option */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A6A50] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C9A96B]" />
                            <span>1. Booking Date</span>
                          </label>
                          
                          {/* Quick Date Stepper Chips */}
                          <div className="flex items-center gap-1 text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={() => updateScheduleDraft(enquiry.id, { date: getTodayString() })}
                              className={`px-1.5 py-0.5 rounded-sm border transition-colors cursor-pointer ${
                                schedule.date === getTodayString()
                                  ? 'bg-[#C9A96B] text-[#1A1A1A] border-[#C9A96B] font-bold'
                                  : 'bg-white text-[#7A6A50] border-[#DDD0B8] hover:bg-[#EADCC8]'
                              }`}
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              onClick={() => updateScheduleDraft(enquiry.id, { date: getOffsetDateString(1) })}
                              className={`px-1.5 py-0.5 rounded-sm border transition-colors cursor-pointer ${
                                schedule.date === getOffsetDateString(1)
                                  ? 'bg-[#C9A96B] text-[#1A1A1A] border-[#C9A96B] font-bold'
                                  : 'bg-white text-[#7A6A50] border-[#DDD0B8] hover:bg-[#EADCC8]'
                              }`}
                            >
                              Tomorrow
                            </button>
                            <button
                              type="button"
                              onClick={() => updateScheduleDraft(enquiry.id, { date: getOffsetDateString(7) })}
                              className={`px-1.5 py-0.5 rounded-sm border transition-colors cursor-pointer ${
                                schedule.date === getOffsetDateString(7)
                                  ? 'bg-[#C9A96B] text-[#1A1A1A] border-[#C9A96B] font-bold'
                                  : 'bg-white text-[#7A6A50] border-[#DDD0B8] hover:bg-[#EADCC8]'
                              }`}
                            >
                              +7 Days
                            </button>
                          </div>
                        </div>

                        <input
                          type="date"
                          value={schedule.date}
                          onChange={(e) => updateScheduleDraft(enquiry.id, { date: e.target.value })}
                          min={getTodayString()}
                          className="w-full bg-white border border-[#DDD0B8] rounded-sm px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A96B] transition-colors font-mono"
                        />
                        <p className="font-mono text-[10px] text-[#7A6A50]">
                          {formatDateDisplay(schedule.date)}
                        </p>
                      </div>

                      {/* 2. Session Time Slot Option */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A6A50] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C9A96B]" />
                          <span>2. Session Time Slot</span>
                        </label>

                        <select
                          value={schedule.slotId}
                          onChange={(e) => updateScheduleDraft(enquiry.id, { slotId: e.target.value })}
                          className="w-full bg-white border border-[#DDD0B8] rounded-sm px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A96B] transition-colors font-mono"
                        >
                          <optgroup label="Morning Sessions (60 mins)">
                            {TIME_SLOTS.filter((s) => s.group === 'Morning').map((s) => (
                              <option key={s.id} value={s.id}>
                                [{s.id}] {s.shortTime} — {s.duration}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Evening Sessions (55 mins)">
                            {TIME_SLOTS.filter((s) => s.group === 'Evening').map((s) => (
                              <option key={s.id} value={s.id}>
                                [{s.id}] {s.shortTime} — {s.duration}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      {/* 3. Cabin / Room Assignment Option */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A6A50] flex items-center gap-1.5">
                          <DoorOpen className="w-3.5 h-3.5 text-[#C9A96B]" />
                          <span>3. Assigned Cabin</span>
                        </label>

                        <select
                          value={schedule.roomId}
                          onChange={(e) => updateScheduleDraft(enquiry.id, { roomId: e.target.value })}
                          className="w-full bg-white border border-[#DDD0B8] rounded-sm px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A96B] transition-colors font-body"
                        >
                          <option value="">— Select Cabin to Allocate —</option>
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.capacity} seats, {r.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Live Conflict & Availability Status Banner */}
                      <div className="pt-1 font-body">
                        {slotStatus.state === 'INCOMPLETE' ? (
                          <div className="p-2.5 rounded-sm bg-white border border-[#DDD0B8] text-[11px] text-[#7A6A50] flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#A89880]" />
                            <span>Select a cabin above to verify real-time slot availability.</span>
                          </div>
                        ) : slotStatus.state === 'AVAILABLE' ? (
                          <div className="p-2.5 rounded-sm bg-[#E8F2E4] border border-[#A6CFA0] text-[11px] text-[#2A3A20] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#2A3A20]" />
                            <span>
                              <strong>Available!</strong> {assignedRoom?.name || schedule.roomId} is free on {formatDateDisplay(schedule.date)} for {slotObj?.shortTime}.
                            </span>
                          </div>
                        ) : slotStatus.state === 'CONFIRMED_FOR_ME' ? (
                          <div className="p-3 rounded-sm bg-[#E8F2E4] border border-[#A6CFA0] text-xs text-[#2A3A20] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#2A3A20]" />
                                <span>Confirmed Session Booked on Calendar</span>
                              </span>
                              <span className="text-[9px] font-mono uppercase bg-[#2A3A20] text-[#E8F2E4] px-2 py-0.5 rounded-sm font-semibold">
                                Synced
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-[#3E2F1F]">
                              {assignedRoom?.name} • {formatDateDisplay(schedule.date)} • {slotObj?.shortTime} ({schedule.slotId})
                            </div>
                            
                            {/* Calendar Link Action */}
                            {onNavigateToCalendar && (
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigateToCalendar(
                                    schedule.date,
                                    schedule.roomId,
                                    schedule.slotId
                                  )
                                }
                                className="w-full mt-1 py-1.5 px-3 bg-[#2A3A20] hover:bg-[#344E28] text-[#F7F2EA] font-mono font-bold text-xs rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <CalendarDays className="w-3.5 h-3.5" />
                                <span>View on Calendar Grid</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[11px] text-[#9B3329] flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#9B3329] mt-0.5" />
                            <div>
                              <strong className="block text-[#9B3329]">Slot Conflict!</strong>
                              <span>
                                {assignedRoom?.name || schedule.roomId} is already booked on {formatDateDisplay(schedule.date)} during {slotObj?.shortTime}
                                {slotStatus.booking?.note ? ` by: "${slotStatus.booking.note}"` : '.'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Primary Calendar Booking Action Button */}
                      <div className="pt-2">
                        {isConfirmed ? (
                          <div className="flex flex-col sm:flex-row gap-2 font-mono">
                            <button
                              type="button"
                              onClick={() => handleConfirmClick(enquiry)}
                              disabled={isActionLoading}
                              className="flex-1 py-2 px-3 rounded-sm text-xs font-semibold bg-[#EADCC8] hover:bg-[#EDE6D8] border border-[#DDD0B8] text-[#1A1A1A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isActionLoading ? 'animate-spin' : ''}`} />
                              <span>Update Slot</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReleaseSlot(enquiry)}
                              disabled={isActionLoading}
                              className="py-2 px-3 rounded-sm text-xs font-semibold bg-transparent hover:bg-[#FFF1F0] text-[#9B3329] border border-[#F8D7D4] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Release Slot</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleConfirmClick(enquiry)}
                            disabled={isActionLoading || !schedule.roomId}
                            className={`w-full py-2.5 px-4 rounded-sm text-xs font-display font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs border ${
                              schedule.roomId
                                ? 'bg-[#C9A96B] hover:bg-[#D4B87A] text-[#1A1A1A] border-[#C9A96B]'
                                : 'bg-[#EADCC8]/50 text-[#A89880] border-[#DDD0B8] cursor-not-allowed'
                            }`}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${isActionLoading ? 'animate-spin' : ''}`} />
                            <span>Confirm & Book Room on Calendar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Secondary Status Workflow Buttons */}
                    <div className="space-y-2 pt-1 border-t border-[#DDD0B8]">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-[0.2em] text-[#7A6A50] block">
                        Ticket Status Actions
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                        {/* Mark Contacted */}
                        <button
                          onClick={() => handleUpdateStatus(enquiry.id, 'contacted')}
                          disabled={isActionLoading || enquiry.status === 'contacted'}
                          className={`py-2 px-2.5 rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            enquiry.status === 'contacted'
                              ? 'bg-[#EAF2F8] text-[#2C5270] border border-[#A8C6DF] opacity-70 cursor-not-allowed'
                              : 'bg-white hover:bg-[#EAF2F8] text-[#7A6A50] hover:text-[#2C5270] border border-[#DDD0B8] hover:border-[#A8C6DF]'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contacted</span>
                        </button>

                        {/* Decline */}
                        <button
                          onClick={() => handleUpdateStatus(enquiry.id, 'declined')}
                          disabled={isActionLoading || enquiry.status === 'declined'}
                          className={`py-2 px-2.5 rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            enquiry.status === 'declined'
                              ? 'bg-[#FFF1F0] text-[#9B3329] border border-[#F8D7D4] opacity-70 cursor-not-allowed'
                              : 'bg-white hover:bg-[#FFF1F0] text-[#7A6A50] hover:text-[#9B3329] border border-[#DDD0B8] hover:border-[#F8D7D4]'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>

                        {/* Reset to New if needed */}
                        <button
                          onClick={() => handleUpdateStatus(enquiry.id, 'new')}
                          disabled={isActionLoading || enquiry.status === 'new'}
                          className={`py-2 px-2.5 rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                            enquiry.status === 'new'
                              ? 'bg-[#FAF6F0] text-[#A89880] border border-[#DDD0B8] opacity-60 cursor-not-allowed'
                              : 'bg-white hover:bg-[#FBF0DA] text-[#7A6A50] hover:text-[#5A4A2A] border border-[#DDD0B8] hover:border-[#C9A96B]'
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset to New</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer audit info */}
                <div className="bg-[#FAF6F0] border-t border-[#DDD0B8] px-4 py-2 text-[10px] font-mono text-[#7A6A50] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <span>Enquiry ID:</span>
                    <span className="text-[#1A1A1A] font-semibold">{enquiry.id.slice(0, 8)}...</span>
                  </div>
                  <div>
                    Last updated: {formatRelativeTime(enquiry.updated_at)}
                    {enquiry.updated_by ? ` by ${enquiry.updated_by}` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conflict Warning Modal */}
      {conflictModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-display font-bold text-[#1A1A1A]">Calendar Slot Conflict</h3>
              <p className="text-xs text-[#7A6A50] leading-relaxed font-body">
                Cabin <strong>{conflictModalData.schedule.roomId}</strong> is already booked on{' '}
                <strong>{formatDateDisplay(conflictModalData.schedule.date)}</strong> for{' '}
                <strong>{getSlotById(conflictModalData.schedule.slotId)?.shortTime}</strong>.
              </p>
              {conflictModalData.existingBooking?.note && (
                <p className="text-xs text-[#9B3329] italic bg-white p-2.5 rounded-sm border border-[#F8D7D4] mt-2 font-body">
                  Existing Booking: "{conflictModalData.existingBooking.note}"
                </p>
              )}
            </div>

            <p className="font-mono text-[10px] text-[#7A6A50] text-center">
              Do you want to overwrite the existing booking on the calendar, or pick another room/time?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2 font-mono">
              <button
                onClick={() => setConflictModalData(null)}
                className="px-4 py-2 bg-transparent hover:bg-[#EADCC8] border border-[#DDD0B8] text-[#7A6A50] text-xs font-semibold rounded-sm transition-colors cursor-pointer"
              >
                Cancel / Choose Another
              </button>
              <button
                onClick={() => executeBooking(conflictModalData.enquiry, conflictModalData.schedule)}
                className="px-4 py-2 bg-[#C9A96B] hover:bg-[#D4B87A] text-[#1A1A1A] text-xs font-bold rounded-sm transition-all shadow-xs border border-[#C9A96B] cursor-pointer"
              >
                Overwrite & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm w-full max-w-md p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-[#1A1A1A]">Delete Enquiry?</h3>
              <p className="text-xs text-[#7A6A50] mt-1 leading-relaxed font-body">
                This will permanently delete this enquiry and release any active calendar reservation linked to it.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2 font-mono">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-transparent hover:bg-[#EADCC8] border border-[#DDD0B8] text-[#7A6A50] text-xs font-semibold rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEnquiry(deleteConfirmId)}
                className="px-5 py-2 bg-[#9B3329] hover:bg-[#7D2921] text-white text-xs font-bold rounded-sm transition-all cursor-pointer shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
