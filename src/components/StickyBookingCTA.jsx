import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export function StickyBookingCTA() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-6 right-6 z-40 lg:hidden"
        >
          <Link
            to="/contact#enquiry-form"
            onClick={() => {
              if (location.pathname === '/contact') {
                document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="flex items-center gap-2 px-5 py-3.5 bg-[#D4B87A] text-[#1A1A1A] font-display font-bold text-xs tracking-wider uppercase rounded-xs shadow-2xl shadow-black/50 border border-[#8B6914] active:scale-95 transition-transform"
            aria-label="Book your space"
          >
            <MessageCircle size={16} />
            Book Your Space
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
