import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { CheckCircle2, AlertCircle, Send, MessageCircle, Sparkles, Tag } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { siteConfig } from '../../config/siteConfig';

const MANAGER_WHATSAPP = siteConfig.contact.whatsapp;
const PLACEHOLDER_PATTERN = /^\[.*\]$/;
const FALLBACK_MSG = "WhatsApp isn't set up yet, please use Copy Request or email us directly.";

const initial = {
  name: '',
  phone: '',
  email: '',
  subject: '',
  studentType: '',
  batchSize: '',
  cabinCapacity: '',
  days: '',
  time: '',
  notes: '',
};

const studentTypes = [
  'School students (Grade 5 and above)',
  'Adults',
  'Mixed ages (Grade 5 and above)',
];

const timeOptions = [
  'Adult 1: 10:00 – 10:55 am',
  'Adult 2: 11:05 am – 12:00 pm',
  'Adult 3: 12:10 – 1:05 pm',
  'Adult 4: 1:15 – 2:10 pm',
  'Adult 5: 2:20 – 3:15 pm',
  'School 1: 3:30 – 4:25 pm',
  'School 2: 4:35 – 5:30 pm',
  'School 3: 5:40 – 6:35 pm',
  'School 4: 6:45 – 7:40 pm',
  'School 5: 7:50 – 8:45 pm',
];

const cabinOptions = [
  '4 seats (Cabin A/B)',
  '8 seats (Cabin C)',
  '10 seats (Cabin D/E/F)',
  '12 seats (Cabin G/H)',
  '30 seats (Seminar Hall)',
  '10 seats (Arts & Crafts Area)',
  '10 seats (Balcony / Outdoor Area)',
  'Not sure yet',
];

function getInitialQuote() {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const pkgParam = params.get('pkg');
    const totalParam = params.get('total');
    if (pkgParam && totalParam) {
      return {
        packageLabel: pkgParam,
        discountApplied: params.get('discount') || 'Package Discount',
        ratePerSeat: params.get('rate') || '',
        quotedTotal: totalParam,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function getInitialForm() {
  if (typeof window === 'undefined') return initial;
  try {
    const params = new URLSearchParams(window.location.search);
    const timeParam = params.get('time');
    const studentTypeParam = params.get('studentType');
    const batchSizeParam = params.get('batchSize');
    const cabinCapParam = params.get('cabinCapacity');
    const quote = getInitialQuote();

    const quoteNote = quote
      ? `[Calculator Quote: ${quote.packageLabel} | Discount: ${quote.discountApplied} | Quoted Total: ${quote.quotedTotal}]`
      : '';

    return {
      ...initial,
      ...(timeParam ? { time: timeParam } : {}),
      ...(studentTypeParam ? { studentType: studentTypeParam } : {}),
      ...(batchSizeParam ? { batchSize: batchSizeParam } : {}),
      ...(cabinCapParam ? { cabinCapacity: cabinCapParam } : {}),
      notes: quoteNote,
    };
  } catch {
    return initial;
  }
}

const inputCls = (err, isHighlighted = false) =>
  `w-full bg-[#FFFFFF] border rounded-sm px-4 py-3 font-body text-sm text-[#1A1A1A] placeholder-[#8C7A65] focus:outline-none transition-all duration-300 ${
    err
      ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
      : isHighlighted
      ? 'border-[#8B6914] ring-2 ring-[#C9A96B] bg-[#FFFDF9]'
      : 'border-[#DDD0B8] focus:border-[#8B6914] focus:ring-1 focus:ring-[#8B6914]'
  }`;

function Field({ label, id, required, error, isPrefilled, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-[#1A1A1A] font-bold">
          {label}{required && <span className="text-[#8B6914] ml-0.5">*</span>}
        </label>
        {isPrefilled && (
          <span className="font-mono text-[9.5px] text-[#8B6914] font-semibold flex items-center gap-1">
            <Sparkles size={10} /> Pre-filled from calculator
          </span>
        )}
      </div>
      {children}
      {error && (
        <span className="flex items-center gap-1 font-mono text-[10.5px] text-red-600 font-semibold">
          <AlertCircle size={11} />{error}
        </span>
      )}
    </div>
  );
}

export function Booking() {
  const [form, setForm] = useState(getInitialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotationInfo, setQuotationInfo] = useState(getInitialQuote);
  const [highlightFields, setHighlightFields] = useState(() => Boolean(getInitialQuote()));

  // Listen for same-page handoff event from Calculator
  useEffect(() => {
    const handleHandoff = (e) => {
      const data = e.detail;
      if (!data) return;

      setQuotationInfo(data);
      setHighlightFields(true);
      setTimeout(() => setHighlightFields(false), 4000);

      const quoteNote = `[Calculator Quote: ${data.packageLabel} | Discount: ${data.discountApplied} | Rate: ${data.ratePerSeat}/seat | Quoted Total: ${data.quotedTotal} (incl. GST & deposit)]`;

      setForm((prev) => {
        const cleanNotes = prev.notes ? prev.notes.replace(/\[Calculator Quote:[^\]]+\]\n?/g, '').trim() : '';
        return {
          ...prev,
          studentType: data.studentType || prev.studentType,
          batchSize: data.batchSize || prev.batchSize,
          cabinCapacity: data.cabinCapacity || prev.cabinCapacity,
          notes: cleanNotes ? `${quoteNote}\n${cleanNotes}` : quoteNote,
        };
      });
    };

    window.addEventListener('ms-calculator-booking-handoff', handleHandoff);
    return () => window.removeEventListener('ms-calculator-booking-handoff', handleHandoff);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    const phone = form.phone.trim();
    if (!phone || !/^\+?[\d\s\-()]{8,}$/.test(phone) || (phone.match(/\d/g) || []).length < 8) {
      e.phone = 'Valid phone required';
    }
    if (!form.subject.trim()) e.subject = 'Required';
    if (!form.studentType) e.studentType = 'Required';
    const batchNum = parseInt(form.batchSize, 10);
    if (!form.batchSize || isNaN(batchNum) || batchNum <= 0) e.batchSize = 'Required';
    if (!form.days.trim()) e.days = 'Required';
    if (!form.time) e.time = 'Required';
    return e;
  };

  const buildMsg = () => {
    let msg = `Mentors Studio — Space Enquiry\n\nName: ${form.name}\nPhone: ${form.phone}\n${form.email ? `Email: ${form.email}\n` : ''}Teaching: ${form.subject}\nStudents: ${form.studentType}\nBatch: ${form.batchSize}\nCabin: ${form.cabinCapacity}\nDays: ${form.days}\nTime: ${form.time}`;

    if (quotationInfo) {
      msg += `\n\nQuoted Package: ${quotationInfo.packageLabel}\nDiscount Applied: ${quotationInfo.discountApplied}\nQuoted Total: ${quotationInfo.quotedTotal} (incl. 18% GST & deposit)`;
    }

    if (form.notes) {
      const filteredNotes = form.notes.replace(/\[Calculator Quote:[^\]]+\]\n?/g, '').trim();
      if (filteredNotes) {
        msg += `\nNotes: ${filteredNotes}`;
      }
    }

    return msg;
  };

  const saveEnquiry = (submittedVia) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      let finalNotes = form.notes.trim() || null;
      if (quotationInfo && (!finalNotes || !finalNotes.includes(quotationInfo.quotedTotal))) {
        const quoteNote = `[Calculator Quote: ${quotationInfo.packageLabel} | Discount: ${quotationInfo.discountApplied} | Total: ${quotationInfo.quotedTotal}]`;
        finalNotes = finalNotes ? `${quoteNote}\n${finalNotes}` : quoteNote;
      }

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        subject: form.subject.trim(),
        student_type: form.studentType,
        batch_size: parseInt(form.batchSize, 10),
        cabin_capacity: form.cabinCapacity || null,
        days: form.days.trim(),
        time_slot: form.time,
        notes: finalNotes,
        submitted_via: submittedVia,
        status: 'new',
      };

      supabase
        .from('enquiries')
        .insert([payload])
        .then(({ error }) => {
          if (error) console.error('[Enquiry Sync] Could not save enquiry:', error.message);
        })
        .catch((err) => {
          console.error('[Enquiry Sync] Network error dispatching enquiry:', err);
        });
    } catch (err) {
      console.error('[Enquiry Sync] Unexpected error:', err);
    }
  };

  const handleCopy = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setIsSubmitting(true);
    saveEnquiry('copy');
    navigator.clipboard.writeText(buildMsg()).then(() => setStatus('copied'));
    setTimeout(() => {
      setStatus('idle');
      setIsSubmitting(false);
    }, 3500);
  };

  const handleWA = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (PLACEHOLDER_PATTERN.test(MANAGER_WHATSAPP)) {
      setStatus('wa-error');
      setTimeout(() => setStatus('idle'), 3500);
      return;
    }
    setIsSubmitting(true);
    saveEnquiry('whatsapp');
    window.open(`https://wa.me/${MANAGER_WHATSAPP}?text=${encodeURIComponent(buildMsg())}`, '_blank');
    setStatus('whatsapp');
    setTimeout(() => {
      setStatus('idle');
      setIsSubmitting(false);
    }, 3500);
  };

  return (
    <section id="booking" className="section-pad bg-warm-stone relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96B]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Left info */}
          <AnimatedSection direction="left" className="lg:col-span-5">
            <SectionLabel>Book a Space</SectionLabel>
            <h2
              className="font-display font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)' }}
            >
              Your Next Class{' '}
              <span className="text-[#8B6914] italic">Starts Here.</span>
            </h2>
            <p className="font-body text-[#3E2F1F] text-base leading-relaxed mb-6 font-normal">
              Share your requirements and our team will get back to you to confirm cabin availability and suitable time slots.
            </p>

            <div className="p-5 border border-[#DDD0B8] rounded-sm bg-[#F7F2EA] shadow-xs mb-5">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] mb-2 font-bold">
                Operating Schedule
              </p>
              <p className="font-body text-xs text-[#3E2F1F] leading-relaxed font-medium">
                Open 7 days a week (Monday to Saturday + 3 Sundays a month). Submitting an enquiry reserves your consultation with our on-site manager.
              </p>
            </div>
          </AnimatedSection>

          {/* Right form */}
          <AnimatedSection direction="right" className="lg:col-span-7">
            <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-6 lg:p-8 shadow-lg shadow-[#C9A96B]/6">

              {/* ─── QUOTATION SUMMARY BANNER FROM CALCULATOR ─── */}
              {quotationInfo && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-sm border-2 border-[#8B6914] bg-[#FFFDF9] shadow-md relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-white bg-[#8B6914] px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <Tag size={10} /> Quoted Rate Locked
                        </span>
                        <span className="font-display font-bold text-sm text-[#1A1A1A]">
                          {quotationInfo.packageLabel}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[#5C450C] mt-1.5 font-medium">
                        Discount applied: <strong className="text-[#8B6914]">{quotationInfo.discountApplied}</strong>
                        {quotationInfo.ratePerSeat && ` · Rate: ${quotationInfo.ratePerSeat}/seat`}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-[10px] uppercase text-[#5C450C] block font-bold">Quoted Total</span>
                      <span className="font-display font-bold text-xl sm:text-2xl text-[#8B6914] italic leading-tight">
                        {quotationInfo.quotedTotal}
                      </span>
                      <span className="font-mono text-[9px] text-[#5C450C] block">incl. 18% GST & deposit</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Full Name" id="name" required error={errors.name}>
                  <input id="name" placeholder="Your full name" value={form.name} onChange={set('name')} className={inputCls(errors.name)} />
                </Field>
                <Field label="Phone Number" id="phone" required error={errors.phone}>
                  <input id="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} className={inputCls(errors.phone)} />
                </Field>
              </div>

              <div className="mb-5">
                <Field label="Email (optional)" id="email">
                  <input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} className={inputCls()} />
                </Field>
              </div>

              <div className="mb-5">
                <Field label="What will you teach?" id="subject" required error={errors.subject}>
                  <input id="subject" placeholder="e.g. IELTS Prep, Coding, School Tuition" value={form.subject} onChange={set('subject')} className={inputCls(errors.subject)} />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Student Category" id="studentType" required error={errors.studentType} isPrefilled={highlightFields}>
                  <div className="relative">
                    <select id="studentType" value={form.studentType} onChange={set('studentType')} className={inputCls(errors.studentType, highlightFields)}>
                      <option value="" disabled>Select category</option>
                      {studentTypes.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Expected Batch Size" id="batchSize" required error={errors.batchSize} isPrefilled={highlightFields}>
                  <input id="batchSize" type="number" min={1} max={24} placeholder="e.g. 8" value={form.batchSize} onChange={set('batchSize')} className={inputCls(errors.batchSize, highlightFields)} />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Preferred Cabin Size" id="cabinCapacity" isPrefilled={highlightFields}>
                  <select id="cabinCapacity" value={form.cabinCapacity} onChange={set('cabinCapacity')} className={inputCls(false, highlightFields)}>
                    <option value="" disabled>Select size</option>
                    {cabinOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Preferred Days" id="days" required error={errors.days}>
                  <input id="days" placeholder="e.g. Mon, Wed, Fri" value={form.days} onChange={set('days')} className={inputCls(errors.days)} />
                </Field>
              </div>

              <div className="mb-5">
                <Field label="Preferred Session Time" id="time" required error={errors.time}>
                  <select id="time" value={form.time} onChange={set('time')} className={inputCls(errors.time)}>
                    <option value="" disabled>Select time slot</option>
                    {timeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              </div>

              <div className="mb-7">
                <Field label="Additional Requirements & Quoted Notes" id="notes">
                  <textarea id="notes" rows={3} placeholder="Any specific display, projector, or scheduling requests..." value={form.notes} onChange={set('notes')} className={`${inputCls()} resize-none`} />
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleWA}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-body font-bold text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#20c05a] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  whileHover={!isSubmitting ? { scale: 1.01 } : undefined}
                  whileTap={!isSubmitting ? { scale: 0.99 } : undefined}
                >
                  <MessageCircle size={16} />Send via WhatsApp
                </motion.button>
                <motion.button
                  onClick={handleCopy}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-[#8B6914] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#8B6914] hover:text-white transition-colors disabled:opacity-50 cursor-pointer bg-white"
                  whileHover={!isSubmitting ? { scale: 1.01 } : undefined}
                  whileTap={!isSubmitting ? { scale: 0.99 } : undefined}
                >
                  <Send size={15} />Copy Request
                </motion.button>
              </div>

              <AnimatePresence>
                {status === 'wa-error' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-sm">
                    <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
                    <p className="font-mono text-xs text-red-700 font-medium">{FALLBACK_MSG}</p>
                  </motion.div>
                )}
                {status === 'copied' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-[#C9A96B] rounded-sm">
                    <CheckCircle2 size={14} className="text-[#8B6914] flex-shrink-0" />
                    <p className="font-body text-sm text-[#1A1A1A] font-medium">
                      Enquiry details copied! Share with our facility manager via WhatsApp or email.
                    </p>
                  </motion.div>
                )}
                {status === 'whatsapp' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded-sm">
                    <CheckCircle2 size={14} className="text-green-700 flex-shrink-0" />
                    <p className="font-body text-sm text-[#1A1A1A] font-medium">WhatsApp opened with your enquiry pre-filled.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="font-mono text-[10px] text-[#5C450C] mt-4 text-center leading-relaxed font-semibold">
                Slots confirmed only after manager review. Never double-booked.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
