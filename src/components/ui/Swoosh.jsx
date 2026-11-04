export function Swoosh({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 420 220" aria-hidden="true">
      <path d="M0 0H330C220 40 90 120 0 210Z" fill="#2a2018" />
      <path d="M330 0C220 40 90 120 0 210" fill="none" stroke="#C9A96B" strokeWidth="2.5" />
      <path d="M300 0C195 36 80 108 0 188" fill="none" stroke="#C9A96B" strokeOpacity=".5" />
    </svg>
  );
}
