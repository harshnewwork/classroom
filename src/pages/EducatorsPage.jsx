import { Link } from 'react-router-dom';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { CheckCircle2, XCircle, ArrowRight, Clock, BookOpen } from 'lucide-react';

const educatorProfiles = [
  {
    label: 'Teachers',
    emoji: '📚',
    desc: 'School subject teachers running additional batches or private tuitions for Grade 5 and above students.',
  },
  {
    label: 'Tutors',
    emoji: '✏️',
    desc: 'Independent tutors who need a professional, well-equipped space without the overhead of running their own centre.',
  },
  {
    label: 'Mentors',
    emoji: '🎯',
    desc: 'Career mentors, academic coaches and guidance professionals who work with students on academic and professional development.',
  },
  {
    label: 'Trainers',
    emoji: '🏆',
    desc: 'Corporate trainers and skills development professionals who need a focused, professional classroom environment.',
  },
  {
    label: 'Language Coaches',
    emoji: '🌐',
    desc: 'IELTS, TOEFL, Spoken English, Business English and other language programme coaches.',
  },
  {
    label: 'Test-Prep Educators',
    emoji: '📋',
    desc: 'Educators running competitive exam preparation — from school board exams to professional certification programmes.',
  },
  {
    label: 'Skill Instructors',
    emoji: '⚙️',
    desc: 'AutoCAD, Advanced Excel, Canva, Digital Marketing, AI and other skill-based instructors teaching professionals.',
  },
  {
    label: 'Professional Coaches',
    emoji: '💼',
    desc: 'Business English, social media marketing, accounting and finance coaches working with adult learners.',
  },
  {
    label: 'Educational Creators',
    emoji: '🎬',
    desc: 'Educators who teach and create content simultaneously — our recording facility supports both activities.',
  },
];

const adultPrograms = [
  { name: 'IELTS & TOEFL',           time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Spoken English',           time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Business English',         time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Artificial Intelligence',  time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Accounts',                 time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Social Media Marketing',   time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Digital Marketing',        time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Language Classes',         time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Basic Coding',             time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Advanced Excel',           time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'AutoCAD',                  time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Multimedia',               time: 'Weekday mornings', cabin: 'Any cabin' },
  { name: 'Canva',                    time: 'Weekday mornings', cabin: 'Any cabin' },
];

const schoolPrograms = [
  { name: 'All Subjects (Grade 5–8)',    time: 'Evenings & weekends', cabin: 'Any cabin' },
  { name: 'All Subjects (Grade 9–12)',   time: 'Evenings & weekends', cabin: 'Any cabin' },
  { name: 'Arts & Crafts',              time: 'Evenings & weekends', cabin: 'Arts & Crafts Area (16 seats)' },
  { name: 'Botany',                     time: 'Evenings & weekends', cabin: 'Botany Balcony (outdoor)' },
];

const rules = [
  { allowed: false, label: 'No music classes', desc: 'Sound travels through the building. Music lessons cannot be accommodated.' },
  { allowed: false, label: 'No dance classes', desc: 'The space is not designed for movement-based activities.' },
  { allowed: false, label: 'No nursery or pre-nursery', desc: 'The mall setting is not appropriate for very young children.' },
  { allowed: true,  label: 'Grade 5 and above only', desc: 'School students from Grade 5 onwards are welcome in the evening and weekend slots.' },
  { allowed: true,  label: 'Adults — all ages', desc: 'Adult learners of any age are welcome in the morning weekday slots.' },
  { allowed: true,  label: 'Mixed age groups accepted', desc: 'Mixed-age groups from Grade 5 upwards are accepted.' },
];

export function EducatorsPage() {
  return (
    <div className="bg-premium-dark min-h-screen">
      <PageHero
        label="For Educators"
        title={<>Your Students. Your Method. <span className="text-gradient">Your Business.</span></>}
        subtitle="Mentors Studio is built for educators who know their craft and want a professional environment to deliver it — without the operational burden of running their own centre."
        breadcrumb={[{ label: 'For Educators' }]}
        image="/images/classroom-standard.png"
        cta={{ label: 'Book Your Space', to: '/contact' }}
      />

      {/* Value proposition strip */}
      <div className="bg-[#231F1B] border-b border-[#3A3228]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '₹0', label: 'Infrastructure investment' },
              { value: '0', label: 'Staff to hire' },
              { value: '100%', label: 'Focus on teaching' },
              { value: '1 day', label: 'From booking to teaching' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-[#C9A96B] text-3xl">{s.value}</p>
                <p className="font-mono text-xs text-[#A89880] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who teaches here */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <AnimatedSection className="mb-10">
          <SectionLabel>Educator Profiles</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-3xl">Who teaches at Mentors Studio?</h2>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {educatorProfiles.map((ep) => (
            <StaggerItem key={ep.label}>
              <div className="h-full p-5 border border-[#3A3228] rounded-sm bg-[#1A1A1A] hover:border-[#C9A96B]/30 hover:bg-[#C9A96B]/3 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{ep.emoji}</span>
                  <h3 className="font-display font-bold text-[#F7F2EA] text-base group-hover:text-[#C9A96B] transition-colors">{ep.label}</h3>
                </div>
                <p className="font-body text-[#A89880] text-sm leading-relaxed">{ep.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* What you can teach */}
      <section className="bg-[#231F1B] border-y border-[#3A3228] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <SectionLabel>Programmes</SectionLabel>
            <h2 className="font-display font-bold text-[#F7F2EA] text-3xl">What you can teach here</h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Adult */}
            <AnimatedSection direction="left">
              <div className="border border-[#3A3228] rounded-sm overflow-hidden bg-[#1A1A1A]">
                <div className="p-5 border-b border-[#3A3228] bg-[#3E2F1F]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={14} className="text-[#C9A96B]" />
                    <span className="font-mono text-xs text-[#C9A96B] tracking-wide uppercase">Adult Programmes</span>
                  </div>
                  <p className="font-body text-[#A89880] text-sm">Monday to Friday · 10:00 am – 3:28 pm · 5 sessions/day</p>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {adultPrograms.map((p) => (
                      <span key={p.name} className="px-3 py-1.5 bg-[#3E2F1F]/30 border border-[#3E2F1F] rounded-sm font-body text-sm text-[#F7F2EA]">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* School */}
            <AnimatedSection direction="right">
              <div className="border border-[#3A3228] rounded-sm overflow-hidden bg-[#1A1A1A]">
                <div className="p-5 border-b border-[#3A3228] bg-[#2D6A4F]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen size={14} className="text-[#C9A96B]" />
                    <span className="font-mono text-xs text-[#C9A96B] tracking-wide uppercase">School & Hobby Programmes</span>
                  </div>
                  <p className="font-body text-[#A89880] text-sm">Evenings from 3:30 pm · Weekends · Grade 5 and above</p>
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-3">
                    {schoolPrograms.map((p) => (
                      <div key={p.name} className="flex items-start justify-between gap-3 py-2 border-b border-[#3A3228] last:border-0">
                        <span className="font-body text-[#F7F2EA] text-sm">{p.name}</span>
                        <span className="font-mono text-[11px] text-[#A89880] text-right flex-shrink-0">{p.cabin}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 rounded-sm">
                      <p className="font-display font-semibold text-[#F7F2EA] text-sm">Arts & Crafts Area</p>
                      <p className="font-mono text-[10px] text-[#A89880] mt-1">16-seat open area</p>
                    </div>
                    <div className="p-3 bg-[#3E2F1F]/15 border border-[#3E2F1F]/30 rounded-sm">
                      <p className="font-display font-semibold text-[#F7F2EA] text-sm">Botany Balcony</p>
                      <p className="font-mono text-[10px] text-[#A89880] mt-1">Private outdoor area</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* House rules */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <AnimatedSection className="mb-8">
          <SectionLabel>House Rules</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-2xl">What's permitted — and what isn't</h2>
          <p className="font-body text-[#A89880] text-sm mt-2 max-w-xl">These rules protect the learning environment for everyone in the studio.</p>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule, i) => (
            <StaggerItem key={i}>
              <div className={`h-full p-5 rounded-sm border ${
                rule.allowed
                  ? 'border-[#C9A96B]/20 bg-[#C9A96B]/3'
                  : 'border-[#3A3228] bg-[#1A1A1A]'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {rule.allowed
                    ? <CheckCircle2 size={16} className="text-[#C9A96B] flex-shrink-0" />
                    : <XCircle size={16} className="text-[#A89880] flex-shrink-0" />
                  }
                  <p className={`font-display font-semibold text-sm ${rule.allowed ? 'text-[#F7F2EA]' : 'text-[#7A6A50]'}`}>{rule.label}</p>
                </div>
                <p className="font-body text-[#A89880] text-sm leading-relaxed pl-6">{rule.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Why Mentors Studio */}
      <section className="bg-[#231F1B] border-y border-[#3A3228] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <SectionLabel>Why Here</SectionLabel>
            <h2 className="font-display font-bold text-[#F7F2EA] text-3xl leading-tight max-w-2xl">
              Why educators choose Mentors Studio over setting up independently.
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            <AnimatedSection direction="left">
              <div className="border border-[#3A3228] rounded-sm p-6 bg-[#1A1A1A]">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A89880] mb-4">Setting up independently</p>
                <div className="flex flex-col gap-3">
                  {[
                    'Finding and negotiating a suitable location',
                    '3–6 month security deposit + advance rent',
                    'Purchasing furniture and classroom equipment',
                    'Installing digital boards, projectors, Wi-Fi',
                    'Hiring a manager, technician and housekeeping',
                    'Managing utilities, maintenance and operations',
                    '6–12 months before first class',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <XCircle size={14} className="text-[#A89880] flex-shrink-0 mt-0.5" />
                      <span className="font-body text-[#A89880] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="border border-[#C9A96B]/30 rounded-sm p-6 bg-[#C9A96B]/3">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C9A96B] mb-4">With Mentors Studio</p>
                <div className="flex flex-col gap-3">
                  {[
                    'Walk into a ready, professional teaching space',
                    '₹0 upfront infrastructure cost',
                    'All furniture, AV, Wi-Fi already in place',
                    'Digital boards, laptops, projectors included',
                    'Manager and IT technician on-site every day',
                    'Housekeeping, printing, lockers included',
                    'First class possible in 1–2 days',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-[#C9A96B] flex-shrink-0 mt-0.5" />
                      <span className="font-body text-[#F7F2EA] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
        <h3 className="font-display font-bold text-[#F7F2EA] text-3xl mb-4 max-w-lg mx-auto leading-tight">
          Ready to start teaching at Mentors Studio?
        </h3>
        <p className="font-body text-[#A89880] text-base mb-8 max-w-md mx-auto">
          One conversation with our manager is all it takes. No commitment required before your visit.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96B] text-[#1A1A1A] font-display font-bold text-base rounded-sm hover:bg-[#D4B87A] transition-colors"
          >
            Book Your Space
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 border border-[#3A3228] text-[#A89880] font-display font-semibold text-base rounded-sm hover:border-[#C9A96B] hover:text-[#C9A96B] transition-all"
          >
            See Pricing
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
