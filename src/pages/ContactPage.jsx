import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { getLocalBusinessSchema } from '../components/seo/schema';
import { MapPin, Phone, Mail, MessageCircle, Clock, CheckCircle2, AlertCircle, Send, ExternalLink } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { siteConfig } from '../config/siteConfig';

const CONTACT = {
  phone:    siteConfig.contact.phone,
  whatsapp: siteConfig.contact.whatsapp,
  email:    siteConfig.contact.email,
  address:  `${siteConfig.contact.address.floorUnit}, ${siteConfig.contact.address.mallName}, Golf Course Extension Road, Sector 57, Gurugram, Haryana — 122003`,
  mapsUrl:  siteConfig.contact.mapsUrl,
};

const initial = {
  name: '', phone: '', email: '', subject: '',
  studentType: '', batchSize: '', cabinCapacity: '',
  days: '', time: '', notes: '',
};

const studentTypes = ['School students (Grade 5 and above)', 'Adults', 'Mixed ages (Grade 5 and above)'];
const timeOpts = [
  'Session 1: 10:00 – 11:00 am', 'Session 2: 11:07 am – 12:07 pm',
  'Session 3: 12:14 – 1:14 pm',  'Session 4: 1:21 – 2:21 pm',
  'Session 5: 2:28 – 3:28 pm',
  'Session 1: 3:30 – 4:25 pm (evening)', 'Session 2: 4:31 – 5:26 pm (evening)',
  'Session 3: 5:32 – 6:27 pm (evening)', 'Session 4: 6:33 – 7:28 pm (evening)',
  'Session 5: 7:34 – 8:29 pm (evening)',
];
const cabinOpts = ['6 seats', '8 seats', '10 seats', '12 seats', '16 seats (Arts & Crafts)', '24 seats', 'Not sure yet'];

function Field({ label, required, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#A89880]">
        {label}{required && <span className="text-[#C9A96B] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 font-mono text-[10px] text-red-400">
          <AlertCircle size={10} />{error}
        </span>
      )}
    </div>
  );
}

const inputCls = (err) =>
  `w-full bg-[#1A1A1A] border rounded-sm px-4 py-3 font-body text-sm text-[#F7F2EA] placeholder-[#3A3228] focus:outline-none transition-colors ${
    err ? 'border-red-500/50 focus:border-red-500' : 'border-[#3A3228] focus:border-[#C9A96B]'
  }`;

function buildWA(f) {
  return encodeURIComponent(
    `*Mentors Studio — Space Enquiry*\n\n` +
    `Name: ${f.name}\nPhone: ${f.phone}\n` +
    (f.email ? `Email: ${f.email}\n` : '') +
    `Teaching: ${f.subject}\nStudents: ${f.studentType}\nBatch: ${f.batchSize}\n` +
    `Cabin: ${f.cabinCapacity}\nDays: ${f.days}\nTime: ${f.time}\n` +
    (f.notes ? `Notes: ${f.notes}\n` : '') +
    `\nFrom ${siteConfig.domain}`
  );
}

export function ContactPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name = 'Required';
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{8,}$/.test(form.phone.trim())) e.phone = 'Valid phone required';
    if (!form.subject.trim()) e.subject = 'Required';
    if (!form.studentType)    e.studentType = 'Required';
    if (!form.batchSize)      e.batchSize = 'Required';
    if (!form.days.trim())    e.days = 'Required';
    if (!form.time)           e.time = 'Required';
    return e;
  };

  const saveEnquiry = (submittedVia) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        subject: form.subject.trim(),
        student_type: form.studentType,
        batch_size: parseInt(form.batchSize, 10) || 1,
        cabin_capacity: form.cabinCapacity || null,
        days: form.days.trim(),
        time_slot: form.time,
        notes: form.notes.trim() || null,
        submitted_via: submittedVia,
        status: 'new',
      };

      supabase
        .from('enquiries')
        .insert([payload])
        .then(({ error }) => {
          if (error) {
            console.warn('[Enquiry Sync] Could not save enquiry to Supabase:', error.message);
          }
        })
        .catch((err) => {
          console.warn('[Enquiry Sync] Network error dispatching enquiry:', err);
        });
    } catch (err) {
      console.warn('[Enquiry Sync] Unexpected error:', err);
    }
  };

  const handleWA = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    saveEnquiry('whatsapp');
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${buildWA(form)}`, '_blank');
    setStatus('whatsapp');
    setTimeout(() => setStatus('idle'), 4000);
  };

  const handleCopy = () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    saveEnquiry('copy');
    const msg = `Mentors Studio Enquiry\n\nName: ${form.name}\nPhone: ${form.phone}\n${form.email ? `Email: ${form.email}\n` : ''}Teaching: ${form.subject}\nStudents: ${form.studentType}\nBatch: ${form.batchSize}\nCabin: ${form.cabinCapacity}\nDays: ${form.days}\nTime: ${form.time}\n${form.notes ? `Notes: ${form.notes}` : ''}`;
    navigator.clipboard.writeText(msg).then(() => setStatus('copied'));
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <div className="bg-premium-dark min-h-screen">
      <SEO
        title="Contact & Location | Mentors Studio, Golf Course Extension Road, Gurugram"
        description={`Visit Mentors Studio on Golf Course Extension Road, Sector 57, Gurugram. ${CONTACT.phone} · ${CONTACT.email} · Monday–Saturday, 10am–8:29pm.`}
        canonicalPath="/contact"
        schema={getLocalBusinessSchema()}
        breadcrumbs={[{ name: 'Contact & Location', path: '/contact' }]}
      />

      <PageHero
        label="Contact & Location"
        title="Visit Us on Golf Course Extension Road, Sector 57"
        subtitle="Schedule a walkthrough, discuss your teaching schedule, and tour our 9 fully equipped classroom cabins. Conveniently located on Golf Course Extension Road in Sector 57, Gurugram."
        image="/images/reception-lobby.png"
        cta={{ label: 'Send an Enquiry', to: '#enquiry-form' }}
      />

      <Breadcrumbs items={[{ name: 'Contact & Location' }]} />

      {/* Contact details bar */}
      <div className="bg-[#231F1B] border-b border-[#3A3228]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Phone,         label: 'Phone',    value: CONTACT.phone,    ph: true },
            { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsapp, ph: true },
            { icon: Mail,          label: 'Email',    value: CONTACT.email,    ph: true },
            { icon: MapPin,        label: 'Location', value: 'Sector 57, Gurugram', ph: false },
          ].map(({ icon: Icon, label, value, ph }) => (
            <div key={label} className={`flex items-center gap-3 ${ph ? 'opacity-65' : ''}`}>
              <div className="w-9 h-9 bg-[#3E2F1F]/40 rounded-sm flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-[#C9A96B]" />
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#A89880]">{label}{ph && ' — to be updated'}</p>
                <p className="font-body text-sm text-[#F7F2EA] mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left: info */}
          <AnimatedSection direction="left" className="lg:col-span-4">
            <SectionLabel>Book Your Space</SectionLabel>
            <h2 className="font-display font-bold text-[#F7F2EA] text-2xl mb-4 leading-snug">
              Your Next Class Starts Here.
            </h2>
            <p className="font-body text-[#A89880] text-base leading-relaxed mb-8">
              Fill in the form and our on-site facility manager will get back to confirm your recurring slots. This is an enquiry — not an automatic booking. Every slot is personally reviewed to ensure perfect cabin availability.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-4 mb-8">
              {[
                { n: '01', t: 'Submit this enquiry with your requirements' },
                { n: '02', t: 'Manager reviews your batch size & timings' },
                { n: '03', t: 'Slots confirmed on the shared master calendar' },
                { n: '04', t: 'Teach your students — receive monthly invoice' },
              ].map(({ n, t }) => (
                <div key={n} className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[#C9A96B] w-8 flex-shrink-0 font-bold">{n}</span>
                  <span className="font-body text-sm text-[#A89880]">{t}</span>
                </div>
              ))}
            </div>

            {/* Operating hours */}
            <div className="p-5 border border-[#3A3228] rounded-sm bg-[#1A1A1A] mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={13} className="text-[#C9A96B]" />
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#A89880]">Operating Hours</p>
              </div>
              <p className="font-display font-semibold text-[#F7F2EA] text-sm">Monday – Saturday</p>
              <p className="font-mono text-xs text-[#A89880] mt-0.5">10:00 am – 8:29 pm</p>
              <p className="font-display font-semibold text-[#F7F2EA] text-sm mt-3">Three Sundays per month</p>
              <p className="font-mono text-xs text-[#A89880] mt-0.5">By prior scheduling with manager</p>
            </div>

            {/* Location */}
            <div className="p-5 border border-[#3A3228] rounded-sm bg-[#1A1A1A]">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={13} className="text-[#C9A96B]" />
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#A89880]">Physical Location</p>
              </div>
              <p className="font-body text-sm text-[#F7F2EA] leading-relaxed">
                {siteConfig.contact.address.street}<br />
                {siteConfig.contact.address.city}, {siteConfig.contact.address.region} — {siteConfig.contact.address.postalCode}
              </p>
              <p className="font-mono text-[10px] text-[#C9A96B] mt-2">Exact mall suite to be confirmed</p>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 font-mono text-[11px] text-[#C9A96B] hover:text-[#D4B87A] transition-colors"
              >
                <ExternalLink size={11} />
                Open in Google Maps
              </a>
            </div>
          </AnimatedSection>

          {/* Right: form */}
          <AnimatedSection direction="right" className="lg:col-span-8">
            <div id="enquiry-form" className="bg-[#1A1A1A] border border-[#3A3228] rounded-sm p-6 lg:p-8 scroll-mt-28">
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
                  <input id="subject" placeholder="e.g. IELTS Preparation, Advanced Excel, School Maths Grade 10" value={form.subject} onChange={set('subject')} className={inputCls(errors.subject)} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Student Category" id="studentType" required error={errors.studentType}>
                  <select id="studentType" value={form.studentType} onChange={set('studentType')} className={inputCls(errors.studentType)}>
                    <option value="" disabled>Select category</option>
                    {studentTypes.map((o) => <option key={o} value={o}>{o}</option>)}
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
                    {cabinOpts.map((o) => <option key={o} value={o}>{o}</option>)}
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
                    {timeOpts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <div className="mb-8">
                <Field label="Additional Requirements" id="notes">
                  <textarea id="notes" rows={3} placeholder="Special equipment, student requests, or anything else..." value={form.notes} onChange={set('notes')} className={`${inputCls()} resize-none`} />
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleWA}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-display font-bold text-sm rounded-sm hover:bg-[#20c05a] transition-colors"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                >
                  <MessageCircle size={16} />
                  Send via WhatsApp
                </motion.button>
                <motion.button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border border-[#C9A96B] text-[#C9A96B] font-display font-semibold text-sm rounded-sm hover:bg-[#C9A96B]/8 transition-colors"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                >
                  <Send size={15} />
                  Copy Request Text
                </motion.button>
              </div>

              <AnimatePresence>
                {status === 'copied' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-[#C9A96B]/10 border border-[#C9A96B]/30 rounded-sm">
                    <CheckCircle2 size={14} className="text-[#C9A96B]" />
                    <p className="font-body text-sm text-[#F7F2EA]">
                      Copied! Send to the manager on WhatsApp or email: <span className="font-mono text-[#C9A96B]">{CONTACT.email}</span>
                    </p>
                  </motion.div>
                )}
                {status === 'whatsapp' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-sm">
                    <CheckCircle2 size={14} className="text-green-400" />
                    <p className="font-body text-sm text-[#F7F2EA]">WhatsApp opened with your enquiry pre-filled.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="font-mono text-[10px] text-[#A89880] mt-4 text-center leading-relaxed">
                This is an enquiry form. Booking is confirmed only after manager approval. Not an automatic reservation.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
