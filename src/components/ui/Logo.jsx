/**
 * Logo components for Mentors Studio.
 *
 * Usage:
 *   <NavLogo />       — clean transparent monogram + wordmark for navbar
 *   <HeroLogo />      — monogram emblem with elegant transparent presentation
 *   <FullLogo />      — full transparent horizontal logo (monogram + wordmark + tagline)
 *   <BrandBanner />   — full banner logo
 */

/** Clean monogram emblem + wordmark — transparent, elegant, not boxed in */
export function NavLogo({ light = false }) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      {/* MS emblem — clean transparent PNG without boxed container */}
      <img
        src="/brand/logo-monogram.png"
        alt="Mentors Studio"
        className="h-9 sm:h-10 w-auto object-contain flex-shrink-0 transition-transform group-hover:scale-105 duration-200"
      />

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-[0.12em] transition-colors ${
            light
              ? 'text-[#F7F2EA] group-hover:text-[#D4B87A]'
              : 'text-[#1A1A1A] group-hover:text-[#8B6914]'
          }`}
          style={{ fontSize: '13.5px' }}
        >
          MENTORS <span className="text-[#8B6914]">STUDIO</span>
        </span>
        <span
          className={`font-body text-[7.5px] tracking-[0.32em] uppercase mt-0.5 font-semibold ${
            light ? 'text-[#EADCC8]/80' : 'text-[#5C450C]'
          }`}
        >
          BY THE VENSEJ
        </span>
      </div>
    </div>
  );
}

/** Monogram emblem — clean, elegant, transparent presentation */
export function HeroLogo({ className = '', size = 76 }) {
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/brand/logo-monogram.png"
        alt="Mentors Studio — By The Vensej"
        className="w-full h-full object-contain drop-shadow-sm"
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

/** Full banner logo */
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
