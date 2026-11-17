import { useState } from 'react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';
import { kits } from '../../data/kits';
import { ShoppingBag } from 'lucide-react';

const categories = ['All', 'School', 'Adult', 'Arts', 'Botany'];

export function Kits() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? kits : kits.filter((k) => k.category === active);

  return (
    <section className="section-pad bg-warm-stone relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96B]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <AnimatedSection className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <SectionLabel>Stationery & Kits</SectionLabel>
              <h2
                className="font-display font-bold text-[#1A1A1A] leading-[1.08] tracking-tight"
                style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}
              >
                Everything Your{' '}
                <span className="text-[#8B6914] italic">Classroom Needs.</span>
              </h2>
            </div>
            <p className="font-body text-[#3E2F1F] text-sm max-w-sm leading-relaxed font-normal">
              Order kits for your batch directly at the front desk. Essential supplies ready when your students arrive.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex gap-2 mt-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-sm font-mono text-[10.5px] tracking-[0.15em] uppercase font-bold transition-all cursor-pointer ${
                  active === cat
                    ? 'bg-[#1A1A1A] text-[#F7F2EA] shadow-xs'
                    : 'bg-[#F7F2EA] border border-[#DDD0B8] text-[#3E2F1F] hover:border-[#8B6914] hover:text-[#8B6914]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Product grid — Headlines and relevant images only per Section 13 */}
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" key={active}>
          {filtered.map((kit) => (
            <StaggerItem key={kit.id}>
              <div className="h-full flex flex-col border border-[#DDD0B8] rounded-sm overflow-hidden hover:border-[#8B6914] hover:shadow-md transition-all group bg-[#F7F2EA]">
                {/* Product Image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EADCC8] relative border-b border-[#DDD0B8]">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-xs font-mono text-[9px] uppercase tracking-wider bg-[#1A1A1A]/80 text-[#F7F2EA] font-semibold backdrop-blur-xs">
                    {kit.category}
                  </span>
                </div>

                {/* Headlines only */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div className="mb-3">
                    <h3 className="font-display font-bold text-[#1A1A1A] text-sm leading-snug group-hover:text-[#8B6914] transition-colors">
                      {kit.name}
                    </h3>
                    <p className="font-mono text-[10px] text-[#5C450C] uppercase tracking-wider font-medium mt-1">
                      {kit.ageGroup}
                    </p>
                  </div>

                  <div className="border-t border-[#DDD0B8]/80 pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-[#8B6914] text-lg leading-none italic">
                        ₹{kit.price.toLocaleString('en-IN')}
                      </p>
                      <p className="font-mono text-[9px] text-[#5C450C] font-semibold mt-0.5">excl. GST</p>
                    </div>
                    <ShoppingBag size={14} className="text-[#8B6914]" />
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
