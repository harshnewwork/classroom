import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Link } from 'react-router-dom';
import {
  Sofa, Laptop, Wifi, UserCheck, Camera, Home, Mic, Printer,
  Lock, Package, Zap, Monitor, Shield, Clock, ArrowRight, CheckCircle2
} from 'lucide-react';

const facilitiesDetailed = [
  {
    icon: Sofa,
    title: 'Furnished, Air-Conditioned Cabins',
    summary: 'Walk in and start teaching immediately.',
    details: [
      'Ergonomic seating designed for classroom learning',
      'Tables configured for teaching and group work',
      'Whiteboards, display walls and pin-up walls in every cabin',
      'Climate-controlled environment throughout the year',
      'Cleaned and reset between every teaching day',
    ],
    image: '/images/classroom-standard.png',
    highlight: false,
  },
  {
    icon: Laptop,
    title: 'Laptop at Class Time',
    summary: 'Technology provided — nothing to carry.',
    details: [
      'A laptop is provided in the cabin for your class duration',
      'Connects directly to the in-cabin TV or projector',
      'Supports presentations, videos and web content',
      'Or connect your own device via HDMI',
      'IT technician on-site for support',
    ],
    image: '/images/classroom-physics.png',
    highlight: false,
  },
  {
    icon: Monitor,
    title: 'TV & Projector Connectivity',
    summary: 'Display anything — slides, videos, live demos.',
    details: [
      'Large-screen TV or projector in every cabin',
      'HDMI and wireless display support',
      'Full-screen presentation mode',
      'Ideal for visual subjects, language coaching and test prep',
      'Technical support from the on-site IT team',
    ],
    image: '/images/classroom-biology.png',
    highlight: false,
  },
  {
    icon: Wifi,
    title: 'High-Speed Wi-Fi & Electricity',
    summary: 'All utilities included. No extra bills.',
    details: [
      'High-speed broadband internet across all cabins',
      'Stable connection for video-based and online teaching',
      'Electricity fully covered — no separate utility costs',
      'No cap or throttling on bandwidth during class',
      'Backup connection available for critical sessions',
    ],
    image: '/images/classroom-seminar.png',
    highlight: true,
  },
  {
    icon: UserCheck,
    title: 'On-Site Manager',
    summary: 'Professional support every operating day.',
    details: [
      'Dedicated manager handles the shared booking calendar',
      'Prevents double bookings across all cabins',
      'Assists with onboarding new educators',
      'Available throughout operating hours',
      'Single point of contact for all operational needs',
    ],
    image: '/images/reception-lobby.png',
    highlight: false,
  },
  {
    icon: Zap,
    title: 'IT Technician On-Site',
    summary: 'Technical issues resolved before they affect your class.',
    details: [
      'Dedicated IT technician present during operating hours',
      'Handles laptop, display and connectivity issues',
      'Sets up recording equipment on request',
      'Maintains all in-cabin AV equipment',
      'Fast response — no waiting for outside support',
    ],
    image: '/images/classroom-physics.png',
    highlight: false,
  },
  {
    icon: Camera,
    title: 'CCTV Across Common Areas',
    summary: 'Monitored for the safety of everyone.',
    details: [
      'CCTV monitoring across all common areas and corridors',
      'Provides safety reassurance for educators and parents',
      'Recording retained for security purposes',
      'Does not monitor inside teaching cabins',
      'Professionally managed security infrastructure',
    ],
    image: '/images/reception-lobby.png',
    highlight: false,
  },
  {
    icon: Home,
    title: 'Daily Housekeeping',
    summary: 'Every session starts in a clean, reset space.',
    details: [
      'Cabins cleaned between operating days',
      'Furniture arranged and reset before each session',
      'Whiteboards cleaned and markers replenished',
      'Bins emptied and surfaces sanitised daily',
      'Deep cleaning on a scheduled basis',
    ],
    image: '/images/classroom-standard.png',
    highlight: false,
  },
  {
    icon: Mic,
    title: 'Audio & Video Recording',
    summary: 'Record your class — for review or content creation.',
    details: [
      'Audio and video recording available on request',
      'Useful for reviewing your teaching or creating content',
      'IT technician sets up and manages the recording',
      'Content is your property — shared only with you',
      'Available in all cabins, subject to prior request',
    ],
    image: '/images/classroom-music.png',
    highlight: true,
  },
  {
    icon: Printer,
    title: 'Printing & Scanning',
    summary: 'Worksheets, notes, question papers — handled.',
    details: [
      'Printing and scanning at the front desk',
      'Multiple paper sizes available',
      'Charged per page — only for what you use',
      'No need for a separate print shop visit',
      'Available throughout operating hours',
    ],
    image: '/images/reception-lobby.png',
    highlight: false,
  },
  {
    icon: Lock,
    title: 'Secure Lockers',
    summary: 'Store your teaching materials safely.',
    details: [
      'Individual lockers for educator use',
      'Secure storage for books, notes and teaching materials',
      'Small monthly fee for a locker',
      'Free with the Annual package',
      'Located within the Mentors Studio common area',
    ],
    image: '/images/facilities-lockers.png',
    highlight: false,
  },
  {
    icon: Package,
    title: 'Balcony & Creative Spaces',
    summary: 'A full range of creative amenities and private balcony.',
    details: [
      'Expansive private balcony for nature study and experiential sessions',
      'School and adult stationery kits at multiple price points',
      'Arts, crafts, watercolour and clay kits for creative classes',
      'Botany kits for the outdoor balcony space',
      'Order for the whole batch or buy individually',
    ],
    image: '/images/terrace-balcony.png',
    highlight: false,
  },
];

export function FacilitiesPage() {
  return (
    <div className="bg-warm-stone min-h-screen">
      <PageHero
        label="Facilities"
        title={<>Everything You Need to Teach. <span className="text-gradient">Already Here.</span></>}
        subtitle="Every seat at Mentors Studio comes with a complete professional teaching infrastructure. No setup, no sourcing, no additional investment — just walk in and teach."
        breadcrumb={[{ label: 'Facilities' }]}
        image="/images/reception-lobby.png"
      />

      {/* What's always included — quick list */}
      <div className="bg-warm-stone border-b border-[#DDD0B8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <AnimatedSection>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] mb-5">Included in every seat, every session</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {['AC + Furniture', 'Laptop', 'TV / Projector', 'Wi-Fi', 'Manager', 'Housekeeping'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-[#C9A96B] flex-shrink-0" />
                  <span className="font-body text-[#1A1A1A]">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Detailed facility cards */}
      <section className="bg-warm-stone">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <AnimatedSection className="mb-12">
            <SectionLabel>In Detail</SectionLabel>
            <h2 className="font-display font-bold text-[#1A1A1A] text-3xl leading-tight">
              Every facility, explained.
            </h2>
          </AnimatedSection>

          <div className="flex flex-col gap-8">
            {facilitiesDetailed.map((f, i) => {
              const Icon = f.icon;
              const isReversed = i % 2 !== 0;
              return (
                <AnimatedSection key={f.title} direction={isReversed ? 'right' : 'left'}>
                  <div className={`grid lg:grid-cols-2 gap-8 items-center p-6 lg:p-0 border border-[#DDD0B8] lg:border-0 rounded-sm lg:rounded-none ${isReversed ? 'lg:direction-rtl' : ''}`}>
                    {/* Image */}
                    <div className={`relative overflow-hidden rounded-sm ${isReversed ? 'lg:order-2' : ''}`}>
                      <img
                        src={f.image}
                        alt={f.title}
                        className="w-full h-64 lg:h-80 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/20 to-transparent" />
                      {f.highlight && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#C9A96B] text-[#1A1A1A] font-mono text-[10px] tracking-wide rounded-sm font-bold">
                          Highlighted
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`${isReversed ? 'lg:order-1' : ''}`}>
                      <div className={`w-11 h-11 rounded-sm flex items-center justify-center mb-5 ${f.highlight ? 'bg-[#C9A96B]/15' : 'bg-[#DDD0B8]/50'}`}>
                        <Icon size={20} className={f.highlight ? 'text-[#C9A96B]' : 'text-[#7A6A50]'} />
                      </div>
                      <h3 className="font-display font-bold text-[#1A1A1A] text-xl mb-2">{f.title}</h3>
                      <p className="font-body text-[#C9A96B] text-sm mb-5 italic">{f.summary}</p>
                      <ul className="flex flex-col gap-2">
                        {f.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <CheckCircle2 size={14} className="text-[#C9A96B] flex-shrink-0 mt-0.5" />
                            <span className="font-body font-light text-[#7A6A50] text-sm leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {i < facilitiesDetailed.length - 1 && <div className="border-b border-[#DDD0B8] mt-8 hidden lg:block" />}
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-8 lg:p-12 text-center">
          <h3 className="font-display font-bold text-[#1A1A1A] text-2xl mb-3">Ready to see it for yourself?</h3>
          <p className="font-body font-light text-[#7A6A50] text-base mb-8 max-w-md mx-auto">
            Come in for a visit. Bring your students for a complimentary demo session and experience the space before you commit.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-[#F7F2EA] font-display font-bold text-base rounded-sm hover:bg-[#3E2F1F] transition-colors"
          >
            Book a Visit
            <ArrowRight size={16} />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
