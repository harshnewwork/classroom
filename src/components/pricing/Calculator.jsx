import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Info,
  ChevronDown,
  Sparkles,
  Tag,
  ArrowRight,
  Calculator as CalcIcon,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { EDUCATOR_TYPES, PACKAGES, calculatePricing, getMinBillable } from '../../data/pricing';
import { cabins } from '../../data/cabins';
import {
  EARLY_BIRD_CONFIG,
  getOfferDateStatus,
} from '../../data/earlyBird';

/* ─── Format helpers ── */
const fmtRate = (n) => {
  if (n == null) return '—';
  const num = Number(n);
  return num % 1 === 0 ? `₹${num}` : `₹${num.toFixed(2)}`;
};

const fmtDec = (n) =>
  n != null ? `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

/**
 * Shared Calculator Component
 * Supports both theme="light" (for HomePage) and theme="dark" (for PricingPage).
 * Allows applying BOTH Package Discount AND Early Bird Offer (stackable discounts).
 */
export function Calculator({
  theme = 'light',
  defaultCapacity = 10,
  defaultPackage = 'starter',
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  // Calculator inputs
  const [eduType, setEduType] = useState('adult');
  const [cabinCap, setCabinCap] = useState(defaultCapacity || 10);
  const [pkgId, setPkgId] = useState(defaultPackage || 'starter');
  const [students, setStudents] = useState(6);

  // Sync defaultCapacity & defaultPackage changes during render
  const [prevCap, setPrevCap] = useState(defaultCapacity);
  if (defaultCapacity !== prevCap) {
    setPrevCap(defaultCapacity);
    setCabinCap(defaultCapacity);
    setStudents((s) => Math.min(Number(s), Number(defaultCapacity)));
  }

  const [prevPkg, setPrevPkg] = useState(defaultPackage);
  if (defaultPackage !== prevPkg) {
    setPrevPkg(defaultPackage);
    setPkgId(defaultPackage);
  }

  // Offer status (initialized lazily)
  const [offerStatus, setOfferStatus] = useState(() => getOfferDateStatus());

  // Independent discount flags:
  // selected = user checkbox choices in left panel (before hitting Apply)
  // applied = active in calculation / cost breakdown (after hitting Apply)
  const [selectedPkgDiscount, setSelectedPkgDiscount] = useState(true);
  const [selectedEarlyBird, setSelectedEarlyBird] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = new URLSearchParams(window.location.search);
        const status = getOfferDateStatus();
        if (p.get('discount') === 'earlybird' && status.active) return true;
      } catch {
        // ignore
      }
    }
    return false;
  });

  const [appliedPkgDiscount, setAppliedPkgDiscount] = useState(true);
  const [appliedEarlyBird, setAppliedEarlyBird] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');

  // Animation & micro-interaction state
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [pulseLineItems, setPulseLineItems] = useState(false);
  const [pulseTotalCard, setPulseTotalCard] = useState(false);
  const [calculatorHalo, setCalculatorHalo] = useState(false);
  const [bookHandoffSent, setBookHandoffSent] = useState(false);

  // Offer mode change listener
  useEffect(() => {
    const handleModeChange = () => {
      const status = getOfferDateStatus();
      setOfferStatus(status);

      if (!status.active) {
        setSelectedEarlyBird(false);
        setAppliedEarlyBird(false);
      }
    };

    window.addEventListener('ms-offer-mode-changed', handleModeChange);
    return () => window.removeEventListener('ms-offer-mode-changed', handleModeChange);
  }, []);

  // Listen for external trigger to pre-select Early Bird (from Floating button)
  useEffect(() => {
    const handlePreselect = () => {
      const status = getOfferDateStatus();
      if (status.active) {
        setSelectedEarlyBird(true);
        // Ensure package discount remains checked so BOTH are applied!
        setSelectedPkgDiscount(true);
        setCalculatorHalo(true);
        setTimeout(() => setCalculatorHalo(false), 2400);
      }
    };

    window.addEventListener('ms-select-discount', handlePreselect);
    return () => window.removeEventListener('ms-select-discount', handlePreselect);
  }, []);

  // Pricing calculation based on applied discounts
  const result = useMemo(() => {
    return calculatePricing({
      educatorType: eduType,
      cabinCapacity: Number(cabinCap),
      packageId: pkgId,
      numStudents: Number(students),
      applyPackageDiscount: appliedPkgDiscount,
      applyEarlyBird: appliedEarlyBird,
    });
  }, [eduType, cabinCap, pkgId, students, appliedPkgDiscount, appliedEarlyBird]);

  // Current package object
  const currentPkg = useMemo(() => {
    return PACKAGES.find((p) => p.id === pkgId) || PACKAGES[0];
  }, [pkgId]);

  // Live preview calculation based on pending selected discounts
  const previewCalculation = useMemo(() => {
    return calculatePricing({
      educatorType: eduType,
      cabinCapacity: Number(cabinCap),
      packageId: pkgId,
      numStudents: Number(students),
      applyPackageDiscount: selectedPkgDiscount,
      applyEarlyBird: selectedEarlyBird,
    });
  }, [eduType, cabinCap, pkgId, students, selectedPkgDiscount, selectedEarlyBird]);

  // Has pending discount changes
  const hasPendingChanges = useMemo(() => {
    return (
      selectedPkgDiscount !== appliedPkgDiscount ||
      selectedEarlyBird !== appliedEarlyBird
    );
  }, [selectedPkgDiscount, appliedPkgDiscount, selectedEarlyBird, appliedEarlyBird]);

  // Handle Apply button click
  const handleApplyDiscount = () => {
    if (selectedEarlyBird && !offerStatus.active) return;

    setAppliedPkgDiscount(selectedPkgDiscount);
    setAppliedEarlyBird(selectedEarlyBird);

    setIsAnimating(true);
    setShowSparkles(true);
    setPulseLineItems(true);
    setPulseTotalCard(true);

    setTimeout(() => {
      setShowSparkles(false);
      setPulseLineItems(false);
      setPulseTotalCard(false);
      setIsAnimating(false);
    }, 1200);
  };

  // Handle Book Your Space handoff
  const handleBookYourSpace = () => {
    if (!result) return;

    const cabinObj = cabins.find((c) => c.capacity === Number(cabinCap));
    const studentCategory = eduType === 'school' ? 'School students (Grade 5 and above)' : 'Adults';
    const cabinFormatted = cabinObj ? `${cabinObj.capacity} seats` : `${cabinCap} seats`;

    let discountSummary;
    if (appliedPkgDiscount && appliedEarlyBird) {
      discountSummary = currentPkg.discount > 0
        ? `Stacked: ${result.label} tier (${currentPkg.discountLabel}) + Early Bird (30% off)`
        : `Early Bird Offer (30% off)`;
    } else if (appliedEarlyBird) {
      discountSummary = `Early Bird Offer (30% off)`;
    } else if (appliedPkgDiscount) {
      discountSummary = `${result.label} tier (${result.discountLabel})`;
    } else {
      discountSummary = `No discount (Standard Base Rate)`;
    }

    const handoffPayload = {
      studentType: studentCategory,
      batchSize: String(students),
      cabinCapacity: cabinFormatted,
      packageLabel: `${result.label} — ${result.packageSessions} sessions (${result.durationLabel})`,
      discountApplied: discountSummary,
      ratePerSeat: fmtRate(result.ratePerSeat),
      quotedTotal: fmtDec(result.totalWithGst),
      timestamp: Date.now(),
    };

    setBookHandoffSent(true);
    setTimeout(() => setBookHandoffSent(false), 2000);

    // If on HomePage (where #booking is on the same page):
    const bookingEl = document.getElementById('booking');
    if (bookingEl && location.pathname === '/') {
      window.dispatchEvent(
        new CustomEvent('ms-calculator-booking-handoff', {
          detail: handoffPayload,
        })
      );
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on PricingPage (/pricing) or any other page, navigate to /contact or /#booking
      const queryParams = new URLSearchParams({
        from: 'calculator',
        studentType: handoffPayload.studentType,
        batchSize: handoffPayload.batchSize,
        cabinCapacity: handoffPayload.cabinCapacity,
        pkg: handoffPayload.packageLabel,
        discount: handoffPayload.discountApplied,
        rate: handoffPayload.ratePerSeat,
        total: handoffPayload.quotedTotal,
      });

      navigate(`/contact?${queryParams.toString()}`, {
        state: { calculatorQuote: handoffPayload },
      });
    }
  };

  /* ─── Style variants based on theme ── */
  const cardBorder = isDark ? 'border-[#3A3228]' : 'border-[#DDD0B8]';
  const leftBg = isDark ? 'bg-[#1A1A1A]' : 'bg-[#F7F2EA]';
  const rightBg = isDark ? 'bg-[#141210]' : 'bg-[#FFFDF9]';
  const textTitle = isDark ? 'text-[#F7F2EA]' : 'text-[#1A1A1A]';
  const textSub = isDark ? 'text-[#A89880]' : 'text-[#5C450C]';
  const textBody = isDark ? 'text-[#DDD0B8]' : 'text-[#3E2F1F]';
  const selectCls = isDark
    ? 'w-full bg-[#231F1B] border border-[#3A3228] text-[#F7F2EA] font-body text-sm px-4 py-3 rounded-sm appearance-none focus:outline-none focus:border-[#C9A96B] focus:ring-1 focus:ring-[#C9A96B] transition-colors cursor-pointer font-medium'
    : 'w-full bg-[#FFFFFF] border border-[#DDD0B8] text-[#1A1A1A] font-body text-sm px-4 py-3 rounded-sm appearance-none focus:outline-none focus:border-[#8B6914] focus:ring-1 focus:ring-[#8B6914] transition-colors cursor-pointer font-medium';

  return (
    <div
      id="cost-calculator"
      className={`relative grid lg:grid-cols-2 border ${cardBorder} rounded-sm overflow-hidden shadow-xl transition-all duration-500 ${
        calculatorHalo ? 'ring-3 ring-[#C9A96B] shadow-2xl shadow-[#C9A96B]/25' : ''
      }`}
    >
      {/* ─── LEFT PANEL: INPUTS & DISCOUNT ─── */}
      <div className={`p-6 lg:p-8 ${leftBg} border-b lg:border-b-0 lg:border-r ${cardBorder} flex flex-col justify-between`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-5 ${isDark ? 'bg-[#C9A96B]' : 'bg-[#8B6914]'}`} />
              <h3 className={`font-display font-bold ${textTitle} text-xl flex items-center gap-2`}>
                <CalcIcon size={18} className={isDark ? 'text-[#C9A96B]' : 'text-[#8B6914]'} />
                Price Your Sessions
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Educator Type Toggle */}
            <div>
              <p className={`font-mono text-[10px] tracking-[0.2em] uppercase ${textSub} mb-2 font-bold`}>
                Who are you teaching?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {EDUCATOR_TYPES.map((et) => {
                  const isSelected = eduType === et.id;
                  return (
                    <button
                      key={et.id}
                      type="button"
                      onClick={() => setEduType(et.id)}
                      className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-[#C9A96B] bg-[#C9A96B]/10 shadow-xs'
                            : 'border-[#8B6914] bg-[#FFFDF9] shadow-xs'
                          : isDark
                          ? 'border-[#3A3228] bg-[#231F1B] hover:border-[#C9A96B]/40'
                          : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#8B6914]/40'
                      }`}
                    >
                      <p className={`font-body font-bold text-sm ${isSelected ? textTitle : textBody}`}>
                        {et.label}
                      </p>
                      <p
                        className={`font-mono text-[10px] mt-0.5 font-semibold ${
                          isSelected
                            ? isDark
                              ? 'text-[#D4B87A]'
                              : 'text-[#8B6914]'
                            : textSub
                        }`}
                      >
                        ₹{et.baseRate}/seat base
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cabin Size Select */}
            <div>
              <p className={`font-mono text-[10px] tracking-[0.2em] uppercase ${textSub} mb-2 font-bold`}>
                Cabin size
              </p>
              <div className="relative">
                <select
                  value={cabinCap}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCabinCap(val);
                    setStudents((s) => Math.min(Number(s), val));
                  }}
                  className={selectCls}
                >
                  {cabins.map((c) => (
                    <option key={c.id} value={c.capacity}>
                      {c.name} — {c.capacity} seats (min. {getMinBillable(c.capacity)} billed)
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${textSub} pointer-events-none`}
                />
              </div>
            </div>

            {/* Package Select */}
            <div>
              <p className={`font-mono text-[10px] tracking-[0.2em] uppercase ${textSub} mb-2 font-bold`}>
                Package
              </p>
              <div className="relative">
                <select value={pkgId} onChange={(e) => setPkgId(e.target.value)} className={selectCls}>
                  {PACKAGES.map((p) => {
                    const rate = eduType === 'school' ? p.rates.school : p.rates.adult;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.label} ({p.discountLabel}) · {p.sessions} sessions · {fmtRate(rate)}/seat · {p.depositPercent}% deposit
                        {p.hasFreeLocker ? ' + Free Locker' : ''}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  size={14}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${textSub} pointer-events-none`}
                />
              </div>
            </div>

            {/* Students Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={`font-mono text-[10px] tracking-[0.2em] uppercase ${textSub} font-bold`}>
                  Number of students attending
                </p>
                <span className={`font-display font-bold ${isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'} italic text-xl leading-none`}>
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
                style={{ accentColor: isDark ? '#C9A96B' : '#8B6914' }}
              />
              {result && Number(students) < result.minBillable && (
                <p className={`font-mono text-[10px] ${isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'} mt-1.5 font-semibold`}>
                  ℹ Minimum {result.minBillable} seats billed for this cabin.
                </p>
              )}
            </div>

            {/* ─── 1. "APPLY A DISCOUNT" SECTION (STACKABLE DISCOUNTS) ─── */}
            <div className={`pt-5 mt-2 border-t ${cardBorder}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Tag size={13} className={isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'} />
                  <p className={`font-mono text-[10.5px] tracking-[0.2em] uppercase ${textSub} font-bold`}>
                    Apply a Discount
                  </p>
                </div>

                {appliedPkgDiscount && appliedEarlyBird ? (
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A96B] text-[#1A1A1A] animate-pulse flex items-center gap-1">
                    <Layers size={10} /> Both Discounts Active (Stacked)
                  </span>
                ) : appliedEarlyBird ? (
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A96B] text-[#1A1A1A] animate-pulse">
                    30% Early Bird Active
                  </span>
                ) : appliedPkgDiscount ? (
                  <span className={`font-mono text-[10px] font-medium ${textSub}`}>
                    {currentPkg.label} Tier Applied
                  </span>
                ) : (
                  <span className={`font-mono text-[10px] font-medium ${textSub}`}>
                    No Discount Applied
                  </span>
                )}
              </div>

              {/* Stackable Banner Notice */}
              <div className={`p-2 mb-2.5 rounded-xs border text-[10.5px] font-mono flex items-center gap-1.5 ${
                isDark ? 'bg-[#2E2319] border-[#C9A96B]/30 text-[#D4B87A]' : 'bg-[#FFF9EE] border-[#C9A96B]/60 text-[#8B6914]'
              }`}>
                <Sparkles size={12} className="flex-shrink-0" />
                <span>You can apply <strong>both</strong> the Package Tier Discount and Early Bird Offer together!</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Checkbox 1: Package Discount */}
                <label
                  onClick={() => setSelectedPkgDiscount((v) => !v)}
                  className={`p-3 rounded-sm border cursor-pointer flex items-start gap-3 transition-all ${
                    selectedPkgDiscount
                      ? isDark
                        ? 'border-[#C9A96B] bg-[#C9A96B]/10 shadow-xs'
                        : 'border-[#8B6914] bg-[#FFFDF9] shadow-xs'
                      : isDark
                      ? 'border-[#3A3228] bg-[#231F1B] hover:border-[#C9A96B]/30 opacity-75'
                      : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#8B6914]/30 opacity-75'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPkgDiscount}
                    onChange={(e) => setSelectedPkgDiscount(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 cursor-pointer w-4 h-4 rounded-xs"
                    style={{ accentColor: isDark ? '#C9A96B' : '#8B6914' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`font-body font-bold text-xs sm:text-sm ${textTitle}`}>
                        Package Tier Discount
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                          isDark ? 'bg-[#3E2F1F] text-[#D4B87A]' : 'bg-[#EADCC8] text-[#3E2F1F]'
                        }`}
                      >
                        {currentPkg.label} tier — {currentPkg.discount > 0 ? `${currentPkg.discountLabel} applied` : 'Standard rate'}
                      </span>
                    </div>
                    <p className={`font-mono text-[10.5px] ${textSub} mt-1 leading-relaxed`}>
                      {currentPkg.discount > 0
                        ? `Standard commitment savings baked into the ${currentPkg.label} package.`
                        : `Starter tier has no volume discount. Upgrade to Growth, Pro, or Elite for up to 15% off.`}
                    </p>
                  </div>
                </label>

                {/* Checkbox 2: Early Bird Offer (30% off) */}
                <label
                  onClick={() => {
                    if (offerStatus.active) setSelectedEarlyBird((v) => !v);
                  }}
                  className={`p-3 rounded-sm border flex items-start gap-3 transition-all ${
                    !offerStatus.active
                      ? 'opacity-60 cursor-not-allowed bg-stone-200/40 border-stone-300'
                      : selectedEarlyBird
                      ? isDark
                        ? 'border-[#C9A96B] bg-[#C9A96B]/10 shadow-xs cursor-pointer'
                        : 'border-[#8B6914] bg-[#FFFDF9] shadow-xs cursor-pointer'
                      : isDark
                      ? 'border-[#3A3228] bg-[#231F1B] hover:border-[#C9A96B]/30 cursor-pointer opacity-75'
                      : 'border-[#DDD0B8] bg-[#F7F2EA] hover:border-[#8B6914]/30 cursor-pointer opacity-75'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!offerStatus.active}
                    checked={selectedEarlyBird}
                    onChange={(e) => setSelectedEarlyBird(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 cursor-pointer w-4 h-4 rounded-xs"
                    style={{ accentColor: isDark ? '#C9A96B' : '#8B6914' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-body font-bold text-xs sm:text-sm ${textTitle}`}>
                          Early Bird Offer
                        </span>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#C9A96B] text-[#1A1A1A] shadow-xs">
                          30% OFF
                        </span>
                      </div>

                      {/* Date Guard Indicator */}
                      {offerStatus.status !== 'active' ? (
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                            offerStatus.status === 'upcoming'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {offerStatus.label}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-[#25D366] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                          Live Offer
                        </span>
                      )}
                    </div>

                    {/* Promo Code Input & Quick Apply Button */}
                    {offerStatus.active && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Promo code (e.g. EARLYBIRD30)"
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full font-mono text-xs px-2.5 py-1.5 rounded-xs border focus:outline-none focus:border-[#8B6914] ${
                              isDark
                                ? 'bg-[#1A1A1A] border-[#3A3228] text-[#F7F2EA]'
                                : 'bg-[#FFFFFF] border-[#DDD0B8] text-[#1A1A1A]'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPromoCodeInput('EARLYBIRD30');
                            setSelectedEarlyBird(true);
                          }}
                          className={`font-mono text-[10px] font-semibold px-2.5 py-1.5 rounded-xs border transition-colors cursor-pointer ${
                            isDark
                              ? 'border-[#C9A96B]/40 text-[#D4B87A] hover:bg-[#C9A96B]/20'
                              : 'border-[#8B6914]/40 text-[#8B6914] hover:bg-[#8B6914]/10'
                          }`}
                        >
                          Use Code
                        </button>
                      </div>
                    )}

                    {/* Inline Offer Terms */}
                    <p className={`font-mono text-[10px] ${textSub} mt-2 leading-relaxed font-medium`}>
                      {EARLY_BIRD_CONFIG.terms}
                    </p>
                  </div>
                </label>
              </div>

              {/* Apply Action Bar with Live Savings Preview */}
              <div
                className={`mt-3 p-3 rounded-sm border flex items-center justify-between gap-3 ${
                  isDark ? 'bg-[#231F1B] border-[#3A3228]' : 'bg-[#FFFFFF] border-[#DDD0B8]'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className={`font-mono text-[10px] uppercase ${textSub} font-bold`}>
                    Discount Preview
                  </span>
                  <span className={`font-mono text-xs sm:text-sm font-bold truncate ${
                    isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'
                  }`}>
                    {selectedPkgDiscount && selectedEarlyBird ? (
                      `You’ll save ₹${Math.round(previewCalculation.savingsVsBase).toLocaleString('en-IN')} (${currentPkg.label} + 30% Early Bird)`
                    ) : selectedEarlyBird ? (
                      `You’ll save ₹${Math.round(previewCalculation.savingsVsBase).toLocaleString('en-IN')} (30% off base)`
                    ) : selectedPkgDiscount ? (
                      previewCalculation.savingsVsBase > 0 ? (
                        `You’ll save ₹${Math.round(previewCalculation.savingsVsBase).toLocaleString('en-IN')} (${currentPkg.label} tier)`
                      ) : (
                        'Standard package rate (₹0 savings)'
                      )
                    ) : (
                      'Standard base rate (no discount)'
                    )}
                  </span>
                </div>

                <div className="relative flex-shrink-0">
                  <motion.button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={!hasPendingChanges && !isAnimating}
                    whileHover={{ scale: hasPendingChanges ? 1.03 : 1 }}
                    whileTap={{ scale: hasPendingChanges ? 0.97 : 1 }}
                    className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      hasPendingChanges
                        ? isDark
                          ? 'bg-[#C9A96B] text-[#1A1A1A] hover:bg-[#D4B87A] shadow-md ring-2 ring-[#C9A96B]/50'
                          : 'bg-[#8B6914] text-white hover:bg-[#6E5310] shadow-md ring-2 ring-[#8B6914]/40'
                        : isDark
                        ? 'bg-[#3A3228] text-[#A89880] cursor-default'
                        : 'bg-[#EADCC8] text-[#5C450C] cursor-default'
                    }`}
                  >
                    {!hasPendingChanges ? (
                      <>
                        <Check size={14} className={isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'} />
                        Applied
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Apply
                      </>
                    )}
                  </motion.button>

                  {/* ─── MICRO-INTERACTION CELEBRATION SPARKLES ─── */}
                  <AnimatePresence>
                    {showSparkles && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.6 }}
                        className="absolute -top-3 -right-3 pointer-events-none flex items-center justify-center"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#C9A96B] flex items-center justify-center text-[#1A1A1A] shadow-lg">
                          <Check size={14} className="stroke-[3]" />
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: COST BREAKDOWN & BOOKING HANDOFF ─── */}
      <div className={`p-6 lg:p-8 ${rightBg} flex flex-col justify-between`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-5 ${isDark ? 'bg-[#C9A96B]' : 'bg-[#8B6914]'}`} />
              <h3 className={`font-display font-bold ${textTitle} text-xl`}>
                Cost Breakdown
              </h3>
            </div>

            {appliedPkgDiscount && appliedEarlyBird ? (
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#C9A96B] text-[#1A1A1A] shadow-xs flex items-center gap-1">
                <Layers size={11} /> Both Discounts Applied
              </span>
            ) : appliedEarlyBird ? (
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-xs bg-[#C9A96B] text-[#1A1A1A] shadow-xs">
                30% Early Bird Active
              </span>
            ) : appliedPkgDiscount && currentPkg.discount > 0 ? (
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-xs bg-[#EADCC8] text-[#3E2F1F] shadow-xs">
                {currentPkg.label} Tier Discount
              </span>
            ) : null}
          </div>

          {result ? (
            <div className="flex flex-col">
              {/* Line Items Container */}
              <div
                className={`flex flex-col border ${cardBorder} rounded-sm overflow-hidden mb-5 transition-colors duration-500 ${
                  pulseLineItems
                    ? isDark
                      ? 'bg-[#C9A96B]/10 ring-1 ring-[#C9A96B]'
                      : 'bg-[#C9A96B]/15 ring-1 ring-[#8B6914]'
                    : isDark
                    ? 'bg-[#1A1A1A]'
                    : 'bg-[#F7F2EA]'
                }`}
              >
                {/* 1. Seats billed / session */}
                <div className={`flex items-start justify-between gap-4 px-4 py-2.5 border-b ${cardBorder}`}>
                  <div>
                    <span className={`font-body text-xs sm:text-sm ${textBody}`}>
                      Seats billed / session
                    </span>
                    {result.seatsForBilling > Number(students) && (
                      <p className={`font-mono text-[10px] ${isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'} font-medium mt-0.5`}>
                        Min. billing: {result.minBillable} seats
                      </p>
                    )}
                  </div>
                  <span className={`font-mono text-xs sm:text-sm whitespace-nowrap font-semibold ${textTitle}`}>
                    {result.seatsForBilling} of {cabinCap}
                  </span>
                </div>

                {/* 2. Rate per seat (with dynamic stacked discount badge) */}
                <div className={`flex items-start justify-between gap-4 px-4 py-2.5 border-b ${cardBorder}`}>
                  <div>
                    <span className={`font-body text-xs sm:text-sm ${textBody}`}>
                      Rate per seat
                    </span>
                    {/* Visual Tag for Rate line */}
                    <div className="mt-0.5">
                      {appliedPkgDiscount && appliedEarlyBird ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A96B]/25 text-[#8B6914] dark:text-[#D4B87A] border border-[#C9A96B]/50 animate-pulse">
                          🎉 {currentPkg.label} {currentPkg.discount > 0 ? `(${currentPkg.discountLabel}) ` : ''}+ Early Bird (30% off)
                        </span>
                      ) : appliedEarlyBird ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A96B]/25 text-[#8B6914] dark:text-[#D4B87A] border border-[#C9A96B]/50 animate-pulse">
                          🎉 Early Bird Applied — 30% OFF
                        </span>
                      ) : appliedPkgDiscount ? (
                        <p className={`font-mono text-[10px] ${textSub} font-medium`}>
                          {result.label} tier ({result.discountLabel})
                        </p>
                      ) : (
                        <p className={`font-mono text-[10px] ${textSub} font-medium`}>
                          Standard base rate (No discount)
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`font-mono text-xs sm:text-sm whitespace-nowrap font-bold ${
                    appliedEarlyBird
                      ? isDark
                        ? 'text-[#D4B87A]'
                        : 'text-[#8B6914]'
                      : textTitle
                  }`}>
                    <AnimatedNumber value={result.ratePerSeat} format="rate" />
                  </span>
                </div>

                {/* 3. Cost per session */}
                <div className={`flex items-start justify-between gap-4 px-4 py-2.5 border-b ${cardBorder}`}>
                  <span className={`font-body text-xs sm:text-sm ${textBody}`}>
                    Cost per session
                  </span>
                  <span className={`font-mono text-xs sm:text-sm whitespace-nowrap font-semibold ${textTitle}`}>
                    <AnimatedNumber value={result.perSession} format="rate" />
                  </span>
                </div>

                {/* 4. Cost per student */}
                <div className={`flex items-start justify-between gap-4 px-4 py-2.5 border-b ${cardBorder}`}>
                  <span className={`font-body text-xs sm:text-sm ${textBody}`}>
                    Cost per student
                  </span>
                  <span className={`font-mono text-xs sm:text-sm whitespace-nowrap font-semibold ${textTitle}`}>
                    <AnimatedNumber value={result.costPerStudent} format="decimal" />
                  </span>
                </div>

                {/* 5. Package subtotal */}
                <div className={`flex items-start justify-between gap-4 px-4 py-2.5 border-b ${cardBorder} ${
                  isDark ? 'bg-[#231F1B]/60' : 'bg-[#EADCC8]/30'
                }`}>
                  <div>
                    <span className={`font-body text-xs sm:text-sm font-bold ${textTitle}`}>
                      Package subtotal ({result.packageSessions} sessions)
                    </span>
                    {result.savingsVsBase > 0 && (
                      <p className={`font-mono text-[10px] ${isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'} mt-0.5`}>
                        Total savings: ₹{Math.round(result.savingsVsBase).toLocaleString('en-IN')} vs base rate
                      </p>
                    )}
                  </div>
                  <span className={`font-mono text-xs sm:text-sm whitespace-nowrap font-bold ${
                    isDark ? 'text-[#F7F2EA]' : 'text-[#1A1A1A]'
                  }`}>
                    <AnimatedNumber value={result.packageSubtotal} format="inr" />
                  </span>
                </div>

                {/* 6. GST at 18% */}
                <div className={`flex items-start justify-between gap-4 px-4 py-2.5 border-b ${cardBorder}`}>
                  <span className={`font-body text-xs sm:text-sm ${textBody}`}>
                    GST at 18%
                  </span>
                  <span className={`font-mono text-xs sm:text-sm whitespace-nowrap font-semibold ${textTitle}`}>
                    <AnimatedNumber value={result.gst} format="decimal" />
                  </span>
                </div>

                {/* 7. Security deposit */}
                <div className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <div>
                    <span className={`font-body text-xs sm:text-sm ${textBody}`}>
                      Security deposit ({result.depositPercent}% refundable)
                    </span>
                    <p className={`font-mono text-[10px] ${textSub} mt-0.5`}>
                      {result.hasFreeLocker
                        ? 'Refundable upon completion · Includes Free Locker'
                        : 'Refundable upon completion of term'}
                    </p>
                  </div>
                  <span className={`font-mono text-xs sm:text-sm whitespace-nowrap font-semibold ${textTitle}`}>
                    <AnimatedNumber value={result.securityDeposit} format="decimal" />
                  </span>
                </div>
              </div>

              {/* ─── Grand Total Card: Subtotal + GST + Deposit ─── */}
              <div
                className={`p-4 rounded-sm mb-3 shadow-lg transition-all duration-500 border ${
                  pulseTotalCard
                    ? 'ring-2 ring-[#C9A96B] bg-[#2E2319]'
                    : isDark
                    ? 'bg-[#1A1A1A] border-[#C9A96B]/30'
                    : 'bg-[#1A1A1A] border-[#C9A96B]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-[#F7F2EA] text-sm">
                        Package Total with GST
                      </p>
                      {appliedPkgDiscount && appliedEarlyBird ? (
                        <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-[#C9A96B] text-[#1A1A1A]">
                          Stacked Discount
                        </span>
                      ) : appliedEarlyBird ? (
                        <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-[#C9A96B] text-[#1A1A1A]">
                          30% Off
                        </span>
                      ) : null}
                    </div>
                    <p className="font-mono text-[10px] text-[#DDD0B8] mt-1 font-medium">
                      {result.packageSessions} sessions · {result.durationLabel} · incl. deposit & GST
                    </p>
                  </div>
                  <span className="font-display font-bold text-[#D4B87A] italic text-2xl lg:text-3xl leading-none flex-shrink-0">
                    <AnimatedNumber value={result.totalWithGst} format="decimal" />
                  </span>
                </div>
              </div>

              {/* Fine-Print Disclaimer Line */}
              <div
                className={`flex items-start gap-2.5 p-3 rounded-sm border mb-4 ${
                  isDark ? 'bg-[#231F1B] border-[#3A3228]' : 'bg-[#F7F2EA] border-[#DDD0B8]'
                }`}
              >
                <Info size={14} className={`${isDark ? 'text-[#D4B87A]' : 'text-[#8B6914]'} flex-shrink-0 mt-0.5`} />
                <p className={`font-mono text-[10.5px] ${textBody} leading-relaxed font-medium`}>
                  Billed monthly, after you teach · Deposits fully refundable · Unused sessions lapse at the end of validity
                </p>
              </div>

              {/* ─── "BOOK YOUR SPACE" PRIMARY CTA BUTTON ─── */}
              <motion.button
                type="button"
                onClick={handleBookYourSpace}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-[#C9A96B] hover:bg-[#D4B87A] text-[#1A1A1A] font-body font-bold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-sm shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
              >
                {bookHandoffSent ? (
                  <>
                    <CheckCircle2 size={18} className="text-[#1A1A1A]" />
                    <span>Quotation Loaded! Opening Booking Form...</span>
                  </>
                ) : (
                  <>
                    <span>Book Your Space</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div className={`flex items-center justify-center h-48 ${textSub} font-mono text-sm`}>
              Select options to calculate
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
