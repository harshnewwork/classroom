import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Percent } from 'lucide-react';
import { getOfferDateStatus } from '../../data/earlyBird';

/**
 * Floating Early Bird Action Button / Banner
 * Matches the "SUPER EARLY BIRD OFFER — 30% OFF" creative.
 * Persists across the site while the offer is live (21 Nov – 12 Dec 2026).
 * Auto-hides when outside the offer window.
 */
export function FloatingEarlyBird() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [offerStatus, setOfferStatus] = useState(() => getOfferDateStatus());

  useEffect(() => {
    const update = () => {
      const status = getOfferDateStatus();
      setOfferStatus(status);
    };

    window.addEventListener('ms-offer-mode-changed', update);
    return () => window.removeEventListener('ms-offer-mode-changed', update);
  }, []);

  // Auto-hide outside the active campaign window (21 Nov – 12 Dec 2026)
  if (!offerStatus.active || dismissed) {
    return null;
  }

  const handleClick = () => {
    // If on HomePage or PricingPage, scroll straight to the calculator
    const isHome = location.pathname === '/';
    const isPricing = location.pathname === '/pricing';

    if (isHome || isPricing) {
      const target =
        document.getElementById('cost-calculator') ||
        document.getElementById('calculator') ||
        document.getElementById('pricing');

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Pre-select Early Bird in the discount toggle without auto-applying
      window.dispatchEvent(new CustomEvent('ms-select-discount', { detail: { discount: 'earlybird' } }));
    } else {
      // Navigate to /pricing with discount pre-selection
      navigate('/pricing?discount=earlybird#calculator');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[340px] sm:max-w-[380px]"
      >
        <div
          onClick={handleClick}
          className="relative group cursor-pointer bg-[#1A1A1A] border-2 border-[#C9A96B] rounded-sm p-3.5 sm:p-4 shadow-2xl shadow-black/80 hover:shadow-[#C9A96B]/20 hover:border-[#D4B87A] transition-all duration-300"
        >
          {/* Subtle gold decorative accent */}
          <div className="absolute -top-1 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96B] to-transparent opacity-80" />

          {/* Dismiss button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#231F1B] border border-[#C9A96B]/60 text-[#D4B87A] hover:text-white flex items-center justify-center transition-colors shadow-md cursor-pointer z-10"
            aria-label="Dismiss offer banner"
          >
            <X size={13} />
          </button>

          <div className="flex items-center gap-3">
            {/* Badge Icon */}
            <div className="w-10 h-10 rounded-sm bg-[#C9A96B] text-[#1A1A1A] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Percent size={20} className="stroke-[2.5]" />
            </div>

            {/* Banner Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[9px] tracking-[0.16em] uppercase font-bold text-[#D4B87A] bg-[#C9A96B]/15 px-1.5 py-0.5 rounded-xs">
                  Limited Time
                </span>
                <span className="font-mono text-[9px] text-[#A89880]">
                  21 Nov – 12 Dec 2026
                </span>
              </div>

              <h4 className="font-display font-bold text-white text-sm sm:text-base leading-tight mt-1 flex items-center gap-1.5">
                <span>SUPER EARLY BIRD</span>
                <span className="text-[#D4B87A] italic">30% OFF</span>
              </h4>

              <p className="font-mono text-[10px] text-[#DDD0B8] mt-0.5 flex items-center gap-1 group-hover:text-white transition-colors">
                <span>Calculate & lock your rate</span>
                <ArrowRight size={11} className="text-[#C9A96B] group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
