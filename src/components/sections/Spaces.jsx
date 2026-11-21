import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { cabins } from '../../data/cabins';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';

const typeColors = {
  'Standard':  { bg: '#3E2F1F', text: '#F7F2EA' },
  'Medium':    { bg: '#5A4A2A', text: '#F7F2EA' },
  'Large':     { bg: '#8B6914', text: '#FFFFFF' },
  'Seminar':   { bg: '#1A1A1A', text: '#D4B87A' },
  'Open Area': { bg: '#2A3A20', text: '#E8F5D8' },
};

function CapacityBar({ capacity, minBillable }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {Array.from({ length: capacity }, (_, i) => (
          <div
            key={i}
            title={i < minBillable ? 'Always billed (Minimum capacity)' : 'Billed only when used'}
            className={`w-4 h-4 rounded-xs transition-colors ${
              i < minBillable
                ? 'bg-[#C9A96B] border border-[#A8883F] shadow-2xs'
                : 'bg-[#E5D7C3] border border-[#A89880]'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 text-[10px] font-mono text-[#3E2F1F] font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#C9A96B] border border-[#A8883F] rounded-xs inline-block" />
          Min. {minBillable} billed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-[#E5D7C3] border border-[#A89880] rounded-xs inline-block" />
          Pay per use
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
              className="font-display font-bold text-[#1A1A1A] leading-[1.12] tracking-tight max-w-xl"
              style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
            >
              Nine Cabins and Two{' '}
              <span className="text-[#8B6914] italic">Open Spaces.</span>
            </h2>
            <p className="font-body text-[#3E2F1F] text-sm max-w-sm leading-relaxed font-normal">
              Every cabin is fully furnished, air-conditioned and equipped with teaching technology.
            </p>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#DDD0B8] text-[11px] font-mono text-[#3E2F1F] font-semibold">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#C9A96B] border border-[#A8883F] rounded-xs" />
              Seats always billed (min. 80%)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#E5D7C3] border border-[#A89880] rounded-xs" />
              Pay per use (billed when occupied)
            </span>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Cabin list */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <StaggerContainer>
              {cabins.map((cabin) => {
                const tc = typeColors[cabin.type] || { bg: '#3E2F1F', text: '#F7F2EA' };
                const isSel = selected?.id === cabin.id;
                return (
                  <StaggerItem key={cabin.id}>
                    <motion.button
                      onClick={() => handleSelect(cabin)}
                      className={`w-full text-left p-4 rounded-sm border transition-all duration-200 group cursor-pointer ${
                        isSel
                          ? 'border-[#C9A96B] bg-[#FFFDF9] shadow-sm ring-1 ring-[#C9A96B]/50'
                          : 'border-[#DDD0B8] hover:border-[#C9A96B]/70 bg-[#F7F2EA]'
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 font-display font-bold text-sm shadow-xs"
                            style={{ background: tc.bg, color: tc.text }}
                          >
                            {cabin.id === 'ARTS' ? 'A+' : cabin.id === 'BALCONY' ? 'B+' : cabin.id}
                          </div>
                          <div>
                            <p className="font-display font-bold text-[#1A1A1A] text-sm group-hover:text-[#8B6914] transition-colors">
                              {cabin.name}
                            </p>
                            <p className="font-mono text-[9px] text-[#5C450C] tracking-wide uppercase font-semibold">
                              {cabin.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="font-display font-bold text-[#8B6914] text-lg leading-none">
                              {cabin.capacity}
                            </p>
                            <p className="font-mono text-[9px] text-[#3E2F1F] font-medium">seats</p>
                          </div>
                          <ChevronRight
                            size={14}
                            className={`transition-all ${
                              isSel ? 'text-[#8B6914] rotate-90' : 'text-[#8C7A65] group-hover:text-[#8B6914]'
                            }`}
                          />
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
                  <div className="relative h-[280px] sm:h-[340px]">
                    <img
                      src={selected.image}
                      alt={`${selected.name} — ${selected.capacity} seat air-conditioned teaching cabin on rent in Gurugram, Sector 57`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wide font-bold shadow-md"
                      style={{
                        background: (typeColors[selected.type] || { bg: '#3E2F1F' }).bg,
                        color: (typeColors[selected.type] || { text: '#F7F2EA' }).text,
                      }}
                    >
                      {selected.type}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#1A1A1A]/90 backdrop-blur-sm border border-[#C9A96B]/40 rounded-sm px-3.5 py-2 text-center shadow-md">
                      <p className="font-display font-bold text-[#D4B87A] text-2xl leading-none">{selected.capacity}</p>
                      <p className="font-mono text-[9px] text-[#EADCC8] mt-0.5 uppercase tracking-wider font-semibold">seats</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-display font-bold text-[#1A1A1A] text-2xl">{selected.name}</h3>
                        {selected.note && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <AlertCircle size={12} className="text-[#8B6914]" />
                            <span className="font-mono text-[10px] text-[#5C450C] font-semibold">{selected.note}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-[10px] text-[#5C450C] uppercase tracking-wider font-bold">Min. billed</p>
                        <p className="font-display font-bold text-[#1A1A1A] text-xl">{selected.minBillable} seats</p>
                      </div>
                    </div>

                    <p className="font-body text-[#3E2F1F] text-sm leading-relaxed mb-5 font-normal">{selected.description}</p>

                    <div className="bg-[#FFFDF9] border border-[#DDD0B8] rounded-sm p-4 mb-5">
                      <p className="font-mono text-[10px] text-[#5C450C] mb-3 tracking-[0.15em] uppercase font-bold">Seat Capacity & Billing</p>
                      <CapacityBar capacity={selected.capacity} minBillable={selected.minBillable} />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm font-mono text-[10px] text-[#3E2F1F] font-medium">
                          <CheckCircle2 size={11} className="text-[#8B6914]" />{tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => navigate('/contact')}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1A1A1A] text-[#F7F2EA] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#8B6914] transition-colors cursor-pointer shadow-sm"
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
