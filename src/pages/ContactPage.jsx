import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  'Adult 1: 10:00 – 11:00 am',
  'Adult 2: 11:05 am – 12:05 pm',
  'Adult 3: 12:10 – 1:10 pm',
  'Adult 4: 1:15 – 2:15 pm',
  'Adult 5: 2:20 – 3:20 pm',
  'Kids 1: 3:30 – 4:25 pm',
  'Kids 2: 4:30 – 5:25 pm',
  'Kids 3: 5:30 – 6:25 pm',
  'Kids 4: 6:30 – 7:25 pm',
  'Kids 5: 7:30 – 8:25 pm',
];

const cabinOpts = ['6 seats', '8 seats', '10 seats', '12 seats', '16 seats (Arts & Crafts)', '24 seats', 'Not sure yet'];

function Field({ label, required, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#F7F2EA] font-semibold">
        {label}{required && <span className="text-[#D4B87A] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 font-mono text-[10px] text-red-400 font-semibold">
          <AlertCircle size={11} />{error}
        </span>
      )}
    </div>
  );
}

const inputCls = (err) =>
  `w-full bg-[#231F1B] border rounded-sm px-4 py-3 font-body text-sm text-[#F7F2EA] placeholder-[#A89880] focus:outline-none transition-colors ${
    err ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'border-[#4A3E31] focus:border-[#C9A96B] focus:ring-1 focus:ring-[#C9A96B]'
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
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const timeParam = searchParams.get('time');
    if (timeParam) {
      setForm((f) => ({ ...f, time: timeParam }));
    }
  }, [searchParams]);

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
          if (error) console.warn('[Enquiry Sync] Could not save enquiry:', error.message);
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
        description="Visit Mentors Studio at Golf Course Extension Road, Sector 57, Gurugram. Explore our furnished cabins and open spaces, and find the right setup for your teaching needs."
        canonicalPath="/contact"
        schema={getLocalBusinessSchema()}
        breadcrumbs={[{ name: 'Contact & Location', path: '/contact' }]}
      />

      {/* PageHero updated per Section 9 */}
      <PageHero
        label="Contact & Location"
        title="The Right Space for Every Teaching Ambition."
        subtitle="Visit Mentors Studio at Golf Course Extension Road, Sector 57, Gurugram. Explore our furnished cabins and open spaces, and find the right setup for your teaching needs."
        image="/images/reception-lobby.png"
        cta={{ label: 'Send an Enquiry', to: '#enquiry-form' }}
      />

      <Breadcrumbs items={[{ name: 'Contact & Location' }]} />

      {/* Contact details bar */}
      <div className="bg-[#231F1B] border-b border-[#3A3228]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Phone,         label: 'Phone',    value: CONTACT.phone,    href: `tel:${CONTACT.phone.replace(/[^\d+]/g, '')}` },
            { icon: MessageCircle, label: 'WhatsApp', value: '+91 99900 35865', href: `https://wa.me/${CONTACT.whatsapp}` },
            { icon: Mail,          label: 'Email',    value: CONTACT.email,    href: `mailto:${CONTACT.email}` },
            { icon: MapPin,        label: 'Location', value: 'Sector 57, Gurugram', href: CONTACT.mapsUrl },
          ].map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={label === 'Phone' || label === 'Email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 bg-[#3E2F1F]/60 border border-[#4A3E31] rounded-xs flex items-center justify-center flex-shrink-0 group-hover:border-[#D4B87A] transition-colors">
                <Icon size={15} className="text-[#D4B87A]" />
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#A89880] font-semibold">{label}</p>
                <p className="font-body text-sm text-[#F7F2EA] mt-0.5 font-medium group-hover:text-[#D4B87A] transition-colors">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Left: info */}
          <AnimatedSection direction="left" className="lg:col-span-5">
            <SectionLabel dark>Book Your Space</SectionLabel>
            <h2 className="font-display font-bold text-[#F7F2EA] text-2xl lg:text-3xl mb-4 leading-snug">
              The Right Space for Every Teaching Ambition.
            </h2>
            <p className="font-body text-[#EADCC8] text-base leading-relaxed mb-8">
              Share your requirements and our team will get back to you to confirm cabin availability and suitable time slots.
            </p>

            {/* Operating hours */}
            <div className="p-5 border border-[#3A3228] rounded-sm bg-[#1A1A1A] mb-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={15} className="text-[#D4B87A]" />
                <p className="font-mono text-[10.5px] tracking-[0.15em] uppercase text-[#D4B87A] font-bold">Operating Hours</p>
              </div>
              <p className="font-display font-semibold text-[#F7F2EA] text-sm">Monday – Saturday</p>
              <p className="font-mono text-xs text-[#EADCC8] mt-0.5 font-medium">10:00 am – 8:25 pm</p>
              <p className="font-display font-semibold text-[#F7F2EA] text-sm mt-3">Three Sundays per month</p>
              <p className="font-mono text-xs text-[#EADCC8] mt-0.5 font-medium">By prior scheduling with manager</p>
            </div>

            {/* Embedded interactive Google Map per Section 14 */}
            <div className="border border-[#3A3228] rounded-sm overflow-hidden bg-[#1A1A1A] shadow-lg">
              <div className="p-4 border-b border-[#3A3228] flex items-center justify-between bg-[#231F1B]">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#D4B87A]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#F7F2EA] font-bold">Interactive Location Map</span>
                </div>
                <a
                  href={CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#D4B87A] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink size={11} /> Open
                </a>
              </div>
              <div className="h-[280px]">
                <iframe
                  src="https://maps.google.com/maps?q=Golf+Course+Extension+Road+Sector+57+Gurugram&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mentors Studio Location"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Right: form — High contrast brand palette */}
          <AnimatedSection direction="right" className="lg:col-span-7">
            <div id="enquiry-form" className="bg-[#1A1A1A] border border-[#3A3228] rounded-sm p-6 lg:p-8 scroll-mt-28 shadow-xl">
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
                  <input id="subject" placeholder="e.g. IELTS Preparation, Coding, Advanced Excel" value={form.subject} onChange={set('subject')} className={inputCls(errors.subject)} />
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
                  <textarea id="notes" rows={3} placeholder="Special equipment, projector requests, or student requirements..." value={form.notes} onChange={set('notes')} className={`${inputCls()} resize-none`} />
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleWA}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-display font-bold text-sm rounded-sm hover:bg-[#20c05a] transition-colors cursor-pointer shadow-sm"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                >
                  <MessageCircle size={16} />
                  Send via WhatsApp
                </motion.button>
                <motion.button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-[#D4B87A] text-[#F7F2EA] font-display font-semibold text-sm rounded-sm hover:bg-[#D4B87A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                >
                  <Send size={15} />
                  Copy Request Text
                </motion.button>
              </div>

              <AnimatePresence>
                {status === 'copied' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-[#C9A96B]/15 border border-[#C9A96B]/40 rounded-sm">
                    <CheckCircle2 size={15} className="text-[#D4B87A]" />
                    <p className="font-body text-sm text-[#F7F2EA]">
                      Copied! Send directly to our facility manager on WhatsApp or email.
                    </p>
                  </motion.div>
                )}
                {status === 'whatsapp' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 p-3 bg-green-500/15 border border-green-500/40 rounded-sm">
                    <CheckCircle2 size={15} className="text-green-400" />
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
