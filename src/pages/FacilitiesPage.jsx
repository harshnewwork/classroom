import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { Link } from 'react-router-dom';
import {
  Sofa, Laptop, Wifi, UserCheck, Camera, Home, Mic, Printer,
  Lock, Package, Zap, Monitor, Shield, Clock, ArrowRight, CheckCircle2,
  Server, Sparkles
} from 'lucide-react';

const facilitiesDetailed = [
  {
    icon: Sofa,
    title: 'Furnished, Air-Conditioned Cabins',
    summary: 'Walk in and start teaching immediately.',
    details: [
      'Ergonomic seating designed for extended classroom learning',
      'Desks configured for clear sightlines to the board and screen',
      'Whiteboards, magnetic display walls, and pin-up walls in every cabin',
      'Climate-controlled split air conditioning throughout the year',
      'Cleaned, wiped, and reset between every teaching day',
    ],
    image: '/images/classroom-standard.png',
    highlight: false,
  },
  {
    icon: Laptop,
    title: 'Laptop at Class Time',
    summary: 'Technology provided — nothing to carry.',
    details: [
      'A dedicated laptop is ready in the cabin for your class duration',
      'Connects directly to the in-cabin TV or overhead projector',
      'Pre-configured to support slide decks, video playback, and web tools',
      'Or connect your personal MacBook/Windows laptop via provided HDMI',
      'On-site IT technician handles setup and connectivity checks',
    ],
    image: '/images/classroom-physics.png',
    highlight: false,
  },
  {
    icon: Monitor,
    title: 'TV & Projector Connectivity',
    summary: 'Display anything — slides, videos, live coding demos.',
    details: [
      'High-definition display screen or digital projector in every cabin',
      'Plug-and-play HDMI and wireless screencasting capability',
      'Full-screen presentation mode with high-lumen clarity',
      'Ideal for visual subjects, language coaching, and software training',
      'Immediate technical troubleshooting from our floor IT team',
    ],
    image: '/images/classroom-biology.png',
    highlight: false,
  },
  {
    icon: Wifi,
    title: 'High-Speed Wi-Fi & Electricity',
    summary: 'All utilities included. No extra bills.',
    details: [
      'Dual-band optical broadband internet across all cabins and common areas',
      'Low-latency connection for video streaming and cloud-based teaching',
      'Electricity and 100% generator power backup fully covered in rent',
      'No bandwidth throttling or session data caps',
      'Secondary failover line ensures zero downtime during live classes',
    ],
    image: '/images/classroom-seminar.png',
    highlight: true,
  },
  {
    icon: UserCheck,
    title: 'On-Site Facility Manager',
    summary: 'Professional support every operating day.',
    details: [
      'Dedicated manager handles the shared booking calendar',
      'Prevents double bookings across all 9 cabins and 2 open areas',
      'Assists with educator onboarding and student reception',
      'Available on the floor throughout all 10:00 am to 8:25 pm hours',
      'Single point of contact for schedule adjustments and batch extensions',
    ],
    image: '/images/reception-lobby.png',
    highlight: false,
  },
  {
    icon: Zap,
    title: 'IT Technician On-Site',
    summary: 'Technical issues resolved before they affect your class.',
    details: [
      'Dedicated IT technician present during all operating hours',
      'Handles laptop, display, audio, and network connectivity issues',
      'Sets up audio and video recording equipment upon request',
      'Performs preventive maintenance on all in-cabin AV equipment',
      'Immediate in-person response — no waiting for outside help',
    ],
    image: '/images/classroom-physics.png',
    highlight: false,
  },
  {
    icon: Camera,
    title: 'CCTV Across Common Areas',
    summary: 'Monitored for the safety of everyone.',
    details: [
      'CCTV monitoring across main entrance, corridors, and reception',
      'Provides peace of mind for educators, students, and parents',
      'Strict privacy policy: zero cameras inside private teaching cabins',
      'Professional security recording maintained on secure cloud storage',
      'Ensures a disciplined, safe learning atmosphere in the mall facility',
    ],
    image: '/images/reception-lobby.png',
    highlight: false,
  },
  {
    icon: Home,
    title: 'Daily Housekeeping & Sanitisation',
    summary: 'Every session starts in a clean, reset space.',
    details: [
      'Cabins vacuumed and sanitized between operating days',
      'Ergonomic desks and chairs reset to clean standard grid layout',
      'Whiteboards wiped spotless and marker supplies replenished',
      'Waste bins cleared and air filters regularly inspected',
      'Deep scheduled cleaning for all floor tiles and upholstery',
    ],
    image: '/images/classroom-standard.png',
    highlight: false,
  },
  {
    icon: Mic,
    title: 'Audio & Video Recording',
    summary: 'Record your class — for review or digital course creation.',
    details: [
      'HD lecture recording support available upon prior notice',
      'Ideal for review, absent students, or creating online course content',
      'IT technician assists with microphone placement and tripod setup',
      'Recordings are handed over directly to you as your exclusive IP',
      'Available across all cabins subject to advance notification',
    ],
    image: '/images/classroom-music.png',
    highlight: true,
  },
  {
    icon: Printer,
    title: 'Printing & Scanning Desk',
    summary: 'Worksheets, tests, and handouts printed on-site.',
    details: [
      'High-speed printing and photocopying at the front desk',
      'Supports question papers, exam sheets, and study notes',
      'Charged affordably per page — only pay for what you print',
      'Eliminates last-minute runs to external copy shops in Gurugram',
      'High-resolution scanning to email for student assignments',
    ],
    image: '/images/reception-lobby.png',
    highlight: false,
  },
  {
    icon: Lock,
    title: 'Secure Educator Lockers',
    summary: 'Store your teaching materials safely on-site.',
    details: [
      'Dedicated personal lockers available for active educators',
      'Leave heavy reference textbooks, test sheets, and teaching kits safely',
      'Complimentary inclusion with our Elite Package',
      'Nominal monthly add-on for Starter, Growth, and Pro members',
      'Keyless or master-coded security within the managed studio suite',
    ],
    image: '/images/facilities-lockers.png',
    highlight: false,
  },
  {
    icon: Package,
    title: 'Balcony & Creative Teaching Spaces',
    summary: 'Dedicated open-air terrace and arts workshop area.',
    details: [
      'Expansive private terrace balcony for botany, ecology, and nature study',
      '16-seat Arts & Crafts open zone with washable surfaces and supply bins',
      'Stationery kits available for school students and adult trainees',
      'Natural lighting ideal for daytime creative and design sessions',
      'Flexible booking for weekend workshops and experiential sessions',
    ],
    image: '/images/terrace-balcony.png',
    highlight: false,
  },
];

export function FacilitiesPage() {
  return (
    <div className="bg-warm-stone min-h-screen">
      <SEO
        title="Classroom Facilities & Amenities | AC, Wi-Fi, AV, CCTV — Mentors Studio"
        description="Every classroom includes AC, high-speed Wi-Fi, TV/projector connectivity, daily housekeeping, CCTV and an on-site manager — no separate setup or bills."
        canonicalPath="/facilities"
        breadcrumbs={[{ name: 'Facilities', path: '/facilities' }]}
      />

      <PageHero
        label="Facilities & Amenities"
        title="Everything You Need to Teach, Already in Place."
        subtitle="Step into fully equipped teaching spaces with air-conditioning, high-speed Wi-Fi, digital displays, whiteboards and dedicated on-site support. No setup hassles or separate utility bills."
        image="/images/reception-lobby.png"
        cta={{ label: 'Schedule a Visit', to: '/contact' }}
      />

      <Breadcrumbs items={[{ name: 'Facilities & Amenities' }]} />

      {/* What's always included — quick list */}
      <div className="bg-[#F7F2EA] border-b border-[#DDD0B8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <AnimatedSection>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] font-bold mb-4">Included in every seat, every session</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {['AC + Furniture', 'In-Cabin Laptop', 'TV / Projector', 'Broadband Wi-Fi', 'Floor Manager', 'Housekeeping'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm bg-white/70 p-2.5 rounded-xs border border-[#DDD0B8]/80 shadow-xs">
                  <CheckCircle2 size={15} className="text-[#8B6914] flex-shrink-0" />
                  <span className="font-body text-[#1A1A1A] font-semibold text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Detailed facility cards */}
      <section className="bg-warm-stone">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <AnimatedSection className="mb-12">
            <SectionLabel>In Detail</SectionLabel>
            <h2 className="font-display font-bold text-[#1A1A1A] text-2xl lg:text-3xl leading-tight">
              Every facility and amenity, explained.
            </h2>
          </AnimatedSection>

          <div className="flex flex-col gap-8">
            {facilitiesDetailed.map((f, i) => {
              const Icon = f.icon;
              const isReversed = i % 2 !== 0;
              return (
                <AnimatedSection key={f.title} direction={isReversed ? 'right' : 'left'}>
                  <div className={`grid lg:grid-cols-2 gap-8 items-center p-6 lg:p-0 border border-[#DDD0B8] lg:border-0 rounded-sm lg:rounded-none bg-[#F7F2EA] lg:bg-transparent ${isReversed ? 'lg:direction-rtl' : ''}`}>
                    {/* Image */}
                    <div className={`relative overflow-hidden rounded-sm shadow-sm ${isReversed ? 'lg:order-2' : ''}`}>
                      <img
                        src={f.image}
                        alt={`${f.title} — Premium classroom rental amenity at Mentors Studio Gurugram`}
                        className="w-full h-64 lg:h-80 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/30 to-transparent" />
                      {f.highlight && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#8B6914] text-white font-mono text-[10px] tracking-wide rounded-xs font-bold shadow-md">
                          Highlighted Amenity
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`${isReversed ? 'lg:order-1' : ''}`}>
                      <div className="w-11 h-11 rounded-xs flex items-center justify-center mb-5 bg-[#EADCC8] border border-[#DDD0B8]">
                        <Icon size={20} className="text-[#8B6914]" />
                      </div>
                      <h3 className="font-display font-bold text-[#1A1A1A] text-xl mb-1.5">{f.title}</h3>
                      <p className="font-body text-[#8B6914] text-sm mb-4 font-semibold italic">{f.summary}</p>
                      <ul className="flex flex-col gap-2">
                        {f.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <CheckCircle2 size={15} className="text-[#8B6914] flex-shrink-0 mt-0.5" />
                            <span className="font-body font-normal text-[#3E2F1F] text-sm leading-relaxed">{d}</span>
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

      {/* Closing Turnkey Infrastructure Section per Section 18 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-6 lg:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#8B6914]" />
            <h2 className="font-display font-bold text-[#1A1A1A] text-xl sm:text-2xl">
              Everything You Need to Teach, Without the Setup Hassle.
            </h2>
          </div>
          <p className="font-body text-[#3E2F1F] text-base leading-relaxed font-normal mb-6">
            Setting up your own coaching centre involves significant investment in infrastructure, technology and daily operations. Mentors Studio takes care of it all with fully equipped teaching cabins, high-speed internet, power backup, secure common areas and dedicated on-site support. Simply choose your space and focus on teaching while we take care of the rest.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link to="/spaces" className="text-[#8B6914] hover:text-[#5C450C] font-bold inline-flex items-center gap-1.5 transition-colors">
              View cabin sizes from 6 to 24 seats <ArrowRight size={13} />
            </Link>
            <span className="text-[#DDD0B8]">|</span>
            <Link to="/pricing" className="text-[#8B6914] hover:text-[#5C450C] font-bold inline-flex items-center gap-1.5 transition-colors">
              Check per-seat session packages <ArrowRight size={13} />
            </Link>
            <span className="text-[#DDD0B8]">|</span>
            <Link to="/faq" className="text-[#8B6914] hover:text-[#5C450C] font-bold inline-flex items-center gap-1.5 transition-colors">
              Frequently asked facility questions <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-8 lg:p-12 text-center shadow-sm">
          <h3 className="font-display font-bold text-[#1A1A1A] text-2xl mb-3">Ready to experience the space firsthand?</h3>
          <p className="font-body font-normal text-[#3E2F1F] text-base mb-8 max-w-lg mx-auto">
            Schedule a walkthrough on Golf Course Extension Road, Sector 57. Bring your students for a complimentary demo session before committing.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-[#F7F2EA] font-display font-bold text-sm tracking-wider uppercase rounded-xs hover:bg-[#8B6914] transition-colors"
          >
            Book a Facility Visit
            <ArrowRight size={16} />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
