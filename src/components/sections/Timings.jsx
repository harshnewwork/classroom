import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { Clock, Calendar } from 'lucide-react';

const adultSessions  = [
  { num: 1, time: '10:00 – 11:00 am',    dur: '60 min' },
  { num: 2, time: '11:07 am – 12:07 pm', dur: '60 min' },
  { num: 3, time: '12:14 – 1:14 pm',     dur: '60 min' },
  { num: 4, time: '1:21 – 2:21 pm',      dur: '60 min' },
  { num: 5, time: '2:28 – 3:28 pm',      dur: '60 min' },
];
const schoolSessions = [
  { num: 1, time: '3:30 – 4:25 pm',  dur: '55 min' },
  { num: 2, time: '4:31 – 5:26 pm',  dur: '55 min' },
  { num: 3, time: '5:32 – 6:27 pm',  dur: '55 min' },
  { num: 4, time: '6:33 – 7:28 pm',  dur: '55 min' },
  { num: 5, time: '7:34 – 8:29 pm',  dur: '55 min' },
];

function SessionRow({ s, highlight }) {
  return (
    <div className={`flex items-center justify-between p-3.5 border rounded-sm transition-all ${
      highlight ? 'border-[#C9A96B]/50 bg-[#C9A96B]/6' : 'border-[#DDD0B8] hover:border-[#C9A96B]/30 bg-[#F7F2EA]'
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm flex items-center justify-center">
          <span className="font-mono text-[10px] text-[#7A6A50]">{s.num}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-[#C9A96B]" />
          <span className="font-mono text-sm text-[#1A1A1A]">{s.time}</span>
        </div>
      </div>
      <span className="font-mono text-[10px] text-[#7A6A50]">{s.dur}</span>
    </div>
  );
}

export function Timings() {
  return (
    <section className="section-pad bg-warm-stone relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
          <SectionLabel className="justify-center">Schedule</SectionLabel>
          <h2 className="font-display font-bold text-[#1A1A1A] leading-[1.06] tracking-tight"
            style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}>
            Five Sessions in the Morning.{' '}
            <span className="text-gradient italic">Five in the Evening.</span>
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Adult */}
          <AnimatedSection direction="left">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-sm">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C9A96B]" />
                <div>
                  <h3 className="font-display font-bold text-[#1A1A1A] text-base">Adult Educators</h3>
                  <p className="font-mono text-[9px] text-[#7A6A50] mt-0.5 uppercase tracking-wide">Monday to Friday · 60-min sessions</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <StaggerContainer className="flex flex-col gap-2" delay={0.05}>
                  {adultSessions.map(s => <StaggerItem key={s.num}><SessionRow s={s} highlight={s.num === 1} /></StaggerItem>)}
                </StaggerContainer>
              </div>
            </div>
          </AnimatedSection>

          {/* School */}
          <AnimatedSection direction="right" delay={0.1}>
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-sm">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#3E2F1F]" />
                <div>
                  <h3 className="font-display font-bold text-[#1A1A1A] text-base">School Educators</h3>
                  <p className="font-mono text-[9px] text-[#7A6A50] mt-0.5 uppercase tracking-wide">Evenings & weekends · 55-min sessions</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <StaggerContainer className="flex flex-col gap-2" delay={0.05}>
                  {schoolSessions.map(s => <StaggerItem key={s.num}><SessionRow s={s} highlight={s.num === 5} /></StaggerItem>)}
                </StaggerContainer>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Calendar, title: 'Operating Days',       desc: 'Monday to Saturday, and three Sundays a month.' },
              { icon: Clock,    title: 'Minimum Commitment',   desc: 'At least 2 sessions per day, at least 3 days per week.' },
              { icon: Clock,    title: 'Billing',              desc: 'Monthly. Billed after teaching — collect from students first.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 border border-[#DDD0B8] rounded-sm flex items-start gap-4 bg-[#F7F2EA]">
                <div className="w-9 h-9 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-[#C9A96B]" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-[#1A1A1A] text-sm mb-1">{title}</h4>
                  <p className="font-body text-[#7A6A50] text-xs leading-relaxed font-light">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
