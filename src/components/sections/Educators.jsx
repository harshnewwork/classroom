import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { XCircle, CheckCircle2 } from 'lucide-react';

const adultPrograms = ['IELTS & TOEFL','Spoken English','Business English','Artificial Intelligence','Accounts','Social Media Marketing','Digital Marketing','Language Classes','Basic Coding','Advanced Excel','AutoCAD','Multimedia','Canva'];
const schoolPrograms = ['All Subjects (Grade 5 and above)','Arts & Crafts','Botany'];
const educatorTypes = [
  { label: 'Teachers',             emoji: '📚' },
  { label: 'Tutors',               emoji: '✏️' },
  { label: 'Mentors',              emoji: '🎯' },
  { label: 'Trainers',             emoji: '🏆' },
  { label: 'Language Coaches',     emoji: '🌐' },
  { label: 'Test-Prep Educators',  emoji: '📋' },
  { label: 'Skill Instructors',    emoji: '⚙️' },
  { label: 'Professional Coaches', emoji: '💼' },
  { label: 'Educational Creators', emoji: '🎬' },
];
const rules = [
  { allowed: false, text: 'No music or dance classes. Noise travels — these are not permitted.' },
  { allowed: false, text: 'No nursery or pre-nursery. The mall environment is not suitable for very young children.' },
  { allowed: true,  text: 'Grade 5 and above only. Focused, structured learning environments.' },
  { allowed: true,  text: 'Adult programmes welcome all ages in the morning time slots.' },
];

export function Educators() {
  return (
    <section id="educators" className="section-pad bg-warm-stone relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#C9A96B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel className="justify-center">For Educators</SectionLabel>
          <h2 className="font-display font-bold text-[#1A1A1A] leading-[1.06] tracking-tight"
            style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}>
            Your Students. Your Method.{' '}
            <span className="text-gradient italic">Your Business.</span>
          </h2>
        </AnimatedSection>

        {/* Educator type pills */}
        <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 mb-14" delay={0.05}>
          {educatorTypes.map(et => (
            <StaggerItem key={et.label}>
              <div className="flex flex-col items-center gap-2 p-4 border border-[#DDD0B8] rounded-sm hover:border-[#C9A96B]/50 hover:bg-[#C9A96B]/4 transition-all text-center group bg-[#F7F2EA]">
                <span className="text-2xl">{et.emoji}</span>
                <span className="font-body text-[#7A6A50] text-[11px] leading-tight group-hover:text-[#1A1A1A] transition-colors">{et.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Programs */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <AnimatedSection direction="left">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA]">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA]">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C9A96B]">Adult Programmes</span>
                <p className="font-body text-[#7A6A50] text-xs mt-1 font-light">Monday to Friday · 10 am – 3:28 pm</p>
              </div>
              <div className="p-5 flex flex-wrap gap-2">
                {adultPrograms.map(p => (
                  <span key={p} className="px-3 py-1.5 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm font-body text-sm text-[#3E2F1F]">{p}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA]">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA]">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C9A96B]">School & Hobby Programmes</span>
                <p className="font-body text-[#7A6A50] text-xs mt-1 font-light">Evenings from 3:30 pm · Weekends · Grade 5+</p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-5">
                  {schoolPrograms.map(p => (
                    <span key={p} className="px-3 py-1.5 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm font-body text-sm text-[#3E2F1F]">{p}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-[#DDD0B8] pt-4">
                  <div className="p-3 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm">
                    <p className="font-display font-semibold text-[#1A1A1A] text-sm">Arts & Crafts Area</p>
                    <p className="font-mono text-[9px] text-[#7A6A50] mt-1">16 seats · Open area</p>
                  </div>
                  <div className="p-3 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm">
                    <p className="font-display font-semibold text-[#1A1A1A] text-sm">Botany Balcony</p>
                    <p className="font-mono text-[9px] text-[#7A6A50] mt-1">Private outdoor space</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Rules */}
        <AnimatedSection>
          <div className="border border-[#DDD0B8] rounded-sm p-6 bg-[#F7F2EA]">
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#7A6A50] mb-4">House Rules</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  {rule.allowed
                    ? <CheckCircle2 size={15} className="text-[#C9A96B] flex-shrink-0 mt-0.5" />
                    : <XCircle     size={15} className="text-[#A89880] flex-shrink-0 mt-0.5" />}
                  <p className="font-body text-sm text-[#7A6A50] leading-relaxed font-light">{rule.text}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
