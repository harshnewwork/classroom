import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { ArrowRight, CheckCircle2, Clock, Calendar, Users, MessageCircle } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Tell Us What You Teach',
    tagline: 'No paperwork. No upfront deposit.',
    desc: 'Start by reaching out to the Mentors Studio manager with a brief overview of what you teach, the grade or age group of your students, and your typical batch size.',
    details: [
      'Share your subject area — IELTS, coding, maths, arts or anything else',
      'Tell us about your students — adults or school grade 5 and above',
      'Mention your expected batch size (helps us suggest the right cabin)',
      'Share your preferred days and time slots',
      'No paperwork, no upfront deposit to begin the conversation',
    ],
    image: '/images/reception-lobby.png',
    color: '#C9A96B',
  },
  {
    num: '02',
    title: 'Visit a Cabin',
    tagline: 'Touch the technology. Test the layout.',
    desc: 'Come to Mentors Studio on Golf Course Extension Road, Sector 57, Gurugram. Walk through the available cabins, try the AV equipment, and bring your students for a complimentary demo session.',
    details: [
      'Walk through all available cabins and compare sizes',
      'Test the laptop, TV and projector in the cabin you like',
      'Bring a small group of students for a free demo class',
      'Experience the actual teaching environment',
      'Ask the manager any questions about scheduling and billing',
    ],
    image: '/images/classroom-physics.png',
    color: '#C9A96B',
  },
  {
    num: '03',
    title: 'Manager Confirms Your Slots',
    tagline: 'Structured scheduling. No double bookings.',
    desc: 'Once you have decided on a cabin, your preferred days and times are added to the shared calendar by the manager. The system ensures no conflicts or double bookings across all 11 spaces.',
    details: [
      'Manager reviews your requested slots',
      'Slots are added to the shared Mentors Studio calendar',
      'You receive confirmation of your teaching schedule',
      'Calendar is managed to prevent any double bookings',
      'Adjustments can be requested through the manager',
    ],
    image: '/images/facilities-lockers.png',
    color: '#C9A96B',
  },
  {
    num: '04',
    title: 'Teach, Then Pay',
    tagline: 'Monthly billing. Collect from students first.',
    desc: 'Run your sessions as scheduled. At the end of each month, you receive a bill for the sessions taught. Pay after you have collected fees from your students — no upfront lock-in.',
    details: [
      'Teach your sessions throughout the month',
      'Receive a monthly invoice after your classes',
      'Invoice reflects actual sessions taught, not pre-paid',
      'Pay after you collect fees from your students',
      'Packages carry a refundable security deposit for larger commitments',
    ],
    image: '/images/classroom-seminar.png',
    color: '#C9A96B',
  },
];

const faqs = [
  {
    q: 'Do I need to pay anything to visit or try a demo session?',
    a: 'No. Visiting the studio and running a complimentary demo session with your students is completely free. You only start paying once your slots are confirmed and classes begin.',
  },
  {
    q: 'Can I change my cabin or timings after I start?',
    a: 'Yes. Subject to availability, you can request changes to your cabin or timing through the manager. Changes are accommodated when the calendar permits.',
  },
  {
    q: 'What is the minimum commitment?',
    a: 'You are expected to attend at least 3 days a week and book at least 2 sessions per day. There is no minimum on package size — you can start on a Pay As You Go basis.',
  },
  {
    q: 'What happens if I miss a session?',
    a: 'You are billed for sessions you actually teach. Missed sessions in a package count against your session tally but the validity period still applies. Unused sessions lapse at the end of the package validity.',
  },
  {
    q: 'How is billing calculated?',
    a: 'You are billed per seat, per session. The minimum billable seats are 60% of the cabin capacity, rounded up. If you have fewer students than the minimum, you still pay for the minimum. You are billed monthly after your classes.',
  },
  {
    q: 'Can I have multiple batches in different cabins?',
    a: 'Yes. Many educators run multiple batches. Coordinate with the manager to slot different batches in the same or different cabins based on availability.',
  },
];

export function HowItWorksPage() {
  return (
    <div className="bg-warm-stone min-h-screen">
      <PageHero
        label="Process"
        title={<>From Booking to Teaching. <span className="text-gradient">Made Simple.</span></>}
        subtitle="Four clear steps. No complex contracts. No hidden charges. No infrastructure investment. Just a straightforward path from your first conversation to your first class."
        breadcrumb={[{ label: 'How It Works' }]}
        image="/images/terrace-balcony.png"
      />

      {/* Steps — detailed */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => {
            const isReversed = i % 2 !== 0;
            return (
              <AnimatedSection key={step.num} direction={isReversed ? 'right' : 'left'}>
                <div className="grid lg:grid-cols-2 gap-0 border border-[#DDD0B8] rounded-sm overflow-hidden mb-6">
                  {/* Image */}
                  <div className={`relative ${isReversed ? 'lg:order-2' : ''}`}>
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-64 lg:h-full min-h-[280px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1A1A1A]/60 to-transparent" />
                    {/* Step number overlay */}
                    <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
                      <div
                        className="w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center"
                        style={{ borderColor: step.color, background: '#1A1A1A' }}
                      >
                        <span className="font-mono text-[9px] tracking-widest" style={{ color: step.color }}>STEP</span>
                        <span className="font-display font-bold text-lg leading-none" style={{ color: step.color }}>{step.num}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 lg:p-10 bg-[#F7F2EA] flex flex-col justify-center ${isReversed ? 'lg:order-1' : ''}`}>
                    <p className="font-mono text-xs tracking-wide mb-2" style={{ color: step.color }}>
                      {step.tagline}
                    </p>
                    <h2 className="font-display font-bold text-[#1A1A1A] text-2xl mb-4">{step.title}</h2>
                    <p className="font-body font-light text-[#7A6A50] text-base leading-relaxed mb-6">{step.desc}</p>
                    <ul className="flex flex-col gap-2.5">
                      {step.details.map((d, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: step.color }} />
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
            <h2 className="font-display font-bold text-[#1A1A1A] text-2xl">What to expect from the schedule</h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Calendar, title: 'Open Days', desc: 'Monday to Saturday, plus three Sundays per month. Operating hours are 10:00 am to 8:29 pm.' },
              { icon: Clock,    title: 'Minimum Commitment', desc: 'At least 2 sessions per day, and at least 3 days per week. Ensures consistent learning for your students.' },
              { icon: Users,    title: 'Multiple Batches', desc: 'You can run multiple batches across different time slots or cabins. Coordinate through the manager.' },
              { icon: Clock,    title: 'Adult Slots', desc: '5 morning slots Monday–Friday, each 60 minutes long. Starting from 10:00 am to 3:28 pm.' },
              { icon: Clock,    title: 'School Slots', desc: '5 evening slots, each 55 minutes long. Starting from 3:30 pm to 8:29 pm. Weekends available.' },
              { icon: Calendar, title: 'Monthly Billing', desc: 'You receive a bill at the end of each month for the sessions taught. No upfront session fees.' },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="p-5 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm hover:border-[#C9A96B]/40 transition-colors">
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

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <AnimatedSection className="mb-10">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display font-bold text-[#1A1A1A] text-2xl">Common questions answered</h2>
        </AnimatedSection>

        <StaggerContainer className="grid lg:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <StaggerItem key={i}>
              <div className="p-6 border border-[#DDD0B8] rounded-sm bg-[#F7F2EA] hover:border-[#C9A96B]/40 transition-colors h-full">
                <p className="font-display font-semibold text-[#1A1A1A] text-sm mb-3 leading-snug">{faq.q}</p>
                <p className="font-body font-light text-[#7A6A50] text-sm leading-relaxed">{faq.a}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display font-bold text-[#1A1A1A] text-2xl mb-2">Ready to start the conversation?</h3>
            <p className="font-body font-light text-[#7A6A50] text-base">It starts with a single message. No commitment required.</p>
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
