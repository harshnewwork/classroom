// ─── Mentors Studio Pricing Data & Configuration ─────────────────────

export const EDUCATOR_TYPES = [
  { id: 'adult',  label: 'Adult Educators',  ratePerSeat: 250, desc: '₹250 / seat / session (60 min)' },
  { id: 'school', label: 'School Educators', ratePerSeat: 200, desc: '₹200 / seat / session (60 min)' },
];

export const PACKAGES = [
  {
    id: 'starter',
    label: 'Starter',
    sessions: 36,
    months: 2,
    discount: 0.05,
    depositPercent: 20,
    depositRate: 0.20,
    depositLabel: '20% of total amount',
  },
  {
    id: 'standard',
    label: 'Standard',
    sessions: 72,
    months: 3,
    discount: 0.10,
    depositPercent: 15,
    depositRate: 0.15,
    depositLabel: '15% of total amount',
  },
  {
    id: 'halfyearly',
    label: 'Half-Yearly',
    sessions: 144,
    months: 6,
    discount: 0.15,
    depositPercent: 12.5,
    depositRate: 0.125,
    depositLabel: '12.5% of total amount',
  },
  {
    id: 'annual',
    label: 'Annual',
    sessions: 288,
    months: 12,
    discount: 0.20,
    depositPercent: 10,
    depositRate: 0.10,
    depositLabel: '10% of total amount',
  },
];

export const GST_RATE = 0.18;
export const MIN_BILLABLE_PCT = 0.6; // 60% of cabin capacity, rounded up

/**
 * Calculate minimum billable seats for a given cabin capacity.
 * Rule: ceil(capacity × 60%)
 * Example: 6-seat cabin → ceil(3.6) = 4 seats minimum
 */
export function getMinBillable(cabinCapacity) {
  return Math.ceil(cabinCapacity * MIN_BILLABLE_PCT);
}

/**
 * Calculate full pricing breakdown.
 */
export function calculatePricing({ educatorType, cabinCapacity, packageId, numStudents }) {
  const educator = EDUCATOR_TYPES.find(e => e.id === educatorType) || EDUCATOR_TYPES[0];
  const pkg      = PACKAGES.find(p => p.id === packageId) || PACKAGES[0];
  if (!educator || !pkg || !cabinCapacity) return null;

  const cap         = Number(cabinCapacity);
  const students    = Number(numStudents) || 0;
  const minBillable = getMinBillable(cap);

  // Seats billed = max(minBillable, actual students), capped at cabin capacity
  const seatsForBilling = Math.min(Math.max(minBillable, students), cap);

  const baseRate       = educator.ratePerSeat;
  const discountedRate = baseRate * (1 - pkg.discount);
  const perSession     = seatsForBilling * discountedRate;
  const costPerStudent = students > 0 ? perSession / students : 0;

  const packageSessions = pkg.sessions;
  const packageTotal    = perSession * packageSessions;
  const gst             = packageTotal * GST_RATE;
  const totalWithGst    = packageTotal + gst;
  const securityDeposit = packageTotal * pkg.depositRate;

  return {
    minBillable,
    seatsForBilling,
    baseRate,
    discountedRate,
    perSession,
    costPerStudent,
    packageSessions,
    packageTotal,
    gst,
    totalWithGst,
    securityDeposit,
    depositPercent: pkg.depositPercent,
    depositLabel:   pkg.depositLabel,
    discount:       pkg.discount,
    label:          pkg.label,
    months:         pkg.months,
  };
}
