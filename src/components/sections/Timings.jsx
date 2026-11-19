import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { Clock, Calendar, Sparkles, Check, ArrowRight } from 'lucide-react';

const adultSessions = [
  { id: 'adult-1', num: 1, time: '9:40 – 10:40 am',     dur: '60 MIN SESSION', bookingTime: 'Adult 1: 9:40 – 10:40 am', shift: 'Adults' },
  { id: 'adult-2', num: 2, time: '10:45 – 11:45 am',    dur: '60 MIN SESSION', bookingTime: 'Adult 2: 10:45 – 11:45 am', shift: 'Adults' },
  { id: 'adult-3', num: 3, time: '11:50 am – 12:50 pm', dur: '60 MIN SESSION', bookingTime: 'Adult 3: 11:50 am – 12:50 pm', shift: 'Adults' },
  { id: 'adult-4', num: 4, time: '12:55 – 1:55 pm',     dur: '60 MIN SESSION', bookingTime: 'Adult 4: 12:55 – 1:55 pm', shift: 'Adults' },
  { id: 'adult-5', num: 5, time: '2:00 – 3:00 pm',      dur: '60 MIN SESSION', bookingTime: 'Adult 5: 2:00 – 3:00 pm', shift: 'Adults' },
];

const kidsSessions = [
  { id: 'kids-1', num: 1, time: '3:10 – 4:10 pm', dur: '60 MIN SESSION', bookingTime: 'Kids 1: 3:10 – 4:10 pm', shift: 'Kids' },
  { id: 'kids-2', num: 2, time: '4:15 – 5:15 pm', dur: '60 MIN SESSION', bookingTime: 'Kids 2: 4:15 – 5:15 pm', shift: 'Kids' },
  { id: 'kids-3', num: 3, time: '5:20 – 6:20 pm', dur: '60 MIN SESSION', bookingTime: 'Kids 3: 5:20 – 6:20 pm', shift: 'Kids' },
  { id: 'kids-4', num: 4, time: '6:25 – 7:25 pm', dur: '60 MIN SESSION', bookingTime: 'Kids 4: 6:25 – 7:25 pm', shift: 'Kids' },
  { id: 'kids-5', num: 5, time: '7:30 – 8:30 pm', dur: '60 MIN SESSION', bookingTime: 'Kids 5: 7:30 – 8:30 pm', shift: 'Kids' },
];

function InteractiveSessionRow({ s, isSelected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(s)}
      className={`w-full flex items-center justify-between p-3 sm:p-3.5 border rounded-sm transition-all text-left cursor-pointer group ${
        isSelected
          ? 'border-[#8B6914] bg-[#FFFDF9] shadow-md ring-1 ring-[#8B6914]/40'
          : 'border-[#DDD0B8] hover:border-[#8B6914]/70 bg-[#F7F2EA] hover:bg-[#FFFDF9]'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Numbered Session Chip */}
        <div
          className={`w-7 h-7 rounded-xs flex items-center justify-center font-bold border transition-colors ${
            isSelected
              ? 'bg-[#8B6914] text-white border-[#8B6914] shadow-xs'
              : 'bg-[#EADCC8] text-[#3E2F1F] border-[#DDD0B8] group-hover:border-[#8B6914]/50'
          }`}
        >
          {isSelected ? (
            <Check size={14} className="stroke-[2.5]" />
          ) : (
            <span className="font-mono text-xs">{s.num}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={13} className={isSelected ? 'text-[#8B6914]' : 'text-[#8B6914]/70 group-hover:text-[#8B6914]'} />
          <span className="font-mono text-xs sm:text-sm text-[#1A1A1A] font-semibold">
            {s.time}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-[9.5px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs transition-colors ${
            isSelected
              ? 'bg-[#8B6914] text-white'
              : 'bg-[#EADCC8]/60 text-[#5C450C] group-hover:bg-[#EADCC8]'
          }`}
        >
          {s.dur}
        </span>
      </div>
    </button>
  );
}

export function Timings() {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleToggle = (slot) => {
    if (selectedSlot?.id === slot.id) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleBookSelected = () => {
    if (!selectedSlot) return;
    navigate(`/contact?time=${encodeURIComponent(selectedSlot.bookingTime)}`);
  };

  return (
    <section className="section-pad bg-warm-stone relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
          <SectionLabel className="justify-center">Schedule</SectionLabel>
          <h2
            className="font-display font-bold text-[#1A1A1A] leading-[1.08] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
          >
            Two Schedules.{' '}
            <span className="text-[#8B6914] italic">One Learning Space.</span>
          </h2>
          <p className="font-body text-[#3E2F1F] text-sm mt-3 font-normal">
            Structured sessions with 5-minute cleaning buffers between sessions to ensure every educator enters a fresh, sanitized room. Click any slot to reserve it.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Adult Sessions */}
          <AnimatedSection direction="left">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B6914]" />
                  <div>
                    <h3 className="font-display font-bold text-[#1A1A1A] text-base">Adults</h3>
                    <p className="font-mono text-[10px] text-[#5C450C] uppercase tracking-wide font-semibold">
                      9:40 am – 3:00 pm · 60 min sessions · 5-min clean
                    </p>
                  </div>
                </div>
                {/* Shift badge */}
                <span className="font-mono text-[10px] px-2.5 py-1 bg-[#EADCC8] text-[#3E2F1F] rounded-xs font-bold uppercase tracking-wider">
                  Morning Shift · Adult Educators
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <StaggerContainer className="flex flex-col gap-2" delay={0.04}>
                  {adultSessions.map((s) => (
                    <StaggerItem key={s.id}>
                      <InteractiveSessionRow
                        s={s}
                        isSelected={selectedSlot?.id === s.id}
                        onToggle={handleToggle}
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* 10-min deep clean notice */}
                <div className="mt-2 p-2.5 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm flex items-center gap-2">
                  <Sparkles size={13} className="text-[#8B6914] flex-shrink-0" />
                  <p className="font-mono text-[10.5px] text-[#3E2F1F] font-medium">
                    <strong className="text-[#1A1A1A]">3:00 – 3:10 pm:</strong> 10-min deep clean & room reset
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Kids Sessions */}
          <AnimatedSection direction="right" delay={0.1}>
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3E2F1F]" />
                  <div>
                    <h3 className="font-display font-bold text-[#1A1A1A] text-base">Kids</h3>
                    <p className="font-mono text-[10px] text-[#5C450C] uppercase tracking-wide font-semibold">
                      3:10 pm – 8:30 pm · 60 min sessions · 5-min clean
                    </p>
                  </div>
                </div>
                {/* Shift badge */}
                <span className="font-mono text-[10px] px-2.5 py-1 bg-[#EADCC8] text-[#3E2F1F] rounded-xs font-bold uppercase tracking-wider">
                  Evening Shift · School Educators
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <StaggerContainer className="flex flex-col gap-2" delay={0.04}>
                  {kidsSessions.map((s) => (
                    <StaggerItem key={s.id}>
                      <InteractiveSessionRow
                        s={s}
                        isSelected={selectedSlot?.id === s.id}
                        onToggle={handleToggle}
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <div className="mt-2 p-2.5 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm flex items-center gap-2">
                  <Calendar size={13} className="text-[#8B6914] flex-shrink-0" />
                  <p className="font-mono text-[10.5px] text-[#3E2F1F] font-medium">
                    <strong className="text-[#1A1A1A]">Weekends:</strong> Mon–Sat schedule + 3 Sundays a month
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Interactive Selection Drawer / Bar */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.25 }}
              className="mb-8 p-4 bg-[#1A1A1A] border border-[#C9A96B] rounded-sm shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
            >
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D4B87A] font-bold">
                  Session Selected
                </p>
                <p className="font-display font-bold text-[#F7F2EA] text-base sm:text-lg mt-0.5">
                  {selectedSlot.shift} Session {selectedSlot.num} ({selectedSlot.time})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 text-xs font-mono text-[#DDD0B8] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={handleBookSelected}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C9A96B] text-[#1A1A1A] font-body font-bold text-xs tracking-wider uppercase rounded-xs hover:bg-[#D4B87A] transition-colors cursor-pointer shadow-md"
                >
                  Book This Slot <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Operational Highlights (Minimum Commitment block deleted per requirement 5) */}
        <AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: Calendar,
                title: '7 Days a Week',
                desc: 'Monday to Saturday, plus three Sundays each month by prior arrangement.',
              },
              {
                icon: Clock,
                title: 'Monthly Invoicing',
                desc: 'Billed monthly after classes. Collect tuition fees from your students first.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 border border-[#DDD0B8] rounded-sm flex items-start gap-4 bg-[#F7F2EA]">
                <div className="w-9 h-9 bg-[#EADCC8] border border-[#DDD0B8] rounded-xs flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#8B6914]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[#1A1A1A] text-sm mb-1">{title}</h4>
                  <p className="font-body text-[#3E2F1F] text-xs leading-relaxed font-normal">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
