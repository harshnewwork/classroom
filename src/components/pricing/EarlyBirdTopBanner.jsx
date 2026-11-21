import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap } from 'lucide-react';
import { getOfferDateStatus } from '../../data/earlyBird';

const BANNER_STORAGE_KEY = 'ms_early_bird_top_banner_dismissed';

export function EarlyBirdTopBanner() {
  const location = useLocation();
  const navigate = useNavigate();

  const [offerStatus, setOfferStatus] = useState(() => getOfferDateStatus());
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(BANNER_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Keep offerStatus in sync if changed via admin toggle
  useEffect(() => {
    const handleModeChange = () => {
      setOfferStatus(getOfferDateStatus());
    };
    window.addEventListener('ms-offer-mode-changed', handleModeChange);
    return () => window.removeEventListener('ms-offer-mode-changed', handleModeChange);
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem(BANNER_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    // Notify floating badge that banner was dismissed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ms-early-bird-banner-dismissed'));
    }
  };

  const handleClick = () => {
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

      window.dispatchEvent(
        new CustomEvent('ms-select-discount', { detail: { discount: 'earlybird' } })
      );
    } else {
      navigate('/pricing?discount=earlybird#calculator');
    }
  };

  if (!offerStatus.active || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="grand-early-bird-banner"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="w-full relative overflow-hidden bg-gradient-to-r from-[#2A180A] via-[#3E2F1F] to-[#1A1A1A] border-b border-[#C9A96B]/50 shadow-md cursor-pointer select-none group"
        onClick={handleClick}
      >
        {/* Subtle decorative shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96B]/10 to-transparent pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 relative z-10">
          {/* Main content strip */}
          <div className="flex-1 flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-center min-w-0 pr-6 sm:pr-0">
            {/* Offer badge */}
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#C9A96B] text-[#1A1A1A] font-mono text-[10px] sm:text-[11px] font-black tracking-wider uppercase shadow-xs flex-shrink-0">
              <Zap size={12} className="fill-[#1A1A1A] stroke-[#1A1A1A]" />
              <span>SUPER EARLY BIRD</span>
            </div>

            {/* Headline */}
            <span className="font-display font-bold text-white text-xs sm:text-sm lg:text-[15px] tracking-wide">
              30% OFF All Packages
            </span>

            {/* Divider */}
            <span className="hidden sm:inline text-[#C9A96B]/60 font-mono text-xs">|</span>

            {/* Validity window */}
            <span className="font-mono text-[10px] sm:text-xs text-[#D4B87A] font-medium tracking-wide">
              Valid 21 Nov – 12 Dec 2026
            </span>

            {/* CTA Pill button */}
            <span className="inline-flex items-center gap-1 font-body text-[11px] sm:text-xs text-[#FFFDF9] font-bold underline decoration-[#C9A96B] decoration-2 underline-offset-4 group-hover:text-[#D4B87A] group-hover:decoration-white transition-all ml-1 sm:ml-2">
              <span>Calculate &amp; Lock Your Rate</span>
              <ArrowRight size={13} className="text-[#C9A96B] group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close promotion banner"
            className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 border border-[#C9A96B]/40 text-[#D4B87A] hover:text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
