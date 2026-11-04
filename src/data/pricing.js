// ─── Exact pricing data from Mentors_Studio_Website.html ─────────────────────

export const EDUCATOR_TYPES = [
  { id: 'adult',  label: 'Adult Educators',  ratePerSeat: 250, desc: '₹250 / seat / session (1 hour)' },
  { id: 'school', label: 'School Educators', ratePerSeat: 200, desc: '₹200 / seat / session' },
];

export const PACKAGES = [
  { id: 'payg',       label: 'Pay As You Go', sessions: 1,   months: null, discount: 0,    deposit: false },
  { id: 'starter',    label: 'Starter',        sessions: 36,  months: 2,   discount: 0.05, deposit: false },
  { id: 'standard',   label: 'Standard',        sessions: 72,  months: 3,   discount: 0.10, deposit: true  },
  { id: 'halfyearly', label: 'Half-Yearly',     sessions: 144, months: 6,   discount: 0.15, deposit: true  },
  { id: 'annual',     label: 'Annual',           sessions: 288, months: 12,  discount: 0.20, deposit: true  },
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
 *
 * Example from HTML:
 *   Adult, 6-seat cabin, 5 students, Standard (10% off, 72 sessions)
 *   Base: ₹250 → Discounted: ₹225
 *   Min billable: ceil(6×0.6) = 4 → actual students = 5 → seats billed = 5
 *   Per session: 5 × ₹225 = ₹1,125
 *   72 sessions: ₹81,000
 *   GST 18%: ₹14,580
 *   Total: ₹95,580
 */
export function calculatePricing({ educatorType, cabinCapacity, packageId, numStudents }) {
  const educator = EDUCATOR_TYPES.find(e => e.id === educatorType);
  const pkg      = PACKAGES.find(p => p.id === packageId);
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

  // Pay-as-you-go shows cost of 1 session only
  const packageSessions = pkg.sessions;
  const packageTotal    = perSession * packageSessions;
  const gst             = packageTotal * GST_RATE;
  const totalWithGst    = packageTotal + gst;

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
    discount:    pkg.discount,
    hasDeposit:  pkg.deposit,
    label:       pkg.label,
    months:      pkg.months,
    isPAYG:      pkg.id === 'payg',
  };
}
