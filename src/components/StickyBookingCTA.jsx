import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export function StickyBookingCTA() {
  const [visible, setVisible] = useState(false);

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
            to="/contact"
            className="flex items-center gap-2 px-5 py-3 bg-[#C9A96B] text-[#1A1A1A] font-display font-bold text-sm rounded-sm shadow-2xl shadow-[#C9A96B]/20"
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
