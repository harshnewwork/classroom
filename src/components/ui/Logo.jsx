/**
 * Logo components for Mentors Studio.
 *
 * Usage:
 *   <NavLogo />       — mono emblem + wordmark for the navbar (small)
 *   <HeroLogo />      — mono emblem in an ivory card for the hero / welcome section
 *   <FullLogo />      — full transparent horizontal logo (monogram + wordmark + tagline)
 *   <BrandBanner />   — full banner logo with ivory background
 */

/** Small monogram emblem + wordmark — used in the navbar and mobile header */
export function NavLogo({ light = false }) {
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0">
      {/* MS emblem */}
      <div
        className={`w-10 h-10 flex-shrink-0 rounded-sm p-1 transition-all flex items-center justify-center ${
          light
            ? 'bg-[#F7F2EA] border border-[#C9A96B]/50 shadow-md shadow-black/20'
            : 'bg-[#F7F2EA] border border-[#DDD0B8]'
        }`}
      >
        <img
          src="/brand/logo-monogram.png"
          alt="Mentors Studio monogram"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-[0.1em] transition-colors ${
            light ? 'text-[#F7F2EA] group-hover:text-[#EADCC8]' : 'text-[#1A1A1A] group-hover:text-[#3E2F1F]'
          }`}
          style={{ fontSize: '13px' }}
        >
          MENTORS <span className="text-[#C9A96B]">STUDIO</span>
        </span>
        <span className={`font-body text-[7.5px] tracking-[0.32em] uppercase mt-0.5 ${light ? 'text-[#EADCC8]/70' : 'text-[#7A6A50]'}`}>
          BY THE VENSEJ
        </span>
      </div>
    </div>
  );
}

/** Monogram emblem card — used in the hero section, modals, and welcome badges */
export function HeroLogo({ className = '', size = 76 }) {
  return (
    <div
      className={`bg-[#F7F2EA] border border-[#C9A96B]/40 shadow-lg shadow-black/20 rounded-md p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/brand/logo-monogram.png"
        alt="Mentors Studio — By The Vensej"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

/** Full transparent horizontal logo */
export function FullLogo({ className = '', style = {} }) {
  return (
    <img
      src="/brand/logo-full.png"
      alt="Mentors Studio — By The Vensej — Learn, Grow, Create, Move"
      className={`object-contain ${className}`}
      style={style}
    />
  );
}

/** Full banner logo with ivory gradient */
export function BrandBanner({ className = '', style = {} }) {
  return (
    <img
      src="/brand/logo-banner.png"
      alt="Mentors Studio — By The Vensej"
      className={`object-contain rounded-sm ${className}`}
      style={style}
    />
  );
}
