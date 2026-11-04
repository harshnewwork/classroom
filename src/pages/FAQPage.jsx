import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight, PhoneCall, MessageCircle } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { getFAQSchema } from '../components/seo/schema';
import { FAQS } from '../data/faqs';
import { siteConfig } from '../config/siteConfig';

const categories = ['All', 'Pricing & Billing', 'Booking & Commitment', 'Facilities & Tech', 'Location & Access', 'Programmes & Rules', 'Educator Guidance'];

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIds, setOpenIds] = useState(() => new Set([FAQS[0].id, FAQS[1].id]));

  const filteredFaqs = activeCategory === 'All'
    ? FAQS
    : FAQS.filter(f => f.category === activeCategory);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="bg-warm-stone min-h-screen">
      <SEO
        title="Frequently Asked Questions | Classroom Rental at Mentors Studio"
        description="Clear answers about classroom rental costs, deposits, facilities, timings, and minimum seat billing at Mentors Studio in Sector 57, Gurugram."
        canonicalPath="/faq"
        schema={getFAQSchema(FAQS)}
        breadcrumbs={[{ name: 'FAQ', path: '/faq' }]}
      />

      <PageHero
        label="FAQ & Knowledge Base"
        title={<>Frequently Asked Questions — <span className="text-gradient">Classroom Rental in Gurugram</span></>}
        subtitle="Everything you need to know about renting fully equipped teaching cabins on Golf Course Extension Road, Sector 57. From per-seat billing to cabin specs and Sunday schedules."
        image="/images/classroom-seminar.png"
        cta={{ label: 'Ask a Question', to: '/contact' }}
      />

      <Breadcrumbs items={[{ name: 'Frequently Asked Questions' }]} />

      {/* Main FAQ Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <AnimatedSection className="mb-8">
          <SectionLabel>Help & Answers</SectionLabel>
          <h2 className="font-display font-bold text-[#1A1A1A] text-2xl lg:text-3xl">
            Answers for Independent Educators & Coaches
          </h2>
          <p className="font-body text-[#7A6A50] text-sm mt-2 max-w-2xl font-light">
            Whether you are expanding from home tuition to a professional center or launching a new batch for IELTS, coding, or board exam coaching, find immediate clarity below.
          </p>
        </AnimatedSection>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#DDD0B8]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-sm font-mono text-[10.5px] tracking-[0.15em] uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-[#F7F2EA] shadow-sm'
                  : 'bg-[#F7F2EA] border border-[#DDD0B8] text-[#7A6A50] hover:border-[#C9A96B] hover:text-[#3E2F1F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3.5 mb-16">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.has(faq.id);
            return (
              <div
                key={faq.id}
                className={`border rounded-sm transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#C9A96B] bg-[#F7F2EA] shadow-md shadow-[#C9A96B]/5'
                    : 'border-[#DDD0B8] bg-[#F7F2EA]/80 hover:border-[#C9A96B]/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-sm bg-[#C9A96B]/15 text-[#C9A96B] flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      <HelpCircle size={14} />
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-[#1A1A1A] text-base sm:text-lg leading-snug">
                        {faq.question}
                      </h3>
                      <span className="inline-block mt-1 font-mono text-[9px] text-[#A89880] uppercase tracking-wider">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#C9A96B]' : 'text-[#7A6A50]'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#DDD0B8]/60 text-[#7A6A50] font-body text-sm sm:text-base leading-relaxed font-light pl-14"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Quick Links Cross-Reference */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          <div className="p-6 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm">
            <h4 className="font-display font-semibold text-[#1A1A1A] text-base mb-2">Detailed Pricing Calculator</h4>
            <p className="font-body text-[#7A6A50] text-sm mb-4 font-light">
              Calculate exact monthly costs based on batch size, educator category, and package savings.
            </p>
            <Link to="/pricing" className="inline-flex items-center gap-1.5 font-mono text-xs text-[#C9A96B] hover:text-[#3E2F1F] font-semibold">
              Explore Pricing Table <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-6 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm">
            <h4 className="font-display font-semibold text-[#1A1A1A] text-base mb-2">Browse 9 Teaching Cabins</h4>
            <p className="font-body text-[#7A6A50] text-sm mb-4 font-light">
              Explore photos, seat layouts, whiteboard setups, and display technology for 6 to 24-seat rooms.
            </p>
            <Link to="/spaces" className="inline-flex items-center gap-1.5 font-mono text-xs text-[#C9A96B] hover:text-[#3E2F1F] font-semibold">
              View All Spaces <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-6 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm">
            <h4 className="font-display font-semibold text-[#1A1A1A] text-base mb-2">Booking Process in 4 Steps</h4>
            <p className="font-body text-[#7A6A50] text-sm mb-4 font-light">
              Learn how to visit, test in-cabin AV equipment, lock in your weekly time slots, and get started.
            </p>
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 font-mono text-xs text-[#C9A96B] hover:text-[#3E2F1F] font-semibold">
              How Booking Works <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Still have questions banner */}
        <div className="bg-[#1A1A1A] text-[#F7F2EA] rounded-sm p-8 lg:p-10 border border-[#C9A96B]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F7F2EA] mb-2">
              Have a specific scheduling or batch question?
            </h3>
            <p className="font-body text-[#A89880] text-sm max-w-xl font-light">
              Speak directly with our on-site facility manager. We can arrange a walkthrough and a complimentary demo session with your students.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C9A96B] text-[#1A1A1A] font-body font-bold text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[#D4B87A] transition-colors"
            >
              <MessageCircle size={14} /> Send an Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

