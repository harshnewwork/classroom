// ─── Mentors Studio Pricing Data & Configuration ─────────────────────

export const EDUCATOR_TYPES = [
  { id: 'adult',  label: 'Adult Educators',  baseRate: 250, desc: 'Starting from ₹212.50 to ₹250 / seat / session (55 min)' },
  { id: 'school', label: 'School Educators', baseRate: 200, desc: 'Starting from ₹170 to ₹200 / seat / session (55 min)' },
];

export const PACKAGES = [
  {
    id: 'starter',
    label: 'Starter',
    sessions: 24,
    months: 2,
    durationLabel: '2 months',
    discount: 0,
    discountLabel: 'No discount',
    depositPercent: 20,
    depositRate: 0.20,
    depositLabel: '20% refundable deposit',
    rates: {
      school: 200,
      adult: 250,
    },
    hasFreeLocker: false,
  },
  {
    id: 'growth',
    label: 'Growth',
    sessions: 60,
    months: 3,
    durationLabel: '3 months',
    discount: 0.05,
    discountLabel: '5% off',
    depositPercent: 15,
    depositRate: 0.15,
    depositLabel: '15% refundable deposit',
    rates: {
      school: 190,
      adult: 237.50,
    },
    hasFreeLocker: false,
  },
  {
    id: 'pro',
    label: 'Pro',
    sessions: 140,
    months: 6,
    durationLabel: '6 months',
    discount: 0.10,
    discountLabel: '10% off',
    depositPercent: 12.5,
    depositRate: 0.125,
    depositLabel: '12.5% refundable deposit',
    rates: {
      school: 180,
      adult: 225,
    },
    hasFreeLocker: false,
  },
  {
    id: 'elite',
    label: 'Elite',
    badge: 'Best Value',
    sessions: 240,
    months: 12,
    durationLabel: '12 months',
    discount: 0.15,
    discountLabel: '15% off',
    depositPercent: 10,
    depositRate: 0.10,
    depositLabel: '10% refundable deposit + Free locker',
    rates: {
      school: 170,
      adult: 212.50,
    },
    hasFreeLocker: true,
  },
];

export const GST_RATE = 0.18;
export const MIN_BILLABLE_PCT = 0.8; // 80% of cabin capacity, rounded up
export const EARLY_BIRD_DISCOUNT_RATE = 0.30; // Flat 30% discount

/**
 * Calculate minimum billable seats for a given cabin capacity.
 * Rule: ceil(capacity × 80%)
 * Example: 6-seat cabin → ceil(4.8) = 5 seats minimum
 */
export function getMinBillable(cabinCapacity) {
  return Math.ceil(cabinCapacity * MIN_BILLABLE_PCT);
}

/**
 * Calculate full pricing breakdown.
 *
 * Supports applying BOTH Package Discount AND Early Bird Offer (stackable):
 * - Package discount applies to base rate (Starter: 0%, Growth: 5%, Pro: 10%, Elite: 15%).
 * - Early Bird discount applies 30% off.
 * - When both are applied, Early Bird 30% applies on top of the package tier rate:
 *   ratePerSeat = pkg.rates[eduKey] * 0.70
 * - Package sessions, duration, and deposit rates still come from the selected package.
 */
export function calculatePricing({
  educatorType,
  cabinCapacity,
  packageId,
  numStudents,
  discountType,
  applyPackageDiscount = true,
  applyEarlyBird = false,
}) {
  const eduKey = educatorType === 'school' ? 'school' : 'adult';
  const educator = EDUCATOR_TYPES.find(e => e.id === eduKey) || EDUCATOR_TYPES[0];
  const pkg      = PACKAGES.find(p => p.id === packageId) || PACKAGES[0];
  if (!educator || !pkg || !cabinCapacity) return null;

  const cap         = Number(cabinCapacity);
  const students    = Number(numStudents) || 0;
  const minBillable = getMinBillable(cap);

  // Seats billed = max(minBillable, actual students), capped at cabin capacity
  const seatsForBilling = Math.min(Math.max(minBillable, students), cap);

  // Reconcile discountType flag for backward compatibility
  let hasPkg = applyPackageDiscount;
  let hasEB  = applyEarlyBird;

  if (discountType === 'both') {
    hasPkg = true;
    hasEB = true;
  } else if (discountType === 'earlybird') {
    hasEB = true;
    if (applyPackageDiscount === undefined) hasPkg = false;
  } else if (discountType === 'package') {
    hasPkg = true;
    hasEB = false;
  } else if (discountType === 'none') {
    hasPkg = false;
    hasEB = false;
  }

  const baseRate = educator.baseRate;

  // Rate determination:
  // 1. Package tier rate if hasPkg, else baseRate
  const intermediateRate = hasPkg ? pkg.rates[eduKey] : baseRate;

  // 2. Early Bird 30% applied if hasEB
  const ratePerSeat = hasEB
    ? Number((intermediateRate * (1 - EARLY_BIRD_DISCOUNT_RATE)).toFixed(2))
    : intermediateRate;

  const perSession     = seatsForBilling * ratePerSeat;
  const costPerStudent = students > 0 ? perSession / students : 0;

  const packageSessions = pkg.sessions;
  const packageSubtotal = perSession * packageSessions;
  const gst             = packageSubtotal * GST_RATE;
  const securityDeposit = packageSubtotal * pkg.depositRate;
  const totalWithGst    = packageSubtotal + gst + securityDeposit;

  // Base undiscounted comparison
  const baseSubtotal    = seatsForBilling * baseRate * packageSessions;
  const savingsVsBase   = baseSubtotal - packageSubtotal;

  // Format descriptive label
  let discountLabel = 'No discount';
  let activeDiscountType = 'none';

  if (hasPkg && hasEB) {
    activeDiscountType = 'both';
    discountLabel = pkg.discount > 0
      ? `${pkg.discountLabel} + 30% Early Bird (Stacked)`
      : '30% off (Early Bird)';
  } else if (hasEB) {
    activeDiscountType = 'earlybird';
    discountLabel = '30% off (Early Bird)';
  } else if (hasPkg) {
    activeDiscountType = 'package';
    discountLabel = pkg.discountLabel;
  }

  return {
    minBillable,
    seatsForBilling,
    ratePerSeat,
    baseRate,
    discountedRate: ratePerSeat, // alias for consistency
    effectiveRate: ratePerSeat,
    perSession,
    costPerStudent,
    packageSessions,
    packageSubtotal,
    packageTotal: packageSubtotal, // alias for backwards compatibility
    gst,
    securityDeposit,
    totalWithGst,
    depositPercent: pkg.depositPercent,
    depositRate:    pkg.depositRate,
    depositLabel:   pkg.depositLabel,
    discount:       hasEB ? (hasPkg ? 1 - (ratePerSeat / baseRate) : EARLY_BIRD_DISCOUNT_RATE) : (hasPkg ? pkg.discount : 0),
    discountLabel,
    discountType:   activeDiscountType,
    hasPackageDiscount: hasPkg,
    hasEarlyBird:   hasEB,
    label:          pkg.label,
    months:         pkg.months,
    durationLabel:  pkg.durationLabel,
    hasFreeLocker:  pkg.hasFreeLocker,
    baseSubtotal,
    savingsVsBase,
  };
}
