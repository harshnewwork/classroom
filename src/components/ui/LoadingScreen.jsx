import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function LoadingScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('ms_loaded');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!isVisible) return;
    try {
      sessionStorage.setItem('ms_loaded', '1');
    } catch {
      // ignore
    }
    // Show brief loading screen animation (1.4s), then fade out smoothly
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1400);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A1A1A] text-[#F7F2EA] px-6"
        >
          {/* Subtle gold background radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(201,169,107,0.12) 0%, transparent 65%)',
            }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center text-center max-w-sm"
          >
            {/* Monogram Emblem */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 p-3 rounded-full bg-[#F7F2EA] border-2 border-[#C9A96B] shadow-xl shadow-black/40 flex items-center justify-center mb-6">
              <img
                src="/brand/logo-monogram.png"
                alt="Mentors Studio monogram"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Script Tagline */}
            <p className="font-script text-[#C9A96B] text-3xl sm:text-4xl leading-none mb-2">
              Learn · Create · Grow
            </p>

            {/* Welcome title */}
            <h2 className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#EADCC8] uppercase font-semibold mb-2">
              Welcome to Mentors Studio
            </h2>

            {/* Location */}
            <p className="font-body text-[11px] tracking-wide text-[#EADCC8]/80 flex items-center gap-1.5 justify-center mb-6">
              <MapPin size={12} className="text-[#C9A96B]" />
              Golf Course Extension Road, Gurugram
            </p>

            {/* Animated Loading Bar */}
            <div className="w-36 h-[2px] bg-[#3E2F1F] rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-transparent via-[#C9A96B] to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
