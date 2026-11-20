import { supabase } from '../lib/supabaseClient.js';

// ─── Early Bird Offer Configuration ─────────────────────────────────────

export const EARLY_BIRD_CONFIG = {
  discountPercent: 30, // 30% off base rate
  discountRate: 0.30,
  promoCode: 'EARLYBIRD30',
  title: 'SUPER EARLY BIRD OFFER — 30% OFF',
  shortTitle: 'Early Bird (30% off)',
  terms: '30% off all packages · Stackable with package tier discounts.',
};

const STORAGE_KEY_ADMIN_ENABLED = 'ms_early_bird_admin_enabled';

/**
 * Check whether the Early Bird offer is currently enabled by Admin.
 * Does not rely on date: directly follows the Admin setting.
 * Defaults to true (Active/Appears) unless explicitly turned off by Admin.
 */
export function isEarlyBirdAdminEnabled() {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY_ADMIN_ENABLED);
    if (val === 'false') return false;
    if (val === 'true') return true;
  } catch {
    // ignore
  }
  return true;
}

/**
 * Determine the status of the Early Bird offer.
 * Returns: { status: 'active' | 'hidden', label, active: boolean, message: string }
 */
export function getOfferDateStatus() {
  const isEnabled = isEarlyBirdAdminEnabled();

  if (!isEnabled) {
    return {
      status: 'hidden',
      label: 'Offer Inactive',
      active: false,
      message: 'Early Bird offer is currently turned off by administrator',
    };
  }

  return {
    status: 'active',
    label: 'Active',
    active: true,
    message: '30% Early Bird Active',
  };
}

/**
 * Admin action: Set the Early Bird offer to appear or hide.
 * Persists to Supabase `site_settings` table, caches in localStorage,
 * and broadcasts an event to immediately update all components.
 */
export async function setEarlyBirdAdminEnabled(enabled, userEmail = 'admin') {
  const boolVal = Boolean(enabled);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_ENABLED, boolVal ? 'true' : 'false');
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('ms-offer-mode-changed', { detail: { enabled: boolVal } }));
  }

  if (supabase) {
    try {
      const { error } = await supabase.from('site_settings').upsert(
        {
          key: 'early_bird_offer',
          value: { enabled: boolVal },
          updated_at: new Date().toISOString(),
          updated_by: userEmail,
        },
        { onConflict: 'key' }
      );

      if (error) {
        console.warn('[EarlyBird Setting] Supabase sync warning (table may need creation):', error.message);
      }
    } catch (err) {
      console.warn('[EarlyBird Setting] Network error syncing setting:', err);
    }
  }

  return boolVal;
}

/**
 * Fetch the latest Early Bird setting from Supabase.
 * Call on app load to ensure visitor views match the admin toggle.
 */
export async function fetchEarlyBirdAdminSetting() {
  if (!supabase) return isEarlyBirdAdminEnabled();

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'early_bird_offer')
      .maybeSingle();

    if (!error && data?.value && typeof data.value.enabled === 'boolean') {
      const remoteEnabled = data.value.enabled;
      if (typeof window !== 'undefined') {
        const localCurrent = isEarlyBirdAdminEnabled();
        if (localCurrent !== remoteEnabled) {
          localStorage.setItem(STORAGE_KEY_ADMIN_ENABLED, remoteEnabled ? 'true' : 'false');
          window.dispatchEvent(new CustomEvent('ms-offer-mode-changed', { detail: { enabled: remoteEnabled } }));
        }
      }
      return remoteEnabled;
    }
  } catch (err) {
    // If offline or table not present, seamlessly continue with local setting
    console.debug('[EarlyBird Setting] Using local setting fallback:', err);
  }

  return isEarlyBirdAdminEnabled();
}
