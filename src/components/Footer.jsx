import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Swoosh } from './ui/Swoosh';
import { siteConfig } from '../config/siteConfig';

const navLinks = [
  { label: 'Spaces',        to: '/spaces' },
  { label: 'Facilities',    to: '/facilities' },
  { label: 'How It Works',  to: '/how-it-works' },
  { label: 'Pricing',       to: '/pricing' },
  { label: 'For Educators', to: '/educators' },
  { label: 'FAQ',           to: '/faq' },
  { label: 'Contact',       to: '/contact' },
];

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#EADCC8] relative overflow-hidden">

      {/* Top gold accent line */}
      <div className="h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />

      {/* Brand swoosh */}
      <Swoosh className="absolute bottom-0 right-0 w-56 sm:w-72 rotate-180 opacity-70 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Main footer body ── */}
        <div className="py-16 grid lg:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-5">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-[46px] h-[46px] border border-[#C9A96B]/70 bg-[#F7F2EA] rounded-sm p-1 flex items-center justify-center flex-shrink-0 relative shadow-md group-hover:border-[#C9A96B] transition-all">
                <img
                  src="/brand/logo-monogram.png"
                  alt="Mentors Studio monogram emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-[#F7F2EA] group-hover:text-[#D4B87A] tracking-[0.12em] text-[15px] transition-colors">
                  MENTORS <span className="text-[#D4B87A]">STUDIO</span>
                </span>
                <span className="font-mono text-[8px] tracking-[0.35em] text-[#D4B87A] uppercase mt-0.5">BY THE VENSEJ</span>
              </div>
            </Link>

            {/* Taglines */}
            <p className="font-body text-[#EADCC8] text-sm leading-relaxed mb-3 max-w-xs font-medium">
              You Bring the Knowledge. We Provide the Space.
            </p>
            <p className="font-body text-[#DDD0B8] text-sm leading-relaxed mb-5 max-w-xs font-normal">
              A professional home for educators to teach, connect and grow.
            </p>

            {/* Script tagline */}
            <p className="font-script text-[#D4B87A] mb-5" style={{ fontSize: '1.6rem' }}>
              Learn · Create · Grow
            </p>

            {/* Gold divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-[#D4B87A]/60 to-transparent" />
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-2.5">
              <a href={`tel:${siteConfig.contact.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2.5 text-[#EADCC8] hover:text-[#D4B87A] transition-colors group">
                <Phone size={14} className="text-[#D4B87A] flex-shrink-0" />
                <span className="font-body text-xs tracking-wide">Phone: {siteConfig.contact.phone}</span>
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2.5 text-[#EADCC8] hover:text-[#D4B87A] transition-colors group">
                <Mail size={14} className="text-[#D4B87A] flex-shrink-0" />
                <span className="font-body text-xs tracking-wide">Email: {siteConfig.contact.email}</span>
              </a>
              <div className="flex items-center gap-2.5 text-[#EADCC8]">
                <MapPin size={14} className="text-[#D4B87A] flex-shrink-0" />
                <span className="font-body text-xs tracking-wide">{siteConfig.contact.address.locality}, Gurugram</span>
              </div>
            </div>
          </div>

          {/* Nav + tagwords */}
          <div className="lg:col-span-4">
            <p className="font-mono text-[9.5px] tracking-[0.3em] uppercase text-[#D4B87A] font-bold mb-5">Navigation</p>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-[#EADCC8] hover:text-[#D4B87A] transition-colors tracking-wide flex items-center gap-2 group font-medium"
                  >
                    <span className="w-0 h-px bg-[#D4B87A] group-hover:w-4 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand words */}
          <div className="lg:col-span-3">
            <p className="font-mono text-[9.5px] tracking-[0.3em] uppercase text-[#D4B87A] font-bold mb-5">Brand</p>
            <div className="flex flex-col gap-2 mb-8">
              {['EDUCATION', 'CREATIVITY', 'WELLNESS', 'MEDIA'].map((word) => (
                <span key={word} className="font-body text-xs tracking-[0.25em] text-[#A89880] font-semibold">
                  {word}
                </span>
              ))}
            </div>

            <div className="mt-auto">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A89880] leading-loose font-medium">
                MORE THAN SKILLS<br />
                A BRIGHTER TOMORROW
              </p>
            </div>
          </div>
        </div>

        {/* ── CTA strip ── */}
        <div className="border-t border-[#3A3228] py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-display font-bold text-[#F7F2EA] text-lg">Ready to start teaching?</p>
            <p className="font-body text-[#EADCC8] text-xs mt-1 tracking-wide font-medium">
              Golf Course Extension Road, Sector 57, Gurugram
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-7 py-3 bg-[#D4B87A] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-xs hover:bg-[#E5C98E] transition-colors flex-shrink-0 shadow-sm"
            >
              BOOK YOUR SPACE
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>

        {/* ── Copyright ── */}
        <div className="border-t border-[#3A3228] py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-[10.5px] text-[#A89880] tracking-wide">
            © {new Date().getFullYear()} Mentors Studio, by The Vensej. Golf Course Extension Road, Sector 57, Gurugram.
          </p>
          <p className="font-body text-[10.5px] text-[#A89880] tracking-wide">
            All prices exclude GST · Subject to change without notice
          </p>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />
    </footer>
  );
}
