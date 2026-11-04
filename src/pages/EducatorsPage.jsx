import { Link } from 'react-router-dom';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { CheckCircle2, XCircle, ArrowRight, Clock, BookOpen, GraduationCap, Code2, Globe2, Palette, Sparkles } from 'lucide-react';

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

const programClusters = [
  {
    title: 'Test Prep Coaching (IELTS, TOEFL & Competitive Exams)',
    icon: GraduationCap,
    badge: 'Morning & Weekend Slots',
    desc: 'Host your IELTS, TOEFL, GRE, or competitive test-prep classes in an environment optimized for mock testing and intensive focus. Each cabin offers wide-format presentation displays for listening and reading comprehension modules, high-speed optical Wi-Fi for digital test platforms, and quiet acoustic insulation to simulate actual examination center conditions on Golf Course Extension Road.',
    keywords: ['IELTS coaching space for rent Gurugram', 'TOEFL coaching room Gurugram', 'Test-prep institute space'],
  },
  {
    title: 'Language & Communication Coaching',
    icon: Globe2,
    badge: 'Morning & Evening Slots',
    desc: 'From Spoken English academies and accent neutralization to Business English and foreign language instruction (French, German, Spanish, Japanese), our 6- to 12-seat cabins encourage participatory speaking circles. In-cabin laptop displays enable interactive multimedia listening drills, while magnetic whiteboards allow real-time phonetics and grammar mapping without screen glare.',
    keywords: ['Spoken English class space Gurugram', 'Business English classroom rental', 'Foreign language tuition room'],
  },
  {
    title: 'Skills, Tech & Professional Software Training',
    icon: Code2,
    badge: 'Weekday Mornings & Weekends',
    desc: 'Conduct hands-on technology workshops for working professionals and university students. Our classrooms provide stable high-bandwidth fiber connectivity, HDMI projection for live coding walkthroughs in Python or Web Development, and power points at every desk. Perfect for instructors teaching Advanced Excel, AutoCAD, Canva, Digital Marketing, and Generative AI applications.',
    keywords: ['Coding class space rental Gurugram', 'Advanced Excel training room Gurugram', 'AutoCAD training room Gurugram', 'Digital marketing training space'],
  },
  {
    title: 'School Subject Tuitions (Grade 5 to Grade 12)',
    icon: BookOpen,
    badge: 'Evenings from 3:30 PM & Weekends',
    desc: 'Independent CBSE, ICSE, and IB curriculum teachers utilize Mentors Studio for Mathematics, Physics, Chemistry, Biology, Commerce, and Humanities batches. With clean tiered seating, daily sanitization, dedicated reception for parent pick-up, and on-site printing for question papers and study worksheets, tutors project high professional credibility.',
    keywords: ['School tuition classroom Gurugram', 'Grade 5 tuition space Gurugram', 'Board exam coaching room Sector 57'],
  },
  {
    title: 'Arts, Crafts & Botany Experiential Workshops',
    icon: Palette,
    badge: 'Specialized Creative Venues',
    desc: 'Beyond traditional classrooms, our facility boasts a dedicated 16-seat Arts & Crafts open zone with washable surfaces for painting, sketching, calligraphy, and pottery. Furthermore, our private outdoor terrace balcony serves as a one-of-a-kind urban venue for botany classes, plant taxonomy, nature journaling, and outdoor experiential science workshops.',
    keywords: ['Art and craft classroom rental Gurugram', 'Botany nature-study classroom Gurugram', 'Creative workshop space'],
  },
];

const rules = [
  { allowed: false, label: 'No music classes', desc: 'Sound travels through the building. Music lessons cannot be accommodated.' },
  { allowed: false, label: 'No dance classes', desc: 'The space is not designed for movement-based activities.' },
  { allowed: false, label: 'No nursery or pre-nursery', desc: 'The mall setting is not appropriate for very young children.' },
  { allowed: true,  label: 'Grade 5 and above only', desc: 'School students from Grade 5 onwards are welcome in evening and weekend slots.' },
  { allowed: true,  label: 'Adults — all ages', desc: 'Adult learners of any age are welcome in morning and afternoon weekday slots.' },
  { allowed: true,  label: 'Mixed age groups accepted', desc: 'Mixed-age hobby and skill groups from Grade 5 upwards are accepted.' },
];

export function EducatorsPage() {
  return (
    <div className="bg-premium-dark min-h-screen">
      <SEO
        title="Classroom Rental for Tutors, Coaches & Trainers | Mentors Studio, Gurugram"
        description="IELTS/TOEFL, spoken English, coding, Excel, AutoCAD, school tuition and more — teach your programme in a fully managed classroom in Gurugram."
        canonicalPath="/educators"
        breadcrumbs={[{ name: 'For Educators', path: '/educators' }]}
      />

      <PageHero
        label="For Educators & Coaches"
        title="Built for Every Kind of Educator"
        subtitle="Mentors Studio is purpose-built for independent tutors, test-prep coaches, corporate trainers, and subject teachers who value a professional academic environment on Golf Course Extension Road, Sector 57, Gurugram — without the operational overhead of running a personal center."
        image="/images/classroom-standard.png"
        cta={{ label: 'Book Your Teaching Space', to: '/contact' }}
      />

      <Breadcrumbs items={[{ name: 'For Educators' }]} />

      {/* Value proposition strip */}
      <div className="bg-[#231F1B] border-b border-[#3A3228]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '₹0', label: 'Infrastructure investment' },
              { value: '0', label: 'Staff to hire & manage' },
              { value: '100%', label: 'Focus on teaching & students' },
              { value: '1 day', label: 'From booking to first session' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-[#C9A96B] text-3xl">{s.value}</p>
                <p className="font-mono text-xs text-[#A89880] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3.5 & 5: Rich Program Paragraphs with High Search Intent */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <AnimatedSection className="mb-10">
          <SectionLabel>Curriculum & Disciplines</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-2xl lg:text-3xl leading-snug">
            Specialized Spaces for Your Exact Teaching Program
          </h2>
          <p className="font-body text-[#A89880] text-sm lg:text-base mt-2 max-w-3xl font-light">
            Every subject has unique pedagogical needs — from high-lumen projectors for coding demos to sound-insulated cabins for IELTS speaking practice. Here is how our Gurugram teaching suites power each discipline:
          </p>
        </AnimatedSection>

        <div className="flex flex-col gap-6">
          {programClusters.map((cluster) => {
            const Icon = cluster.icon;
            return (
              <AnimatedSection key={cluster.title}>
                <div className="p-6 lg:p-8 bg-[#1A1A1A] border border-[#3A3228] rounded-sm hover:border-[#C9A96B]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-[#C9A96B]/15 text-[#C9A96B] flex items-center justify-center flex-shrink-0">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-display font-bold text-[#F7F2EA] text-lg sm:text-xl">
                        {cluster.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] tracking-wider uppercase px-3 py-1 bg-[#3E2F1F]/50 text-[#C9A96B] border border-[#C9A96B]/30 rounded-sm w-fit">
                      {cluster.badge}
                    </span>
                  </div>

                  <p className="font-body text-[#A89880] text-sm sm:text-base leading-relaxed font-light mb-4">
                    {cluster.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#3A3228]/80 text-xs font-mono text-[#7A6A50]">
                    <span className="text-[#A89880]">Targeted programs:</span>
                    {cluster.keywords.map((kw, ki) => (
                      <span key={ki} className="text-[#C9A96B]/90 bg-[#C9A96B]/5 px-2 py-0.5 rounded-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Educator Profiles */}
      <section className="bg-[#231F1B] border-y border-[#3A3228] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <SectionLabel>Educator Profiles</SectionLabel>
            <h2 className="font-display font-bold text-[#F7F2EA] text-2xl lg:text-3xl">Who teaches at Mentors Studio?</h2>
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
        </div>
      </section>

      {/* House rules */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <AnimatedSection className="mb-8">
          <SectionLabel>House Rules</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-2xl">What's permitted — and what isn't</h2>
          <p className="font-body text-[#A89880] text-sm mt-2 max-w-xl">These rules preserve a disciplined, premium learning atmosphere across all 9 cabins.</p>
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

      {/* Comparison: Independent setup vs Mentors Studio */}
      <section className="bg-[#231F1B] border-y border-[#3A3228] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <SectionLabel>Why Here</SectionLabel>
            <h2 className="font-display font-bold text-[#F7F2EA] text-2xl lg:text-3xl leading-tight max-w-2xl">
              Why Gurugram educators choose Mentors Studio over leasing commercial space.
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            <AnimatedSection direction="left">
              <div className="border border-[#3A3228] rounded-sm p-6 bg-[#1A1A1A]">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A89880] mb-4">Setting up independently</p>
                <div className="flex flex-col gap-3">
                  {[
                    'Finding and negotiating commercial property leases in Sector 57',
                    '3–6 month security deposits + upfront broker commissions',
                    'Purchasing classroom furniture, podiums, and whiteboards',
                    'Installing projectors, displays, and commercial internet connections',
                    'Hiring cleaning staff, reception manager, and technical maintenance',
                    'Fixed electricity bills and high ongoing operational liabilities',
                    '6–12 months before holding your first paid class',
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
                    'Walk directly into a furnished, ready-to-teach classroom cabin',
                    'Zero setup cost, zero infrastructure capital expenditure',
                    'All display tech, laptops, and whiteboards in place and maintained',
                    'Dual-band optical Wi-Fi and 100% generator power backup included',
                    'Full-time floor manager and IT technician present every session',
                    'Daily professional housekeeping, printing station, and student reception',
                    'Start teaching your batch in as little as 24–48 hours',
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
        <h3 className="font-display font-bold text-[#F7F2EA] text-2xl lg:text-3xl mb-4 max-w-lg mx-auto leading-tight">
          Ready to elevate your teaching business?
        </h3>
        <p className="font-body text-[#A89880] text-base mb-8 max-w-md mx-auto">
          One walkthrough with our manager is all it takes. Bring your students for a complimentary demo session before committing.
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
            See Pricing Table
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
