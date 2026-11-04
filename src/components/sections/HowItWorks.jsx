import { Link } from 'react-router-dom';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Tell Us What You Teach',  desc: 'Share your subject, grade level, batch size and preferred days and times. No paperwork. No deposits before you visit.', detail: 'No paperwork. No deposits before you visit.' },
  { num: '02', title: 'Visit a Cabin',            desc: 'Come in, explore the space and bring your students for a complimentary demo session. See the infrastructure for yourself.', detail: 'Touch the technology. Test the layout.' },
  { num: '03', title: 'Manager Confirms',         desc: 'Your slots are added to the shared calendar. The manager ensures no double bookings across all cabins.', detail: 'Structured, professional scheduling.' },
  { num: '04', title: 'Teach, Then Pay',          desc: 'Run your classes. At the end of the month you receive a bill for sessions taught. Pay after you collect from your students.', detail: 'Monthly billing. No upfront lock-in.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad bg-[#1A1A1A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96B]/40 to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{
        backgroundImage: 'radial-gradient(circle, #C9A96B 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <SectionLabel className="justify-center">Process</SectionLabel>
          <h2
            className="font-display font-bold text-[#F7F2EA] leading-[1.06] tracking-tight"
            style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}
          >
            From Booking to Teaching.{' '}
            <span className="text-gradient italic">Made Simple.</span>
          </h2>
        </AnimatedSection>

        {/* Desktop horizontal */}
        <div className="hidden lg:block mb-16">
          <AnimatedSection>
            <div className="relative flex items-start">
              <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#C9A96B]/20 via-[#C9A96B]/60 to-[#C9A96B]/20" />
              {steps.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center px-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.4, type: 'spring' }}
                    className="w-20 h-20 rounded-full border-2 border-[#C9A96B] bg-[#1A1A1A] flex flex-col items-center justify-center mb-6 relative z-10"
                  >
                    <span className="font-mono text-[9px] text-[#7A6A50] tracking-widest">STEP</span>
                    <span className="font-display font-bold text-[#C9A96B] text-xl leading-none italic">{step.num}</span>
                  </motion.div>
                  <h3 className="font-display font-bold text-[#F7F2EA] text-base text-center mb-3 leading-snug">{step.title}</h3>
                  <p className="font-body text-[#7A6A50] text-xs text-center leading-relaxed mb-2 font-light">{step.desc}</p>
                  <span className="font-mono text-[9px] text-[#C9A96B] tracking-wide text-center">{step.detail}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Mobile vertical */}
        <StaggerContainer className="lg:hidden flex flex-col gap-6 mb-12" delay={0.1}>
          {steps.map((step, i) => (
            <StaggerItem key={i}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-[#C9A96B] bg-[#1A1A1A] flex flex-col items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-[#C9A96B] text-sm italic">{step.num}</span>
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-[#C9A96B]/40 to-transparent mt-2" />}
                </div>
                <div className="pb-6">
                  <h3 className="font-display font-bold text-[#F7F2EA] text-lg mb-2">{step.title}</h3>
                  <p className="font-body text-[#7A6A50] text-sm leading-relaxed mb-1 font-light">{step.desc}</p>
                  <span className="font-mono text-[10px] text-[#C9A96B] tracking-wide">{step.detail}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="text-center pt-10 border-t border-[#3A3228]">
          <p className="font-body text-[#7A6A50] text-base mb-6 font-light">
            It's that straightforward. No complex contracts. No hidden charges.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96B] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#D4B87A] transition-colors"
            >
              Start the Conversation
            </Link>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
