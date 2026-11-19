import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink } from 'lucide-react';
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: Contact Info */}
          <AnimatedSection direction="left">
            <SectionLabel>Get in Touch</SectionLabel>
            <h2
              className="font-display font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)' }}
            >
              The Right Space for{' '}
              <span className="text-[#8B6914] italic">Every Teaching Ambition.</span>
            </h2>
            <p className="font-body text-[#3E2F1F] text-base leading-relaxed mb-8 font-normal">
              Visit Mentors Studio at Golf Course Extension Road, Sector 57, Gurugram. Explore our furnished cabins and open spaces, and find the right setup for your teaching needs.
            </p>

            {/* Hours */}
            <div className="p-5 border border-[#DDD0B8] rounded-sm bg-[#FFFDF9] mb-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={15} className="text-[#8B6914]" />
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] font-bold">
                  Operating Hours
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-display font-bold text-[#1A1A1A] text-sm">Monday – Saturday</p>
                  <p className="font-mono text-xs text-[#3E2F1F] mt-0.5 font-medium">10:00 am – 8:25 pm</p>
                </div>
                <div>
                  <p className="font-display font-bold text-[#1A1A1A] text-sm">Three Sundays a month</p>
                  <p className="font-mono text-xs text-[#3E2F1F] mt-0.5 font-medium">By prior manager scheduling</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: Phone,         label: 'Phone',    value: CONTACT.phone,    href: `tel:${CONTACT.phone.replace(/[^\d+]/g, '')}` },
                { icon: MessageCircle, label: 'WhatsApp', value: '+91 99900 35865', href: `https://wa.me/${CONTACT.whatsapp}` },
                { icon: Mail,          label: 'Email',    value: CONTACT.email,    href: `mailto:${CONTACT.email}` },
                { icon: MapPin,        label: 'Location', value: 'Golf Course Extension Road, Sector 57, Gurugram, Haryana — 122003', href: CONTACT.mapsUrl },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Phone' || label === 'Email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-4 border border-[#DDD0B8] rounded-sm bg-[#F7F2EA] transition-all hover:border-[#8B6914] group shadow-xs"
                >
                  <div className="w-9 h-9 bg-[#EADCC8] border border-[#DDD0B8] rounded-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#8B6914] transition-colors">
                    <Icon size={15} className="text-[#8B6914] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5C450C] font-bold">
                      {label}
                    </p>
                    <p className="font-body text-sm text-[#1A1A1A] mt-0.5 leading-relaxed font-semibold group-hover:text-[#8B6914] transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: Embedded Interactive Google Map per Section 14 */}
          <AnimatedSection direction="right">
            <div className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] h-[540px] flex flex-col shadow-lg shadow-[#C9A96B]/6">
              <iframe
                src="https://maps.google.com/maps?q=Golf+Course+Extension+Road+Sector+57+Gurugram&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full flex-1 border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Mentors Studio Location Map"
              />
              <div className="border-t border-[#DDD0B8] p-4 bg-[#FFFDF9] flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5C450C] font-bold mb-0.5">
                    Interactive Map
                  </p>
                  <p className="font-body text-xs sm:text-sm text-[#1A1A1A] font-semibold">
                    Golf Course Extension Road, Sector 57, Gurugram
                  </p>
                </div>
                <a
                  href={CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1A] text-[#F7F2EA] hover:bg-[#8B6914] text-xs font-mono uppercase tracking-wider rounded-xs transition-colors font-bold"
                >
                  <ExternalLink size={12} />
                  Open in Maps
                </a>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
}
