import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { Sofa, Laptop, Wifi, UserCheck, Camera, Home, Mic, Printer, Lock, Package, Zap, Monitor } from 'lucide-react';

const facilities = [
  { icon: Sofa,      title: 'Furnished, AC Cabins',           desc: 'Comfortable, air-conditioned classrooms with quality furniture, whiteboards and display walls.', highlight: false, image: '/images/classroom-standard.png' },
  { icon: Laptop,    title: 'Laptop at Class Time',           desc: 'A laptop available during class, connecting directly to the TV or projector in your cabin.', highlight: false, image: '/images/classroom-physics.png' },
  { icon: Monitor,   title: 'TV / Projector Connectivity',    desc: 'Full AV connectivity — display slides, videos or demos effortlessly every session.', highlight: false, image: '/images/classroom-biology.png' },
  { icon: Wifi,      title: 'Electricity & High-Speed Wi-Fi', desc: 'Fast internet and all utilities included. No bills, no setup, no separate payments.', highlight: true,  image: '/images/classroom-seminar.png' },
  { icon: UserCheck, title: 'On-Site Manager & IT',           desc: 'A manager runs the shared calendar and an IT technician resolves any technical issues.', highlight: false, image: '/images/reception-lobby.png' },
  { icon: Camera,    title: 'CCTV Across Common Areas',       desc: 'Monitored common areas for the safety and reassurance of educators and parents.', highlight: false, image: '/images/reception-lobby.png' },
  { icon: Home,      title: 'Daily Housekeeping',             desc: 'Cabins cleaned and reset between sessions — always a fresh, professional space.', highlight: false, image: '/images/classroom-standard.png' },
  { icon: Mic,       title: 'Audio & Video Recording',        desc: 'Record your class for review or content creation. Available on request at no extra cost.', highlight: true,  image: '/images/classroom-music.png' },
  { icon: Printer,   title: 'Printing & Scanning',            desc: 'Multiple paper sizes at the front desk, charged per page.', highlight: false, image: '/images/facilities-lockers.png' },
  { icon: Lock,      title: 'Secure Lockers',                 desc: 'Small monthly fee, or free with the Annual package.', highlight: false, image: '/images/facilities-lockers.png' },
  { icon: Package,   title: 'Stationery & Art Kits',          desc: 'A full range of kits at the front desk. Buy for the batch or bring your own.', highlight: false, image: '/images/classroom-music.png' },
  { icon: Zap,       title: 'Operational Assistance',         desc: 'Everything behind the scenes is managed — so every session runs without friction.', highlight: false, image: '/images/terrace-balcony.png' },
];

export function Facilities() {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Preload all facility images for instant hover transitions
    const defaultImg = new Image();
    defaultImg.src = '/images/terrace-balcony.png';
    facilities.forEach((f) => {
      const img = new Image();
      img.src = f.image;
    });
  }, []);

  const activeFacility = activeIndex !== null ? facilities[activeIndex] : null;
  const bannerImage = activeFacility ? activeFacility.image : '/images/terrace-balcony.png';

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
                      ? 'border-[#C9A96B] shadow-xl shadow-black/25 scale-[1.02]'
                      : f.highlight
                        ? 'border-[#C9A96B]/40 bg-[#C9A96B]/6 hover:border-[#C9A96B] hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02]'
                        : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#C9A96B] hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02]'
                  }`}
                >
                  {/* Hover / Active Background Image Transition */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <img
                      src={f.image}
                      alt={f.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/85 to-[#1A1A1A]/70" />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div
                      className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 transition-all duration-300 ${
                        isActive
                          ? 'bg-[#C9A96B] text-[#1A1A1A] shadow-md'
                          : f.highlight
                            ? 'bg-[#C9A96B]/15 text-[#C9A96B] group-hover:bg-[#C9A96B] group-hover:text-[#1A1A1A]'
                            : 'bg-[#EADCC8] text-[#7A6A50] group-hover:bg-[#C9A96B] group-hover:text-[#1A1A1A]'
                      }`}
                    >
                      <Icon size={17} className="transition-colors duration-300" />
                    </div>
                    <h3
                      className={`font-display font-semibold text-sm mb-2 leading-snug transition-colors duration-300 ${
                        isActive ? 'text-[#F7F2EA]' : 'text-[#1A1A1A] group-hover:text-[#F7F2EA]'
                      }`}
                    >
                      {f.title}
                    </h3>
                    <p
                      className={`font-body text-xs leading-relaxed font-light transition-colors duration-300 ${
                        isActive ? 'text-[#EADCC8]/90' : 'text-[#7A6A50] group-hover:text-[#EADCC8]/90'
                      }`}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Banner with smooth Image Transition */}
        <AnimatedSection className="mt-12">
          <div className="relative overflow-hidden rounded-sm min-h-[192px] lg:min-h-[224px] bg-[#1A1A1A]">
            <AnimatePresence mode="wait">
              <motion.img
                key={bannerImage}
                src={bannerImage}
                alt={activeFacility ? `${activeFacility.title} at Mentors Studio` : "Mentors Studio Balcony and Outdoor Terrace on Golf Course Extension Road, Sector 57, Gurugram"}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/85 via-[#1A1A1A]/55 to-[#1A1A1A]/85 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <p className="font-display font-bold text-[#F7F2EA] text-2xl lg:text-4xl tracking-tight transition-all duration-300">
                {activeFacility ? activeFacility.title : 'A professional home for educators.'}
              </p>
              {activeFacility && (
                <p className="font-body text-[#D4B87A] text-sm mt-1.5 max-w-xl transition-all duration-300 font-light">
                  {activeFacility.desc}
                </p>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
