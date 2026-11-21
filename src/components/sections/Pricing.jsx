import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { EDUCATOR_TYPES, PACKAGES } from '../../data/pricing';
import { Calculator } from '../pricing/Calculator';

const HIGHLIGHT_PKG = 'elite';

/* ─── Format helper ── */
const fmtRate = (n) => {
  if (n == null) return '—';
  const num = Number(n);
  return num % 1 === 0 ? `₹${num}` : `₹${num.toFixed(2)}`;
};

/* ─── Package card ── */
function PkgCard({ pkg, eduType }) {
  const isElite = pkg.id === HIGHLIGHT_PKG;
  const isSchool = eduType === 'school';

  return (
    <div
      className={`relative p-6 rounded-sm border flex flex-col h-full transition-all duration-200 ${
        isElite
          ? 'border-[#8B6914] bg-[#3E2F1F] text-[#F7F2EA] shadow-xl shadow-black/25 ring-1 ring-[#C9A96B]/50'
          : 'border-[#DDD0B8] bg-[#FFFDF9] hover:border-[#8B6914]/60 hover:shadow-md'
      }`}
    >
      {isElite && (
        <div className="absolute -top-3 right-5">
          <span className="bg-[#C9A96B] text-[#1A1A1A] font-mono text-[9.5px] tracking-[0.18em] uppercase px-3 py-1 rounded-xs font-bold shadow-xs">
            Best value
          </span>
        </div>
      )}

      {/* Package Header */}
      <h3 className={`font-display font-bold text-xl sm:text-2xl mb-2 ${isElite ? 'text-[#F7F2EA]' : 'text-[#1A1A1A]'}`}>
        {pkg.label}
      </h3>

      {/* Sessions and Duration */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`font-display font-bold italic leading-none text-3xl sm:text-4xl ${isElite ? 'text-[#D4B87A]' : 'text-[#8B6914]'}`}>
          {pkg.sessions}
        </span>
        <div className="flex flex-col">
          <span className={`font-body text-xs font-bold uppercase tracking-wide ${isElite ? 'text-[#F7F2EA]' : 'text-[#1A1A1A]'}`}>
            sessions
          </span>
          <span className={`font-mono text-[11px] ${isElite ? 'text-[#DDD0B8]' : 'text-[#5C450C]'}`}>
            {pkg.durationLabel}
          </span>
        </div>
      </div>

      {/* Discount Pill Badge */}
      <div className="mb-4">
        <span
          className={`inline-block font-mono text-[11px] font-bold tracking-wider px-3 py-1 rounded-xs ${
            isElite
              ? 'bg-[#C9A96B] text-[#1A1A1A]'
              : 'bg-[#EADCC8] text-[#3E2F1F]'
          }`}
        >
          {pkg.discountLabel}
        </span>
      </div>

      {/* Deposit & Locker Features */}
      <div className="mb-4 flex flex-col gap-1 text-xs">
        <p className={`font-body font-medium ${isElite ? 'text-[#DDD0B8]' : 'text-[#5C450C]'}`}>
          {pkg.depositPercent}% refundable deposit
        </p>
        {pkg.hasFreeLocker && (
          <p className="font-body font-bold text-[#D4B87A] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#D4B87A]" />
            + Free locker
          </p>
        )}
      </div>

      {/* Explicit Rates Table */}
      <div className={`border-t pt-4 mt-auto flex flex-col gap-2 ${isElite ? 'border-[#C9A96B]/30' : 'border-[#DDD0B8]'}`}>
        <div className={`flex justify-between items-center text-xs sm:text-sm p-1.5 rounded-xs transition-colors ${
          isSchool ? (isElite ? 'bg-[#1A1A1A]/40 font-bold' : 'bg-[#EADCC8]/40 font-bold') : 'opacity-85'
        }`}>
          <span className={isElite ? 'text-[#DDD0B8]' : 'text-[#3E2F1F]'}>School</span>
          <span className={`font-mono ${isSchool ? (isElite ? 'text-[#D4B87A]' : 'text-[#8B6914]') : (isElite ? 'text-[#F7F2EA]' : 'text-[#1A1A1A]')}`}>
            {fmtRate(pkg.rates.school)}
          </span>
        </div>
        <div className={`flex justify-between items-center text-xs sm:text-sm p-1.5 rounded-xs transition-colors ${
          !isSchool ? (isElite ? 'bg-[#1A1A1A]/40 font-bold' : 'bg-[#EADCC8]/40 font-bold') : 'opacity-85'
        }`}>
          <span className={isElite ? 'text-[#DDD0B8]' : 'text-[#3E2F1F]'}>Adult</span>
          <span className={`font-mono ${!isSchool ? (isElite ? 'text-[#D4B87A]' : 'text-[#8B6914]') : (isElite ? 'text-[#F7F2EA]' : 'text-[#1A1A1A]')}`}>
            {fmtRate(pkg.rates.adult)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Pricing section ── */
export function Pricing({ defaultCapacity }) {
  const [activeType, setActiveType] = useState('adult');

  return (
    <section id="pricing" className="section-pad bg-[#F7F2EA] relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,169,107,0.07) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
          <SectionLabel className="justify-center">Pricing</SectionLabel>
          <h2
            className="font-display font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
          >
            Flexible Packages.{' '}
            <span className="text-[#8B6914] italic">Commit Longer. Save More.</span>
          </h2>
          <p className="font-body text-[#3E2F1F] text-sm font-normal leading-relaxed">
            All prices exclude GST at 18%. Billed monthly after you have taught — collect tuition from your students first.
          </p>
        </AnimatedSection>

        {/* Base rates toggle */}
        <AnimatedSection className="mb-8" delay={0.05}>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {EDUCATOR_TYPES.map((et) => (
              <div
                key={et.id}
                onClick={() => setActiveType(et.id)}
                className={`p-5 border rounded-sm cursor-pointer transition-all ${
                  activeType === et.id
                    ? 'border-[#8B6914] bg-[#FFFDF9] shadow-md ring-1 ring-[#8B6914]/40'
                    : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#8B6914]/40'
                }`}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] mb-1 font-bold">
                  {et.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-[#1A1A1A] italic text-3xl leading-none">
                    ₹{et.baseRate}
                  </span>
                  <span className="font-body text-[#3E2F1F] text-xs font-semibold">/ seat base rate</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Package cards — 4 tiers (Starter, Growth, Pro, Elite) */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4" delay={0.08}>
          {PACKAGES.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <PkgCard pkg={pkg} eduType={activeType} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Footer Note Banner under Pricing Cards */}
        <AnimatedSection className="mb-12">
          <div className="p-3.5 bg-[#3E2F1F] text-[#F7F2EA] rounded-full text-center shadow-md max-w-4xl mx-auto border border-[#C9A96B]/30">
            <p className="font-display italic text-xs sm:text-sm tracking-wide">
              Billed monthly, after you teach · Deposits fully refundable · Unused sessions lapse at the end of validity
            </p>
          </div>
        </AnimatedSection>

        {/* Cost Calculator with Promo/Discount & Booking Handoff */}
        <AnimatedSection delay={0.12}>
          <Calculator theme="light" defaultCapacity={defaultCapacity} />
        </AnimatedSection>
      </div>
    </section>
  );
}
