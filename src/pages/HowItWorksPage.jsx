import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { getFAQSchema } from '../components/seo/schema';
import { ArrowRight, CheckCircle2, Clock, Calendar, Users, MessageCircle, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/faqs';

const steps = [
  {
    num: '01',
    title: 'Tell Us What You Teach',
    tagline: 'No paperwork. No upfront deposit.',
    desc: 'Start by reaching out to the Mentors Studio facility manager with a brief overview of what you teach, the grade or age group of your students, and your expected batch size.',
    details: [
      'Share your subject focus — IELTS, coding, school tuition, language, or creative arts',
      'Specify your learners — adult professionals or school students (Grade 5 and above)',
      'Share your typical batch size (helps us recommend an optimal 6, 8, 10, 12 or 24-seat cabin)',
      'Indicate your preferred days and time slots across morning, afternoon, or evening shifts',
      'No paperwork or upfront security deposit required to initiate booking discussions',
    ],
    image: '/images/reception-lobby.png',
    color: '#C9A96B',
  },
  {
    num: '02',
    title: 'Visit a Cabin & Test the Technology',
    tagline: 'Touch the technology. Test the layout.',
    desc: 'Visit Mentors Studio directly on Golf Course Extension Road, Sector 57, Gurugram. Tour all 9 cabins, test the in-cabin displays and projectors, and run a complimentary demo session with your students.',
    details: [
      'Inspect all available cabin capacities from 6-seat tutoring suites to 24-seat lecture halls',
      'Connect your laptop to test HDMI projection, audio, and wireless screencasting',
      'Bring a small group of students for a free, complimentary demo teaching class',
      'Experience our climate control, acoustic isolation, and ergonomic classroom seating',
      'Clarify scheduling, timing, and billing parameters directly with the on-site floor manager',
    ],
    image: '/images/classroom-physics.png',
    color: '#C9A96B',
  },
  {
    num: '03',
    title: 'Manager Confirms Your Recurring Slots',
    tagline: 'Structured scheduling. No double bookings.',
    desc: 'Once you select your preferred cabin, your recurring weekly timetable is locked into the studio calendar by the manager. Our calendar system prevents double bookings across all 11 teaching spaces.',
    details: [
      'The manager registers your recurring timetable (e.g., Mon/Wed/Fri 4:31–5:26 pm)',
      'Your slot is secured on the official shared Mentors Studio master schedule',
      'You receive confirmation of your reserved teaching cabin and schedule',
      'Strict single-occupancy management guarantees zero room overlap or waiting delays',
      'Flexible rescheduling or batch expansions can be coordinated with the manager',
    ],
    image: '/images/facilities-lockers.png',
    color: '#C9A96B',
  },
  {
    num: '04',
    title: 'Teach, Then Pay Monthly in Arrears',
    tagline: 'Monthly billing. Collect from students first.',
    desc: 'Deliver your classes in a turnkey academic environment. At the end of each calendar month, you receive a single consolidated invoice reflecting sessions taught. Pay after you collect tuition fees from your students.',
    details: [
      'Teach your scheduled batches throughout the month with full IT and housekeeping support',
      'Receive a transparent monthly tax invoice based strictly on sessions conducted',
      'Collect your fees from students first throughout the month, eliminating cashflow pressure',
      'Enjoy volume discounts up to 20% by enrolling in structured multi-month packages',
      'Zero cancellation penalties for Pay As You Go members',
    ],
    image: '/images/classroom-seminar.png',
    color: '#C9A96B',
  },
];

// Relevant FAQs for How It Works
const bookingFaqs = FAQS.filter(f =>
  ['booking-options', 'inclusions', 'min-billing-calculation', 'scale-cabin-size', 'sunday-classes', 'student-acquisition'].includes(f.id)
);

export function HowItWorksPage() {
  return (
    <div className="bg-warm-stone min-h-screen">
      <SEO
        title="How Classroom Booking Works | Mentors Studio, Gurugram"
        description="From enquiry to your first class in four steps — visit, confirm your slot, teach, then pay monthly. No paperwork or deposit to get started."
        canonicalPath="/how-it-works"
        schema={getFAQSchema(bookingFaqs)}
        breadcrumbs={[{ name: 'How It Works', path: '/how-it-works' }]}
      />

      <PageHero
        label="Booking Process"
        title="From Booking to Teaching — How It Works"
        subtitle="Four clear steps from enquiry to your first class on Golf Course Extension Road, Sector 57, Gurugram. No complex paperwork, no upfront deposit, and transparent monthly billing in arrears."
        image="/images/terrace-balcony.png"
        cta={{ label: 'Start Your Enquiry', to: '/contact' }}
      />

      <Breadcrumbs items={[{ name: 'How It Works' }]} />

      {/* Steps — detailed */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => {
            const isReversed = i % 2 !== 0;
            return (
              <AnimatedSection key={step.num} direction={isReversed ? 'right' : 'left'}>
                <div className="grid lg:grid-cols-2 gap-0 border border-[#DDD0B8] rounded-sm overflow-hidden mb-6 bg-[#F7F2EA] shadow-sm">
                  {/* Image */}
                  <div className={`relative ${isReversed ? 'lg:order-2' : ''}`}>
                    <img
                      src={step.image}
                      alt={`${step.title} — Step ${step.num} of classroom booking at Mentors Studio Gurugram`}
                      className="w-full h-64 lg:h-full min-h-[280px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1A1A1A]/60 to-transparent" />
                    {/* Step number overlay */}
                    <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
                      <div
                        className="w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center shadow-lg"
                        style={{ borderColor: step.color, background: '#1A1A1A' }}
                      >
                        <span className="font-mono text-[9px] tracking-widest text-[#C9A96B]">STEP</span>
                        <span className="font-display font-bold text-lg leading-none text-[#C9A96B]">{step.num}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 lg:p-10 bg-[#F7F2EA] flex flex-col justify-center ${isReversed ? 'lg:order-1' : ''}`}>
                    <p className="font-mono text-xs tracking-wide mb-2 text-[#C9A96B] uppercase font-semibold">
                      {step.tagline}
                    </p>
                    <h2 className="font-display font-bold text-[#1A1A1A] text-2xl mb-4">{step.title}</h2>
                    <p className="font-body font-light text-[#7A6A50] text-base leading-relaxed mb-6">{step.desc}</p>
                    <ul className="flex flex-col gap-2.5">
                      {step.details.map((d, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-[#C9A96B]" />
                          <span className="font-body font-light text-[#7A6A50] text-sm leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connector arrow */}
                {i < steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="flex flex-col items-center gap-1 text-[#DDD0B8]">
                      <div className="w-px h-6 bg-[#DDD0B8]" />
                      <ArrowRight size={14} className="rotate-90 text-[#C9A96B]" />
                    </div>
                  </div>
                )}
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Scheduling details */}
      <section className="bg-warm-stone border-y border-[#DDD0B8] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <SectionLabel>Scheduling Rules</SectionLabel>
            <h2 className="font-display font-bold text-[#1A1A1A] text-2xl lg:text-3xl">What to expect from the studio schedule</h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Calendar, title: 'Operating Days', desc: 'Monday to Saturday, plus three Sundays per month. Operating hours run from 10:00 am to 8:29 pm.' },
              { icon: Clock,    title: 'Recommended Commitment', desc: 'At least 2 sessions per day, and at least 3 days per week to ensure learning continuity for students.' },
              { icon: Users,    title: 'Multiple Batches', desc: 'Run multiple batches across different time slots or cabin capacities. Easily coordinate with the manager.' },
              { icon: Clock,    title: 'Adult Timetable', desc: '5 morning and midday slots Monday–Friday, each 60 minutes long. Running from 10:00 am to 3:28 pm.' },
              { icon: Clock,    title: 'School Timetable', desc: '5 evening slots, each 55 minutes long. Running from 3:30 pm to 8:29 pm, with full weekend availability.' },
              { icon: Calendar, title: 'Monthly Billing', desc: 'Consolidated tax invoice issued at month-end for sessions taught. Zero advance session payments.' },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="p-5 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm hover:border-[#C9A96B]/40 transition-colors h-full">
                  <div className="w-9 h-9 bg-[#C9A96B]/10 rounded-sm flex items-center justify-center mb-4">
                    <Icon size={16} className="text-[#C9A96B]" />
                  </div>
                  <h3 className="font-display font-semibold text-[#1A1A1A] text-sm mb-2">{title}</h3>
                  <p className="font-body font-light text-[#7A6A50] text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ subset */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <AnimatedSection className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="font-display font-bold text-[#1A1A1A] text-2xl">Common booking questions answered</h2>
          </div>
          <Link to="/faq" className="font-mono text-xs text-[#C9A96B] hover:text-[#3E2F1F] font-semibold inline-flex items-center gap-1">
            Browse complete 15-question FAQ bank <ArrowRight size={12} />
          </Link>
        </AnimatedSection>

        <StaggerContainer className="grid lg:grid-cols-2 gap-4">
          {bookingFaqs.map((faq, i) => (
            <StaggerItem key={i}>
              <div className="p-6 border border-[#DDD0B8] rounded-sm bg-[#F7F2EA] hover:border-[#C9A96B]/40 transition-colors h-full">
                <p className="font-display font-semibold text-[#1A1A1A] text-sm mb-3 leading-snug">{faq.question}</p>
                <p className="font-body font-light text-[#7A6A50] text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display font-bold text-[#1A1A1A] text-2xl mb-2">Ready to plan your timetable?</h3>
            <p className="font-body font-light text-[#7A6A50] text-base">Send an enquiry with your subject and preferred cabin size. No commitment required.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/contact"
              className="flex items-center gap-2 px-7 py-3.5 bg-[#1A1A1A] text-[#F7F2EA] font-display font-bold text-sm rounded-sm hover:bg-[#3E2F1F] transition-colors"
            >
              <MessageCircle size={15} />
              Book Your Space
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-2 px-7 py-3.5 border border-[#C9A96B] text-[#3E2F1F] font-display font-semibold text-sm rounded-sm hover:bg-[#C9A96B]/10 transition-all"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
