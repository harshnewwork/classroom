import { useState } from 'react';
import { Check, X, Sparkles, Trophy } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionLabel } from '../ui/SectionLabel';

const comparisonData = [
  {
    criterion: 'Unlimited earnings',
    whyItMatters: 'No salary cap',
    rented: { ok: true, text: 'Keep fees, but high rent cuts profit' },
    home: { ok: true, text: 'Keep earnings, but small batch limit' },
    institute: { ok: false, text: 'Fixed salary or 30–40% revenue cut' },
    mentors: { ok: true, text: '100% of student fee is yours' },
  },
  {
    criterion: 'Your own fees',
    whyItMatters: 'You set the price',
    rented: { ok: true, text: 'Full pricing freedom' },
    home: { ok: true, text: 'Full pricing freedom' },
    institute: { ok: false, text: 'Institute sets student tuition' },
    mentors: { ok: true, text: 'You set your own tuition rates' },
  },
  {
    criterion: 'Your own students',
    whyItMatters: 'Build your own brand',
    rented: { ok: true, text: 'Direct student relationship' },
    home: { ok: true, text: 'Direct student relationship' },
    institute: { ok: false, text: 'Students belong to the coaching brand' },
    mentors: { ok: true, text: 'Your students, brand & reputation' },
  },
  {
    criterion: 'Flexible slots',
    whyItMatters: 'Book when it suits you',
    rented: { ok: false, text: 'Paying 24/7 lease even when empty' },
    home: { ok: true, text: 'Teach when you choose' },
    institute: { ok: false, text: 'Fixed schedule dictated to you' },
    mentors: { ok: true, text: 'Morning & evening shifts on demand' },
  },
  {
    criterion: 'Zero set-up cost',
    whyItMatters: 'No furniture or equipment to buy',
    rented: { ok: false, text: '₹3L–₹8L upfront fit-out & deposit' },
    home: { ok: false, text: 'Need furniture & domestic disruption' },
    institute: { ok: true, text: 'Rooms already equipped' },
    mentors: { ok: true, text: '₹0 capital expenditure or setup' },
  },
  {
    criterion: 'Ready to teach',
    whyItMatters: 'Smart classroom, fully managed',
    rented: { ok: false, text: 'Manage Wi-Fi, electricity & housekeeping' },
    home: { ok: false, text: 'Domestic noise, no tech support' },
    institute: { ok: true, text: 'Ready-to-use classroom' },
    mentors: { ok: true, text: 'Digital screens, IT technician & manager' },
  },
  {
    criterion: 'Parent-trusted space',
    whyItMatters: 'CCTV and front desk',
    rented: { ok: false, text: 'Costly to hire guards & front desk' },
    home: { ok: false, text: 'Privacy & safety hesitation for parents' },
    institute: { ok: true, text: 'Professional public premise' },
    mentors: { ok: true, text: 'Mall location, CCTV & reception desk' },
  },
  {
    criterion: 'Right-size rooms',
    whyItMatters: '4 to 30 seats',
    rented: { ok: false, text: 'One fixed room; empty seats waste money' },
    home: { ok: false, text: 'Constrained by home living space' },
    institute: { ok: false, text: 'Assigned fixed batch sizes' },
    mentors: { ok: true, text: 'Choose 4, 8, 10, 12, or 30 seats' },
  },
  {
    criterion: 'Grow without risk',
    whyItMatters: 'Bigger room only when needed',
    rented: { ok: false, text: 'High financial risk to upsize lease' },
    home: { ok: false, text: 'Physical ceiling on growth' },
    institute: { ok: false, text: 'Your growth enriches the institute' },
    mentors: { ok: true, text: 'Switch to bigger cabin as batch grows' },
  },
  {
    criterion: 'Run multiple batches',
    whyItMatters: 'Add rooms as you grow',
    rented: { ok: false, text: 'Locked to single leased cabin' },
    home: { ok: false, text: 'Cannot host parallel sessions' },
    institute: { ok: false, text: 'Limited slot allocation' },
    mentors: { ok: true, text: 'Book multiple cabins concurrently' },
  },
];

const competitors = [
  { id: 'rented', label: 'Own rented space', score: '4/10', compromise: 'Your savings' },
  { id: 'home', label: 'Teach from home', score: '5/10', compromise: 'Your growth' },
  { id: 'institute', label: 'Coaching institute', score: '3/10', compromise: 'Your freedom' },
];

export function CompetitorComparison() {
  const [mobileCompetitor, setMobileCompetitor] = useState('rented');

  return (
    <section className="bg-[#1A1A1A] border-y border-[#3A3228] py-16 lg:py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#C9A96B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <SectionLabel className="justify-center" dark>
            Comparison
          </SectionLabel>
          <h2
            className="font-display font-bold text-[#F7F2EA] leading-[1.08] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)' }}
          >
            Why Mentors Studio
          </h2>
          <p className="font-body text-[#A89880] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Every other option asks you to give something up. Here&apos;s what you don&apos;t.
          </p>
        </AnimatedSection>

        {/* Mobile Tab Switcher (Visible on mobile screens < 768px) */}
        <div className="block md:hidden mb-6">
          <p className="font-mono text-[10px] tracking-wider uppercase text-[#A89880] mb-2 font-bold text-center">
            Compare Mentors Studio against:
          </p>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#231F1B] rounded-sm border border-[#3A3228]">
            {competitors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setMobileCompetitor(c.id)}
                className={`py-2 px-1 text-center font-mono text-[10px] uppercase font-bold rounded-xs transition-all ${
                  mobileCompetitor === c.id
                    ? 'bg-[#C9A96B] text-[#1A1A1A] shadow-sm'
                    : 'text-[#DDD0B8] hover:text-white'
                }`}
              >
                {c.label.replace('Own ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* ─── FULL COMPARISON TABLE CONTAINER ─── */}
        <AnimatedSection>
          <div className="relative border border-[#3A3228] rounded-sm overflow-hidden bg-[#1E1B18]/70 backdrop-blur-md shadow-2xl">
            {/* Scroll indicator for mobile screens */}
            <div className="md:hidden flex items-center justify-between p-2.5 bg-[#231F1B] border-b border-[#3A3228] text-[10px] font-mono text-[#D4B87A]">
              <span>← Swipe table horizontally to view all columns →</span>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#C9A96B]/30">
              <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-full">
                <thead>
                  <tr className="border-b border-[#3A3228] bg-[#231F1B]">
                    <th className="py-4 px-3 sm:px-4 text-xs font-mono font-bold tracking-wider uppercase text-[#D4B87A] w-[22%]">
                      What teachers want
                    </th>
                    <th className="py-4 px-3 sm:px-4 text-xs font-mono font-bold tracking-wider uppercase text-[#A89880] w-[18%]">
                      Why it matters
                    </th>
                    <th className="py-4 px-3 text-center text-xs font-mono font-bold tracking-wider uppercase text-[#EADCC8] w-[15%]">
                      Own rented space
                    </th>
                    <th className="py-4 px-3 text-center text-xs font-mono font-bold tracking-wider uppercase text-[#EADCC8] w-[15%]">
                      Teach from home
                    </th>
                    <th className="py-4 px-3 text-center text-xs font-mono font-bold tracking-wider uppercase text-[#EADCC8] w-[15%]">
                      Coaching institute
                    </th>
                    {/* Mentors Studio Standout Column */}
                    <th className="py-4 px-3 text-center text-xs font-mono font-bold tracking-wider uppercase text-[#1A1A1A] bg-[#C9A96B] w-[15%] relative shadow-md">
                      <div className="flex items-center justify-center gap-1">
                        <Sparkles size={13} className="text-[#1A1A1A]" />
                        <span>Mentors Studio</span>
                      </div>
                      <span className="block text-[8.5px] font-mono tracking-widest text-[#2A180A] uppercase mt-0.5 font-extrabold">
                        ★ Standout Choice
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2822] text-xs sm:text-sm font-body">
                  {comparisonData.map((row, idx) => (
                    <tr
                      key={row.criterion}
                      className={`transition-colors ${
                        idx % 2 === 0 ? 'bg-[#1E1B18]/40' : 'bg-[#181614]/60'
                      } hover:bg-[#2A241E]/50`}
                    >
                      {/* What teachers want */}
                      <td className="py-3.5 px-3 sm:px-4 font-semibold text-[#F7F2EA] font-display text-sm">
                        {row.criterion}
                      </td>

                      {/* Why it matters */}
                      <td className="py-3.5 px-3 sm:px-4 text-[#A89880] font-mono text-[11px] sm:text-xs">
                        {row.whyItMatters}
                      </td>

                      {/* Own rented space */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {row.rented.ok ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                              <Check size={14} className="stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                              <X size={14} className="stroke-[2.5]" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Teach from home */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {row.home.ok ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                              <Check size={14} className="stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                              <X size={14} className="stroke-[2.5]" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Coaching institute */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {row.institute.ok ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                              <Check size={14} className="stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                              <X size={14} className="stroke-[2.5]" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Mentors Studio (Standout Column) */}
                      <td className="py-3.5 px-3 text-center bg-[#C9A96B]/10 border-x border-[#C9A96B]/40">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 flex items-center justify-center font-bold shadow-xs">
                            <Check size={15} className="stroke-[3]" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* ─── SUMMARY ROW 1: SCORE ─── */}
                  <tr className="border-t-2 border-[#3A3228] bg-[#231F1B] font-mono">
                    <td className="py-4 px-3 sm:px-4 font-bold text-white uppercase text-xs">
                      Overall Score
                    </td>
                    <td className="py-4 px-3 sm:px-4 text-[#A89880] text-[11px]">
                      Out of 10 criteria
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-[#EADCC8] text-sm">
                      4/10
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-[#EADCC8] text-sm">
                      5/10
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-[#EADCC8] text-sm">
                      3/10
                    </td>
                    <td className="py-4 px-3 text-center bg-[#C9A96B]/15 border-x border-[#C9A96B]/60 font-bold">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C9A96B] text-[#1A1A1A] text-xs font-extrabold shadow-sm">
                        <Trophy size={12} className="stroke-[2.5]" /> 10/10
                      </span>
                    </td>
                  </tr>

                  {/* ─── SUMMARY ROW 2: THE COMPROMISE ─── */}
                  <tr className="border-t border-[#3A3228] bg-[#1E1B18] font-mono">
                    <td className="py-4 px-3 sm:px-4 font-bold text-white uppercase text-xs">
                      The Compromise
                    </td>
                    <td className="py-4 px-3 sm:px-4 text-[#A89880] text-[11px]">
                      What you sacrifice
                    </td>
                    <td className="py-4 px-3 text-center text-rose-400 font-bold text-xs">
                      Your savings
                    </td>
                    <td className="py-4 px-3 text-center text-rose-400 font-bold text-xs">
                      Your growth
                    </td>
                    <td className="py-4 px-3 text-center text-rose-400 font-bold text-xs">
                      Your freedom
                    </td>
                    <td className="py-4 px-3 text-center bg-[#C9A96B]/20 border-x border-[#C9A96B]/60 font-bold">
                      <span className="text-emerald-400 uppercase tracking-wider text-xs font-extrabold">
                        Zero compromise
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
