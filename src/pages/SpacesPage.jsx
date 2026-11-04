import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ChevronRight, Users, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { SectionLabel } from '../components/ui/SectionLabel';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { cabins } from '../data/cabins';

const typeColors = {
  'Standard':  { bg: '#3E2F1F', text: '#EADCC8' },
  'Medium':    { bg: '#5A4A2A', text: '#EADCC8' },
  'Large':     { bg: '#C9A96B', text: '#1A1A1A' },
  'Seminar':   { bg: '#1A1A1A', text: '#C9A96B' },
  'Open Area': { bg: '#2A3A20', text: '#D4E8C2' },
};

function CapacityBar({ capacity, minBillable }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {Array.from({ length: capacity }, (_, i) => (
          <div key={i} title={i < minBillable ? 'Always billed' : 'When occupied'}
            className={`w-5 h-5 rounded-sm ${i < minBillable ? 'bg-[#C9A96B]' : 'bg-[#DDD0B8]'}`} />
        ))}
      </div>
      <div className="flex items-center gap-5 text-[10px] font-mono text-[#7A6A50]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#C9A96B] rounded-sm" />Min. {minBillable} billed</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#DDD0B8] rounded-sm" />{capacity - minBillable} extra</span>
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
      <PageHero
        label="Our Spaces"
        title={<>Nine Cabins & Two <span className="text-gradient italic">Open Spaces.</span></>}
        subtitle="Every cabin is fully furnished, air-conditioned and equipped with professional teaching technology. Browse all available spaces and find the perfect fit for your batch."
        image="/images/classroom-seminar.png"
        cta={{ label: 'Book a Space', to: '/contact' }}
      />

      {/* Stats */}
      <div className="bg-[#1A1A1A] border-b border-[#3A3228]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[['9','Teaching cabins'],['2','Open areas'],['120','Total seats'],['6–24','Seats per cabin']].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-display font-bold text-[#C9A96B] text-3xl italic">{v}</p>
              <p className="font-mono text-[9px] text-[#7A6A50] mt-1 tracking-wide uppercase">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Min billing note */}
      <AnimatedSection className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-4">
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm flex items-center justify-center flex-shrink-0">
            <Users size={16} className="text-[#C9A96B]" />
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-[#1A1A1A] text-sm mb-1">How minimum billing works</p>
            <p className="font-body text-[#7A6A50] text-sm leading-relaxed font-light">
              Every cabin bills a minimum of 60% of its capacity per session, rounded up. If a 10-seat cabin has 5 students, you still pay for 6 seats. You only pay for extra seats when more students attend.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#7A6A50] flex-shrink-0">
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 bg-[#C9A96B] rounded-sm" />Always billed</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 bg-[#DDD0B8] rounded-sm" />When used</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-4">
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-sm font-mono text-[10px] tracking-[0.15em] uppercase transition-all ${
                filterType === t ? 'bg-[#1A1A1A] text-[#F7F2EA]' : 'border border-[#DDD0B8] text-[#7A6A50] hover:border-[#C9A96B]/50 hover:text-[#3E2F1F] bg-[#F7F2EA]'
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
                    <motion.button onClick={() => setSelected(cabin)} whileHover={{ x: 3 }}
                      className={`w-full text-left p-4 rounded-sm border transition-all duration-200 group ${
                        isSel ? 'border-[#C9A96B] bg-[#C9A96B]/6 shadow-sm' : 'border-[#DDD0B8] hover:border-[#C9A96B]/50 bg-[#F7F2EA]'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-sm flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                            style={{ background: tc.bg, color: tc.text }}>
                            {cabin.id === 'ARTS' ? 'A+' : cabin.id === 'BALCONY' ? 'B+' : cabin.id}
                          </div>
                          <div>
                            <p className="font-display font-semibold text-[#1A1A1A] text-sm">{cabin.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[9px] text-[#7A6A50] uppercase">{cabin.type}</span>
                              <span className="w-1 h-1 rounded-full bg-[#DDD0B8]" />
                              <span className="font-mono text-[9px] text-[#7A6A50]">Min. {cabin.minBillable} billed</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-display font-bold text-[#C9A96B] text-xl italic leading-none">{cabin.capacity}</p>
                            <p className="font-mono text-[9px] text-[#7A6A50]">seats</p>
                          </div>
                          <ChevronRight size={13} className={`transition-all ${isSel ? 'text-[#C9A96B]' : 'text-[#DDD0B8] group-hover:text-[#C9A96B]'}`} />
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
                  className="border border-[#DDD0B8] rounded-sm overflow-hidden bg-[#F7F2EA] shadow-lg shadow-[#C9A96B]/6">
                  <div className="relative h-[320px] lg:h-[380px]">
                    <img src={selected.image} alt={`${selected.name} — ${selected.capacity} seat ${selected.type}`}
                      className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-sm font-mono text-[9px] tracking-wide"
                      style={{ background: typeColors[selected.type].bg, color: typeColors[selected.type].text }}>
                      {selected.type}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#C9A96B]/20 rounded-sm px-3 py-2 text-center">
                      <p className="font-display font-bold text-[#C9A96B] text-3xl italic leading-none">{selected.capacity}</p>
                      <p className="font-mono text-[9px] text-[#7A6A50] mt-0.5">seats</p>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h2 className="font-display font-bold text-[#1A1A1A] text-2xl">{selected.name}</h2>
                        {selected.note && <div className="flex items-center gap-1.5 mt-1"><AlertCircle size={11} className="text-[#C9A96B]" /><span className="font-mono text-[9px] text-[#7A6A50]">{selected.note}</span></div>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-[9px] text-[#7A6A50]">Minimum billed</p>
                        <p className="font-display font-bold text-[#1A1A1A] text-2xl">{selected.minBillable}</p>
                        <p className="font-mono text-[9px] text-[#7A6A50]">seats / session</p>
                      </div>
                    </div>
                    <p className="font-body text-[#7A6A50] text-sm leading-relaxed mb-5 font-light">{selected.description}</p>
                    <div className="bg-[#F7F2EA] rounded-sm p-4 mb-5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#7A6A50] mb-3">Seat Breakdown</p>
                      <CapacityBar capacity={selected.capacity} minBillable={selected.minBillable} />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {selected.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm font-mono text-[9px] text-[#7A6A50]">
                          <CheckCircle2 size={9} className="text-[#C9A96B]" />{tag}
                        </span>
                      ))}
                    </div>
                    <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-4 mb-5">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="font-mono text-[9px] text-[#7A6A50] mb-1 uppercase">Adult educators</p><p className="font-display font-bold text-[#1A1A1A]">₹250 <span className="font-body font-normal text-[#7A6A50] text-xs">/ seat / session</span></p></div>
                        <div><p className="font-mono text-[9px] text-[#7A6A50] mb-1 uppercase">School educators</p><p className="font-display font-bold text-[#1A1A1A]">₹200 <span className="font-body font-normal text-[#7A6A50] text-xs">/ seat / session</span></p></div>
                      </div>
                      <p className="font-mono text-[9px] text-[#7A6A50] mt-3">+18% GST · Min. {selected.minBillable} seats billed · Monthly billing</p>
                    </div>
                    <div className="flex gap-3">
                      <Link to="/contact" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1A1A1A] text-[#F7F2EA] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#3E2F1F] transition-colors">
                        Book {selected.name}<ArrowRight size={13} />
                      </Link>
                      <Link to="/pricing" className="flex items-center justify-center gap-2 px-5 py-3.5 border border-[#DDD0B8] text-[#7A6A50] font-body font-semibold text-xs tracking-wide rounded-sm hover:border-[#C9A96B] hover:text-[#3E2F1F] transition-all">
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
              <tr className="border-b border-[#DDD0B8] bg-[#F7F2EA]">
                {['Cabin','Type','Capacity','Min. Billed','Adult Rate / Session','School Rate / Session'].map(h => (
                  <th key={h} className="text-left font-mono text-[9px] tracking-[0.15em] uppercase text-[#7A6A50] px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cabins.map(cabin => {
                const tc = typeColors[cabin.type];
                return (
                  <tr key={cabin.id} onClick={() => { setSelected(cabin); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                    className="border-b border-[#DDD0B8] hover:bg-[#F7F2EA] cursor-pointer transition-colors group last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-sm flex items-center justify-center font-display font-bold text-xs flex-shrink-0" style={{ background: tc.bg, color: tc.text }}>
                          {cabin.id === 'ARTS' ? 'A+' : cabin.id === 'BALCONY' ? 'B+' : cabin.id}
                        </div>
                        <span className="font-display font-semibold text-[#1A1A1A] group-hover:text-[#C9A96B] transition-colors">{cabin.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="font-mono text-[9px] text-[#7A6A50] uppercase">{cabin.type}</span></td>
                    <td className="px-4 py-3"><span className="font-display font-bold text-[#C9A96B] italic">{cabin.capacity}</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-[#1A1A1A]">{cabin.minBillable} seats</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-[#7A6A50]">₹{250 * cabin.minBillable}+</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-[#7A6A50]">₹{200 * cabin.minBillable}+</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[9px] text-[#A89880] mt-3">Rates shown are minimum per session (excl. GST). Click any row to explore the cabin.</p>
      </section>
    </div>
  );
}
