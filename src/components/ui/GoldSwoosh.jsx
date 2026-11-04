/**
 * GoldSwoosh — brand decorative SVG element.
 * Place in hero (top-left) and footer (bottom-right, rotated 180°).
 */
export function GoldSwoosh({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 420 220"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Dark filled triangle */}
      <path d="M0 0H330C220 40 90 120 0 210Z" fill="#2a2018" />
      {/* Primary gold curve */}
      <path
        d="M330 0C220 40 90 120 0 210"
        fill="none"
        stroke="#C9A96B"
        strokeWidth="2.5"
      />
      {/* Secondary gold curve (50% opacity) */}
      <path
        d="M300 0C195 36 80 108 0 188"
        fill="none"
        stroke="#C9A96B"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
    </svg>
  );
}
