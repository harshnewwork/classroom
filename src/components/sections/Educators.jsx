import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import {
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Globe2,
  ClipboardCheck,
  Code2,
  Briefcase,
  Video,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

const adultPrograms = [
  'IELTS & TOEFL',
  'Spoken English',
  'Business English',
  'Artificial Intelligence',
  'Accounting & Finance',
  'Digital Marketing',
  'Foreign Languages',
  'Programming & Coding',
  'Advanced Excel',
  'AutoCAD',
  'Canva & Design',
];

const schoolPrograms = [
  'School Tuitions (Grade 5 and above)',
  'CBSE / ICSE / IB Curriculum Support',
  'Competitive Exam Foundation',
  'Arts & Crafts Workshops',
  'Botany Experiential Study',
];

const educatorTypes = [
  { label: 'Teachers',             icon: GraduationCap },
  { label: 'Tutors',               icon: BookOpen },
  { label: 'Mentors',              icon: Target },
  { label: 'Trainers',             icon: Award },
  { label: 'Language Coaches',     icon: Globe2 },
  { label: 'Test-Prep Educators',  icon: ClipboardCheck },
  { label: 'Skill Instructors',    icon: Code2 },
  { label: 'Professional Coaches', icon: Briefcase },
  { label: 'Educational Creators', icon: Video },
];

const rules = [
  { allowed: false, text: 'No music or dance classes — acoustic discipline ensures zero spillover to neighboring cabins.' },
  { allowed: false, text: 'No nursery or pre-nursery — the academic mall setting is curated for mature learners.' },
  { allowed: true,  text: 'Grade 5 and above only — focused, structured classroom environments.' },
  { allowed: true,  text: 'Adult programmes welcome all skill-levels during morning and daytime sessions.' },
];

export function Educators() {
  return (
    <section id="educators" className="section-pad bg-warm-stone relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#C9A96B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
          <SectionLabel className="justify-center">For Educators</SectionLabel>
          <h2
            className="font-display font-bold text-[#1A1A1A] leading-[1.08] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
          >
            Your Students. Your Method.{' '}
            <span className="text-[#8B6914] italic">Your Business.</span>
          </h2>
          <p className="font-body text-[#3E2F1F] text-base mt-3 font-normal leading-relaxed">
            Mentors Studio provides the turnkey infrastructure. You maintain complete academic freedom, direct student relationships, and 100% of your tuition fees.
          </p>
        </AnimatedSection>

        {/* Educator type cards — refined editorial aesthetic replacing emojis */}
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3 mb-12" delay={0.04}>
          {educatorTypes.map((et) => {
            const Icon = et.icon;
            return (
              <StaggerItem key={et.label}>
                <div className="flex flex-col items-center justify-center gap-2.5 p-4 border border-[#DDD0B8] rounded-sm hover:border-[#8B6914] hover:bg-[#FFFDF9] transition-all text-center group bg-[#F7F2EA] shadow-2xs h-full">
                  <div className="w-10 h-10 rounded-sm bg-[#EADCC8] flex items-center justify-center text-[#3E2F1F] group-hover:bg-[#8B6914] group-hover:text-white transition-colors">
                    <Icon size={18} />
                  </div>
                  <span className="font-body text-[#1A1A1A] font-semibold text-xs leading-tight group-hover:text-[#8B6914] transition-colors">
                    {et.label}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Programs */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <AnimatedSection direction="left">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-xs h-full flex flex-col">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B6914] font-bold">
                    Adult Programmes
                  </span>
                  <p className="font-body text-[#3E2F1F] text-xs mt-1 font-medium">
                    Monday to Friday · 10:00 am – 3:20 pm
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 bg-[#EADCC8] text-[#3E2F1F] rounded-xs font-bold uppercase">
                  Morning
                </span>
              </div>
              <div className="p-5 flex flex-wrap gap-2 flex-1">
                {adultPrograms.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1.5 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm font-body text-xs font-medium text-[#1A1A1A] shadow-2xs"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-xs h-full flex flex-col">
              <div className="p-5 border-b border-[#DDD0B8] bg-[#F7F2EA] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8B6914] font-bold">
                    School & Hobby Programmes
                  </span>
                  <p className="font-body text-[#3E2F1F] text-xs mt-1 font-medium">
                    Evenings · Weekends · Grade 5 and above
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 bg-[#EADCC8] text-[#3E2F1F] rounded-xs font-bold uppercase">
                  Evening
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div className="flex flex-wrap gap-2 mb-5">
                  {schoolPrograms.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1.5 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm font-body text-xs font-medium text-[#1A1A1A] shadow-2xs"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-[#DDD0B8] pt-4">
                  <div className="p-3 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm">
                    <p className="font-display font-bold text-[#1A1A1A] text-sm">Arts & Crafts Zone</p>
                    <p className="font-mono text-[10px] text-[#5C450C] mt-1 font-semibold">16 seats · Dedicated creative area</p>
                  </div>
                  <div className="p-3 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm">
                    <p className="font-display font-bold text-[#1A1A1A] text-sm">Botany Balcony</p>
                    <p className="font-mono text-[10px] text-[#5C450C] mt-1 font-semibold">Private outdoor terrace space</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* House Guidelines */}
        <AnimatedSection>
          <div className="border border-[#DDD0B8] rounded-sm p-6 bg-[#F7F2EA] shadow-xs">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#5C450C] mb-4 font-bold">
              Community Guidelines & Suitability
            </p>
            <div className="grid sm:grid-cols-2 gap-3.5">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm">
                  {rule.allowed ? (
                    <CheckCircle2 size={16} className="text-[#8B6914] flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-red-700 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-body text-xs text-[#3E2F1F] leading-relaxed font-medium">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
