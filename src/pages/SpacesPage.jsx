import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ChevronRight, Users, ArrowRight, Sparkles } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { SEO } from '../components/seo/SEO';
import { cabins } from '../data/cabins';

const typeColors = {
  'Standard':  { bg: '#3E2F1F', text: '#EADCC8', anchor: 'standard-cabins' },
  'Medium':    { bg: '#5A4A2A', text: '#EADCC8', anchor: 'medium-cabins' },
  'Large':     { bg: '#C9A96B', text: '#1A1A1A', anchor: 'large-cabins' },
  'Seminar':   { bg: '#1A1A1A', text: '#C9A96B', anchor: 'seminar-cabins' },
  'Open Area': { bg: '#2A3A20', text: '#D4E8C2', anchor: 'open-area' },
};

function CapacityBar({ capacity, minBillable }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {Array.from({ length: capacity }, (_, i) => (
          <div
            key={i}
            title={i < minBillable ? 'Minimum billing' : 'Pay per use'}
            className={`w-5 h-5 rounded-xs border transition-colors ${
              i < minBillable
                ? 'bg-[#8B6914] border-[#5C450C]'
                : 'bg-[#EADCC8] border-[#A89880]'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-5 text-[11px] font-mono text-[#3E2F1F] font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#8B6914] border border-[#5C450C] rounded-xs inline-block" />
          Minimum Billing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#EADCC8] border border-[#A89880] rounded-xs inline-block" />
          Pay Per Use
        </span>
      </div>
    </div>
  );
}

export function SpacesPage() {
  const [selected,    setSelected]    = useState(cabins[0]);
  const [filterType,  setFilterType]  = useState('All');

  const types    = ['All', ...Object.keys(typeColors)];
  const filtered = filterType === 'All' ? cabins : cabins.filter(c => c.type === filterType);

  return (
    <div className="bg-warm-stone min-h-screen">
      <SEO
        title="Classroom Cabins for Rent (6–24 Seats) | Mentors Studio, Gurugram"
        description="9 furnished teaching cabins from 6 to 24 seats, plus an open-air balcony and arts area. Whiteboards, AC, Wi-Fi and display tech in every room."
        canonicalPath="/spaces"
        breadcrumbs={[{ name: 'Spaces', path: '/spaces' }]}
      />

      <PageHero
        label="Our Spaces & Cabins"
        title="Find a Space That Fits Your Teaching Needs."
        subtitle="Nine dedicated teaching cabins from 6 to 24 seats, plus an open-air balcony and dedicated arts space. Fully furnished with climate-controlled AC, high-speed Wi-Fi, and presentation displays."
        image="/images/classroom-seminar.png"
        cta={{ label: 'Book a Space', to: '/contact#enquiry-form' }}
      />

      <Breadcrumbs items={[{ name: 'Spaces & Cabins' }]} />

      {/* Stats */}
      <div className="bg-[#1A1A1A] border-b border-[#3A3228]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[['9','Teaching cabins'],['2','Open areas'],['120','Total seats'],['6–24','Seats per cabin']].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-display font-bold text-[#D4B87A] text-3xl italic">{v}</p>
              <p className="font-mono text-[9.5px] text-[#EADCC8] mt-1 tracking-wider uppercase font-semibold">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Overview */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-4">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#8B6914]" />
            <h2 className="font-display font-bold text-[#1A1A1A] text-xl sm:text-2xl">
              Designed for Independent Educators
            </h2>
          </div>
          <p className="font-body text-[#3E2F1F] text-base leading-relaxed font-normal mb-6">
            Professional teaching spaces with furnished cabins, digital displays, whiteboards and high-speed Wi-Fi. Choose from 9 private cabins and 2 open spaces, accommodating groups of 6–24 students.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link to="/pricing" className="text-[#8B6914] hover:text-[#5C450C] font-bold inline-flex items-center gap-1.5 transition-colors">
              View Pricing <ArrowRight size={13} />
            </Link>
            <span className="text-[#DDD0B8]">|</span>
            <Link to="/facilities" className="text-[#8B6914] hover:text-[#5C450C] font-bold inline-flex items-center gap-1.5 transition-colors">
              Explore Facilities <ArrowRight size={13} />
            </Link>
            <span className="text-[#DDD0B8]">|</span>
            <Link to="/how-it-works" className="text-[#8B6914] hover:text-[#5C450C] font-bold inline-flex items-center gap-1.5 transition-colors">
              How It Works <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Min billing note */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-10 pt-2 pb-4">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#EADCC8] border border-[#DDD0B8] rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users size={18} className="text-[#8B6914]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#1A1A1A] text-base mb-1">
                How Minimum Billing Works
              </h3>
              <p className="font-body text-[#3E2F1F] text-sm leading-relaxed font-normal max-w-2xl">
                A minimum of 80% of cabin capacity is billed per session. Pay for additional seats only when used.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[11px] font-mono text-[#3E2F1F] font-semibold flex-shrink-0 bg-white/70 px-4 py-2.5 rounded-sm border border-[#DDD0B8]/80">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#8B6914] border border-[#5C450C] rounded-xs inline-block" />
              Minimum Billing
            </span>
            <span className="text-[#DDD0B8]">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#EADCC8] border border-[#A89880] rounded-xs inline-block" />
              Pay Per Use
            </span>
          </div>
        </div>
      </AnimatedSection>

      {/* Cabin Category Anchor Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-4 pb-2">
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-[#3E2F1F]">
          <span className="uppercase tracking-wider text-[10px] text-[#5C450C] font-bold">Jump to category:</span>
          {Object.entries(typeColors).map(([type, meta]) => (
            <a
              key={type}
              href={`#${meta.anchor}`}
              className="px-2.5 py-1 bg-[#F7F2EA] border border-[#DDD0B8] rounded-xs font-semibold hover:border-[#8B6914] hover:text-[#8B6914] transition-colors"
            >
              #{type}
            </a>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-4 pb-4">
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xs font-mono text-[10.5px] tracking-[0.15em] uppercase font-bold transition-all ${
                filterType === t ? 'bg-[#1A1A1A] text-[#F7F2EA]' : 'border border-[#DDD0B8] text-[#3E2F1F] hover:border-[#8B6914] hover:text-[#8B6914] bg-[#F7F2EA]'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Explorer */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* List */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <StaggerContainer key={filterType}>
              {filtered.map(cabin => {
                const tc    = typeColors[cabin.type];
                const isSel = selected?.id === cabin.id;
                return (
                  <StaggerItem key={cabin.id}>
                    <motion.button
                      id={cabin.type === 'Standard' && cabin.id === 'A' ? 'standard-cabins' : cabin.type === 'Medium' && cabin.id === 'E' ? 'medium-cabins' : cabin.type === 'Large' && cabin.id === 'G' ? 'large-cabins' : cabin.type === 'Seminar' ? 'seminar-cabins' : cabin.type === 'Open Area' && cabin.id === 'ARTS' ? 'open-area' : undefined}
                      onClick={() => setSelected(cabin)} whileHover={{ x: 3 }}
                      className={`w-full text-left p-4 rounded-sm border transition-all duration-200 group scroll-mt-28 ${
                        isSel ? 'border-[#8B6914] bg-[#8B6914]/8 shadow-sm' : 'border-[#DDD0B8] hover:border-[#8B6914]/60 bg-[#F7F2EA]'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-sm flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                            style={{ background: tc.bg, color: tc.text }}>
                            {cabin.id === 'ARTS' ? 'A+' : cabin.id === 'BALCONY' ? 'B+' : cabin.id}
                          </div>
                          <div>
                            <p className="font-display font-bold text-[#1A1A1A] text-sm group-hover:text-[#8B6914] transition-colors">{cabin.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[9.5px] text-[#5C450C] uppercase font-bold">{cabin.type}</span>
                              <span className="w-1 h-1 rounded-full bg-[#8B6914]" />
                              <span className="font-mono text-[9.5px] text-[#3E2F1F] font-medium">Min. {cabin.minBillable} billed</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-display font-bold text-[#8B6914] text-xl italic leading-none">{cabin.capacity}</p>
                            <p className="font-mono text-[9.5px] text-[#5C450C] font-semibold">seats</p>
                          </div>
                          <ChevronRight size={14} className={`transition-all ${isSel ? 'text-[#8B6914]' : 'text-[#A89880] group-hover:text-[#8B6914]'}`} />
                        </div>
                      </div>
                      {isSel && (
                        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} className="mt-4 pt-4 border-t border-[#DDD0B8]">
                          <CapacityBar capacity={cabin.capacity} minBillable={cabin.minBillable} />
                        </motion.div>
                      )}
                    </motion.button>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Detail */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div key={selected.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ duration: 0.35 }}
                  className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-lg shadow-black/5">
                  <div className="relative h-[320px] lg:h-[380px]">
                    <img
                      src={selected.image}
                      alt={`${selected.name} — ${selected.capacity} seat air-conditioned teaching cabin on rent in Gurugram, Sector 57`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xs font-mono text-[9.5px] tracking-wide font-bold"
                      style={{ background: typeColors[selected.type].bg, color: typeColors[selected.type].text }}>
                      {selected.type}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#1A1A1A]/85 backdrop-blur-sm border border-[#D4B87A]/30 rounded-xs px-3.5 py-2 text-center">
                      <p className="font-display font-bold text-[#D4B87A] text-3xl italic leading-none">{selected.capacity}</p>
                      <p className="font-mono text-[9.5px] text-[#EADCC8] mt-0.5 font-semibold">seats</p>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h2 className="font-display font-bold text-[#1A1A1A] text-2xl">{selected.name}</h2>
                        {selected.note && <div className="flex items-center gap-1.5 mt-1"><AlertCircle size={12} className="text-[#8B6914]" /><span className="font-mono text-[10px] text-[#5C450C] font-semibold">{selected.note}</span></div>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-[9.5px] text-[#5C450C] font-bold uppercase">Minimum billed</p>
                        <p className="font-display font-bold text-[#1A1A1A] text-2xl">{selected.minBillable}</p>
                        <p className="font-mono text-[9.5px] text-[#5C450C]">seats / session</p>
                      </div>
                    </div>
                    <p className="font-body text-[#3E2F1F] text-sm leading-relaxed mb-5 font-normal">{selected.description}</p>
                    <div className="bg-[#EADCC8]/40 border border-[#DDD0B8] rounded-sm p-4 mb-5">
                      <p className="font-mono text-[9.5px] uppercase tracking-[0.15em] text-[#5C450C] font-bold mb-3">Seat Breakdown</p>
                      <CapacityBar capacity={selected.capacity} minBillable={selected.minBillable} />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {selected.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 border border-[#DDD0B8] rounded-xs font-mono text-[9.5px] text-[#3E2F1F] font-semibold">
                          <CheckCircle2 size={11} className="text-[#8B6914]" />{tag}
                        </span>
                      ))}
                    </div>
                    <div className="bg-[#EADCC8]/40 border border-[#DDD0B8] rounded-sm p-4 mb-5">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-mono text-[9.5px] text-[#5C450C] mb-1 uppercase font-bold">Adult educators</p>
                          <p className="font-display font-bold text-[#1A1A1A] text-lg">₹250 <span className="font-body font-normal text-[#3E2F1F] text-xs">/ seat / session</span></p>
                        </div>
                        <div>
                          <p className="font-mono text-[9.5px] text-[#5C450C] mb-1 uppercase font-bold">School educators</p>
                          <p className="font-display font-bold text-[#1A1A1A] text-lg">₹200 <span className="font-body font-normal text-[#3E2F1F] text-xs">/ seat / session</span></p>
                        </div>
                      </div>
                      <p className="font-mono text-[10px] text-[#5C450C] font-semibold mt-3">+18% GST · Min. {selected.minBillable} seats billed · Monthly billing</p>
                    </div>
                    <div className="flex gap-3">
                      <Link to="/contact" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1A1A1A] text-[#F7F2EA] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-xs hover:bg-[#8B6914] transition-colors">
                        Book {selected.name}<ArrowRight size={13} />
                      </Link>
                      <Link to="/pricing" className="flex items-center justify-center gap-2 px-5 py-3.5 border border-[#DDD0B8] text-[#1A1A1A] font-body font-bold text-xs tracking-wide rounded-xs hover:border-[#8B6914] hover:text-[#8B6914] transition-all bg-white/50">
                        Calculate cost
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-[#DDD0B8]">
        <AnimatedSection className="mb-8">
          <SectionLabel>All Spaces</SectionLabel>
          <h2 className="font-display font-bold text-[#1A1A1A] text-2xl">Compare Every Cabin</h2>
        </AnimatedSection>
        <div className="overflow-x-auto rounded-sm border border-[#DDD0B8] bg-[#F7F2EA] shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#DDD0B8] bg-[#EADCC8]/70">
                {['Cabin','Type','Capacity','Min. Billed','Adult Rate / Session','School Rate / Session'].map(h => (
                  <th key={h} className="text-left font-mono text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A] font-bold px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cabins.map(cabin => {
                const tc = typeColors[cabin.type];
                return (
                  <tr key={cabin.id} onClick={() => { setSelected(cabin); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                    className="border-b border-[#DDD0B8] hover:bg-[#F2EAE0] cursor-pointer transition-colors group last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xs flex items-center justify-center font-display font-bold text-xs flex-shrink-0" style={{ background: tc.bg, color: tc.text }}>
                          {cabin.id === 'ARTS' ? 'A+' : cabin.id === 'BALCONY' ? 'B+' : cabin.id}
                        </div>
                        <span className="font-display font-bold text-[#1A1A1A] group-hover:text-[#8B6914] transition-colors">{cabin.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="font-mono text-[9.5px] text-[#5C450C] font-semibold uppercase">{cabin.type}</span></td>
                    <td className="px-4 py-3"><span className="font-display font-bold text-[#8B6914] italic text-base">{cabin.capacity}</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-[#1A1A1A] font-semibold">{cabin.minBillable} seats</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-[#1A1A1A] font-semibold">₹{250 * cabin.minBillable}+</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-[#1A1A1A] font-semibold">₹{200 * cabin.minBillable}+</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[10px] text-[#5C450C] font-medium mt-3">Rates shown are minimum per session (excl. GST). Click any row to explore the cabin.</p>
      </section>
    </div>
  );
}
