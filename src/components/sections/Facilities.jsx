import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { Sofa, Laptop, Wifi, UserCheck, Camera, Home, Mic, Printer, Lock, Package, Zap, Monitor } from 'lucide-react';

const facilities = [
  { icon: Sofa,      title: 'Furnished, AC Cabins',          desc: 'Comfortable, air-conditioned classrooms with quality furniture, whiteboards and display walls.', highlight: false },
  { icon: Laptop,    title: 'Laptop at Class Time',          desc: 'A laptop available during class, connecting directly to the TV or projector in your cabin.', highlight: false },
  { icon: Monitor,   title: 'TV / Projector Connectivity',   desc: 'Full AV connectivity — display slides, videos or demos effortlessly every session.', highlight: false },
  { icon: Wifi,      title: 'Electricity & High-Speed Wi-Fi',desc: 'Fast internet and all utilities included. No bills, no setup, no separate payments.', highlight: true },
  { icon: UserCheck, title: 'On-Site Manager & IT',          desc: 'A manager runs the shared calendar and an IT technician resolves any technical issues.', highlight: false },
  { icon: Camera,    title: 'CCTV Across Common Areas',      desc: 'Monitored common areas for the safety and reassurance of educators and parents.', highlight: false },
  { icon: Home,      title: 'Daily Housekeeping',            desc: 'Cabins cleaned and reset between sessions — always a fresh, professional space.', highlight: false },
  { icon: Mic,       title: 'Audio & Video Recording',       desc: 'Record your class for review or content creation. Available on request at no extra cost.', highlight: true },
  { icon: Printer,   title: 'Printing & Scanning',           desc: 'Multiple paper sizes at the front desk, charged per page.', highlight: false },
  { icon: Lock,      title: 'Secure Lockers',                desc: 'Small monthly fee, or free with the Annual package.', highlight: false },
  { icon: Package,   title: 'Stationery & Art Kits',         desc: 'A full range of kits at the front desk. Buy for the batch or bring your own.', highlight: false },
  { icon: Zap,       title: 'Operational Assistance',        desc: 'Everything behind the scenes is managed — so every session runs without friction.', highlight: false },
];

export function Facilities() {
  return (
    <section id="facilities" className="section-pad bg-[#F7F2EA] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C9A96B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <AnimatedSection className="mb-14">
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <div>
              <SectionLabel>What's Included</SectionLabel>
              <h2
                className="font-display font-bold text-[#1A1A1A] leading-[1.1] tracking-tight"
                style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}
              >
                Everything You Need{' '}
                <span className="text-gradient italic">to Teach.</span>
                <br />Already Here.
              </h2>
            </div>
            <p className="font-body text-[#7A6A50] text-base leading-relaxed font-light">
              Every seat at Mentors Studio comes with the full infrastructure of a professional
              teaching environment. Nothing left to arrange before your first session.
            </p>
          </div>
        </AnimatedSection>

        {/* Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {facilities.map((f, i) => {
            const Icon = f.icon;
            return (
              <StaggerItem key={i}>
                <div className={`h-full p-5 border rounded-sm group transition-all duration-200 ${
                  f.highlight
                    ? 'border-[#C9A96B]/40 bg-[#C9A96B]/6 hover:bg-[#C9A96B]/10'
                    : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#C9A96B]/40 hover:bg-[#F7F2EA]'
                }`}>
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 transition-colors ${
                    f.highlight ? 'bg-[#C9A96B]/15' : 'bg-[#EADCC8] group-hover:bg-[#C9A96B]/15'
                  }`}>
                    <Icon size={17} className={f.highlight ? 'text-[#C9A96B]' : 'text-[#7A6A50] group-hover:text-[#C9A96B]'} />
                  </div>
                  <h3 className="font-display font-semibold text-[#1A1A1A] text-sm mb-2 leading-snug">{f.title}</h3>
                  <p className="font-body text-[#7A6A50] text-xs leading-relaxed font-light">{f.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Banner */}
        <AnimatedSection className="mt-12">
          <div className="relative overflow-hidden rounded-sm">
            <img
              src="/images/terrace-balcony.png"
              alt="Mentors Studio Balcony Corridor & Modern Facade"
              className="w-full h-48 lg:h-56 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 via-[#1A1A1A]/50 to-[#1A1A1A]/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-display font-bold text-[#F7F2EA] text-2xl lg:text-4xl text-center tracking-tight">
                A professional home for educators.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
