import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Info, Calculator as CalcIcon, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { getPricingProductSchemas, getFAQSchema } from '../components/seo/schema';
import { EDUCATOR_TYPES, PACKAGES, calculatePricing, getMinBillable } from '../data/pricing';
import { cabins } from '../data/cabins';
import { FAQS } from '../data/faqs';

const packageHighlight = 'halfyearly';

// Pricing specific FAQ subset
const pricingFaqs = FAQS.filter(f =>
  ['pricing-cost', 'deposit', 'booking-options', 'min-billing-calculation'].includes(f.id)
);

function PricingCard({ pkg, educatorType, isActive, onClick }) {
  const isHighlighted = pkg.id === packageHighlight;
  const rate = EDUCATOR_TYPES.find(e => e.id === educatorType)?.ratePerSeat ?? 250;
  const discounted = (rate * (1 - pkg.discount)).toFixed(0);

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-sm border flex flex-col cursor-pointer transition-all duration-200 ${
        isHighlighted
          ? 'border-[#C9A96B] bg-[#C9A96B]/5 shadow-md shadow-[#C9A96B]/10'
          : isActive
          ? 'border-[#C9A96B]/50 bg-[#C9A96B]/3'
          : 'border-[#3A3228] bg-[#1A1A1A] hover:border-[#C9A96B]/30'
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-6">
          <span className="bg-[#C9A96B] text-[#1A1A1A] font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-sm font-bold">
            Best Value
          </span>
        </div>
      )}

      <p className={`font-mono text-xs tracking-[0.15em] uppercase mb-2 ${isHighlighted ? 'text-[#C9A96B]' : 'text-[#A89880]'}`}>
        {pkg.label}
      </p>

      {pkg.discount > 0 ? (
        <div className="mb-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-[#F7F2EA] text-4xl">{(pkg.discount * 100).toFixed(0)}%</span>
            <span className="font-body text-[#A89880] text-sm">off</span>
          </div>
          <p className="font-mono text-sm text-[#C9A96B] mt-1">₹{discounted}/seat/session</p>
        </div>
      ) : (
        <div className="mb-1">
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-[#F7F2EA] text-4xl">₹{discounted}</span>
          </div>
          <p className="font-mono text-xs text-[#A89880] mt-1">per seat per session</p>
        </div>
      )}

      <div className="border-t border-[#3A3228] my-4 pt-4 flex flex-col gap-2.5 text-sm flex-1">
        {pkg.sessions > 1 && (
          <div className="flex items-center justify-between">
            <span className="font-body text-[#A89880]">Sessions</span>
            <span className="font-mono text-[#F7F2EA]">{pkg.sessions}</span>
          </div>
        )}
        {pkg.months && (
          <div className="flex items-center justify-between">
            <span className="font-body text-[#A89880]">Validity</span>
            <span className="font-mono text-[#F7F2EA]">{pkg.months} months</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-body text-[#A89880]">Rate / seat</span>
          <span className="font-mono text-[#F7F2EA]">₹{discounted}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-[#A89880]">Security deposit</span>
          <span className={`font-mono text-xs ${pkg.deposit ? 'text-[#C9A96B]' : 'text-[#A89880]'}`}>
            {pkg.deposit ? 'Refundable' : 'None'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {[
          'Pay after you teach',
          'Min. 60% seats billed',
          pkg.discount > 0 ? `${(pkg.discount * 100).toFixed(0)}% discount` : 'No lock-in',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs text-[#A89880]">
            <Check size={11} className={isHighlighted ? 'text-[#C9A96B]' : 'text-[#A89880]'} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Calculator({ defaultPackage }) {
  const [educatorType, setEducatorType] = useState('adult');
  const [cabinCapacity, setCabinCapacity] = useState(10);
  const [packageId, setPackageId] = useState(defaultPackage || 'standard');
  const [numStudents, setNumStudents] = useState(8);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (defaultPackage) setPackageId(defaultPackage);
  }, [defaultPackage]);

  useEffect(() => {
    const r = calculatePricing({ educatorType, cabinCapacity: Number(cabinCapacity), packageId, numStudents: Number(numStudents) });
    setResult(r);
  }, [educatorType, cabinCapacity, packageId, numStudents]);

  const fmt = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—';
  const fmtD = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

  const rows = result ? [
    { label: 'Seats billed / session', value: `${result.seatsForBilling} seats`, note: result.seatsForBilling > numStudents ? `Min. billing of ${result.minBillable} seats applied` : null },
    { label: 'Base rate / seat', value: `₹${result.baseRate}` },
    { label: 'Discount', value: result.discount > 0 ? `${(result.discount * 100).toFixed(0)}%` : 'None' },
    { label: 'Discounted rate / seat', value: fmtD(result.discountedRate) },
    { label: 'Cost per session', value: fmt(result.perSession) },
    { label: 'Your cost per student', value: fmtD(result.costPerStudent) },
    { label: `Subtotal (${result.packageSessions} session${result.packageSessions > 1 ? 's' : ''}, excl. GST)`, value: fmt(result.packageTotal), bold: true },
    { label: 'GST at 18%', value: fmt(result.gst) },
  ] : [];

  return (
    <div className="grid lg:grid-cols-2 gap-0 border border-[#3A3228] rounded-sm overflow-hidden bg-[#1A1A1A]">
      {/* Inputs */}
      <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-[#3A3228]">
        <div className="flex items-center gap-2 mb-7">
          <CalcIcon size={16} className="text-[#C9A96B]" />
          <h3 className="font-display font-semibold text-[#F7F2EA] text-lg">Price Your Sessions</h3>
        </div>

        <div className="flex flex-col gap-6">
          {/* Educator type */}
          <div>
            <label className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#A89880] block mb-2">Who are you teaching?</label>
            <div className="grid grid-cols-2 gap-2">
              {EDUCATOR_TYPES.map((et) => (
                <button
                  key={et.id}
                  onClick={() => setEducatorType(et.id)}
                  className={`p-3 rounded-sm border text-left transition-all ${
                    educatorType === et.id ? 'border-[#C9A96B] bg-[#C9A96B]/8' : 'border-[#3A3228] hover:border-[#C9A96B]/40'
                  }`}
                >
                  <p className={`font-display font-semibold text-sm ${educatorType === et.id ? 'text-[#F7F2EA]' : 'text-[#A89880]'}`}>{et.label}</p>
                  <p className={`font-mono text-xs mt-0.5 ${educatorType === et.id ? 'text-[#C9A96B]' : 'text-[#A89880]'}`}>₹{et.ratePerSeat}/seat/session</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cabin */}
          <div>
            <label className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#A89880] block mb-2">Cabin</label>
            <div className="relative">
              <select
                value={cabinCapacity}
                onChange={(e) => { setCabinCapacity(e.target.value); setNumStudents(Math.min(Number(numStudents), Number(e.target.value))); }}
                className="w-full bg-[#F7F2EA] border border-[#DDD0B8] text-[#1A1A1A] font-body text-sm px-4 py-3 rounded-sm appearance-none cursor-pointer focus:outline-none focus:border-[#C9A96B]"
              >
                {cabins.map((c) => (
                  <option key={c.id} value={c.capacity}>{c.name} — {c.capacity} seats (min. {getMinBillable(c.capacity)} billed)</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] pointer-events-none" />
            </div>
          </div>

          {/* Package */}
          <div>
            <label className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#A89880] block mb-2">Package</label>
            <div className="relative">
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#3A3228] text-[#F7F2EA] font-body text-sm px-4 py-3 rounded-sm appearance-none cursor-pointer focus:outline-none focus:border-[#C9A96B]"
              >
                {PACKAGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}{p.discount > 0 ? ` — ${(p.discount * 100).toFixed(0)}% off` : ''}{p.sessions > 1 ? ` · ${p.sessions} sessions` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] pointer-events-none" />
            </div>
          </div>

          {/* Students slider */}
          <div>
            <label className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#A89880] block mb-3">
              Students in a typical session — <span className="text-[#C9A96B]">{numStudents}</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={Number(cabinCapacity)}
                value={numStudents}
                onChange={(e) => setNumStudents(e.target.value)}
                className="flex-1 h-1 cursor-pointer rounded-full"
                style={{ accentColor: '#C9A96B' }}
              />
              <div className="w-14 h-10 bg-[#1A1A1A] border border-[#3A3228] rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-[#F7F2EA] text-lg">{numStudents}</span>
              </div>
            </div>
            {result && Number(numStudents) < result.minBillable && (
              <p className="font-mono text-[10px] text-[#C9A96B] mt-2">
                Min. {result.minBillable} seats billed regardless.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6 lg:p-8">
        <h3 className="font-display font-semibold text-[#F7F2EA] text-lg mb-6">Cost Breakdown</h3>
        {result ? (
          <div className="flex flex-col gap-0">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 py-3 border-b border-[#3A3228]">
                <div>
                  <span className={`font-body text-sm ${row.bold ? 'text-[#F7F2EA] font-medium' : 'text-[#A89880]'}`}>{row.label}</span>
                  {row.note && <p className="font-mono text-[10px] text-[#C9A96B] mt-0.5">{row.note}</p>}
                </div>
                <span className={`font-mono text-sm whitespace-nowrap ${row.bold ? 'text-[#F7F2EA]' : 'text-[#7A6A50]'}`}>{row.value}</span>
              </div>
            ))}

            {/* Grand total */}
            <div className="mt-4 p-4 bg-[#C9A96B]/8 border border-[#C9A96B]/30 rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-[#F7F2EA] text-base">Total with GST</p>
                  <p className="font-mono text-[10px] text-[#A89880] mt-0.5">
                    {result.packageSessions > 1 ? `${result.packageSessions} sessions · ${result.months} months` : '1 session'}
                    {result.hasDeposit ? ' · refundable deposit required' : ''}
                  </p>
                </div>
                <span className="font-display font-bold text-[#C9A96B] text-3xl">{fmt(result.totalWithGst)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-3">
              <Info size={12} className="text-[#A89880] flex-shrink-0 mt-0.5" />
              <p className="font-mono text-[10px] text-[#A89880] leading-relaxed">
                Billed monthly after teaching. Unused sessions lapse at end of validity. Deposit is refundable.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[#A89880] font-mono text-sm text-center py-16">Select options to calculate</p>
        )}
      </div>
    </div>
  );
}

export function PricingPage() {
  const [activeType, setActiveType] = useState('adult');
  const [activePackage, setActivePackage] = useState('standard');

  const schemas = [
    ...getPricingProductSchemas(),
    getFAQSchema(pricingFaqs),
  ];

  return (
    <div className="bg-premium-dark min-h-screen">
      <SEO
        title="Classroom Rental Pricing — Pay Per Seat, No Deposit | Mentors Studio"
        description="Transparent per-seat, per-session pricing for classroom rental in Gurugram. Pay-as-you-go or save up to 20% with Starter, Standard, Half-Yearly and Annual packages."
        canonicalPath="/pricing"
        schema={schemas}
        breadcrumbs={[{ name: 'Pricing', path: '/pricing' }]}
      />

      <PageHero
        label="Pricing & Packages"
        title="Simple, Transparent Classroom Rental Pricing"
        subtitle="Pay per seat, per session. Choose a commitment package that matches your teaching schedule and unlock volume discounts up to 20%. Billed monthly in arrears after you teach — never upfront lock-in."
        image="/images/classroom-seminar.png"
        cta={{ label: 'Calculate Your Batch Cost', to: '#calculator' }}
      />

      <Breadcrumbs items={[{ name: 'Pricing & Packages' }]} />

      {/* Base rates */}
      <div className="bg-[#231F1B] border-b border-[#3A3228]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row gap-4">
              {EDUCATOR_TYPES.map((et) => (
                <div
                  key={et.id}
                  onClick={() => setActiveType(et.id)}
                  className={`flex-1 p-5 border rounded-sm cursor-pointer transition-all ${
                    activeType === et.id ? 'border-[#C9A96B] bg-[#C9A96B]/5' : 'border-[#3A3228] hover:border-[#C9A96B]/30'
                  }`}
                >
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#A89880] mb-1">{et.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-[#F7F2EA] text-4xl">₹{et.ratePerSeat}</span>
                    <span className="font-body text-[#A89880] text-sm">/ seat / session</span>
                  </div>
                  <p className="font-mono text-xs text-[#A89880] mt-1">1 hour · excl. GST</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Content Depth: Pricing Model & Billing Economics (150-300 words) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-4">
        <div className="bg-[#1A1A1A] border border-[#3A3228] rounded-sm p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#C9A96B]" />
            <h2 className="font-display font-bold text-[#F7F2EA] text-xl">
              Pay-Per-Seat Economics: Only Pay for What Your Batch Consumes
            </h2>
          </div>
          <p className="font-body text-[#A89880] text-sm lg:text-base leading-relaxed font-light mb-4">
            Traditional coaching room rentals in Gurugram demand fixed monthly leases between ₹35,000 and ₹75,000 regardless of student turnout. Mentors Studio replaces that liability with an educator-first variable model: you pay strictly per seat, per session, billed monthly in arrears. You collect tuition fees from your students first throughout the month, then settle your classroom invoice with zero cashflow strain.
          </p>
          <p className="font-body text-[#A89880] text-sm lg:text-base leading-relaxed font-light mb-4">
            To reserve a dedicated room, every cabin requires a reasonable 60% minimum billable capacity (rounded up). In an 8-seat cabin, the minimum bill is 5 seats; in a 10-seat cabin, it is 6 seats; in our 24-seat seminar hall, it is 15 seats. If 7 students attend your 10-seat session, you pay for 7 seats; if 4 attend, you pay the 6-seat baseline. With packages offering up to 20% savings, educators run high-margin batches without ever risking lease penalties.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono">
            <Link to="/spaces" className="text-[#C9A96B] hover:text-[#F7F2EA] font-semibold inline-flex items-center gap-1">
              Explore 9 cabin layouts & capacities <ArrowRight size={12} />
            </Link>
            <span className="text-[#3A3228]">·</span>
            <Link to="/faq" className="text-[#C9A96B] hover:text-[#F7F2EA] font-semibold inline-flex items-center gap-1">
              Read billing & deposit FAQs <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <AnimatedSection className="mb-10">
          <SectionLabel>Packages</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-2xl mb-2">Choose your commitment, earn a discount.</h2>
          <p className="font-body text-[#A89880] text-sm">Click a package to use it in the calculator below.</p>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {PACKAGES.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <PricingCard
                pkg={pkg}
                educatorType={activeType}
                isActive={activePackage === pkg.id}
                onClick={() => setActivePackage(pkg.id)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Important notes */}
      <section className="bg-[#231F1B] border-y border-[#3A3228] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A89880] mb-5">Important pricing conditions</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '📊', title: 'Minimum 60% billing', desc: 'Even if fewer students attend, you are billed for at least 60% of cabin capacity per session, rounded up.' },
                { icon: '💳', title: 'Refundable deposit', desc: 'The Standard, Half-Yearly and Annual packages require a security deposit, returned 100% when you complete the term.' },
                { icon: '⏳', title: 'Session validity', desc: 'Package sessions remain valid across the allocated months (2, 3, 6, or 12 months) for predictable scheduling.' },
                { icon: '📅', title: 'Monthly billing', desc: 'Receive a consolidated GST invoice at the end of each month. Collect from your students first, then pay.' },
              ].map((note) => (
                <div key={note.title} className="p-4 border border-[#3A3228] rounded-sm bg-[#1A1A1A]">
                  <span className="text-2xl mb-3 block">{note.icon}</span>
                  <h4 className="font-display font-semibold text-[#F7F2EA] text-sm mb-2">{note.title}</h4>
                  <p className="font-body text-[#A89880] text-xs leading-relaxed">{note.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="max-w-7xl mx-auto px-6 lg:px-8 py-16 scroll-mt-24">
        <AnimatedSection className="mb-8">
          <SectionLabel>Calculator</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-2xl">Calculate your exact cost</h2>
          <p className="font-body text-[#A89880] text-sm mt-2">All calculations follow the actual billing rules — minimum seats, discounts and GST included.</p>
        </AnimatedSection>
        <AnimatedSection>
          <Calculator defaultPackage={activePackage} />
        </AnimatedSection>
      </section>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-[#1A1A1A] border border-[#C9A96B]/20 rounded-sm p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-[#F7F2EA] text-xl mb-2">Ready to book your classroom slots?</h3>
            <p className="font-body text-[#A89880] text-sm">Schedule a personal walkthrough on Golf Course Extension Road. Our facility manager confirms your timetable before any commitment.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C9A96B] text-[#1A1A1A] font-display font-bold text-sm rounded-sm hover:bg-[#D4B87A] transition-colors flex-shrink-0"
          >
            Book Your Space
            <ArrowRight size={15} />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
