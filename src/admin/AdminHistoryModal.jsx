import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  X,
  Clock,
  RefreshCw,
  AlertCircle,
  History,
  CheckCircle,
  Ban,
  Calendar,
} from 'lucide-react';

export function AdminHistoryModal({ room, isOpen, onClose }) {
  const [activeHistoryTab, setActiveHistoryTab] = useState('slots'); // 'slots' | 'rooms'
  const [slotHistory, setSlotHistory] = useState([]);
  const [roomHistory, setRoomHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!supabase || !room) return;
    setLoading(true);
    setError(null);

    try {
      if (activeHistoryTab === 'slots') {
        let query = supabase
          .from('slot_booking_history')
          .select('*')
          .order('changed_at', { ascending: false })
          .limit(40);

        if (room.id !== 'ALL') {
          query = query.eq('room_id', room.id);
        }

        const { data, error: fetchErr } = await query;
        if (fetchErr) {
          // Table might not exist yet if migration pending
          if (fetchErr.code === 'PGRST205') {
            setSlotHistory([]);
            return;
          }
          throw fetchErr;
        }
        setSlotHistory(data || []);
      } else {
        let query = supabase
          .from('room_status_history')
          .select('*')
          .order('changed_at', { ascending: false })
          .limit(30);

        if (room.id !== 'ALL') {
          query = query.eq('room_id', room.id);
        }

        const { data, error: fetchErr } = await query;
        if (fetchErr) throw fetchErr;
        setRoomHistory(data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load audit history');
    } finally {
      setLoading(false);
    }
  }, [room, activeHistoryTab]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (isOpen && room && !ignore) {
        await fetchHistory();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [isOpen, room, activeHistoryTab, fetchHistory]);

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-body">
        
        {/* Top Gold Accent Bar */}
        <div className="h-[2px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#DDD0B8] flex items-center justify-between bg-[#F7F2EA]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C9A96B]/15 text-[#8F6D28] border border-[#C9A96B]/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#1A1A1A]">
                {room.id === 'ALL' ? 'Studio Status Audit Log' : `Audit History: ${room.name}`}
              </h3>
              <p className="font-mono text-[11px] tracking-wide text-[#7A6A50]">
                {room.id === 'ALL'
                  ? 'Audit log of slot bookings & availability changes'
                  : `Room ID: ${room.id} (${room.type || 'Cabin'})`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              disabled={loading}
              title="Refresh history"
              className="p-2 text-[#7A6A50] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EADCC8]/50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#7A6A50] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EADCC8]/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History Tab Switcher */}
        <div className="bg-[#EDE6D8]/60 border-b border-[#DDD0B8] px-4 py-2.5 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveHistoryTab('slots')}
            className={`px-3 py-1.5 rounded-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
              activeHistoryTab === 'slots'
                ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs border border-[#A8883F]'
                : 'text-[#7A6A50] hover:text-[#1A1A1A] hover:bg-[#EADCC8]/50 border border-transparent'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Date & Slot History</span>
          </button>
          <button
            onClick={() => setActiveHistoryTab('rooms')}
            className={`px-3 py-1.5 rounded-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
              activeHistoryTab === 'rooms'
                ? 'bg-[#C9A96B] text-[#1A1A1A] font-bold shadow-xs border border-[#A8883F]'
                : 'text-[#7A6A50] hover:text-[#1A1A1A] hover:bg-[#EADCC8]/50 border border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Legacy Room Log</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 bg-[#FAF6F0]">
          {loading ? (
            <div className="py-12 text-center text-[#7A6A50] text-sm flex flex-col items-center gap-2 font-mono">
              <RefreshCw className="w-6 h-6 animate-spin text-[#C9A96B]" />
              <span>Loading audit records...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-lg bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : activeHistoryTab === 'slots' ? (
            slotHistory.length === 0 ? (
              <div className="py-12 text-center text-[#7A6A50] text-sm font-mono">
                No slot booking changes recorded yet for this room.
              </div>
            ) : (
              slotHistory.map((record) => {
                const date = new Date(record.changed_at);
                const formattedDate = date.toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-lg bg-[#F7F2EA] border border-[#DDD0B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {record.action === 'BOOKED' ? (
                          <div className="p-1.5 rounded-full bg-[#FFF1F0] text-[#9B3329] border border-[#F8D7D4]">
                            <Ban className="w-3.5 h-3.5" />
                          </div>
                        ) : record.action === 'FREED' ? (
                          <div className="p-1.5 rounded-full bg-[#E8F2E4] text-[#2A3A20] border border-[#A6CFA0]">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-full bg-[#C9A96B]/15 text-[#8F6D28] border border-[#C9A96B]/30">
                            <History className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[#1A1A1A] bg-[#EADCC8] px-2 py-0.5 rounded-sm border border-[#DDD0B8]">
                            {record.room_id}
                          </span>
                          <span className="font-mono text-[#5A4E3A] bg-[#EDE6D8] px-2 py-0.5 rounded-sm text-[11px] border border-[#DDD0B8]">
                            {record.booking_date} ({record.slot_id})
                          </span>
                          <span
                            className={`font-semibold ${
                              record.action === 'BOOKED'
                                ? 'text-[#9B3329]'
                                : record.action === 'FREED'
                                ? 'text-[#2A3A20]'
                                : 'text-[#8F6D28]'
                            }`}
                          >
                            {record.action === 'BOOKED'
                              ? 'Slot Booked'
                              : record.action === 'FREED'
                              ? 'Slot Freed Up'
                              : 'Note Updated'}
                          </span>
                        </div>

                        {record.note ? (
                          <p className="mt-1 text-[#1A1A1A] italic font-serif">
                            "{record.note}"
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[#A89880] italic">No note attached</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right text-[#7A6A50] flex flex-col gap-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#DDD0B8]">
                      <div className="flex items-center sm:justify-end gap-1.5 text-[#1A1A1A] font-medium font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#7A6A50]" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="text-[11px] text-[#7A6A50]">
                        By: <span className="text-[#1A1A1A] font-mono font-medium">{record.changed_by || 'admin'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : roomHistory.length === 0 ? (
            <div className="py-12 text-center text-[#7A6A50] text-sm font-mono">
              No legacy status changes recorded yet for this room.
            </div>
          ) : (
            roomHistory.map((record) => {
              const date = new Date(record.changed_at);
              const formattedDate = date.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={record.id}
                  className="p-3.5 rounded-lg bg-[#F7F2EA] border border-[#DDD0B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {record.is_booked ? (
                        <div className="p-1.5 rounded-full bg-[#FFF1F0] text-[#9B3329] border border-[#F8D7D4]">
                          <Ban className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-[#E8F2E4] text-[#2A3A20] border border-[#A6CFA0]">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        {room.id === 'ALL' && (
                          <span className="font-mono font-bold text-[#1A1A1A] bg-[#EADCC8] px-2 py-0.5 rounded-sm border border-[#DDD0B8]">
                            {record.room_id}
                          </span>
                        )}
                        <span className={`font-semibold ${record.is_booked ? 'text-[#9B3329]' : 'text-[#2A3A20]'}`}>
                          {record.is_booked ? 'Marked as Booked' : 'Marked as Available'}
                        </span>
                      </div>

                      {record.note ? (
                        <p className="mt-1 text-[#1A1A1A] italic font-serif">
                          "{record.note}"
                        </p>
                      ) : (
                        <p className="mt-0.5 text-[#A89880] italic">No note attached</p>
                      )}
                    </div>
                  </div>

                    <div className="sm:text-right text-[#7A6A50] flex flex-col gap-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#DDD0B8]">
                    <div className="flex items-center sm:justify-end gap-1.5 text-[#1A1A1A] font-medium font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#7A6A50]" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="text-[11px] text-[#7A6A50]">
                      By: <span className="text-[#1A1A1A] font-mono font-medium">{record.changed_by || 'admin'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDD0B8] bg-[#F7F2EA] flex items-center justify-between text-xs text-[#7A6A50] font-mono">
          <span>Persisted in PostgreSQL trigger audit tables</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#EADCC8] hover:bg-[#DDD0B8] text-[#1A1A1A] font-medium rounded-sm border border-[#DDD0B8] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
