import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function PageHero({ label, title, subtitle, image, cta }) {
  return (
    <section className="relative min-h-[54vh] flex items-end overflow-hidden bg-[#1A1A1A]">
      {/* Background image */}
      {image && (
        <>
          <div className="absolute inset-0">
            <img src={image} alt="" className="w-full h-full object-cover opacity-25" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/50 via-[#1A1A1A]/60 to-[#1A1A1A]" />
        </>
      )}

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Gold glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#C9A96B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative corner lines */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[#C9A96B]/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-[#C9A96B]/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-20 pt-36">
        {/* Label */}
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span className="w-8 h-px bg-[#C9A96B]" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C9A96B]">{label}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display font-bold text-[#F7F2EA] leading-[1.08] tracking-tight mb-5 max-w-3xl"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-body text-[#A89880] text-base lg:text-lg leading-relaxed max-w-2xl mb-8 font-light"
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA */}
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to={cta.to}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C9A96B] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#D4B87A] transition-colors"
            >
              {cta.label}
              <ChevronRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96B]/60 to-transparent" />
    </section>
  );
}
