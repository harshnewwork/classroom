/**
 * Logo components for Mentors Studio.
 *
 * Usage:
 *   <NavLogo />       — clean transparent horizontal logo for navbar
 *   <HeroLogo />      — monogram emblem with elegant transparent presentation
 *   <FullLogo />      — full transparent horizontal logo (monogram + wordmark + tagline)
 *   <BrandBanner />   — full banner logo
 */

/** Clean full horizontal logo PNG for navbar */
export function NavLogo({ light = false, className = '' }) {
  return (
    <div className={`flex items-center flex-shrink-0 ${className}`}>
      <img
        src="/brand/logo-nav.png"
        alt="Mentors Studio — By The Vensej"
        className={`h-5 sm:h-5.5 md:h-6 lg:h-6.5 w-auto max-w-[160px] sm:max-w-[190px] md:max-w-[230px] lg:max-w-[260px] object-contain flex-shrink-0 transition-transform group-hover:scale-[1.02] duration-200 ${
          light ? 'brightness-0 invert' : ''
        }`}
      />
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
