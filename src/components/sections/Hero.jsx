import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { HeroLogo } from '../ui/Logo';
import { Swoosh } from '../ui/Swoosh';

const stats = [
  { value: '9',           label: 'Cabins, 6–24 seats' },
  { value: '120',         label: 'Total seats' },
  { value: '₹0',          label: 'Setup cost to you' },
  { value: '10am–8:29pm', label: 'Daily sessions' },
];

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex flex-col overflow-hidden bg-[#1A1A1A]">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/reception-lobby.png"
          alt="Mentors Studio Reception & Campus Corridor"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/95 via-[#1A1A1A]/80 to-[#1A1A1A]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-[#1A1A1A]/30" />
      </div>

      {/* Warm radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 right-0 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,169,107,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(62,47,31,0.28) 0%, transparent 70%)' }} />
      </div>

      {/* Brand swoosh */}
      <Swoosh className="absolute top-[72px] left-0 w-56 sm:w-64 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto px-5 lg:px-8 w-full pt-28 pb-12">
        <div className="flex-1 flex items-center">

          {/* ── LEFT: Text ── */}
          <motion.div style={{ y: textY, opacity }} className="flex flex-col max-w-2xl">

            {/* Welcome brand */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="flex items-center gap-3 mb-5">
              <HeroLogo size={76} className="rounded-md border border-[#C9A96B]/40 shadow-lg shadow-black/20 flex-shrink-0" />
              <div>
                <p className="font-script text-[#C9A96B] text-2xl leading-none">Learn · Create · Grow</p>
                <p className="font-body text-[9px] tracking-[0.2em] text-[#EADCC8] uppercase mt-1.5">
                  Welcome to Mentors Studio
                </p>
                <p className="font-body text-[9px] tracking-wide text-[#EADCC8]/80 mt-1 flex items-center gap-1">
                  <MapPin size={10} className="text-[#C9A96B]" />
                  Golf Course Extension Road, Gurugram
                </p>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display font-medium text-[#F7F2EA] leading-[1.06] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Your Knowledge{' '}
              <em className="not-italic text-[#D4B87A]">Deserves</em> a
              Professional Space.
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.44 }}
              className="font-body text-[#F7F2EA]/85 text-base lg:text-lg leading-relaxed mb-8 max-w-lg font-light">
              Teach, connect and grow in professionally managed classrooms designed exclusively for educators.
              You bring your students and expertise —{' '}
              <span className="text-[#F7F2EA] font-medium">we take care of the space, technology and infrastructure.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.56 }}
              className="flex flex-wrap gap-3 mb-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/spaces"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C9A96B] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.18em] uppercase rounded-sm hover:bg-[#D4B87A] transition-colors shadow-lg shadow-black/20">
                  Explore Our Spaces <ArrowRight size={13} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/pricing"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#C9A96B]/70 text-[#F7F2EA] font-body font-bold text-xs tracking-[0.18em] uppercase rounded-sm hover:bg-[#C9A96B]/15 transition-all">
                  View Pricing
                </Link>
              </motion.div>
            </motion.div>

            {/* Tagline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-3 border-l-2 border-[#C9A96B]/50 pl-4">
              <p className="font-display italic text-[#EADCC8] text-sm leading-relaxed">
                "You Bring the Knowledge. We Provide the Space."
              </p>
            </motion.div>
          </motion.div>

        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.7 }}
          className="border-t border-[#C9A96B]/35 pt-7 grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="font-display font-bold text-[#C9A96B] text-2xl lg:text-3xl italic leading-none">{s.value}</span>
              <span className="font-mono text-[10px] text-[#EADCC8]/75 tracking-wide uppercase mt-1">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#EADCC8]/70">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
