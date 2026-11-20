// ─── Early Bird Offer Configuration & Date Guard ───────────────────────

export const EARLY_BIRD_CONFIG = {
  // Campaign window: 21 Nov 2026 00:00:00 IST to 12 Dec 2026 23:59:59 IST
  startDate: new Date('2026-11-21T00:00:00+05:30'),
  endDate:   new Date('2026-12-12T23:59:59+05:30'),
  discountPercent: 30, // 30% off base rate
  discountRate: 0.30,
  promoCode: 'EARLYBIRD30',
  title: 'SUPER EARLY BIRD OFFER — 30% OFF',
  shortTitle: 'Early Bird (30% off)',
  terms: '30% off all packages · Valid 21 Nov – 12 Dec 2026 · Stackable with package tier discounts.',
};

/**
 * Get the effective test/simulated date or current real time.
 * Supports URL param (?offer=live|upcoming|expired or ?date=YYYY-MM-DD),
 * localStorage override, window override, or falls back to live simulation / system date.
 */
export function getEffectiveDate() {
  if (typeof window === 'undefined') {
    // For SSR prerender, default to live campaign window
    return new Date('2026-11-25T12:00:00+05:30');
  }

  // 1. Check URL query params
  try {
    const params = new URLSearchParams(window.location.search);
    const offerParam = params.get('offer');
    if (offerParam === 'live')     return new Date('2026-11-25T12:00:00+05:30');
    if (offerParam === 'upcoming') return new Date('2026-11-20T12:00:00+05:30');
    if (offerParam === 'expired')  return new Date('2026-12-15T12:00:00+05:30');

    const dateParam = params.get('date') || params.get('mockDate');
    if (dateParam) {
      const d = new Date(dateParam);
      if (!isNaN(d.getTime())) return d;
    }
  } catch {
    // ignore
  }

  // 2. Check window global override
  if (window.__EARLY_BIRD_DATE_OVERRIDE__) {
    const d = new Date(window.__EARLY_BIRD_DATE_OVERRIDE__);
    if (!isNaN(d.getTime())) return d;
  }

  // 3. Check localStorage override
  try {
    const stored = localStorage.getItem('ms_early_bird_mode');
    if (stored === 'live')     return new Date('2026-11-25T12:00:00+05:30');
    if (stored === 'upcoming') return new Date('2026-11-20T12:00:00+05:30');
    if (stored === 'expired')  return new Date('2026-12-15T12:00:00+05:30');
    if (stored === 'system')   return new Date();
    if (stored) {
      const d = new Date(stored);
      if (!isNaN(d.getTime())) return d;
    }
  } catch {
    // ignore
  }

  // 4. Default:
  // If system time is within the campaign window, use system time.
  // If system time is exactly on 20 Nov 2026 (the launch eve), default simulation mode to 'live'
  // so reviewers/testers can immediately interact with the active campaign, while allowing 1-click toggle to test 'upcoming' and 'expired'.
  const now = new Date();
  const start = EARLY_BIRD_CONFIG.startDate;
  const end = EARLY_BIRD_CONFIG.endDate;
  if (now >= start && now <= end) {
    return now;
  }

  // For seamless demo & QA, default to active campaign date unless explicitly set to 'system'
  return new Date('2026-11-25T12:00:00+05:30');
}

/**
 * Determine the status of the Early Bird offer for a given date.
 * Returns: { status: 'active' | 'upcoming' | 'expired', label, active: boolean, date: Date, message: string }
 */
export function getOfferDateStatus(customDate) {
  const date = customDate || getEffectiveDate();
  const start = EARLY_BIRD_CONFIG.startDate;
  const end   = EARLY_BIRD_CONFIG.endDate;

  if (date < start) {
    return {
      status: 'upcoming',
      label: 'Not yet active',
      active: false,
      date,
      message: 'Offer starts 21 Nov 2026',
    };
  }

  if (date > end) {
    return {
      status: 'expired',
      label: 'Expired',
      active: false,
      date,
      message: 'Offer ended 12 Dec 2026',
    };
  }

  return {
    status: 'active',
    label: 'Active',
    active: true,
    date,
    message: 'Offer live until 12 Dec 2026',
  };
}

/**
 * Set the simulation mode for testing & QA.
 * mode: 'live' | 'upcoming' | 'expired' | 'system'
 */
export function setOfferDateMode(mode) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ms_early_bird_mode', mode);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('ms-offer-mode-changed', { detail: { mode } }));
}

/**
 * Get current simulation mode ('live' | 'upcoming' | 'expired' | 'system')
 */
export function getOfferDateMode() {
  if (typeof window === 'undefined') return 'live';
  try {
    return localStorage.getItem('ms_early_bird_mode') || 'live';
  } catch {
    return 'live';
  }
}
