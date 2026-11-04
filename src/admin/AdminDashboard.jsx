import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AdminHistoryModal } from './AdminHistoryModal';
import { AdminEnquiries } from './AdminEnquiries';
import { AdminRoomAvailability } from './AdminRoomAvailability';
import { NavLogo } from '../components/ui/Logo';
import {
  LogOut,
  RefreshCw,
  User,
  History,
  Building,
  AlertCircle,
  CheckCircle2,
  Inbox
} from 'lucide-react';

export function AdminDashboard({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'enquiries'
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTING'); // 'CONNECTED', 'CONNECTING', 'ERROR'
  const [activeHistoryRoom, setActiveHistoryRoom] = useState(null);

  // Synchronized Calendar Date & Cell Highlighter for cross-tab jumping
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [highlightCell, setHighlightCell] = useState(null);

  const handleNavigateToCalendar = useCallback((dateStr, roomId, slotId) => {
    if (dateStr) {
      setCalendarDate(dateStr);
    }
    if (roomId && slotId) {
      setHighlightCell({ roomId, slotId });
      setTimeout(() => setHighlightCell(null), 6000);
    }
    setActiveTab('rooms');
  }, []);

  // Toast / feedback message
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch all rooms from Supabase
  const fetchRooms = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      if (!supabase) return;
      const { data, error: fetchErr } = await supabase
        .from('rooms')
        .select('*')
        .order('name', { ascending: true });

      if (fetchErr) throw fetchErr;
      setRooms(data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch rooms', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [showToast]);

  // Fetch count of pending "new" enquiries for tab badge
  const fetchNewEnquiriesCount = useCallback(async () => {
    if (!supabase) return;
    try {
      const { count, error: countErr } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      if (!countErr && typeof count === 'number') {
        setNewEnquiriesCount(count);
      }
    } catch {
      // Table might not exist yet or offline
    }
  }, []);

  // Setup Supabase Realtime subscriptions for rooms and enquiries
  useEffect(() => {
    let ignore = false;

    async function initialLoad() {
      try {
        if (!supabase) return;
        const { data, error: fetchErr } = await supabase
          .from('rooms')
          .select('*')
          .order('name', { ascending: true });

        if (fetchErr) throw fetchErr;
        if (!ignore && data) {
          setRooms(data);
        }
        await fetchNewEnquiriesCount();
      } catch (err) {
        if (!ignore) {
          showToast(err.message || 'Failed to fetch rooms', 'error');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initialLoad();

    if (!supabase) return;

    // Realtime channel for rooms table
    const roomsChannel = supabase
      .channel('admin-rooms-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setRooms((currentRooms) =>
              currentRooms.map((r) =>
                r.id === payload.new.id ? { ...r, ...payload.new } : r
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setRooms((currentRooms) => [...currentRooms, payload.new]);
          } else if (payload.eventType === 'DELETE') {
            setRooms((currentRooms) =>
              currentRooms.filter((r) => r.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('CONNECTED');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          setRealtimeStatus('ERROR');
        } else {
          setRealtimeStatus('CONNECTING');
        }
      });

    // Realtime channel to track new enquiries count
    const enquiriesCounterChannel = supabase
      .channel('admin-enquiries-badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enquiries' },
        () => {
          fetchNewEnquiriesCount();
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(roomsChannel);
      supabase.removeChannel(enquiriesCounterChannel);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [fetchNewEnquiriesCount, showToast]);

  return (
    <div className="min-h-screen bg-[#F7F2EA] bg-paper text-[#1A1A1A] flex flex-col font-body selection:bg-[#C9A96B] selection:text-[#1A1A1A]">
      
      {/* Top Gold Accent Bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />

      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-[#F7F2EA]/95 backdrop-blur-md border-b border-[#DDD0B8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <NavLogo />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-[#EADCC8] text-[#3E2F1F] border border-[#DDD0B8] px-2 py-0.5 rounded-sm">
              Admin Portal
            </span>
          </div>

          {/* User info & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Realtime status badge */}
            <div
              title={
                realtimeStatus === 'CONNECTED'
                  ? 'Realtime live sync connected via Postgres websocket'
                  : 'Reconnecting to realtime channel...'
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#FAF6F0] border border-[#DDD0B8] text-[11px]"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  realtimeStatus === 'CONNECTED'
                    ? 'bg-[#2E7D32] animate-pulse shadow-sm shadow-[#2E7D32]/30'
                    : 'bg-[#C9A96B]'
                }`}
              />
              <span className="text-[#7A6A50] hidden md:inline font-mono">
                {realtimeStatus === 'CONNECTED' ? 'Live Sync' : 'Syncing'}
              </span>
            </div>

            {/* Current user */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#7A6A50] bg-[#FAF6F0] px-2.5 py-1 rounded-sm border border-[#DDD0B8]">
              <User className="w-3.5 h-3.5 text-[#A89880]" />
              <span className="font-mono text-[#1A1A1A]">{user?.email}</span>
            </div>

            {/* Global History Button */}
            <button
              onClick={() => setActiveHistoryRoom({ id: 'ALL', name: 'All Rooms', type: 'Studio Overview' })}
              className="px-2.5 py-1.5 text-[#1A1A1A] bg-[#FAF6F0] hover:bg-[#EADCC8] rounded-sm border border-[#DDD0B8] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="View all audit history"
            >
              <History className="w-3.5 h-3.5 text-[#C9A96B]" />
              <span className="hidden sm:inline">Audit Log</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchRooms(false)}
              disabled={loading}
              title="Force refresh from database"
              className="p-1.5 text-[#7A6A50] hover:text-[#1A1A1A] bg-[#FAF6F0] hover:bg-[#EADCC8] rounded-sm border border-[#DDD0B8] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Logout */}
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-[#FFF1F0] border border-[#DDD0B8] hover:border-[#F8D7D4] text-[#7A6A50] hover:text-[#9B3329] rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-header / Tabs */}
      <div className="bg-[#EDE6D8]/50 border-b border-[#DDD0B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-2 -mb-px">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'rooms'
                  ? 'border-[#C9A96B] text-[#1A1A1A] bg-[#F7F2EA] font-display font-bold'
                  : 'border-transparent text-[#7A6A50] hover:text-[#1A1A1A] hover:bg-[#F7F2EA]/60'
              }`}
            >
              <Building className="w-4 h-4 text-[#C9A96B]" />
              <span className="tracking-wide">Rooms Availability</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm font-mono bg-[#EADCC8] text-[#3E2F1F] border border-[#DDD0B8]">
                {rooms.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'border-[#C9A96B] text-[#1A1A1A] bg-[#F7F2EA] font-display font-bold'
                  : 'border-transparent text-[#7A6A50] hover:text-[#1A1A1A] hover:bg-[#F7F2EA]/60'
              }`}
            >
              <Inbox className="w-4 h-4 text-[#C9A96B]" />
              <span className="tracking-wide">Enquiries</span>
              {newEnquiriesCount > 0 ? (
                <span className="text-[10px] px-2 py-0.2 rounded-sm font-bold bg-[#C9A96B] text-[#1A1A1A] font-mono animate-pulse shadow-xs">
                  {newEnquiriesCount} new
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded-sm font-mono bg-[#EADCC8] text-[#3E2F1F] border border-[#DDD0B8]">
                  Inbox
                </span>
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 py-2 text-[11px] font-mono text-[#7A6A50]">
            {activeTab === 'rooms' ? (
              <span>Date & slot availability synced across sessions</span>
            ) : (
              <span>Review and action bookings submitted through website</span>
            )}
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`px-4 py-3 rounded-sm shadow-lg flex items-center gap-2.5 text-xs font-medium border ${
              toast.type === 'error'
                ? 'bg-[#FFF1F0] border-[#F8D7D4] text-[#9B3329]'
                : 'bg-[#F7F2EA] border-[#C9A96B] text-[#1A1A1A]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#9B3329]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#C9A96B]" />
            )}
            <span className="font-body">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeTab === 'enquiries' ? (
          <AdminEnquiries
            rooms={rooms}
            user={user}
            showToast={showToast}
            onNavigateToCalendar={handleNavigateToCalendar}
          />
        ) : (
          <AdminRoomAvailability
            rooms={rooms}
            user={user}
            showToast={showToast}
            controlledDate={calendarDate}
            onDateChange={setCalendarDate}
            highlightCell={highlightCell}
            onOpenHistory={(r) =>
              setActiveHistoryRoom(r || { id: 'ALL', name: 'All Rooms' })
            }
          />
        )}
      </main>

      {/* Audit History Modal */}
      <AdminHistoryModal
        room={activeHistoryRoom}
        isOpen={Boolean(activeHistoryRoom)}
        onClose={() => setActiveHistoryRoom(null)}
      />

      {/* Admin Panel Footer Note */}
      <footer className="border-t border-[#DDD0B8] bg-[#F7F2EA] py-5 text-center text-xs text-[#7A6A50] font-mono tracking-wide">
        <p>
          Mentors Studio Internal Admin Panel • Protected via Supabase Postgres RLS
        </p>
      </footer>
    </div>
  );
}
