import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  TIME_SLOTS,
  MORNING_SLOTS,
  EVENING_SLOTS,
  formatDateForInput,
  formatDisplayDate,
  getDateRelativeLabel,
  addDaysToDate,
} from './timeSlots';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Building,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  Edit2,
  Trash2,
} from 'lucide-react';

function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
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

export function AdminRoomAvailability({
  rooms = [],
  user,
  showToast,
  onOpenHistory,
  controlledDate,
  onDateChange,
  highlightCell,
}) {
  const [internalDate, setInternalDate] = useState(() =>
    formatDateForInput(new Date())
  );

  const selectedDate = controlledDate || internalDate;
  const setSelectedDate = useCallback(
    (valOrFn) => {
      const nextVal =
        typeof valOrFn === 'function' ? valOrFn(selectedDate) : valOrFn;
      setInternalDate(nextVal);
      if (onDateChange) onDateChange(nextVal);
    },
    [selectedDate, onDateChange]
  );

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'OCCUPIED', 'AVAILABLE'
  const [search, setSearch] = useState('');

  // Modals state
  const [bookingModalData, setBookingModalData] = useState(null); // { room, slot }
  const [bookingNoteDraft, setBookingNoteDraft] = useState('');
  const [slotDetailsModalData, setSlotDetailsModalData] = useState(null); // { room, slot, booking }
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteDraft, setEditNoteDraft] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch bookings for selectedDate
  const fetchBookingsForDate = useCallback(
    async (dateStr, silent = false) => {
      if (!silent) setLoading(true);
      setErrorMsg(null);

      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('room_slot_bookings')
          .select('*')
          .eq('booking_date', dateStr);

        if (error) {
          if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
            throw new Error(
              "Table 'public.room_slot_bookings' not found. Please run the migration script in Supabase SQL Editor."
            );
          }
          throw error;
        }

        setBookings(data || []);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to fetch slot bookings');
        if (showToast) showToast(err.message, 'error');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [showToast]
  );

  // Load bookings when selectedDate changes & set up Realtime subscription
  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!ignore) {
        await fetchBookingsForDate(selectedDate);
      }
    }

    load();

    if (!supabase) return;

    // Realtime subscription on room_slot_bookings
    const channel = supabase
      .channel(`admin-slots-${selectedDate}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_slot_bookings',
          filter: `booking_date=eq.${selectedDate}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings((prev) => [
              ...prev.filter((b) => b.id !== payload.new.id),
              payload.new,
            ]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          } else if (payload.eventType === 'DELETE') {
            setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [selectedDate, fetchBookingsForDate]);

  // Date Navigation handlers
  const handlePrevDay = () => setSelectedDate((d) => addDaysToDate(d, -1));
  const handleNextDay = () => setSelectedDate((d) => addDaysToDate(d, 1));
  const handleToday = () => setSelectedDate(formatDateForInput(new Date()));

  // Map of bookings for O(1) cell lookup: key = `${room_id}_${slot_id}`
  const bookingMap = useMemo(() => {
    const map = new Map();
    for (const b of bookings) {
      if (b.is_booked) {
        map.set(`${b.room_id}_${b.slot_id}`, b);
      }
    }
    return map;
  }, [bookings]);

  // Modal Action 1: Book an available slot
  const handleConfirmBooking = async () => {
    if (!bookingModalData) return;
    const { room, slot } = bookingModalData;
    setActionLoading(true);

    try {
      if (supabase) {
        // Pre-write freshness check: re-fetch the current row for this cell
        const { data: freshRow, error: checkError } = await supabase
          .from('room_slot_bookings')
          .select('*')
          .eq('room_id', room.id)
          .eq('booking_date', selectedDate)
          .eq('slot_id', slot.id)
          .maybeSingle();

        if (checkError) throw checkError;

        const currentCellBooking = bookings.find(
          (b) => b.room_id === room.id && b.slot_id === slot.id
        );

        const isConflict =
          freshRow &&
          freshRow.is_booked &&
          (!currentCellBooking?.is_booked ||
            (currentCellBooking?.note || null) !== (freshRow.note || null));

        if (isConflict) {
          if (showToast) {
            showToast('This slot was just booked by someone else, refreshing.', 'error');
          }
          // Re-render cell with the fresh data and refresh the date bookings
          setBookings((prev) => [
            ...prev.filter(
              (b) => !(b.room_id === room.id && b.slot_id === slot.id)
            ),
            freshRow,
          ]);
          fetchBookingsForDate(selectedDate, true);
          setBookingModalData(null);
          setBookingNoteDraft('');
          return;
        }

        const payload = {
          room_id: room.id,
          booking_date: selectedDate,
          slot_id: slot.id,
          is_booked: true,
          note: bookingNoteDraft.trim() || null,
          updated_by: user?.email || 'admin',
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('room_slot_bookings')
          .upsert([payload], { onConflict: 'room_id,booking_date,slot_id' })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setBookings((prev) => [
            ...prev.filter(
              (b) => !(b.room_id === room.id && b.slot_id === slot.id)
            ),
            data,
          ]);
        }
      }

      if (showToast) {
        showToast(
          `Booked ${room.name} for ${slot.label} on ${selectedDate}`,
          'success'
        );
      }
      setBookingModalData(null);
      setBookingNoteDraft('');
    } catch (err) {
      if (showToast) showToast(`Failed to book slot: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Modal Action 2: Free up a booked slot
  const handleFreeUpSlot = async () => {
    if (!slotDetailsModalData) return;
    const { room, slot, booking } = slotDetailsModalData;
    setActionLoading(true);

    const prevBookings = [...bookings];

    // Optimistic UI update
    setBookings((prev) =>
      prev.filter(
        (b) => !(b.room_id === room.id && b.slot_id === slot.id)
      )
    );

    try {
      if (supabase && booking?.id) {
        const { error } = await supabase
          .from('room_slot_bookings')
          .delete()
          .match({
            room_id: room.id,
            booking_date: selectedDate,
            slot_id: slot.id,
          });

        if (error) throw error;
      }

      if (showToast) {
        showToast(
          `Freed up ${room.name} (${slot.label}) for ${selectedDate}`,
          'success'
        );
      }
      setSlotDetailsModalData(null);
    } catch (err) {
      setBookings(prevBookings);
      if (showToast) showToast(`Failed to free slot: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Modal Action 3: Save updated note on booked slot
  const handleSaveSlotNote = async () => {
    if (!slotDetailsModalData) return;
    const { room, slot, booking } = slotDetailsModalData;
    setActionLoading(true);
    const newNote = editNoteDraft.trim() || null;

    // Optimistic update
    setBookings((prev) =>
      prev.map((b) =>
        b.room_id === room.id && b.slot_id === slot.id
          ? { ...b, note: newNote, updated_by: user?.email || 'admin', updated_at: new Date().toISOString() }
          : b
      )
    );

    try {
      if (supabase && booking?.id) {
        const { data, error } = await supabase
          .from('room_slot_bookings')
          .update({
            note: newNote,
            updated_by: user?.email || 'admin',
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setBookings((prev) =>
            prev.map((b) => (b.id === data.id ? data : b))
          );
        }
      }

      if (showToast) showToast('Note updated.', 'success');
      setIsEditingNote(false);
      setSlotDetailsModalData((prev) =>
        prev ? { ...prev, booking: { ...prev.booking, note: newNote } } : null
      );
    } catch (err) {
      if (showToast) showToast(`Failed to update note: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Summary Metrics calculations
  const totalSlotsCount = rooms.length * TIME_SLOTS.length;
  const totalBookedSlots = bookingMap.size;
  const totalFreeSlots = Math.max(0, totalSlotsCount - totalBookedSlots);
  const occupancyPercentage =
    totalSlotsCount > 0
      ? Math.round((totalBookedSlots / totalSlotsCount) * 100)
      : 0;

  // Filtered & Searched rooms
  const filteredRooms = rooms.filter((room) => {
    // Check occupancy filter
    let roomBookedCount = 0;
    for (const slot of TIME_SLOTS) {
      if (bookingMap.has(`${room.id}_${slot.id}`)) {
        roomBookedCount++;
      }
    }

    if (filter === 'OCCUPIED' && roomBookedCount === 0) return false;
    if (filter === 'AVAILABLE' && roomBookedCount > 0) return false;

    // Search query
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const matchesRoom =
      room.name.toLowerCase().includes(q) ||
      room.id.toLowerCase().includes(q) ||
      room.type.toLowerCase().includes(q);

    const matchesNotes = bookings.some(
      (b) =>
        b.room_id === room.id &&
        b.note &&
        b.note.toLowerCase().includes(q)
    );

    return matchesRoom || matchesNotes;
  });

  const relativeLabel = getDateRelativeLabel(selectedDate);

  return (
    <div className="space-y-6">
      
      {/* Error message banner */}
      {errorMsg && (
        <div className="p-4 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] text-xs flex items-center justify-between font-body">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#9B3329]" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => fetchBookingsForDate(selectedDate, false)}
            className="px-2.5 py-1 bg-[#F8D7D4] hover:bg-[#F2B8B4] text-[#9B3329] rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Date Navigation & Calendar Bar */}
      <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Day Steppers & Formatted Date */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          <div className="flex items-center bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-1">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 text-[#7A6A50] hover:text-[#1A1A1A] hover:bg-[#EADCC8] rounded-sm transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded-sm transition-all cursor-pointer ${
                relativeLabel === 'Today'
                  ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs'
                  : 'text-[#7A6A50] hover:text-[#1A1A1A] hover:bg-[#EADCC8]'
              }`}
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 text-[#7A6A50] hover:text-[#1A1A1A] hover:bg-[#EADCC8] rounded-sm transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="relative flex items-center bg-white border border-[#DDD0B8] rounded-sm px-3 py-1.5 hover:border-[#C9A96B] transition-colors">
            <CalendarIcon className="w-4 h-4 text-[#C9A96B] mr-2 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-[#1A1A1A] text-xs font-mono font-medium focus:outline-none cursor-pointer"
            />
          </div>

          {/* Formatted Date Label */}
          <div className="flex items-center gap-2 pl-1">
            <span className="text-sm sm:text-base font-display font-bold text-[#1A1A1A] tracking-tight">
              {formatDisplayDate(selectedDate)}
            </span>
            {relativeLabel && (
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm bg-[#EADCC8] text-[#3E2F1F] border border-[#DDD0B8]">
                {relativeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick Date Stats & Refresh */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          <div className="flex items-center gap-3 bg-[#FAF6F0] border border-[#DDD0B8] px-3.5 py-1.5 rounded-sm">
            <div>
              <span className="font-mono text-[9px] text-[#7A6A50] uppercase tracking-[0.15em] block">Date Occupancy</span>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="font-bold text-[#1A1A1A] text-sm">{totalBookedSlots}</span>
                <span className="text-[#7A6A50] text-[11px]">/ {totalSlotsCount} slots</span>
                <span className="text-[#A8883F] text-[11px] font-semibold">({occupancyPercentage}%)</span>
              </div>
            </div>
          </div>

          {onOpenHistory && (
            <button
              onClick={() => onOpenHistory({ id: 'ALL', name: 'All Rooms' })}
              title="View slot booking audit log"
              className="p-2 text-[#7A6A50] hover:text-[#1A1A1A] bg-[#FAF6F0] border border-[#DDD0B8] hover:bg-[#EADCC8] rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
            >
              <History className="w-4 h-4 text-[#C9A96B]" />
              <span className="hidden sm:inline">Audit Log</span>
            </button>
          )}

          <button
            onClick={() => fetchBookingsForDate(selectedDate, false)}
            disabled={loading}
            title="Refresh date bookings"
            className="p-2 text-[#7A6A50] hover:text-[#1A1A1A] bg-[#FAF6F0] border border-[#DDD0B8] hover:bg-[#EADCC8] rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Date Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Booked Slots Card */}
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9B3329] font-semibold">
              Booked Sessions
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-display font-bold text-[#9B3329]">{totalBookedSlots}</span>
              <span className="font-mono text-xs text-[#7A6A50]">
                of {totalSlotsCount} total slots
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#A89880] mt-0.5">Reserved by educators on this date</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] flex items-center justify-center text-[#9B3329]">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Available Slots Card */}
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#2A3A20] font-semibold">
              Available Sessions
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-display font-bold text-[#2A3A20]">{totalFreeSlots}</span>
              <span className="font-mono text-xs text-[#7A6A50]">
                slots open
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#A89880] mt-0.5">Open for educator reservations</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-[#E8F2E4] border border-[#A6CFA0] flex items-center justify-center text-[#2A3A20]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Studio Capacity Utilization */}
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] font-semibold">
              Studio Utilization
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-display font-bold text-[#1A1A1A]">{occupancyPercentage}%</span>
              <span className="font-mono text-xs text-[#7A6A50]">
                daily schedule load
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#A89880] mt-0.5">10 daily recurring session slots</p>
          </div>
          <div className="w-10 h-10 rounded-sm bg-[#FAF6F0] border border-[#DDD0B8] flex items-center justify-center text-[#C9A96B]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Filter Tabs */}
        <div className="flex items-center bg-[#FAF6F0] p-1 rounded-sm border border-[#DDD0B8] text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-sm font-mono font-medium transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            All Cabins ({rooms.length})
          </button>
          <button
            onClick={() => setFilter('OCCUPIED')}
            className={`px-3 py-1.5 rounded-sm font-mono font-medium transition-colors cursor-pointer ${
              filter === 'OCCUPIED'
                ? 'bg-[#9B3329] text-white font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            Has Bookings ({rooms.filter((r) => TIME_SLOTS.some((s) => bookingMap.has(`${r.id}_${s.id}`))).length})
          </button>
          <button
            onClick={() => setFilter('AVAILABLE')}
            className={`px-3 py-1.5 rounded-sm font-mono font-medium transition-colors cursor-pointer ${
              filter === 'AVAILABLE'
                ? 'bg-[#2A3A20] text-[#D4E8C2] font-bold shadow-xs'
                : 'text-[#7A6A50] hover:text-[#1A1A1A]'
            }`}
          >
            100% Free ({rooms.filter((r) => !TIME_SLOTS.some((s) => bookingMap.has(`${r.id}_${s.id}`))).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A89880] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cabins or booking notes..."
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
      </div>

      {/* Main Room × Slot Matrix Grid */}
      <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm shadow-2xs overflow-hidden">
        
        {/* Table scroll wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[980px]">
            <thead>
              {/* Group Header Row: Morning vs Evening */}
              <tr className="bg-[#EADCC8] border-b border-[#DDD0B8] text-[11px]">
                <th
                  rowSpan={2}
                  className="sticky left-0 z-20 bg-[#EADCC8] px-4 py-3 text-[#1A1A1A] font-display font-bold uppercase tracking-wider border-r border-[#DDD0B8] min-w-[210px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Cabin Space</span>
                    <span className="font-mono text-[9px] text-[#7A6A50] font-normal tracking-[0.1em]">
                      Seats
                    </span>
                  </div>
                </th>

                {/* Morning Header */}
                <th
                  colSpan={MORNING_SLOTS.length}
                  className="px-3 py-2 text-center font-mono font-bold tracking-[0.2em] uppercase text-[#3E2F1F] bg-[#FAF6F0] border-r border-[#DDD0B8]"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C9A96B]" />
                    <span>Morning Sessions (10:00 AM – 3:28 PM)</span>
                  </div>
                </th>

                {/* Evening Header */}
                <th
                  colSpan={EVENING_SLOTS.length}
                  className="px-3 py-2 text-center font-mono font-bold tracking-[0.2em] uppercase text-[#3E2F1F] bg-[#FAF6F0]"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C9A96B]" />
                    <span>Evening Sessions (3:30 PM – 8:29 PM)</span>
                  </div>
                </th>
              </tr>

              {/* Slot Labels Row */}
              <tr className="bg-[#FAF6F0] border-b border-[#DDD0B8] text-[10px] text-[#7A6A50] font-mono">
                {/* Morning individual headers */}
                {MORNING_SLOTS.map((slot) => (
                  <th
                    key={slot.id}
                    className="px-2 py-2 text-center font-medium border-r border-[#DDD0B8] min-w-[85px] max-w-[105px]"
                  >
                    <div className="font-bold text-[#1A1A1A]">S{slot.sessionNum}</div>
                    <div className="text-[9px] text-[#7A6A50] leading-tight mt-0.5">
                      {slot.startTime}–{slot.endTime}
                    </div>
                  </th>
                ))}

                {/* Evening individual headers */}
                {EVENING_SLOTS.map((slot) => (
                  <th
                    key={slot.id}
                    className="px-2 py-2 text-center font-medium border-r border-[#DDD0B8] last:border-r-0 min-w-[85px] max-w-[105px]"
                  >
                    <div className="font-bold text-[#1A1A1A]">S{slot.sessionNum}</div>
                    <div className="text-[9px] text-[#7A6A50] leading-tight mt-0.5">
                      {slot.startTime}–{slot.endTime}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body: Rooms Rows */}
            <tbody className="divide-y divide-[#DDD0B8]">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={TIME_SLOTS.length + 1}
                    className="py-16 text-center text-[#7A6A50]"
                  >
                    <Building className="w-8 h-8 mx-auto text-[#A89880] mb-2" />
                    <p className="text-sm font-display font-medium text-[#1A1A1A]">No rooms match your filter</p>
                    <p className="font-mono text-xs text-[#7A6A50] mt-1">
                      Try adjusting the search query or changing the filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => {
                  let roomBookedCount = 0;
                  for (const s of TIME_SLOTS) {
                    if (bookingMap.has(`${room.id}_${s.id}`)) {
                      roomBookedCount++;
                    }
                  }

                  return (
                    <tr
                      key={room.id}
                      className="hover:bg-[#FAF6F0]/60 transition-colors"
                    >
                      {/* Room info sticky cell */}
                      <td className="sticky left-0 z-10 bg-[#FAF6F0] px-4 py-3 border-r border-[#DDD0B8] shadow-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-display font-bold text-sm text-[#1A1A1A] block">
                              {room.name}
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A6A50]">
                              {room.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#3E2F1F] bg-[#EADCC8] px-1.5 py-0.5 rounded-sm border border-[#DDD0B8]">
                              {room.capacity}
                            </span>

                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-sm font-semibold border ${
                                roomBookedCount === 0
                                  ? 'bg-[#E8F2E4] text-[#2A3A20] border-[#A6CFA0]'
                                  : roomBookedCount === TIME_SLOTS.length
                                  ? 'bg-[#FFF1F0] text-[#9B3329] border-[#F8D7D4]'
                                  : 'bg-[#FBF0DA] text-[#5A4A2A] border-[#DDD0B8]'
                              }`}
                            >
                              {roomBookedCount === 0
                                ? 'Free'
                                : `${roomBookedCount}/${TIME_SLOTS.length}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 10 Time Slot Cells */}
                      {TIME_SLOTS.map((slot) => {
                        const booking = bookingMap.get(`${room.id}_${slot.id}`);
                        const isBooked = Boolean(booking);
                        const isHighlighted =
                          highlightCell &&
                          highlightCell.roomId === room.id &&
                          highlightCell.slotId === slot.id;

                        return (
                          <td
                            key={slot.id}
                            className={`p-1.5 text-center border-r border-[#DDD0B8] last:border-r-0 transition-all ${
                              isHighlighted
                                ? 'bg-[#FBF0DA]'
                                : isBooked
                                ? 'bg-[#FFF8F7] hover:bg-[#FFF1F0]'
                                : 'bg-[#F7F2EA] hover:bg-[#FAF6F0]'
                            }`}
                          >
                            <button
                              onClick={() => {
                                if (isBooked) {
                                  setSlotDetailsModalData({
                                    room,
                                    slot,
                                    booking,
                                  });
                                  setEditNoteDraft(booking.note || '');
                                  setIsEditingNote(false);
                                } else {
                                  setBookingModalData({ room, slot });
                                  setBookingNoteDraft('');
                                }
                              }}
                              className={`w-full py-2 px-1 rounded-sm text-[11px] font-medium flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                                isHighlighted
                                  ? 'ring-2 ring-[#C9A96B] bg-[#FBF0DA] text-[#1A1A1A] border border-[#C9A96B] animate-pulse shadow-sm'
                                  : isBooked
                                  ? 'bg-[#FFF1F0] hover:bg-[#FCE8E6] text-[#9B3329] border border-[#F8D7D4] shadow-xs'
                                  : 'bg-white hover:bg-[#EADCC8]/60 hover:border-[#C9A96B] text-[#A89880] hover:text-[#1A1A1A] border border-[#DDD0B8]'
                              }`}
                              title={
                                isBooked
                                  ? `Booked: ${booking.note || 'No note'}`
                                  : `Available — Click to book ${room.name} for ${slot.label}`
                              }
                            >
                              {isBooked ? (
                                <>
                                  <div className="flex items-center gap-1 font-mono font-bold text-[10px] text-[#9B3329]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B3329]" />
                                    <span>Booked</span>
                                  </div>
                                  {booking.note && (
                                    <span className="text-[9px] text-[#7A6A50] truncate max-w-[85px] leading-tight mt-0.5 font-body">
                                      {booking.note}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[11px] text-[#A89880] group-hover:text-[#1A1A1A] font-mono">
                                  +
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info legend */}
        <div className="p-3 bg-[#FAF6F0] border-t border-[#DDD0B8] text-[11px] text-[#7A6A50] font-mono flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-white border border-[#DDD0B8]" />
              <span>Available Slot (Click to Book)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4]" />
              <span className="text-[#9B3329] font-medium">Booked Slot (Click to View / Free)</span>
            </div>
          </div>

          <div className="text-[#A89880] text-[10px]">
            Uniqueness enforced on (Room + Date + Slot) • Realtime sync across sessions
          </div>
        </div>
      </div>

      {/* MODAL 1: Book Available Slot */}
      {bookingModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#EADCC8] border border-[#DDD0B8] text-[#3E2F1F] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C9A96B]" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-[#1A1A1A]">
                  Book Slot: {bookingModalData.room.name}
                </h3>
                <p className="font-mono text-xs text-[#7A6A50]">
                  {bookingModalData.room.capacity} seats • {bookingModalData.room.type}
                </p>
              </div>
            </div>

            {/* Time & Date Confirmation Box */}
            <div className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-3.5 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#7A6A50]">
                <span>Date:</span>
                <span className="font-bold text-[#1A1A1A]">{formatDisplayDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between text-[#7A6A50]">
                <span>Session:</span>
                <span className="font-bold text-[#3E2F1F]">
                  {bookingModalData.slot.label}
                </span>
              </div>
              <div className="flex justify-between text-[#7A6A50]">
                <span>Duration:</span>
                <span className="text-[#1A1A1A]">{bookingModalData.slot.duration}</span>
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] mb-1.5">
                Teacher / Batch Details (Optional)
              </label>
              <textarea
                value={bookingNoteDraft}
                onChange={(e) => setBookingNoteDraft(e.target.value)}
                placeholder="e.g. Dr. Verma — Grade 11 Physics batch"
                rows={2}
                autoFocus
                className="w-full bg-white border border-[#DDD0B8] rounded-sm p-2.5 text-xs text-[#1A1A1A] placeholder-[#A89880] focus:outline-none focus:border-[#C9A96B] font-body"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBookingModalData(null)}
                className="px-4 py-2 bg-transparent hover:bg-[#EADCC8] border border-[#DDD0B8] text-[#7A6A50] text-xs font-mono rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={actionLoading}
                className="px-5 py-2 bg-[#C9A96B] hover:bg-[#D4B87A] text-[#1A1A1A] text-xs font-display font-semibold rounded-sm transition-all border border-[#C9A96B] shadow-xs cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View / Edit / Free Booked Slot */}
      {slotDetailsModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD0B8] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-[#1A1A1A]">
                    {slotDetailsModalData.room.name} — Booked
                  </h3>
                  <p className="font-mono text-[10px] text-[#7A6A50]">
                    {slotDetailsModalData.slot.label}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSlotDetailsModalData(null)}
                className="text-[#A89880] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Booking Details Box */}
            <div className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-3.5 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#7A6A50]">Date:</span>
                <span className="font-medium text-[#1A1A1A]">{formatDisplayDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6A50]">Booked By:</span>
                <span className="text-[#1A1A1A]">
                  {slotDetailsModalData.booking.updated_by || 'admin'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6A50]">Last Changed:</span>
                <span className="text-[#7A6A50]">
                  {formatRelativeTime(slotDetailsModalData.booking.updated_at)}
                </span>
              </div>
            </div>

            {/* Teacher / Batch Note */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A6A50]">
                  Teacher / Batch Note
                </label>
                {!isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="text-[11px] text-[#A8883F] hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Note</span>
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    value={editNoteDraft}
                    onChange={(e) => setEditNoteDraft(e.target.value)}
                    placeholder="Enter teacher/batch information..."
                    rows={2}
                    autoFocus
                    className="w-full bg-white border border-[#C9A96B] rounded-sm p-2 text-xs text-[#1A1A1A] placeholder-[#A89880] focus:outline-none font-body"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-2.5 py-1 bg-transparent hover:bg-[#EADCC8] border border-[#DDD0B8] text-[#7A6A50] text-xs font-mono rounded-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSlotNote}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-[#C9A96B] text-[#1A1A1A] text-xs font-display font-semibold rounded-sm hover:bg-[#D4B87A] border border-[#C9A96B] cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              ) : (
                <p className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-2.5 text-xs text-[#1A1A1A] italic font-body">
                  {slotDetailsModalData.booking.note || 'No notes currently attached to this slot.'}
                </p>
              )}
            </div>

            {/* Action to Free Up Slot */}
            <div className="pt-2 border-t border-[#DDD0B8] flex items-center justify-between">
              <button
                onClick={handleFreeUpSlot}
                disabled={actionLoading}
                className="px-4 py-2 bg-transparent hover:bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] text-xs font-mono font-semibold rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Free up Slot / Cancel Booking</span>
              </button>

              <button
                onClick={() => setSlotDetailsModalData(null)}
                className="px-4 py-2 bg-[#EADCC8] hover:bg-[#EDE6D8] text-[#1A1A1A] text-xs font-mono rounded-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
