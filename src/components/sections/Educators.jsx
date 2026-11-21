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
  MessageSquareQuote,
  Languages,
  Landmark,
  Users,
  Mic,
  Coins,
  FileSpreadsheet,
  Megaphone,
  PenTool,
  BarChart3,
  Palette,
  Trophy,
  Brain,
  Layers,
  Sprout,
} from 'lucide-react';

/* ─── Custom Vector Icons Matching Reference Graphic ─── */
function IconAbacus({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="14" x2="21" y2="14" />
      <circle cx="7" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" />
      <circle cx="11" cy="14" r="1.5" fill="currentColor" />
      <circle cx="17" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconVedicMaths({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="7.5" y1="5.5" x2="7.5" y2="9.5" />
      <line x1="5.5" y1="7.5" x2="9.5" y2="7.5" />
      <line x1="14.5" y1="7.5" x2="18.5" y2="7.5" />
      <line x1="6" y1="15" x2="9" y2="18" />
      <line x1="9" y1="15" x2="6" y2="18" />
      <line x1="14.5" y1="16.5" x2="18.5" y2="16.5" />
      <circle cx="16.5" cy="14.5" r="0.75" fill="currentColor" />
      <circle cx="16.5" cy="18.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function IconRobotics({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 21h8" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="13" cy="12" r="2" />
      <circle cx="19" cy="5" r="2" />
      <line x1="8.5" y1="17.5" x2="11.5" y2="13.5" />
      <line x1="14.5" y1="10.5" x2="17.5" y2="6.5" />
      <path d="M19 2l3 3" />
      <path d="M16 3l3 3" />
    </svg>
  );
}

function IconChessKnight({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 20h14" />
      <path d="M6 20v-2a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2" />
      <path d="M8 12c-1.5 0-3-.5-3-2 0-2 2-4 4-5l1-2 2 1c1.5 1 2 2.5 2 4.5 0 1.5-.5 2.5-1 3.5" />
      <circle cx="9" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function IconTeacher({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <path d="M2 17v-1.5a3.5 3.5 0 0 1 7 0V17" />
      <rect x="11" y="4" width="11" height="8" rx="1.5" />
      <path d="M16.5 12v5" />
      <path d="M14 19l2.5-2 2.5 2" />
    </svg>
  );
}

function IconInterview({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="7" r="2.5" />
      <circle cx="5" cy="10" r="2" />
      <circle cx="19" cy="10" r="2" />
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0" />
      <path d="M2 19a3 3 0 0 1 6 0" />
      <path d="M16 19a3 3 0 0 1 6 0" />
    </svg>
  );
}

function IconAITools({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

/* ─── 15 Adult Education Programmes (3 cols x 5 rows) ─── */
const adultProgrammes = [
  // Row 1
  { title: 'IELTS & PTE',        icon: GraduationCap },
  { title: 'Spoken English',      icon: MessageSquareQuote },
  { title: 'Foreign Languages',   icon: Languages },
  // Row 2
  { title: 'Teacher Training',    icon: IconTeacher },
  { title: 'CTET & TET',          icon: ClipboardCheck },
  { title: 'Govt Exam Prep',      icon: Landmark },
  // Row 3
  { title: 'Interview Prep',      icon: IconInterview },
  { title: 'Public Speaking',     icon: Mic },
  { title: 'Tally & GST',         icon: Coins },
  // Row 4
  { title: 'Advanced Excel',      icon: FileSpreadsheet },
  { title: 'Digital Marketing',   icon: Megaphone },
  { title: 'AI Tools',            icon: IconAITools },
  // Row 5
  { title: 'Canva & Content',     icon: PenTool },
  { title: 'Data Analytics',      icon: BarChart3 },
  { title: 'Art & Craft',         icon: Palette },
];

/* ─── 15 School & Hobby Programmes (3 cols x 5 rows) ─── */
const schoolHobbyProgrammes = [
  // Row 1
  { title: 'Grade 5 and Above',     icon: Users },
  { title: 'CBSE, ICSE, IB, IGCSE', icon: Layers },
  { title: 'JEE-NEET Foundation',   icon: GraduationCap },
  // Row 2
  { title: 'Olympiad Prep',         icon: Trophy },
  { title: 'IELTS Prep',            icon: Target },
  { title: 'SAT Prep',              icon: Brain },
  // Row 3
  { title: 'Spoken English',        icon: MessageSquareQuote },
  { title: 'Foreign Languages',     icon: Globe2 },
  { title: 'Abacus',                icon: IconAbacus },
  // Row 4
  { title: 'Vedic Maths',           icon: IconVedicMaths },
  { title: 'Coding for Kids',       icon: Code2 },
  { title: 'Robotics',              icon: IconRobotics },
  // Row 5
  { title: 'Chess Classes',         icon: IconChessKnight },
  { title: 'Arts and Crafts',       icon: Palette },
  { title: 'Botany on the Balcony', icon: Sprout },
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

        {/* ─── Programmes: Matched to Website Theme ─── */}
        <div className="grid lg:grid-cols-2 gap-7 mb-12">

          {/* Left Card: Adult Education Programmes */}
          <AnimatedSection direction="left">
            <div className="border border-[#DDD0B8] rounded-[24px] overflow-hidden bg-[#F7F2EA] shadow-xs p-5 sm:p-6 h-full flex flex-col justify-between hover:border-[#C9A96B]/60 transition-all">
              <div>
                {/* Header Badge */}
                <div className="flex justify-center mb-1">
                  <div className="bg-[#EADCC8] text-[#2A180A] rounded-full px-5 py-2 sm:px-6 sm:py-2.5 shadow-2xs border border-[#C9A96B] inline-flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B6914] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <GraduationCap size={18} className="stroke-[2.2]" />
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg tracking-wide text-[#2A180A]">
                      Adult Education Programmes
                    </h3>
                  </div>
                </div>

                <p className="text-center font-mono text-[10.5px] sm:text-[11px] tracking-wider uppercase text-[#8B6914] font-bold mb-5 mt-2">
                  Monday to Friday · 10:00 am – 3:20 pm
                </p>

                {/* 15 Program Tiles (3 columns x 5 rows) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {adultProgrammes.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.title}
                        className="bg-[#FFFDF9] hover:bg-white border border-[#DDD0B8] hover:border-[#8B6914] shadow-2xs hover:shadow-xs rounded-xl px-2.5 py-2.5 sm:px-3 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-default"
                      >
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8B6914] flex-shrink-0 group-hover:scale-105 transition-transform" />
                        <span className="w-px h-3.5 sm:h-4 bg-[#C9A96B]/50 flex-shrink-0" />
                        <span className="font-body font-semibold text-[11px] sm:text-xs text-[#1A1A1A] leading-tight group-hover:text-[#8B6914] transition-colors">
                          {p.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Card: School and Hobby Programmes */}
          <AnimatedSection direction="right">
            <div className="border border-[#DDD0B8] rounded-[24px] overflow-hidden bg-[#F7F2EA] shadow-xs p-5 sm:p-6 h-full flex flex-col justify-between hover:border-[#C9A96B]/60 transition-all">
              <div>
                {/* Header Badge */}
                <div className="flex justify-center mb-1">
                  <div className="bg-[#EADCC8] text-[#2A180A] rounded-full px-5 py-2 sm:px-6 sm:py-2.5 shadow-2xs border border-[#C9A96B] inline-flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B6914] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <BookOpen size={18} className="stroke-[2.2]" />
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg tracking-wide text-[#2A180A]">
                      School and Hobby Programmes
                    </h3>
                  </div>
                </div>

                {/* Decorative flourish under title */}
                <div className="flex items-center justify-center gap-2 my-1 text-[#8B6914]">
                  <span className="text-[10px]">♦</span>
                  <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent via-[#C9A96B] to-transparent" />
                  <span className="text-xs">❦</span>
                  <span className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent via-[#C9A96B] to-transparent" />
                  <span className="text-[10px]">♦</span>
                </div>

                <p className="text-center font-mono text-[10.5px] sm:text-[11px] tracking-wider uppercase text-[#8B6914] font-bold mb-5 mt-1">
                  Evenings · Weekends · Grade 5 and Above
                </p>

                {/* 15 Program Tiles (3 columns x 5 rows) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {schoolHobbyProgrammes.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.title}
                        className="bg-[#FFFDF9] hover:bg-white border border-[#DDD0B8] hover:border-[#8B6914] shadow-2xs hover:shadow-xs rounded-xl px-2.5 py-2.5 sm:px-3 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-default"
                      >
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8B6914] flex-shrink-0 group-hover:scale-105 transition-transform" />
                        <span className="w-px h-3.5 sm:h-4 bg-[#C9A96B]/50 flex-shrink-0" />
                        <span className="font-body font-semibold text-[11px] sm:text-xs text-[#1A1A1A] leading-tight group-hover:text-[#8B6914] transition-colors">
                          {p.title}
                        </span>
                      </div>
                    );
                  })}
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
