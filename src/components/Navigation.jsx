import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavLogo } from './ui/Logo';

const navLinks = [
  { label: 'Home',          to: '/',              exact: true },
  { label: 'Spaces',        to: '/spaces' },
  { label: 'Facilities',    to: '/facilities' },
  { label: 'How It Works',  to: '/how-it-works' },
  { label: 'Pricing',       to: '/pricing' },
  { label: 'For Educators', to: '/educators' },
  { label: 'FAQ',           to: '/faq' },
  { label: 'Contact',       to: '/contact' },
];

export function Navigation() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHome
            ? 'bg-[#1A1A1A]/90 backdrop-blur-md shadow-md shadow-black/20'
            : scrolled ? 'bg-[#F7F2EA]/97 backdrop-blur-md shadow-md' : 'bg-[#F7F2EA]'
        }`}
      >
        {/* Top gold line */}
        <div className="h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-[66px] gap-4">

            {/* Logo */}
            <Link to="/" className="group flex-shrink-0">
              <NavLogo light={isHome} />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-0">
              {navLinks.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-2.5 py-2 font-body text-[10.5px] tracking-[0.12em] font-semibold uppercase
                      transition-colors duration-200 whitespace-nowrap
                      ${active ? 'text-[#C9A96B]' : isHome ? 'text-[#F7F2EA] hover:text-[#C9A96B]' : 'text-[#3E2F1F] hover:text-[#C9A96B]'}`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active-line"
                        className="absolute bottom-0 left-1 right-1 h-[2px] bg-[#C9A96B] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              className="hidden lg:block flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/contact"
                className={`px-5 py-2.5 font-body font-bold text-[10px] tracking-[0.2em] uppercase rounded-sm transition-colors shadow-sm ${
                  isHome ? 'bg-[#C9A96B] text-[#1A1A1A] hover:bg-[#D4B87A]' : 'bg-[#1A1A1A] text-[#F7F2EA] hover:bg-[#3E2F1F]'
                }`}
              >
                BOOK YOUR SPACE
              </Link>
            </motion.div>

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 hover:text-[#C9A96B] transition-colors ml-auto ${isHome ? 'text-[#F7F2EA]' : 'text-[#1A1A1A]'}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* Bottom gold separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96B]/40 to-transparent" />
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-[72px] left-0 right-0 z-40 border-b-2 border-[#C9A96B] shadow-2xl lg:hidden ${
              isHome ? 'bg-[#1A1A1A]' : 'bg-[#F7F2EA]'
            }`}
          >
            <nav className="max-w-7xl mx-auto px-5 py-3 flex flex-col">
              {navLinks.map((link, i) => {
                const active = isActive(link);
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035 }}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center justify-between py-3.5 border-b ${isHome ? 'border-[#3A3228]' : 'border-[#DDD0B8]'}
                        font-body text-xs tracking-[0.15em] font-semibold uppercase transition-colors
                        ${active ? 'text-[#C9A96B]' : isHome ? 'text-[#F7F2EA] hover:text-[#C9A96B]' : 'text-[#3E2F1F] hover:text-[#C9A96B]'}`}
                    >
                      {link.label}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96B] flex-shrink-0" />}
                    </Link>
                  </motion.div>
                );
              })}
              <Link
                to="/contact"
                className={`mt-4 mb-1 flex items-center justify-center py-3.5 font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm transition-colors ${
                  isHome ? 'bg-[#C9A96B] text-[#1A1A1A] hover:bg-[#D4B87A]' : 'bg-[#1A1A1A] text-[#F7F2EA] hover:bg-[#3E2F1F]'
                }`}
              >
                BOOK YOUR SPACE
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
