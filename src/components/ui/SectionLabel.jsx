export function SectionLabel({ children, className = '', dark = false }) {
  return (
    <div className={`inline-flex items-center gap-2 mb-4 ${className}`}>
      <span className={`w-6 h-[2px] ${dark ? 'bg-[#D4B87A]' : 'bg-[#8B6914]'}`} />
      <span
        className={`font-mono text-[11px] tracking-[0.25em] uppercase font-bold ${
          dark ? 'text-[#D4B87A]' : 'text-[#8B6914]'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
