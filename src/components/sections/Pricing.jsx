import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Info, ChevronDown } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { EDUCATOR_TYPES, PACKAGES, calculatePricing, getMinBillable } from '../../data/pricing';
import { cabins } from '../../data/cabins';

const HIGHLIGHT_PKG = 'halfyearly';

/* ─── Format helpers ── */
const fmtINR  = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—';
const fmtDec  = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

/* ─── Package card ── */
function PkgCard({ pkg, eduType }) {
  const isHL = pkg.id === HIGHLIGHT_PKG;
  const rate = EDUCATOR_TYPES.find(e => e.id === eduType)?.ratePerSeat ?? 250;
  const disc = (rate * (1 - pkg.discount)).toFixed(0);

  return (
    <div className={`relative p-6 rounded-sm border flex flex-col h-full transition-all duration-200 ${
      isHL ? 'border-[#C9A96B] bg-[#FFFDF8] shadow-lg shadow-[#C9A96B]/12'
           : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#C9A96B]/50 hover:shadow-md'
    }`}>
      {isHL && (
        <div className="absolute -top-3 left-5">
          <span className="bg-[#C9A96B] text-[#1A1A1A] font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded-sm font-bold">
            Best Value
          </span>
        </div>
      )}

      <p className={`font-mono text-[9px] tracking-[0.22em] uppercase mb-2 ${isHL ? 'text-[#C9A96B]' : 'text-[#7A6A50]'}`}>
        {pkg.label}
      </p>

      {pkg.discount > 0 ? (
        <>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="font-display font-bold text-[#1A1A1A] italic" style={{ fontSize: '2.4rem', lineHeight: 1 }}>
              {(pkg.discount * 100).toFixed(0)}%
            </span>
            <span className="font-body text-[#7A6A50] text-sm">off</span>
          </div>
          <p className="font-mono text-xs text-[#7A6A50] mb-1">₹{disc} / seat / session</p>
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display font-bold text-[#1A1A1A] italic" style={{ fontSize: '2rem', lineHeight: 1 }}>₹{disc}</span>
          </div>
          <p className="font-mono text-xs text-[#7A6A50] mb-1">per seat per session</p>
        </>
      )}

      <div className="border-t border-[#DDD0B8] mt-4 pt-4 flex flex-col gap-2 flex-1">
        {pkg.sessions > 1 && (
          <div className="flex justify-between text-xs">
            <span className="font-body text-[#7A6A50]">Sessions</span>
            <span className="font-mono text-[#1A1A1A] font-medium">{pkg.sessions}</span>
          </div>
        )}
        {pkg.months && (
          <div className="flex justify-between text-xs">
            <span className="font-body text-[#7A6A50]">Validity</span>
            <span className="font-mono text-[#1A1A1A]">{pkg.months} months</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="font-body text-[#7A6A50]">Rate / seat</span>
          <span className="font-mono text-[#1A1A1A]">₹{disc}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-body text-[#7A6A50]">Security deposit</span>
          <span className={`font-mono text-[10px] ${pkg.deposit ? 'text-[#C9A96B]' : 'text-[#7A6A50]'}`}>
            {pkg.deposit ? 'Refundable' : 'None'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        {['Pay after teaching', 'Min. 60% seats billed',
          pkg.discount > 0 ? `${(pkg.discount * 100).toFixed(0)}% discount` : 'No lock-in'].map(t => (
          <div key={t} className="flex items-center gap-2 text-[10px] text-[#7A6A50]">
            <Check size={10} className={isHL ? 'text-[#C9A96B]' : 'text-[#A89880]'} />{t}
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
  const [students, setStudents] = useState(5);
  const [result,   setResult]   = useState(null);

  useEffect(() => { if (defaultCapacity) setCabinCap(defaultCapacity); }, [defaultCapacity]);
  useEffect(() => {
    const cap = Number(cabinCap);
    setStudents(s => Math.min(Number(s), cap));
  }, [cabinCap]);
  useEffect(() => {
    setResult(calculatePricing({ educatorType: eduType, cabinCapacity: Number(cabinCap), packageId: pkgId, numStudents: Number(students) }));
  }, [eduType, cabinCap, pkgId, students]);

  const selCls = "w-full bg-[#F7F2EA] border border-[#DDD0B8] text-[#1A1A1A] font-body text-sm px-4 py-3 rounded-sm appearance-none focus:outline-none focus:border-[#C9A96B] transition-colors cursor-pointer";

  return (
    <div className="grid lg:grid-cols-2 border border-[#DDD0B8] rounded-sm overflow-hidden shadow-lg shadow-[#C9A96B]/6">

      {/* Inputs */}
      <div className="p-6 lg:p-8 bg-[#F7F2EA] border-b lg:border-b-0 lg:border-r border-[#DDD0B8]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-[#C9A96B]" />
          <h3 className="font-display font-bold text-[#1A1A1A] text-lg">Price Your Sessions</h3>
        </div>

        <div className="flex flex-col gap-5">
          {/* Educator type toggle */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] mb-2">Who are you teaching?</p>
            <div className="grid grid-cols-2 gap-2">
              {EDUCATOR_TYPES.map(et => (
                <button key={et.id} onClick={() => setEduType(et.id)}
                  className={`p-3 rounded-sm border text-left transition-all ${
                    eduType === et.id ? 'border-[#C9A96B] bg-[#C9A96B]/8' : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#C9A96B]/40'
                  }`}>
                  <p className={`font-body font-semibold text-sm ${eduType === et.id ? 'text-[#1A1A1A]' : 'text-[#7A6A50]'}`}>{et.label}</p>
                  <p className={`font-mono text-[10px] mt-0.5 ${eduType === et.id ? 'text-[#C9A96B]' : 'text-[#A89880]'}`}>₹{et.ratePerSeat}/seat/session</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cabin */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] mb-2">Cabin size</p>
            <div className="relative">
              <select value={cabinCap} onChange={e => setCabinCap(e.target.value)} className={selCls}>
                {cabins.map(c => (
                  <option key={c.id} value={c.capacity}>
                    {c.name} — {c.capacity} seats (min. {getMinBillable(c.capacity)} billed)
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A50] pointer-events-none" />
            </div>
          </div>

          {/* Package */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] mb-2">Package</p>
            <div className="relative">
              <select value={pkgId} onChange={e => setPkgId(e.target.value)} className={selCls}>
                {PACKAGES.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.label}{p.discount > 0 ? ` — ${(p.discount*100).toFixed(0)}% off` : ''}{p.sessions > 1 ? ` · ${p.sessions} sessions` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A50] pointer-events-none" />
            </div>
          </div>

          {/* Students slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50]">Number of students</p>
              <span className="font-display font-bold text-[#C9A96B] italic text-lg leading-none">{students}</span>
            </div>
            <input type="range" min={1} max={Number(cabinCap)} value={students}
              onChange={e => setStudents(e.target.value)}
              className="w-full h-1 cursor-pointer rounded-full" style={{ accentColor: '#C9A96B' }} />
            {result && Number(students) < result.minBillable && (
              <p className="font-mono text-[9px] text-[#C9A96B] mt-1.5">
                ⚠ Minimum {result.minBillable} seats billed for this cabin.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 lg:p-8 bg-[#F7F2EA]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-[#C9A96B]" />
          <h3 className="font-display font-bold text-[#1A1A1A] text-lg">Cost Breakdown</h3>
        </div>

        {result ? (
          <>
            <div className="flex flex-col gap-0 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm overflow-hidden mb-4">
              {[
                { label: 'Seats billed / session', value: `${result.seatsForBilling} of ${cabinCap}`,
                  note: result.seatsForBilling > Number(students) ? `Min. billing: ${result.minBillable} seats` : null },
                { label: 'Discounted rate / seat',  value: fmtDec(result.discountedRate),
                  note: result.discount > 0 ? `${(result.discount*100).toFixed(0)}% off ₹${result.baseRate}` : null },
                { label: 'Cost per session',         value: fmtINR(result.perSession) },
                { label: 'Cost per student',         value: fmtDec(result.costPerStudent) },
                { label: `Package total (${result.packageSessions} session${result.packageSessions > 1 ? 's' : ''}, excl. GST)`,
                  value: fmtINR(result.packageTotal), bold: true },
                { label: 'GST at 18%',              value: fmtINR(result.gst) },
              ].map(row => (
                <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-3 border-b border-[#DDD0B8] last:border-0">
                  <div>
                    <span className={`font-body text-sm ${row.bold ? 'text-[#1A1A1A] font-semibold' : 'text-[#7A6A50]'}`}>{row.label}</span>
                    {row.note && <p className="font-mono text-[9px] text-[#C9A96B] mt-0.5">{row.note}</p>}
                  </div>
                  <span className={`font-mono text-sm whitespace-nowrap flex-shrink-0 ${row.bold ? 'text-[#1A1A1A] font-semibold' : 'text-[#7A6A50]'}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Grand total */}
            <div className="p-4 bg-[#1A1A1A] border border-[#C9A96B]/20 rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-[#F7F2EA] text-sm">Total with GST</p>
                  <p className="font-mono text-[9px] text-[#7A6A50] mt-1">
                    {result.isPAYG ? '1 session (pay as you go)' : `${result.packageSessions} sessions · ${result.months} months`}
                    {result.hasDeposit ? ' · refundable deposit req.' : ''}
                  </p>
                </div>
                <span className="font-display font-bold text-[#C9A96B] italic" style={{ fontSize: '1.9rem', lineHeight: 1 }}>
                  {fmtINR(result.totalWithGst)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-3">
              <Info size={11} className="text-[#A89880] flex-shrink-0 mt-0.5" />
              <p className="font-mono text-[9px] text-[#A89880] leading-relaxed">
                Billed monthly after classes. Unused sessions lapse at end of validity. Security deposit is refundable.
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-48 text-[#A89880] font-mono text-sm">
            Select options to calculate
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Pricing section ── */
export function Pricing({ defaultCapacity }) {
  const [activeType, setActiveType] = useState('adult');

  return (
    <section id="pricing" className="section-pad bg-[#F7F2EA] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,169,107,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">

        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-8">
          <SectionLabel className="justify-center">Pricing</SectionLabel>
          <h2 className="font-display font-bold text-[#1A1A1A] leading-[1.06] tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}>
            Flexible Pricing.{' '}
            <em className="not-italic text-gradient">Designed Around Your Teaching.</em>
          </h2>
          <p className="font-body text-[#7A6A50] text-sm font-light leading-relaxed">
            All prices exclude GST at 18%. Billed monthly after you have taught — collect from your students first.
          </p>
        </AnimatedSection>

        {/* Base rates */}
        <AnimatedSection className="mb-8" delay={0.05}>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {EDUCATOR_TYPES.map(et => (
              <div key={et.id}
                onClick={() => setActiveType(et.id)}
                className={`p-5 border rounded-sm cursor-pointer transition-all ${
                  activeType === et.id ? 'border-[#C9A96B] bg-[#C9A96B]/6 shadow-md' : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#C9A96B]/40'
                }`}>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#7A6A50] mb-1">{et.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-[#1A1A1A] italic" style={{ fontSize: '2.2rem', lineHeight: 1 }}>₹{et.ratePerSeat}</span>
                  <span className="font-body text-[#7A6A50] text-xs">/ seat / session</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Package cards */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10" delay={0.08}>
          {PACKAGES.map(pkg => (
            <StaggerItem key={pkg.id}>
              <PkgCard pkg={pkg} eduType={activeType} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Conditions */}
        <AnimatedSection className="mb-12">
          <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📊', title: 'Min. 60% billing', text: 'Even with fewer students, you are billed for at least 60% of cabin capacity per session (rounded up).' },
              { icon: '💳', title: 'Refundable deposit', text: 'Standard, Half-Yearly and Annual packages require a refundable security deposit.' },
              { icon: '⏳', title: 'Session validity', text: 'Unused sessions lapse at the end of the validity period and do not carry forward.' },
              { icon: '📅', title: 'Monthly billing', text: 'You are billed at the end of each month for sessions taught — not upfront.' },
            ].map(n => (
              <div key={n.title} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{n.icon}</span>
                  <p className="font-display font-semibold text-[#1A1A1A] text-sm">{n.title}</p>
                </div>
                <p className="font-body text-[#7A6A50] text-xs leading-relaxed font-light">{n.text}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Calculator */}
        <AnimatedSection>
          <div className="mb-5">
            <SectionLabel>Interactive Calculator</SectionLabel>
            <h3 className="font-display font-bold text-[#1A1A1A] text-2xl">Calculate Your Exact Cost</h3>
            <p className="font-body text-[#7A6A50] text-sm mt-1 font-light">
              Uses the exact billing rules from Mentors Studio — minimum seats, package discounts and GST included.
            </p>
          </div>
          <Calculator defaultCapacity={defaultCapacity} />
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="mt-10 text-center">
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-[#F7F2EA] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#3E2F1F] transition-colors">
            Book Your Space — No Upfront Fees
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
