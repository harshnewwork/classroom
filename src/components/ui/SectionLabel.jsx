export function SectionLabel({ children, className = '', dark = false }) {
  return (
    <div className={`inline-flex items-center gap-2.5 mb-4 ${className}`}>
      <span
        className={`w-7 h-[2px] rounded-full transition-colors ${
          dark ? 'bg-[#E5C378] shadow-[0_0_8px_rgba(229,195,120,0.4)]' : 'bg-[#8B6914]'
        }`}
      />
      <span
        className={`font-mono text-xs sm:text-[12px] tracking-[0.28em] uppercase font-bold transition-colors ${
          dark
            ? 'text-[#F5E6C8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
            : 'text-[#5C450C]'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
