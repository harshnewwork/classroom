import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { MapPin, Building, Package, Monitor, Wifi, Printer, Wrench } from 'lucide-react';

const challenges = [
  {
    icon: MapPin,
    text: 'Finding the right location',
    image: '/images/classroom-standard.png',
    alt: 'Air-conditioned furnished teaching cabin for rent in Gurugram with whiteboard and student desks',
  },
  {
    icon: Building,
    text: 'Paying high deposits and rent',
    image: '/images/reception-lobby.png',
    alt: 'Commercial reception and building entrance with administrative front desk',
  },
  {
    icon: Package,
    text: 'Setting up classrooms and furniture',
    image: '/images/classroom-seminar.png',
    alt: 'Spacious 24-seat classroom setup with ergonomic student desks and classroom furniture',
  },
  {
    icon: Monitor,
    text: 'Installing digital boards and displays',
    image: '/images/classroom-physics.png',
    alt: 'Technology-equipped classroom with digital display wall and ceiling projector',
  },
  {
    icon: Wifi,
    text: 'Managing utilities and Wi-Fi',
    image: '/images/classroom-biology.png',
    alt: 'Modern interactive classroom with high-speed internet and uninterrupted power backup',
  },
  {
    icon: Printer,
    text: 'Handling printing and daily operations',
    image: '/images/facilities-lockers.png',
    alt: 'Facilities storage lockers and operational front desk area',
  },
  {
    icon: Wrench,
    text: 'Managing maintenance and housekeeping',
    image: '/images/terrace-balcony.png',
    alt: 'Clean, maintained educator spaces and outdoor terrace at Mentors Studio',
  },
];

export function Problem() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    challenges.forEach((c) => {
      const img = new Image();
      img.src = c.image;
    });
  }, []);

  return (
    <section className="section-pad relative isolate overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#231F1B] to-[#3E2F1F]">
      <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-[#C9A96B]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] rounded-full bg-[#C9A96B]/[.06] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_45%,rgba(201,169,107,0.035)_45.1%,transparent_45.3%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-16 items-stretch">

          {/* Left: Image Showcase */}
          <AnimatedSection direction="left" className="flex">
            <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] lg:min-h-[640px]">
              <div className="absolute -top-4 -left-4 w-28 h-28 border-t-2 border-l-2 border-[#C9A96B] pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-28 h-28 border-b-2 border-r-2 border-[#C9A96B] pointer-events-none" />
              <div className="absolute inset-0 overflow-hidden rounded-xl border border-[#C9A96B]/40 shadow-2xl shadow-black/40 bg-[#1A1A1A]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={challenges[activeIndex].image}
                    alt={challenges[activeIndex].alt}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-[#1A1A1A]/10 pointer-events-none" />
                <div className="absolute top-5 left-5 flex items-center gap-2.5 rounded-full border border-[#E5C378]/80 bg-[#1A1A1A]/90 px-4 py-1.5 backdrop-blur-md pointer-events-none shadow-lg shadow-black/40">
                  <span className="h-2 w-2 rounded-full bg-[#E5C378] shadow-[0_0_6px_rgba(229,195,120,0.6)]" />
                  <span className="font-mono text-xs font-bold tracking-[0.24em] text-[#FFFFFF] uppercase drop-shadow-xs">
                    The Challenge
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 pointer-events-none">
                  <div className="mb-4 h-[2px] w-14 bg-[#C9A96B]" />
                  <p className="font-display text-xl sm:text-2xl italic leading-snug text-[#F7F2EA]">
                    “Your expertise belongs in the classroom — not in maintenance and management.”
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Content */}
          <AnimatedSection direction="right" className="flex flex-col justify-center py-4 lg:py-8">
            <SectionLabel dark>The Challenge</SectionLabel>
            <h2
              className="font-display font-medium text-[#F7F2EA] leading-[1.12] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
            >
              Great Teaching Shouldn’t Come with the{' '}
              <span className="text-[#D4B87A] italic">Burden of Setup.</span>
            </h2>
            <p className="font-body text-[#EADCC8] text-base leading-relaxed mb-7 font-light">
              Setting up a space takes months, eats savings, and drains the energy that should go into your students.
            </p>

            <StaggerContainer className="flex flex-col gap-2.5">
              {challenges.map(({ icon: Icon, text }, i) => {
                const isActive = activeIndex === i;
                return (
                  <StaggerItem key={i}>
                    <div
                      role="button"
                      tabIndex={0}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveIndex(i);
                        }
                      }}
                      className={`flex items-center gap-3.5 p-3.5 sm:p-4 border rounded-md transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A96B] ${
                        isActive
                          ? 'border-[#D4B87A] bg-[#C9A96B]/20 shadow-md'
                          : 'border-[#3A3228] bg-[#231F1B]/90 hover:border-[#C9A96B]/60 hover:bg-[#C9A96B]/10'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#C9A96B] text-[#1A1A1A]'
                            : 'bg-[#3E2F1F] text-[#D4B87A] group-hover:bg-[#C9A96B] group-hover:text-[#1A1A1A]'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="font-body text-[#F7F2EA] text-sm leading-relaxed font-medium">
                        {text}
                      </span>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
