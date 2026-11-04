import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

const CONTACT = {
  phone:    siteConfig.contact.phone,
  whatsapp: siteConfig.contact.whatsapp,
  email:    siteConfig.contact.email,
  address:  `${siteConfig.contact.address.floorUnit}, ${siteConfig.contact.address.mallName}, Golf Course Extension Road, Sector 57, Gurugram, Haryana — 122003`,
  mapsUrl:  siteConfig.contact.mapsUrl,
};

export function Contact() {
  return (
    <section id="contact" className="section-pad bg-[#F7F2EA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <AnimatedSection direction="left">
            <SectionLabel>Get in Touch</SectionLabel>
            <h2 className="font-display font-bold text-[#1A1A1A] leading-[1.06] tracking-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)' }}>
              Let's Build a Better Space{' '}
              <span className="text-gradient italic">for Your Teaching.</span>
            </h2>
            <p className="font-body text-[#7A6A50] text-base leading-relaxed mb-8 font-light">
              Visit us on Golf Course Extension Road, Sector 57, Gurugram. Walk in during operating hours, or reach out to the manager.
            </p>

            {/* Hours */}
            <div className="p-5 border border-[#DDD0B8] rounded-sm bg-[#F7F2EA] mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={13} className="text-[#C9A96B]" />
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#7A6A50]">Operating Hours</p>
              </div>
              <p className="font-display font-semibold text-[#1A1A1A] text-sm">Monday – Saturday</p>
              <p className="font-mono text-xs text-[#7A6A50] mt-0.5">10:00 am – 8:29 pm</p>
              <p className="font-display font-semibold text-[#1A1A1A] text-sm mt-3">Three Sundays a month</p>
              <p className="font-mono text-xs text-[#7A6A50] mt-0.5">Schedule confirmed with manager</p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: Phone,         label: 'Phone',    value: CONTACT.phone,    ph: true },
                { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsapp, ph: true },
                { icon: Mail,          label: 'Email',    value: CONTACT.email,    ph: true },
                { icon: MapPin,        label: 'Location', value: CONTACT.address,  ph: false },
              ].map(({ icon: Icon, label, value, ph }) => (
                <div key={label} className={`flex items-start gap-4 p-4 border border-[#DDD0B8] rounded-sm bg-[#F7F2EA] transition-all ${ph ? 'opacity-60' : 'hover:border-[#C9A96B]/40'}`}>
                  <div className="w-9 h-9 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#C9A96B]" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#7A6A50]">{label}{ph && ' — to be updated'}</p>
                    <p className="font-body text-sm text-[#1A1A1A] mt-0.5 leading-relaxed">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: Map placeholder */}
          <AnimatedSection direction="right">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] h-[500px] flex flex-col shadow-lg shadow-[#C9A96B]/6">
              <div className="flex-1 bg-[#F7F2EA] flex flex-col items-center justify-center gap-5 relative">
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: 'radial-gradient(circle, #C9A96B22 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }} />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-[#F7F2EA] border-2 border-[#C9A96B]/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MapPin size={26} className="text-[#C9A96B]" />
                  </div>
                  <p className="font-display font-bold text-[#1A1A1A] text-lg mb-1">Mentors Studio</p>
                  <p className="font-body text-[#7A6A50] text-sm leading-relaxed max-w-[220px] text-center font-light">
                    Golf Course Extension Road<br />Sector 57, Gurugram<br />Haryana — 122003
                  </p>
                </div>
                <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="relative z-10 flex items-center gap-2 px-5 py-2.5 border border-[#C9A96B]/50 text-[#3E2F1F] font-mono text-[10px] rounded-sm hover:bg-[#C9A96B]/10 transition-colors">
                  <MapPin size={11} />Open in Google Maps
                </a>
              </div>
              <div className="border-t border-[#DDD0B8] p-4 bg-[#F7F2EA]">
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#7A6A50] mb-1">Exact address</p>
                <p className="font-body text-sm text-[#1A1A1A]">[Floor and Unit], [Mall Name]<br />Golf Course Extension Road, Sector 57, Gurugram</p>
                <p className="font-mono text-[9px] text-[#C9A96B] mt-1">Address to be confirmed — placeholder shown</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
