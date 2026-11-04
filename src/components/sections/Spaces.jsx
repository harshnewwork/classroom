import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { cabins } from '../../data/cabins';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';

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
          <div
            key={i}
            title={i < minBillable ? 'Always billed' : 'Billed when occupied'}
            className={`w-4 h-4 rounded-sm ${i < minBillable ? 'bg-[#C9A96B]' : 'bg-[#DDD0B8]'}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 text-[10px] font-mono text-[#7A6A50]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#C9A96B] rounded-sm inline-block" />Min. {minBillable} billed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#DDD0B8] rounded-sm inline-block" />{capacity - minBillable} extra
        </span>
      </div>
    </div>
  );
}

export function Spaces({ onCabinSelect }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(cabins[0]);

  const handleSelect = (cabin) => {
    setSelected(cabin);
    if (onCabinSelect) onCabinSelect(cabin.capacity);
  };

  return (
    <section id="spaces" className="section-pad bg-warm-stone relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96B]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <SectionLabel>Our Spaces</SectionLabel>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2
              className="font-display font-bold text-[#1A1A1A] leading-[1.1] tracking-tight max-w-xl"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}
            >
              Nine Cabins and Two{' '}
              <span className="text-gradient italic">Open Spaces.</span>
            </h2>
            <p className="font-body text-[#7A6A50] text-sm max-w-sm leading-relaxed font-light">
              Every cabin is fully furnished, air-conditioned and equipped with teaching technology.
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#DDD0B8] text-[10px] font-mono text-[#7A6A50]">
            <span className="flex items-center gap-2"><span className="w-4 h-4 bg-[#C9A96B] rounded-sm" />Seats always billed (min. 60%)</span>
            <span className="flex items-center gap-2"><span className="w-4 h-4 bg-[#DDD0B8] rounded-sm" />Seats billed when used</span>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Cabin list */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <StaggerContainer>
              {cabins.map((cabin) => {
                const tc = typeColors[cabin.type];
                const isSel = selected?.id === cabin.id;
                return (
                  <StaggerItem key={cabin.id}>
                    <motion.button
                      onClick={() => handleSelect(cabin)}
                      className={`w-full text-left p-4 rounded-sm border transition-all duration-200 group ${
                        isSel ? 'border-[#C9A96B] bg-[#C9A96B]/6 shadow-sm' : 'border-[#DDD0B8] hover:border-[#C9A96B]/50 bg-[#F7F2EA]'
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                            style={{ background: tc.bg, color: tc.text }}
                          >
                            {cabin.id === 'ARTS' ? 'A+' : cabin.id === 'BALCONY' ? 'B+' : cabin.id}
                          </div>
                          <div>
                            <p className="font-display font-semibold text-[#1A1A1A] text-sm">{cabin.name}</p>
                            <p className="font-mono text-[9px] text-[#7A6A50] tracking-wide uppercase">{cabin.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="font-display font-bold text-[#C9A96B] text-lg leading-none">{cabin.capacity}</p>
                            <p className="font-mono text-[9px] text-[#7A6A50]">seats</p>
                          </div>
                          <ChevronRight size={13} className={`text-[#DDD0B8] transition-all ${isSel ? 'text-[#C9A96B] rotate-90' : 'group-hover:text-[#C9A96B]'}`} />
                        </div>
                      </div>
                      {isSel && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-[#DDD0B8]"
                        >
                          <CapacityBar capacity={cabin.capacity} minBillable={cabin.minBillable} />
                        </motion.div>
                      )}
                    </motion.button>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-sm overflow-hidden border border-[#DDD0B8] bg-[#F7F2EA] shadow-lg shadow-[#C9A96B]/6"
                >
                  <div className="relative h-[300px] lg:h-[360px]">
                    <img
                      src={selected.image}
                      alt={`${selected.name} — ${selected.capacity} seat air-conditioned teaching cabin on rent in Gurugram, Sector 57`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wide"
                      style={{ background: typeColors[selected.type].bg, color: typeColors[selected.type].text }}
                    >
                      {selected.type}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#C9A96B]/20 rounded-sm px-3 py-2 text-center">
                      <p className="font-display font-bold text-[#C9A96B] text-2xl leading-none">{selected.capacity}</p>
                      <p className="font-mono text-[9px] text-[#7A6A50] mt-0.5">seats</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-display font-bold text-[#1A1A1A] text-2xl">{selected.name}</h3>
                        {selected.note && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle size={11} className="text-[#C9A96B]" />
                            <span className="font-mono text-[9px] text-[#7A6A50]">{selected.note}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-[10px] text-[#7A6A50]">Min. billed</p>
                        <p className="font-display font-bold text-[#1A1A1A] text-xl">{selected.minBillable} seats</p>
                      </div>
                    </div>

                    <p className="font-body text-[#7A6A50] text-sm leading-relaxed mb-5 font-light">{selected.description}</p>

                    <div className="bg-[#F7F2EA] rounded-sm p-4 mb-5">
                      <p className="font-mono text-[9px] text-[#7A6A50] mb-3 tracking-[0.15em] uppercase">Seat Breakdown</p>
                      <CapacityBar capacity={selected.capacity} minBillable={selected.minBillable} />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm font-mono text-[10px] text-[#7A6A50]">
                          <CheckCircle2 size={9} className="text-[#C9A96B]" />{tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => navigate('/contact')}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1A1A1A] text-[#F7F2EA] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#3E2F1F] transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Book {selected.name}
                      <ChevronRight size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
