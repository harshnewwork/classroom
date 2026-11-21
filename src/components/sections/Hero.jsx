import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { Swoosh } from '../ui/Swoosh';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#1A1A1A]">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/reception-lobby.png"
          alt="Mentors Studio Reception and Campus Corridor — Furnished teaching spaces and classrooms for rent on Golf Course Extension Road, Sector 57, Gurugram"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/95 via-[#1A1A1A]/80 to-[#1A1A1A]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-transparent to-[#1A1A1A]/40" />
      </div>

      {/* Warm radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 right-0 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,169,107,0.14) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(62,47,31,0.28) 0%, transparent 70%)' }}
        />
      </div>

      {/* Brand swoosh */}
      <Swoosh className="absolute top-[72px] left-0 w-56 sm:w-64 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto px-5 lg:px-8 w-full pt-32 pb-8">
        <div className="flex-1 flex items-center">

          {/* ── LEFT: Text ── */}
          <motion.div style={{ y: textY, opacity }} className="flex flex-col max-w-2xl py-6">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display font-medium text-[#F7F2EA] leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4rem)' }}
            >
              Ready-to-Teach Classrooms.{' '}
              <span className="not-italic text-[#D4B87A] block sm:inline">Made for Educators.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
              className="font-body text-[#F7F2EA]/90 text-base lg:text-lg leading-relaxed mb-8 max-w-xl font-light"
            >
              Teach, connect and grow in professionally managed classrooms designed exclusively for educators.
              You bring your students and expertise —{' '}
              <span className="text-[#F7F2EA] font-medium">we take care of the space, technology and infrastructure.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.48 }}
              className="flex flex-wrap gap-3.5 mb-10"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/spaces"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C9A96B] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.18em] uppercase rounded-sm hover:bg-[#D4B87A] transition-colors shadow-lg shadow-black/30"
                >
                  Explore Our Spaces <ArrowRight size={13} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#C9A96B] text-[#F7F2EA] font-body font-bold text-xs tracking-[0.18em] uppercase rounded-sm hover:bg-[#C9A96B]/20 transition-all bg-[#1A1A1A]/40 backdrop-blur-xs"
                >
                  View Pricing
                </Link>
              </motion.div>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex items-center gap-3 border-l-2 border-[#C9A96B] pl-4"
            >
              <p className="font-display italic text-[#EADCC8] text-sm sm:text-base leading-relaxed">
                "You Bring the Knowledge. We Provide the Space."
              </p>
            </motion.div>
          </motion.div>

        </div>

        {/* ── Stats bar: All 5 slots styled with consistent rounded-card containers ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.6 }}
          className="border-t border-[#3E342A]/80 pt-6 mt-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">

            {/* Slot 1: Range Card 1 */}
            <div className="p-4 sm:p-4.5 rounded-lg border border-[#3E342A] bg-[#1E1B18]/70 backdrop-blur-md shadow-md min-h-[148px] flex flex-col justify-between hover:border-[#C9A96B]/50 transition-all group">
              <div>
                <span className="font-display font-medium italic text-[#D4B87A] text-2xl sm:text-3xl lg:text-[32px] leading-none">
                  4–30
                </span>
              </div>
              <div className="mt-3">
                <p className="font-mono text-[11px] font-bold tracking-[0.06em] text-[#F7F2EA] uppercase leading-tight">
                  SEATER CABIN & OPEN SPACES
                </p>
                <p className="font-body text-[11px] text-[#A89880] font-light mt-1 leading-snug">
                  Multiple Options for every need.
                </p>
              </div>
            </div>

            {/* Slot 2: Range Card 2 */}
            <div className="p-4 sm:p-4.5 rounded-lg border border-[#3E342A] bg-[#1E1B18]/70 backdrop-blur-md shadow-md min-h-[148px] flex flex-col justify-between hover:border-[#C9A96B]/50 transition-all group">
              <div>
                <span className="font-display font-medium italic text-[#D4B87A] text-2xl sm:text-3xl lg:text-[32px] leading-none">
                  100–120
                </span>
              </div>
              <div className="mt-3">
                <p className="font-mono text-[11px] font-bold tracking-[0.06em] text-[#F7F2EA] uppercase leading-tight">
                  SEATS IN TOTAL
                </p>
                <p className="font-body text-[11px] text-[#A89880] font-light mt-1 leading-snug">
                  Cabins + Arts area + Botany
                </p>
              </div>
            </div>

            {/* Slot 3: 7 Days */}
            <div className="p-4 sm:p-4.5 rounded-lg border border-[#3E342A] bg-[#1E1B18]/50 backdrop-blur-md shadow-md min-h-[148px] flex flex-col justify-between hover:border-[#C9A96B]/50 transition-all group">
              <div>
                <span className="font-display font-medium italic text-[#D4B87A] text-2xl sm:text-3xl lg:text-[32px] leading-none">
                  7 Days
                </span>
              </div>
              <div className="mt-3">
                <p className="font-mono text-[10px] sm:text-[10.5px] font-bold tracking-[0.08em] text-[#A89880] uppercase leading-tight">
                  A WEEK (MON–SAT + 3 SUN)
                </p>
              </div>
            </div>

            {/* Slot 4: ₹0 Setup Cost */}
            <div className="p-4 sm:p-4.5 rounded-lg border border-[#3E342A] bg-[#1E1B18]/50 backdrop-blur-md shadow-md min-h-[148px] flex flex-col justify-between hover:border-[#C9A96B]/50 transition-all group">
              <div>
                <span className="font-display font-medium italic text-[#D4B87A] text-2xl sm:text-3xl lg:text-[32px] leading-none">
                  ₹0
                </span>
              </div>
              <div className="mt-3">
                <p className="font-mono text-[10px] sm:text-[10.5px] font-bold tracking-[0.08em] text-[#A89880] uppercase leading-tight">
                  SETUP COST TO YOU
                </p>
              </div>
            </div>

            {/* Slot 5: 10:00am–8:45pm Daily Sessions */}
            <div className="p-4 sm:p-4.5 rounded-lg border border-[#3E342A] bg-[#1E1B18]/50 backdrop-blur-md shadow-md min-h-[148px] flex flex-col justify-between hover:border-[#C9A96B]/50 transition-all group">
              <div className="flex flex-col font-display font-medium italic text-[#D4B87A] text-xl sm:text-2xl lg:text-[26px] leading-[1.08] tracking-tight">
                <span>10:00am–</span>
                <span>8:45pm</span>
              </div>
              <div className="mt-3">
                <p className="font-mono text-[10px] sm:text-[10.5px] font-bold tracking-[0.08em] text-[#A89880] uppercase leading-tight">
                  DAILY SESSIONS
                </p>
              </div>
            </div>

          </div>

          {/* Reference indicator dot in bottom right */}
          <div className="flex justify-end pt-3 pr-1 pointer-events-none">
            <div className="w-5 h-5 rounded-full border border-[#4A3E31] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4B87A]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* High-visibility Scroll-down indicator */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="relative z-20 pb-4 flex justify-center pointer-events-none"
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1A]/85 border border-[#C9A96B]/60 text-[#F7F2EA] shadow-xl backdrop-blur-md">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-[#D4B87A]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            <ChevronDown size={14} className="text-[#C9A96B]" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
