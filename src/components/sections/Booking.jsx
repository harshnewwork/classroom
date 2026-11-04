import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { CheckCircle2, AlertCircle, Send, MessageCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { siteConfig } from '../../config/siteConfig';

const MANAGER_WHATSAPP = siteConfig.contact.whatsapp;
const STUDIO_EMAIL     = siteConfig.contact.email;
const PLACEHOLDER_PATTERN = /^\[.*\]$/;
const FALLBACK_MSG = "WhatsApp isn't set up yet, please use Copy Request or email us directly.";

const initial = { name:'', phone:'', email:'', subject:'', studentType:'', batchSize:'', cabinCapacity:'', days:'', time:'', notes:'' };
const studentTypes = ['School students (Grade 5 and above)', 'Adults', 'Mixed ages (Grade 5 and above)'];
const timeOptions  = ['Session 1: 10:00 – 11:00 am','Session 2: 11:07 am – 12:07 pm','Session 3: 12:14 – 1:14 pm','Session 4: 1:21 – 2:21 pm','Session 5: 2:28 – 3:28 pm','Session 1: 3:30 – 4:25 pm (evening)','Session 2: 4:31 – 5:26 pm (evening)','Session 3: 5:32 – 6:27 pm (evening)','Session 4: 6:33 – 7:28 pm (evening)','Session 5: 7:34 – 8:29 pm (evening)'];
const cabinOptions = ['6 seats','8 seats','10 seats','12 seats','16 seats (Arts & Crafts)','24 seats','Not sure yet'];

const inputCls = (err) =>
  `w-full bg-[#F7F2EA] border rounded-sm px-4 py-3 font-body text-sm text-[#1A1A1A] placeholder-[#A89880] focus:outline-none transition-colors ${
    err ? 'border-red-400 focus:border-red-500' : 'border-[#DDD0B8] focus:border-[#C9A96B]'
  }`;

function Field({ label, id, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50]">
        {label}{required && <span className="text-[#C9A96B] ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="flex items-center gap-1 font-mono text-[10px] text-red-500"><AlertCircle size={10}/>{error}</span>}
    </div>
  );
}

export function Booking() {
  const [form,   setForm]   = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name = 'Required';
    const phone = form.phone.trim();
    if (!phone || !/^\+?[\d\s\-()]{8,}$/.test(phone) || (phone.match(/\d/g) || []).length < 8) {
      e.phone = 'Valid phone required';
    }
    if (!form.subject.trim()) e.subject = 'Required';
    if (!form.studentType)   e.studentType = 'Required';
    const batchNum = parseInt(form.batchSize, 10);
    if (!form.batchSize || isNaN(batchNum) || batchNum <= 0) e.batchSize = 'Required';
    if (!form.days.trim())   e.days = 'Required';
    if (!form.time)          e.time = 'Required';
    return e;
  };

  const buildMsg = () =>
    `Mentors Studio — Space Enquiry\n\nName: ${form.name}\nPhone: ${form.phone}\n${form.email?`Email: ${form.email}\n`:''}Teaching: ${form.subject}\nStudents: ${form.studentType}\nBatch: ${form.batchSize}\nCabin: ${form.cabinCapacity}\nDays: ${form.days}\nTime: ${form.time}\n${form.notes?`Notes: ${form.notes}`:''}`;

  const saveEnquiry = (submittedVia) => {
    if (!isSupabaseConfigured || !supabase) {
      console.error('CRITICAL: Supabase is not configured; enquiry was not saved to database.');
      return;
    }
    try {
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
        notes: form.notes.trim() || null,
        submitted_via: submittedVia,
        status: 'new',
      };

      // Background non-blocking sync: failures will never block visitor action
      supabase
        .from('enquiries')
        .insert([payload])
        .then(({ error }) => {
          if (error) {
            console.error('CRITICAL: [Enquiry Sync] Could not save enquiry to Supabase:', error.message);
          }
        })
        .catch((err) => {
          console.error('CRITICAL: [Enquiry Sync] Network error dispatching enquiry:', err);
        });
    } catch (err) {
      console.error('CRITICAL: [Enquiry Sync] Unexpected error:', err);
    }
  };

  const handleCopy = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
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
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
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
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left info */}
          <AnimatedSection direction="left" className="lg:col-span-4">
            <SectionLabel>Book a Space</SectionLabel>
            <h2 className="font-display font-bold text-[#1A1A1A] leading-[1.06] tracking-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)' }}>
              Your Next Class{' '}
              <span className="text-gradient italic">Starts Here.</span>
            </h2>
            <p className="font-body text-[#7A6A50] text-sm leading-relaxed mb-8 font-light">
              Fill in the form and our manager will confirm your slots. This is an enquiry — every booking is personally reviewed.
            </p>
            <div className="flex flex-col gap-3.5 mb-10">
              {[['01','Submit your enquiry below.'],['02','Manager reviews your requirements.'],['03','Slots confirmed on the shared calendar.'],['04','Teach — receive your monthly invoice.']].map(([n,t]) => (
                <div key={n} className="flex items-center gap-4">
                  <span className="font-display italic text-[#C9A96B] text-sm w-8">{n}</span>
                  <span className="font-body text-sm text-[#7A6A50] font-light">{t}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border border-[#DDD0B8] rounded-sm bg-[#F7F2EA]">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#7A6A50] mb-2">Note</p>
              <p className="font-body text-xs text-[#7A6A50] leading-relaxed font-light">
                Submitting this form does not confirm or reserve a cabin. Your booking is confirmed only after the manager approves your slot.
              </p>
            </div>
          </AnimatedSection>

          {/* Right form */}
          <AnimatedSection direction="right" className="lg:col-span-8">
            <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-6 lg:p-8 shadow-lg shadow-[#C9A96B]/5">
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
                  <input id="subject" placeholder="e.g. IELTS Preparation, Advanced Excel, Arts & Crafts" value={form.subject} onChange={set('subject')} className={inputCls(errors.subject)} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Student Category" id="studentType" required error={errors.studentType}>
                  <select id="studentType" value={form.studentType} onChange={set('studentType')} className={inputCls(errors.studentType)}>
                    <option value="" disabled>Select category</option>
                    {studentTypes.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Expected Batch Size" id="batchSize" required error={errors.batchSize}>
                  <input id="batchSize" type="number" min={1} max={24} placeholder="e.g. 8" value={form.batchSize} onChange={set('batchSize')} className={inputCls(errors.batchSize)} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Preferred Cabin Size" id="cabinCapacity">
                  <select id="cabinCapacity" value={form.cabinCapacity} onChange={set('cabinCapacity')} className={inputCls()}>
                    <option value="" disabled>Select size</option>
                    {cabinOptions.map(o => <option key={o} value={o}>{o}</option>)}
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
                    {timeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <div className="mb-8">
                <Field label="Additional Requirements" id="notes">
                  <textarea id="notes" rows={3} placeholder="Special requirements, questions..." value={form.notes} onChange={set('notes')} className={`${inputCls()} resize-none`} />
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button onClick={handleWA}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-body font-bold text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#20c05a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  whileHover={!isSubmitting ? { scale: 1.01 } : undefined} whileTap={!isSubmitting ? { scale: 0.99 } : undefined}>
                  <MessageCircle size={15} />Send via WhatsApp
                </motion.button>
                <motion.button onClick={handleCopy}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border border-[#C9A96B] text-[#3E2F1F] font-body font-bold text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#C9A96B]/8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  whileHover={!isSubmitting ? { scale: 1.01 } : undefined} whileTap={!isSubmitting ? { scale: 0.99 } : undefined}>
                  <Send size={14} />Copy Request
                </motion.button>
              </div>

              <AnimatePresence>
                {status === 'wa-error' && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm">
                    <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                    <p className="font-mono text-xs text-red-500">{FALLBACK_MSG}</p>
                  </motion.div>
                )}
                {status === 'copied' && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-[#C9A96B]/10 border border-[#C9A96B]/30 rounded-sm">
                    <CheckCircle2 size={13} className="text-[#C9A96B] flex-shrink-0" />
                    <p className="font-body text-sm text-[#1A1A1A]">
                      {PLACEHOLDER_PATTERN.test(STUDIO_EMAIL) ? (
                        FALLBACK_MSG
                      ) : (
                        <>Copied! Send to the manager on WhatsApp or email: <span className="font-mono text-[#C9A96B]">{STUDIO_EMAIL}</span></>
                      )}
                    </p>
                  </motion.div>
                )}
                {status === 'whatsapp' && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-sm">
                    <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                    <p className="font-body text-sm text-[#1A1A1A]">WhatsApp opened with your enquiry pre-filled.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="font-mono text-[9px] text-[#A89880] mt-4 text-center leading-relaxed">
                Booking confirmed only after manager approval. Not an automatic reservation.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
