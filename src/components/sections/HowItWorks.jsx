import { Link } from 'react-router-dom';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Share Your Requirements',
    desc: 'Tell us your subject, batch size and preferred timings.',
  },
  {
    num: '02',
    title: 'Visit & Choose',
    desc: 'Explore the space and select your cabin.',
  },
  {
    num: '03',
    title: 'Confirm Your Slot',
    desc: 'Our manager schedules your sessions.',
  },
  {
    num: '04',
    title: 'Teach & Pay',
    desc: 'Conduct your classes. Pay monthly based on student collections.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad bg-[#1A1A1A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96B]/40 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A96B 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <SectionLabel dark className="justify-center">Process</SectionLabel>
          <h2
            className="font-display font-bold text-[#F7F2EA] leading-[1.08] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
          >
            From Booking to Teaching.{' '}
            <span className="text-[#D4B87A] italic">Made Simple.</span>
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
                    transition={{ delay: i * 0.12, duration: 0.4, type: 'spring' }}
                    className="w-20 h-20 rounded-full border-2 border-[#C9A96B] bg-[#231F1B] flex flex-col items-center justify-center mb-6 relative z-10 shadow-lg"
                  >
                    <span className="font-mono text-[9px] text-[#D4B87A] tracking-widest font-bold">STEP</span>
                    <span className="font-display font-bold text-[#F7F2EA] text-xl leading-none italic">{step.num}</span>
                  </motion.div>
                  <h3 className="font-display font-bold text-[#F7F2EA] text-base text-center mb-2.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-body text-[#EADCC8] text-xs text-center leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Mobile vertical */}
        <StaggerContainer className="lg:hidden flex flex-col gap-6 mb-12" delay={0.1}>
          {steps.map((step, i) => (
            <StaggerItem key={i}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-[#C9A96B] bg-[#231F1B] flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                    <span className="font-display font-bold text-[#D4B87A] text-sm italic">{step.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-[#C9A96B]/50 to-transparent mt-2" />
                  )}
                </div>
                <div className="pb-4">
                  <h3 className="font-display font-bold text-[#F7F2EA] text-base mb-1.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-body text-[#EADCC8] text-sm leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Action Button */}
        <AnimatedSection className="text-center pt-8 border-t border-[#3A3228]">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96B] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#D4B87A] transition-colors shadow-lg shadow-black/30"
            >
              Start the Conversation
            </Link>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
