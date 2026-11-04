import { useState } from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { kits } from '../../data/kits';
import { ShoppingBag } from 'lucide-react';

const categories = ['All', 'School', 'Adult', 'Arts', 'Botany'];
const catAccent  = { School: '#3E2F1F', Adult: '#1A1A1A', Arts: '#5A4A2A', Botany: '#2A3A20' };

export function Kits() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? kits : kits.filter(k => k.category === active);

  return (
    <section className="section-pad bg-[#1A1A1A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96B]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <SectionLabel>Stationery & Kits</SectionLabel>
              <h2 className="font-display font-bold text-[#F7F2EA] leading-[1.1] tracking-tight"
                style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)' }}>
                Everything Your{' '}
                <span className="text-gradient italic">Classroom Needs.</span>
              </h2>
            </div>
            <p className="font-body text-[#7A6A50] text-sm max-w-sm leading-relaxed font-light">
              Order kits for your whole batch at the front desk. All prices exclude GST.
            </p>
          </div>
          <div className="flex gap-2 mt-8 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-sm font-mono text-[10px] tracking-[0.15em] uppercase transition-all ${
                  active === cat ? 'bg-[#C9A96B] text-[#1A1A1A]' : 'border border-[#3A3228] text-[#7A6A50] hover:border-[#C9A96B]/50 hover:text-[#EADCC8]'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" key={active}>
          {filtered.map(kit => (
            <StaggerItem key={kit.id}>
              <div className="h-full flex flex-col border border-[#3A3228] rounded-sm overflow-hidden hover:border-[#C9A96B]/40 transition-all group bg-[#231F1B]">
                <div className="h-1.5 flex-shrink-0" style={{ background: catAccent[kit.category] || '#3A3228' }} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-sm font-mono text-[9px] tracking-wide border border-[#3A3228] text-[#7A6A50]">{kit.category}</span>
                    <ShoppingBag size={13} className="text-[#3A3228]" />
                  </div>
                  <h3 className="font-display font-bold text-[#F7F2EA] text-sm mb-2 leading-snug">{kit.name}</h3>
                  <p className="font-body text-[#7A6A50] text-xs leading-relaxed mb-4 flex-1 font-light">{kit.description}</p>
                  <div className="mt-auto border-t border-[#3A3228] pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-[#C9A96B] text-lg leading-none italic">₹{kit.price.toLocaleString('en-IN')}</p>
                      <p className="font-mono text-[9px] text-[#7A6A50] mt-0.5">excl. GST</p>
                    </div>
                    <span className="font-mono text-[9px] text-[#3A3228] text-right">{kit.ageGroup}</span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
