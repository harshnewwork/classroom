export function SectionLabel({ children, className = '', light = false }) {
  return (
    <div className={`inline-flex items-center gap-2 mb-4 ${className}`}>
      <span className={`w-6 h-px ${light ? 'bg-[#C9A96B]' : 'bg-[#C9A96B]'}`} />
      <span className={`font-mono text-[10px] tracking-[0.25em] uppercase ${light ? 'text-[#C9A96B]' : 'text-[#C9A96B]'}`}>
        {children}
      </span>
    </div>
  );
}
