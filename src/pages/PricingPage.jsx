import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { getPricingProductSchemas, getFAQSchema } from '../components/seo/schema';
import { EDUCATOR_TYPES, PACKAGES } from '../data/pricing';
import { FAQS } from '../data/faqs';
import { Calculator } from '../components/pricing/Calculator';

const packageHighlight = 'elite';

// Pricing specific FAQ subset
const pricingFaqs = FAQS.filter(f =>
  ['pricing-cost', 'deposit', 'booking-options', 'min-billing-calculation'].includes(f.id)
);

const fmtRate = (n) => {
  if (n == null) return '—';
  const num = Number(n);
  return num % 1 === 0 ? `₹${num}` : `₹${num.toFixed(2)}`;
};

function PricingCard({ pkg, educatorType, isActive, onClick }) {
  const isElite = pkg.id === packageHighlight;
  const isSchool = educatorType === 'school';

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-sm border flex flex-col cursor-pointer transition-all duration-200 ${
        isElite
          ? 'border-[#C9A96B] bg-[#2E2319] text-[#F7F2EA] shadow-xl shadow-black/30 ring-1 ring-[#C9A96B]/60'
          : isActive
          ? 'border-[#C9A96B] bg-[#C9A96B]/8'
          : 'border-[#3A3228] bg-[#1A1A1A] hover:border-[#C9A96B]/40'
      }`}
    >
      {isElite && (
        <div className="absolute -top-3 right-5">
          <span className="bg-[#C9A96B] text-[#1A1A1A] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-sm font-bold shadow-sm">
            Best Value
          </span>
        </div>
      )}

      {/* Package Name */}
      <h3 className={`font-display font-bold text-2xl mb-2 ${isElite ? 'text-[#F7F2EA]' : 'text-[#F7F2EA]'}`}>
        {pkg.label}
      </h3>

      {/* Sessions & Duration */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`font-display font-bold text-4xl italic leading-none ${isElite ? 'text-[#D4B87A]' : 'text-[#C9A96B]'}`}>
          {pkg.sessions}
        </span>
        <div className="flex flex-col">
          <span className="font-body text-xs font-bold uppercase tracking-wide text-[#F7F2EA]">
            sessions
          </span>
          <span className="font-mono text-[11px] text-[#A89880]">
            {pkg.durationLabel}
          </span>
        </div>
      </div>

      {/* Discount Pill Badge */}
      <div className="mb-4">
        <span
          className={`inline-block font-mono text-xs font-bold tracking-wider px-3 py-1 rounded-xs ${
            isElite
              ? 'bg-[#C9A96B] text-[#1A1A1A]'
              : 'bg-[#C9A96B]/20 text-[#D4B87A] border border-[#C9A96B]/30'
          }`}
        >
          {pkg.discountLabel}
        </span>
      </div>

      {/* Deposit & Free Locker */}
      <div className="mb-4 flex flex-col gap-1 text-xs">
        <p className="font-body text-[#DDD0B8] font-medium">
          {pkg.depositPercent}% refundable deposit
        </p>
        {pkg.hasFreeLocker && (
          <p className="font-body font-bold text-[#D4B87A] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#D4B87A]" />
            + Free locker
          </p>
        )}
      </div>

      {/* Rates for School & Adult */}
      <div className="border-t border-[#3A3228] pt-4 mt-auto flex flex-col gap-2">
        <div className={`flex justify-between items-center text-xs sm:text-sm p-1.5 rounded-xs transition-colors ${
          isSchool ? 'bg-[#C9A96B]/20 font-bold text-[#F7F2EA]' : 'text-[#A89880]'
        }`}>
          <span>School</span>
          <span className="font-mono text-[#D4B87A]">{fmtRate(pkg.rates.school)}</span>
        </div>
        <div className={`flex justify-between items-center text-xs sm:text-sm p-1.5 rounded-xs transition-colors ${
          !isSchool ? 'bg-[#C9A96B]/20 font-bold text-[#F7F2EA]' : 'text-[#A89880]'
        }`}>
          <span>Adult</span>
          <span className="font-mono text-[#D4B87A]">{fmtRate(pkg.rates.adult)}</span>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-4 pt-3 border-t border-[#3A3228] flex flex-col gap-1.5">
        {[
          'Pay after you teach',
          'Min. 60% seats billed',
          pkg.discountLabel,
          `${pkg.depositPercent}% refundable deposit`,
          ...(pkg.hasFreeLocker ? ['Complimentary free locker'] : []),
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs text-[#EADCC8]">
            <Check size={11} className={isElite ? 'text-[#D4B87A]' : 'text-[#C9A96B]'} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingPage() {
  const [activeType, setActiveType] = useState('adult');
  const [activePackage, setActivePackage] = useState('starter');

  const schemas = [
    ...getPricingProductSchemas(),
    getFAQSchema(pricingFaqs),
  ];

  return (
    <div className="bg-premium-dark min-h-screen">
      <SEO
        title="Classroom Rental Pricing — Pay Per Seat, Transparent Packages | Mentors Studio"
        description="Transparent per-seat, per-session pricing for classroom rental in Gurugram. Save up to 15% with Starter, Growth, Pro and Elite packages with free locker inclusion."
        canonicalPath="/pricing"
        schema={schemas}
        breadcrumbs={[{ name: 'Pricing', path: '/pricing' }]}
      />

      <PageHero
        label="Pricing & Packages"
        title="Simple, Transparent Classroom Rental Pricing"
        subtitle="Pay per seat, per session. Choose a commitment package that matches your teaching schedule and unlock volume discounts up to 15%. Billed monthly in arrears after you teach — never upfront lock-in."
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
                    <span className="font-display font-bold text-[#F7F2EA] text-4xl">₹{et.baseRate}</span>
                    <span className="font-body text-[#A89880] text-sm">/ seat base rate</span>
                  </div>
                  <p className="font-mono text-xs text-[#A89880] mt-1">{et.id === 'school' ? '55 min' : '60 min'} · excl. GST</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Content Depth: Pricing Model & Billing Economics */}
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
            To reserve a dedicated room, every cabin requires a reasonable 60% minimum billable capacity (rounded up). In an 8-seat cabin, the minimum bill is 5 seats; in a 10-seat cabin, it is 6 seats; in our 24-seat seminar hall, it is 15 seats. If 7 students attend your 10-seat session, you pay for 7 seats; if 4 attend, you pay the 6-seat baseline. With packages offering up to 15% savings, educators run high-margin batches without ever risking lease penalties.
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
          <SectionLabel dark>Packages</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-2xl mb-2">Commit longer. Save more.</h2>
          <p className="font-body text-[#A89880] text-sm">Click a package to use it in the calculator below.</p>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        {/* Footer Note under Pricing Cards */}
        <AnimatedSection className="mt-6 mb-4">
          <div className="p-3.5 bg-[#2E2319] text-[#F7F2EA] rounded-full text-center shadow-lg max-w-4xl mx-auto border border-[#C9A96B]/30">
            <p className="font-display italic text-xs sm:text-sm tracking-wide">
              Billed monthly, after you teach · Deposits fully refundable · Unused sessions lapse at the end of validity
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Important notes */}
      <section className="bg-[#231F1B] border-y border-[#3A3228] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A89880] mb-5">Important pricing conditions</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '📊', title: 'Minimum 60% billing', desc: 'Even if fewer students attend, you are billed for at least 60% of cabin capacity per session, rounded up.' },
                { icon: '💳', title: 'Refundable deposit', desc: 'All packages include a refundable security deposit (Starter 20%, Growth 15%, Pro 12.5%, Elite 10% + Free locker), returned 100% when you complete the term.' },
                { icon: '⏳', title: 'Session validity', desc: 'Package sessions remain valid across the allocated duration (2, 3, 6, or 12 months) for predictable scheduling.' },
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

      {/* Calculator with Promo/Discount & Booking Handoff */}
      <section id="calculator" className="max-w-7xl mx-auto px-6 lg:px-8 py-16 scroll-mt-24">
        <AnimatedSection className="mb-8">
          <SectionLabel dark>Calculator</SectionLabel>
          <h2 className="font-display font-bold text-[#F7F2EA] text-2xl">Calculate your exact cost</h2>
          <p className="font-body text-[#A89880] text-sm mt-2">All calculations follow the actual billing rules — minimum seats, explicit package rates, deposit and GST included.</p>
        </AnimatedSection>
        <AnimatedSection>
          <Calculator theme="dark" defaultPackage={activePackage} />
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
