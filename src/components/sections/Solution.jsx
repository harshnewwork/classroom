import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: 'Ready-to-Use Classrooms',
    desc: 'Walk in and start teaching. Everything is set up, cleaned and ready.',
    image: '/images/classroom-physics.png',
    alt: 'Technology equipped classroom on rent in Gurugram with projector and digital display',
  },
  {
    title: 'Digital Teaching Technology',
    desc: 'TV, projector, display walls and laptop available in every cabin.',
    image: '/images/classroom-biology.png',
    alt: 'Interactive classroom with digital display wall and modern teaching technology',
  },
  {
    title: 'High-Speed Wi-Fi',
    desc: 'Reliable, fast internet included. No bills, no setup.',
    image: '/images/classroom-seminar.png',
    alt: 'Seminar teaching space with high-speed internet and uninterrupted connectivity',
  },
  {
    title: 'On-Site Manager & IT',
    desc: 'A manager handles the calendar and an IT technician handles the tech.',
    image: '/images/reception-lobby.png',
    alt: 'Reception lobby with on-site facility manager and IT support staff',
  },
  {
    title: 'Recording Facilities',
    desc: 'Audio and video recording of your class available on request.',
    image: '/images/classroom-music.png',
    alt: 'Classroom studio setup with audio and video recording equipment',
  },
  {
    title: 'Printing & Scanning',
    desc: 'Multiple sizes. Charged per page. No separate print shop needed.',
    image: '/images/facilities-lockers.png',
    alt: 'Front desk facility lockers and administrative printing and scanning station',
  },
  {
    title: 'Professional Infrastructure',
    desc: 'Air conditioning, housekeeping, CCTV, lockers — all included.',
    image: '/images/classroom-standard.png',
    alt: 'Professional air-conditioned classroom cabin with standard furnished infrastructure',
  },
  {
    title: 'Operational Support',
    desc: 'You focus entirely on teaching. We handle everything else.',
    image: '/images/terrace-balcony.png',
    alt: 'Full operational support and open terrace breakout spaces at Mentors Studio',
  },
];

export function Solution() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    features.forEach((f) => {
      const img = new Image();
      img.src = f.image;
    });
  }, []);

  return (
    <section className="section-pad bg-[#1A1A1A] relative overflow-hidden">
      {/* Subtle gold radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C9A96B]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
          <SectionLabel className="justify-center">The Solution</SectionLabel>
          <h2
            className="font-display font-bold text-[#F7F2EA] leading-[1.06] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.6rem)' }}
          >
            Just Walk In.{' '}
            <span className="text-gradient italic">And Teach.</span>
          </h2>
          <p className="font-body text-[#A89880] text-lg leading-relaxed font-light">
            Mentors Studio eliminates every operational barrier between you and your students.
          </p>
        </AnimatedSection>

        {/* Bento grid */}
        <div className="grid lg:grid-cols-12 gap-4 mb-10">
          {/* Large image tile */}
          <AnimatedSection className="lg:col-span-5 relative overflow-hidden rounded-sm h-[380px] sm:h-[440px] lg:h-auto lg:min-h-full bg-[#1A1A1A]" direction="left">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={features[activeIndex].image}
                alt={features[activeIndex].alt}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 flex flex-col gap-1.5 pointer-events-none">
              {['No Setting Up.', 'No Managing.', 'No Unnecessary Investment.'].map((t, i) => (
                <div
                  key={i}
                  className={`font-display font-bold text-lg px-4 py-1.5 inline-block rounded-sm ${
                    i === 0 ? 'bg-[#C9A96B] text-[#1A1A1A]' :
                    i === 1 ? 'bg-[#F7F2EA] text-[#1A1A1A]' :
                              'bg-[#3E2F1F] text-[#EADCC8]'
                  }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Features grid */}
          <StaggerContainer className="lg:col-span-7 grid sm:grid-cols-2 gap-3" delay={0.15}>
            {features.map((f, i) => {
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
                    className={`h-full p-5 border rounded-sm transition-all group bg-[#231F1B] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A96B]/50 ${
                      isActive
                        ? 'border-[#C9A96B] bg-[#C9A96B]/10'
                        : 'border-[#3A3228] hover:border-[#C9A96B]/40 hover:bg-[#C9A96B]/4'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <CheckCircle2
                        size={15}
                        className={`flex-shrink-0 mt-0.5 transition-colors ${
                          isActive ? 'text-[#F7F2EA]' : 'text-[#C9A96B]'
                        }`}
                      />
                      <h3
                        className={`font-display font-semibold text-sm transition-colors ${
                          isActive ? 'text-[#C9A96B]' : 'text-[#F7F2EA]'
                        }`}
                      >
                        {f.title}
                      </h3>
                    </div>
                    <p className="font-body text-[#7A6A50] text-xs leading-relaxed pl-6 font-light">{f.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Image strip */}
        <AnimatedSection>
          <div className="grid grid-cols-3 gap-4">
            {[
              { src: '/images/classroom-seminar.png', alt: 'Spacious 24-seat seminar hall and test-prep classroom in Sector 57 Gurugram' },
              { src: '/images/classroom-biology.png', alt: 'Furnished 12-seat tuition and coaching classroom with interactive digital display' },
              { src: '/images/classroom-music.png', alt: 'Dedicated Arts and Crafts teaching workshop room with creative supplies' },
            ].map((img, i) => (
              <div key={i} className="overflow-hidden rounded-sm aspect-[4/3]">
                <img
                  src={img.src} alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
