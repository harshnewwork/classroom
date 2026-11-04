import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { CheckCircle2 } from 'lucide-react';

const features = [
  { title: 'Ready-to-Use Classrooms',     desc: 'Walk in and start teaching. Everything is set up, cleaned and ready.' },
  { title: 'Digital Teaching Technology', desc: 'TV, projector, display walls and laptop available in every cabin.' },
  { title: 'High-Speed Wi-Fi',            desc: 'Reliable, fast internet included. No bills, no setup.' },
  { title: 'On-Site Manager & IT',        desc: 'A manager handles the calendar and an IT technician handles the tech.' },
  { title: 'Recording Facilities',        desc: 'Audio and video recording of your class available on request.' },
  { title: 'Printing & Scanning',         desc: 'Multiple sizes. Charged per page. No separate print shop needed.' },
  { title: 'Professional Infrastructure', desc: 'Air conditioning, housekeeping, CCTV, lockers — all included.' },
  { title: 'Operational Support',         desc: 'You focus entirely on teaching. We handle everything else.' },
];

export function Solution() {
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
          <AnimatedSection className="lg:col-span-5 relative overflow-hidden rounded-sm" direction="left">
            <img
              src="/images/classroom-physics.png"
              alt="Technology equipped classroom on rent in Gurugram with projector and digital display"
              className="w-full h-full min-h-[400px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent" />
            <div className="absolute bottom-6 left-6 flex flex-col gap-1.5">
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
            {features.map((f, i) => (
              <StaggerItem key={i}>
                <div className="h-full p-5 border border-[#3A3228] rounded-sm hover:border-[#C9A96B]/40 hover:bg-[#C9A96B]/4 transition-all group bg-[#231F1B]">
                  <div className="flex items-start gap-3 mb-2">
                    <CheckCircle2 size={15} className="text-[#C9A96B] flex-shrink-0 mt-0.5" />
                    <h3 className="font-display font-semibold text-[#F7F2EA] text-sm">{f.title}</h3>
                  </div>
                  <p className="font-body text-[#7A6A50] text-xs leading-relaxed pl-6 font-light">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
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
