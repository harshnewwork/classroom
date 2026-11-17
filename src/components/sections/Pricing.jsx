import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, ChevronDown } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { EDUCATOR_TYPES, PACKAGES, calculatePricing, getMinBillable } from '../../data/pricing';
import { cabins } from '../../data/cabins';

const HIGHLIGHT_PKG = 'halfyearly';

/* ─── Format helpers ── */
const fmtINR = (n) => (n != null ? `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—');
const fmtDec = (n) => (n != null ? `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—');

/* ─── Package card ── */
function PkgCard({ pkg, eduType }) {
  const isHL = pkg.id === HIGHLIGHT_PKG;
  const rate = EDUCATOR_TYPES.find((e) => e.id === eduType)?.ratePerSeat ?? 250;
  const disc = (rate * (1 - pkg.discount)).toFixed(0);

  return (
    <div
      className={`relative p-6 rounded-sm border flex flex-col h-full transition-all duration-200 ${
        isHL
          ? 'border-[#8B6914] bg-[#FFFDF9] shadow-lg shadow-[#C9A96B]/15 ring-1 ring-[#8B6914]/40'
          : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#8B6914]/60 hover:shadow-md'
      }`}
    >
      {isHL && (
        <div className="absolute -top-3 left-5">
          <span className="bg-[#8B6914] text-white font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded-xs font-bold shadow-xs">
            Best Value
          </span>
        </div>
      )}

      <p className={`font-mono text-[10px] tracking-[0.22em] uppercase mb-2 font-bold ${isHL ? 'text-[#8B6914]' : 'text-[#5C450C]'}`}>
        {pkg.label}
      </p>

      {pkg.discount > 0 ? (
        <>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-display font-bold text-[#1A1A1A] italic" style={{ fontSize: '2.4rem', lineHeight: 1 }}>
              {(pkg.discount * 100).toFixed(0)}%
            </span>
            <span className="font-body text-[#3E2F1F] font-semibold text-sm">off</span>
          </div>
          <p className="font-mono text-xs text-[#5C450C] font-semibold mb-1">₹{disc} / seat / session</p>
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display font-bold text-[#1A1A1A] italic" style={{ fontSize: '2rem', lineHeight: 1 }}>
              ₹{disc}
            </span>
          </div>
          <p className="font-mono text-xs text-[#5C450C] font-semibold mb-1">per seat per session</p>
        </>
      )}

      <div className="border-t border-[#DDD0B8] mt-4 pt-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between text-xs">
          <span className="font-body text-[#3E2F1F]">Sessions</span>
          <span className="font-mono text-[#1A1A1A] font-bold">{pkg.sessions}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-body text-[#3E2F1F]">Validity</span>
          <span className="font-mono text-[#1A1A1A] font-semibold">{pkg.months} months</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-body text-[#3E2F1F]">Rate / seat</span>
          <span className="font-mono text-[#1A1A1A] font-semibold">₹{disc}</span>
        </div>
        <div className="flex justify-between text-xs pt-1 border-t border-[#DDD0B8]/60">
          <span className="font-body text-[#3E2F1F] font-medium">Security deposit</span>
          <span className="font-mono text-xs font-bold text-[#8B6914]">
            {pkg.depositPercent}%
          </span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-[#DDD0B8] flex flex-col gap-1.5">
        {['Pay after teaching', 'Min. 60% seats billed', `${(pkg.discount * 100).toFixed(0)}% package discount`].map((t) => (
          <div key={t} className="flex items-center gap-2 text-[10px] text-[#3E2F1F] font-medium">
            <Check size={11} className={isHL ? 'text-[#8B6914]' : 'text-[#5C450C]'} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Calculator ── */
function Calculator({ defaultCapacity }) {
  const [eduType,  setEduType]  = useState('adult');
  const [cabinCap, setCabinCap] = useState(defaultCapacity || 10);
  const [pkgId,    setPkgId]    = useState('standard');
  const [students, setStudents] = useState(6);
  const [result,   setResult]   = useState(null);

  useEffect(() => { if (defaultCapacity) setCabinCap(defaultCapacity); }, [defaultCapacity]);
  useEffect(() => {
    const cap = Number(cabinCap);
    setStudents((s) => Math.min(Number(s), cap));
  }, [cabinCap]);
  useEffect(() => {
    setResult(calculatePricing({ educatorType: eduType, cabinCapacity: Number(cabinCap), packageId: pkgId, numStudents: Number(students) }));
  }, [eduType, cabinCap, pkgId, students]);

  const selCls = 'w-full bg-[#FFFFFF] border border-[#DDD0B8] text-[#1A1A1A] font-body text-sm px-4 py-3 rounded-sm appearance-none focus:outline-none focus:border-[#8B6914] focus:ring-1 focus:ring-[#8B6914] transition-colors cursor-pointer font-medium';

  return (
    <div className="grid lg:grid-cols-2 border border-[#DDD0B8] rounded-sm overflow-hidden shadow-lg shadow-[#C9A96B]/6">

      {/* Inputs */}
      <div className="p-6 lg:p-8 bg-[#F7F2EA] border-b lg:border-b-0 lg:border-r border-[#DDD0B8]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-5 bg-[#8B6914]" />
          <h3 className="font-display font-bold text-[#1A1A1A] text-xl">Price Your Sessions</h3>
        </div>

        <div className="flex flex-col gap-5">
          {/* Educator type toggle */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] mb-2 font-bold">
              Who are you teaching?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {EDUCATOR_TYPES.map((et) => (
                <button
                  key={et.id}
                  onClick={() => setEduType(et.id)}
                  className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                    eduType === et.id
                      ? 'border-[#8B6914] bg-[#FFFDF9] shadow-xs'
                      : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#8B6914]/40'
                  }`}
                >
                  <p className={`font-body font-bold text-sm ${eduType === et.id ? 'text-[#1A1A1A]' : 'text-[#3E2F1F]'}`}>
                    {et.label}
                  </p>
                  <p className={`font-mono text-[10px] mt-0.5 font-semibold ${eduType === et.id ? 'text-[#8B6914]' : 'text-[#5C450C]'}`}>
                    ₹{et.ratePerSeat}/seat/session
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Cabin */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] mb-2 font-bold">
              Cabin size
            </p>
            <div className="relative">
              <select value={cabinCap} onChange={(e) => setCabinCap(e.target.value)} className={selCls}>
                {cabins.map((c) => (
                  <option key={c.id} value={c.capacity}>
                    {c.name} — {c.capacity} seats (min. {getMinBillable(c.capacity)} billed)
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C450C] pointer-events-none" />
            </div>
          </div>

          {/* Package */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] mb-2 font-bold">
              Package
            </p>
            <div className="relative">
              <select value={pkgId} onChange={(e) => setPkgId(e.target.value)} className={selCls}>
                {PACKAGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({(p.discount * 100).toFixed(0)}% off) · {p.sessions} sessions · {p.depositPercent}% deposit
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C450C] pointer-events-none" />
            </div>
          </div>

          {/* Students slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] font-bold">
                Number of students attending
              </p>
              <span className="font-display font-bold text-[#8B6914] italic text-xl leading-none">
                {students}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={Number(cabinCap)}
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              className="w-full h-1.5 cursor-pointer rounded-full"
              style={{ accentColor: '#8B6914' }}
            />
            {result && Number(students) < result.minBillable && (
              <p className="font-mono text-[10px] text-[#8B6914] mt-1.5 font-semibold">
                ℹ Minimum {result.minBillable} seats billed for this cabin.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results / Cost Breakdown */}
      <div className="p-6 lg:p-8 bg-[#FFFDF9] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-5 bg-[#8B6914]" />
            <h3 className="font-display font-bold text-[#1A1A1A] text-xl">Cost Breakdown</h3>
          </div>

          {result ? (
            <>
              <div className="flex flex-col bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm overflow-hidden mb-5">
                {[
                  {
                    label: 'Seats billed / session',
                    value: `${result.seatsForBilling} of ${cabinCap}`,
                    note: result.seatsForBilling > Number(students) ? `Min. billing: ${result.minBillable} seats` : null,
                  },
                  {
                    label: 'Discounted rate / seat',
                    value: fmtDec(result.discountedRate),
                    note: `${(result.discount * 100).toFixed(0)}% off base ₹${result.baseRate}`,
                  },
                  { label: 'Cost per session', value: fmtINR(result.perSession) },
                  { label: 'Cost per student', value: fmtDec(result.costPerStudent) },
                  {
                    label: `Package subtotal (${result.packageSessions} sessions)`,
                    value: fmtINR(result.packageTotal),
                    bold: true,
                  },
                  { label: 'GST at 18%', value: fmtINR(result.gst) },
                  {
                    label: `Security deposit (${result.depositPercent}%)`,
                    value: fmtINR(result.securityDeposit),
                    note: 'Refundable upon completion of term',
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-2.5 border-b border-[#DDD0B8] last:border-0">
                    <div>
                      <span className={`font-body text-xs sm:text-sm ${row.bold ? 'text-[#1A1A1A] font-bold' : 'text-[#3E2F1F]'}`}>
                        {row.label}
                      </span>
                      {row.note && <p className="font-mono text-[10px] text-[#8B6914] font-medium mt-0.5">{row.note}</p>}
                    </div>
                    <span className={`font-mono text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${row.bold ? 'text-[#1A1A1A] font-bold' : 'text-[#1A1A1A] font-semibold'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Grand total card */}
              <div className="p-4 bg-[#1A1A1A] border border-[#C9A96B]/30 rounded-sm mb-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-[#F7F2EA] text-sm">Package Total with GST</p>
                    <p className="font-mono text-[10px] text-[#DDD0B8] mt-1 font-medium">
                      {result.packageSessions} sessions · {result.months} months validity
                    </p>
                  </div>
                  <span className="font-display font-bold text-[#D4B87A] italic text-2xl lg:text-3xl leading-none">
                    {fmtINR(result.totalWithGst)}
                  </span>
                </div>
              </div>

              {/* Fine-print disclaimer — High Visibility Contrast Fix */}
              <div className="flex items-start gap-2.5 p-3 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm">
                <Info size={14} className="text-[#8B6914] flex-shrink-0 mt-0.5" />
                <p className="font-mono text-[10.5px] text-[#3E2F1F] leading-relaxed font-medium">
                  Billed monthly after classes. Security deposit is refundable upon term completion. Unused sessions lapse at end of package validity.
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-[#5C450C] font-mono text-sm">
              Select options to calculate
            </div>
          )}
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

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">

        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
          <SectionLabel className="justify-center">Pricing</SectionLabel>
          <h2
            className="font-display font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
          >
            Flexible Packages.{' '}
            <span className="text-[#8B6914] italic">Designed Around Your Teaching.</span>
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
                    ₹{et.ratePerSeat}
                  </span>
                  <span className="font-body text-[#3E2F1F] text-xs font-semibold">/ seat / session</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Package cards — 4 tiers (Starter, Standard, Half-Yearly, Annual) */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12" delay={0.08}>
          {PACKAGES.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <PkgCard pkg={pkg} eduType={activeType} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Cost Calculator */}
        <AnimatedSection delay={0.12}>
          <Calculator defaultCapacity={defaultCapacity} />
        </AnimatedSection>
      </div>
    </section>
  );
}
