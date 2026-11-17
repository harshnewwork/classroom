import { useState, useEffect } from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import {
  Sofa,
  Laptop,
  Monitor,
  Wifi,
  UserCheck,
  Camera,
  Home,
  Mic,
  Printer,
  Lock,
  Package,
  Zap,
} from 'lucide-react';

const facilities = [
  { icon: Sofa,      title: 'Furnished AC Cabins',     desc: 'Ready-to-use, fully furnished classrooms.',            image: '/images/classroom-standard.png' },
  { icon: Laptop,    title: 'Laptop Support',          desc: 'Laptop available during class.',                       image: '/images/classroom-physics.png' },
  { icon: Monitor,   title: 'TV & Projector',          desc: 'Easy screen and presentation connectivity.',           image: '/images/classroom-biology.png' },
  { icon: Wifi,      title: 'Wi-Fi & Utilities',       desc: 'High-speed internet and electricity included.',        image: '/images/classroom-seminar.png', highlight: true },
  { icon: UserCheck, title: 'On-Site Support',         desc: 'Dedicated manager and IT assistance.',                 image: '/images/reception-lobby.png' },
  { icon: Camera,    title: 'CCTV Security',           desc: 'Monitored common areas.',                             image: '/images/reception-lobby.png' },
  { icon: Home,      title: 'Daily Housekeeping',      desc: 'Clean spaces between sessions.',                      image: '/images/classroom-standard.png' },
  { icon: Mic,       title: 'Audio & Video Recording', desc: 'Recording available on request.',                     image: '/images/classroom-music.png', highlight: true },
  { icon: Printer,   title: 'Printing & Scanning',     desc: 'Convenient front-desk services.',                     image: '/images/facilities-lockers.png' },
  { icon: Lock,      title: 'Secure Lockers',          desc: 'Safe storage for personal belongings.',                image: '/images/facilities-lockers.png' },
  { icon: Package,   title: 'Stationery & Art Kits',   desc: 'Essential supplies available.',                       image: '/images/classroom-music.png' },
  { icon: Zap,       title: 'Operational Support',     desc: 'Hassle-free day-to-day assistance.',                  image: '/images/terrace-balcony.png' },
];

export function Facilities() {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Preload all facility images for smooth transitions
    facilities.forEach((f) => {
      const img = new Image();
      img.src = f.image;
    });
  }, []);

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
                className="font-display font-bold text-[#1A1A1A] leading-[1.12] tracking-tight"
                style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
              >
                Everything You Need{' '}
                <span className="text-[#8B6914] italic">to Teach.</span>
                <br />Already Here.
              </h2>
            </div>
            {/* High-visibility subhead text */}
            <p className="font-body text-[#3E2F1F] text-base leading-relaxed font-normal">
              Every seat at Mentors Studio comes with turnkey infrastructure for professional educators.
              No setup delays, no unexpected maintenance, and no separate utility bills.
            </p>
          </div>
        </AnimatedSection>

        {/* Grid — Clean, focused 12-item list */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {facilities.map((f, i) => {
            const Icon = f.icon;
            const isActive = activeIndex === i;
            return (
              <StaggerItem key={i}>
                <div
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() => setActiveIndex(isActive ? null : i)}
                  onFocus={() => setActiveIndex(i)}
                  onBlur={() => setActiveIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(isActive ? null : i);
                    }
                  }}
                  className={`relative overflow-hidden h-full p-5 border rounded-sm group transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A96B] ${
                    isActive
                      ? 'border-[#8B6914] shadow-xl shadow-black/20 scale-[1.02] bg-[#FFFDF9]'
                      : f.highlight
                        ? 'border-[#C9A96B] bg-[#C9A96B]/8 hover:border-[#8B6914] hover:shadow-lg'
                        : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#8B6914] hover:shadow-lg hover:bg-[#FFFDF9]'
                  }`}
                >
                  {/* Subtle background image reveal on active/hover */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${
                      isActive ? 'opacity-15' : 'opacity-0 group-hover:opacity-10'
                    }`}
                  >
                    <img
                      src={f.image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-sm bg-[#EADCC8] border border-[#DDD0B8] flex items-center justify-center mb-3 group-hover:bg-[#8B6914] transition-colors">
                        <Icon size={18} className="text-[#3E2F1F] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-display font-bold text-[#1A1A1A] text-base mb-1.5 leading-snug">
                        {f.title}
                      </h3>
                      <p className="font-body text-[#3E2F1F] text-xs leading-relaxed font-normal">
                        {f.desc}
                      </p>
                    </div>

                    {f.highlight && (
                      <span className="mt-3 inline-block font-mono text-[9px] uppercase tracking-wider text-[#8B6914] font-bold">
                        ★ Included Feature
                      </span>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
