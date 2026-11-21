import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavLogo } from './ui/Logo';
import { EarlyBirdTopBanner } from './pricing/EarlyBirdTopBanner';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      scrollToHash();
      const timer = setTimeout(scrollToHash, 200);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#F7F2EA]/96 backdrop-blur-md border-b border-[#DDD0B8] shadow-xs"
      >
        {/* Full-width grand Early Bird Top Banner */}
        <EarlyBirdTopBanner />

        {/* Top gold line */}
        <div className="h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-[68px] gap-2 lg:gap-4">

            {/* Logo — clean, transparent, single instance */}
            <Link to="/" className="group flex-shrink-0" aria-label="Mentors Studio Home">
              <NavLogo light={false} />
            </Link>

            {/* Desktop navigation tabs — consistent palette with explicit legible hover colors */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-0.5 xl:gap-1">
              {navLinks.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-2 xl:px-3 py-2 font-body text-[10px] xl:text-[11px] tracking-[0.08em] xl:tracking-[0.12em] uppercase transition-colors duration-200 whitespace-nowrap ${
                      active
                        ? 'text-[#8B6914] font-bold'
                        : 'text-[#1A1A1A] hover:text-[#8B6914] font-semibold'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active-line"
                        className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#C9A96B] rounded-full"
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
                to="/contact#enquiry-form"
                onClick={() => {
                  if (location.pathname === '/contact') {
                    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-5 py-2.5 font-body font-bold text-[10px] tracking-[0.2em] uppercase rounded-sm transition-colors shadow-sm bg-[#1A1A1A] text-[#F7F2EA] hover:bg-[#8B6914] hover:text-white"
              >
                BOOK YOUR SPACE
              </Link>
            </motion.div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[#1A1A1A] hover:text-[#8B6914] transition-colors ml-auto cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[71px] left-0 right-0 z-40 border-b-2 border-[#C9A96B] shadow-2xl lg:hidden bg-[#F7F2EA]"
          >
            <nav className="max-w-7xl mx-auto px-5 py-3 flex flex-col">
              {navLinks.map((link, i) => {
                const active = isActive(link);
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between py-3.5 border-b border-[#DDD0B8] font-body text-xs tracking-[0.15em] uppercase transition-colors ${
                        active
                          ? 'text-[#8B6914] font-bold'
                          : 'text-[#1A1A1A] hover:text-[#8B6914] font-semibold'
                      }`}
                    >
                      {link.label}
                      {active && <span className="w-2 h-2 rounded-full bg-[#C9A96B] flex-shrink-0" />}
                    </Link>
                  </motion.div>
                );
              })}
              <Link
                to="/contact#enquiry-form"
                onClick={() => {
                  setMobileOpen(false);
                  if (location.pathname === '/contact') {
                    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="mt-4 mb-2 flex items-center justify-center py-3.5 font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm transition-colors bg-[#1A1A1A] text-[#F7F2EA] hover:bg-[#8B6914] hover:text-white"
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
