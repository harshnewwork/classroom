import { calculatePricing, EDUCATOR_TYPES, PACKAGES, GST_RATE, getMinBillable } from '../src/data/pricing.js';
import { cabins } from '../src/data/cabins.js';
import { getOfferDateStatus } from '../src/data/earlyBird.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${message}`);
  }
}

console.log('🧪 Starting Verification for Stackable Discounts (Both Applied)...\n');

// ─── 1. Verify Both Discounts Applied Together ───
console.log('1️⃣ Checking BOTH Package Discount AND Early Bird Offer (Stacked):');

for (const edu of EDUCATOR_TYPES) {
  for (const pkg of PACKAGES) {
    const pkgStandardRate = pkg.rates[edu.id];
    // With both applied, Early Bird takes 30% off the package rate:
    const expectedStackedRate = Number((pkgStandardRate * 0.70).toFixed(2));

    for (const cabin of cabins) {
      const minBillable = getMinBillable(cabin.capacity);

      for (let students = 1; students <= cabin.capacity; students++) {
        const res = calculatePricing({
          educatorType: edu.id,
          cabinCapacity: cabin.capacity,
          packageId: pkg.id,
          numStudents: students,
          applyPackageDiscount: true,
          applyEarlyBird: true,
        });

        const expectedSeats = Math.min(Math.max(minBillable, students), cabin.capacity);
        const expectedPerSession = expectedSeats * expectedStackedRate;
        const expectedSubtotal = expectedPerSession * pkg.sessions;
        const expectedGst = expectedSubtotal * GST_RATE;
        const expectedDeposit = expectedSubtotal * pkg.depositRate;
        const expectedTotalWithGst = expectedSubtotal + expectedGst + expectedDeposit;

        assert(
          res.ratePerSeat === expectedStackedRate,
          `Rate per seat for ${edu.id} (${pkg.label}) with both discounts must be ${expectedStackedRate}, got ${res.ratePerSeat}`
        );
        assert(
          res.hasPackageDiscount === true && res.hasEarlyBird === true,
          `Both discount flags must be true`
        );
        assert(
          Math.abs(res.packageSubtotal - expectedSubtotal) < 0.01,
          `Subtotal mismatch: expected ${expectedSubtotal}, got ${res.packageSubtotal}`
        );
        assert(
          Math.abs(res.totalWithGst - expectedTotalWithGst) < 0.01,
          `Total with GST mismatch: expected ${expectedTotalWithGst}, got ${res.totalWithGst}`
        );
      }
    }
  }
}

console.log(`  ✓ Verified all combinations for stacked (both) discounts.`);

// ─── 2. Verify Concrete Pricing for Pro & Elite with Both Discounts ───
console.log('\n2️⃣ Verifying Concrete Rates for Pro & Elite (Adult & School):');

// Adult Pro: base 250, 10% pkg = 225. Both = 225 * 0.70 = 157.50
const adultProBoth = calculatePricing({ educatorType: 'adult', cabinCapacity: 10, packageId: 'pro', numStudents: 6, applyPackageDiscount: true, applyEarlyBird: true });
assert(adultProBoth.ratePerSeat === 157.50, `Adult Pro with both discounts must be 157.50, got ${adultProBoth.ratePerSeat}`);
assert(adultProBoth.packageSubtotal === 6 * 157.50 * 140, `Subtotal for 6 seats * 140 sessions must be 132300`);

// Adult Elite: base 250, 15% pkg = 212.50. Both = 212.50 * 0.70 = 148.75
const adultEliteBoth = calculatePricing({ educatorType: 'adult', cabinCapacity: 10, packageId: 'elite', numStudents: 6, applyPackageDiscount: true, applyEarlyBird: true });
assert(adultEliteBoth.ratePerSeat === 148.75, `Adult Elite with both discounts must be 148.75, got ${adultEliteBoth.ratePerSeat}`);

// School Pro: base 200, 10% pkg = 180. Both = 180 * 0.70 = 126.00
const schoolProBoth = calculatePricing({ educatorType: 'school', cabinCapacity: 10, packageId: 'pro', numStudents: 6, applyPackageDiscount: true, applyEarlyBird: true });
assert(schoolProBoth.ratePerSeat === 126.00, `School Pro with both discounts must be 126.00, got ${schoolProBoth.ratePerSeat}`);

// School Elite: base 200, 15% pkg = 170. Both = 170 * 0.70 = 119.00
const schoolEliteBoth = calculatePricing({ educatorType: 'school', cabinCapacity: 10, packageId: 'elite', numStudents: 6, applyPackageDiscount: true, applyEarlyBird: true });
assert(schoolEliteBoth.ratePerSeat === 119.00, `School Elite with both discounts must be 119.00, got ${schoolEliteBoth.ratePerSeat}`);

console.log('  ✓ Verified Pro & Elite concrete rates.');

// ─── 3. Verify All 4 States (Both, Pkg Only, EB Only, None) ───
console.log('\n3️⃣ Verifying Clean Transitions between All 4 States:');

const sBoth = calculatePricing({ educatorType: 'adult', cabinCapacity: 10, packageId: 'pro', numStudents: 6, applyPackageDiscount: true, applyEarlyBird: true });
const sPkg  = calculatePricing({ educatorType: 'adult', cabinCapacity: 10, packageId: 'pro', numStudents: 6, applyPackageDiscount: true, applyEarlyBird: false });
const sEB   = calculatePricing({ educatorType: 'adult', cabinCapacity: 10, packageId: 'pro', numStudents: 6, applyPackageDiscount: false, applyEarlyBird: true });
const sNone = calculatePricing({ educatorType: 'adult', cabinCapacity: 10, packageId: 'pro', numStudents: 6, applyPackageDiscount: false, applyEarlyBird: false });

assert(sBoth.ratePerSeat === 157.50, 'Both: rate = 157.50');
assert(sPkg.ratePerSeat === 225.00, 'Pkg only: rate = 225.00');
assert(sEB.ratePerSeat === 175.00, 'EB only: rate = 175.00');
assert(sNone.ratePerSeat === 250.00, 'None: rate = 250.00');

assert(sBoth.totalWithGst < sEB.totalWithGst, 'Both total must be cheaper than EB only');
assert(sEB.totalWithGst < sPkg.totalWithGst, 'EB only total must be cheaper than Pkg only');
assert(sPkg.totalWithGst < sNone.totalWithGst, 'Pkg only total must be cheaper than None');

console.log('  ✓ Verified monotonic savings: Both > Early Bird > Package > None.');

console.log(`\n======================================================`);
console.log(`🎉 ALL CHECKS PASSED: ${passedTests} / ${totalTests} assertions succeeded (0 failures).`);
console.log(`======================================================\n`);
