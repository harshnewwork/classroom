import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { Clock, Calendar, Sparkles } from 'lucide-react';

const adultSessions = [
  { num: 1, time: '9:40 – 10:40 am',   dur: '60 min session' },
  { num: 2, time: '10:45 – 11:45 am',  dur: '60 min session' },
  { num: 3, time: '11:50 am – 12:50 pm', dur: '60 min session' },
  { num: 4, time: '12:55 – 1:55 pm',   dur: '60 min session' },
  { num: 5, time: '2:00 – 3:00 pm',    dur: '60 min session' },
];

const kidsSessions = [
  { num: 1, time: '3:10 – 4:10 pm',    dur: '60 min session' },
  { num: 2, time: '4:15 – 5:15 pm',    dur: '60 min session' },
  { num: 3, time: '5:20 – 6:20 pm',    dur: '60 min session' },
  { num: 4, time: '6:25 – 7:25 pm',    dur: '60 min session' },
];

function SessionRow({ s, highlight }) {
  return (
    <div
      className={`flex items-center justify-between p-3 sm:p-3.5 border rounded-sm transition-all ${
        highlight
          ? 'border-[#8B6914] bg-[#FFFDF9] shadow-2xs'
          : 'border-[#DDD0B8] hover:border-[#8B6914]/60 bg-[#F7F2EA]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-[#EADCC8] border border-[#DDD0B8] rounded-xs flex items-center justify-center font-bold">
          <span className="font-mono text-[11px] text-[#3E2F1F]">{s.num}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#8B6914]" />
          <span className="font-mono text-sm text-[#1A1A1A] font-semibold">{s.time}</span>
        </div>
      </div>
      <span className="font-mono text-[10px] text-[#5C450C] uppercase tracking-wider font-semibold">
        {s.dur}
      </span>
    </div>
  );
}

export function Timings() {
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
            Structured sessions with 5-minute cleaning buffers between sessions to ensure every educator enters a fresh, sanitized room.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Adult Sessions */}
          <AnimatedSection direction="left">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B6914]" />
                  <div>
                    <h3 className="font-display font-bold text-[#1A1A1A] text-base">Adults</h3>
                    <p className="font-mono text-[10px] text-[#5C450C] uppercase tracking-wide font-semibold">
                      60 min sessions · 5-min clean between sessions
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 bg-[#EADCC8] text-[#3E2F1F] rounded-xs font-bold uppercase">
                  Morning Shift
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <StaggerContainer className="flex flex-col gap-2" delay={0.04}>
                  {adultSessions.map((s) => (
                    <StaggerItem key={s.num}>
                      <SessionRow s={s} highlight={s.num === 1} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* 10-min deep clean notice */}
                <div className="mt-2 p-2.5 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm flex items-center gap-2">
                  <Sparkles size={13} className="text-[#8B6914] flex-shrink-0" />
                  <p className="font-mono text-[10px] text-[#3E2F1F] font-medium">
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
                      60 min sessions · 5-min clean between sessions
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 bg-[#EADCC8] text-[#3E2F1F] rounded-xs font-bold uppercase">
                  Evening Shift
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <StaggerContainer className="flex flex-col gap-2" delay={0.04}>
                  {kidsSessions.map((s) => (
                    <StaggerItem key={s.num}>
                      <SessionRow s={s} highlight={s.num === 1} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <div className="mt-2 p-2.5 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm flex items-center gap-2">
                  <Calendar size={13} className="text-[#8B6914] flex-shrink-0" />
                  <p className="font-mono text-[10px] text-[#3E2F1F] font-medium">
                    <strong className="text-[#1A1A1A]">Weekends:</strong> Mon–Sat schedule + 3 Sundays a month
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Calendar,
                title: '7 Days a Week',
                desc: 'Monday to Saturday, plus three Sundays each month by prior arrangement.',
              },
              {
                icon: Clock,
                title: 'Minimum Commitment',
                desc: 'At least 2 sessions per day, at least 3 days per week.',
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
