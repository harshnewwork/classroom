import { useState } from 'react';
import { Hero }        from '../components/sections/Hero';
import { Problem }     from '../components/sections/Problem';
import { Solution }    from '../components/sections/Solution';
import { Spaces }      from '../components/sections/Spaces';
import { Facilities }  from '../components/sections/Facilities';
import { HowItWorks }  from '../components/sections/HowItWorks';
import { Timings }     from '../components/sections/Timings';
import { Pricing }     from '../components/sections/Pricing';
import { Educators }   from '../components/sections/Educators';
import { Kits }        from '../components/sections/Kits';
import { Booking }     from '../components/sections/Booking';
import { Contact }     from '../components/sections/Contact';

export function HomePage() {
  const [selectedCapacity, setSelectedCapacity] = useState(10);

  return (
    <>
      <Hero />

      {/* Brand Identity Showcase */}
      <section className="bg-[#141414] py-6 sm:py-9 border-y border-[#C9A96B]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96B]/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#F7F2EA] rounded-md p-3 sm:p-5 border border-[#C9A96B]/50 shadow-2xl shadow-black/60 flex items-center justify-center">
            <img
              src="/brand/logo-banner.png"
              alt="Mentors Studio by The Vensej — Learn, Grow, Create, Move"
              className="w-full max-h-14 sm:max-h-20 object-contain"
            />
          </div>
        </div>
      </section>

      <Problem />
      <Solution />
      <Spaces onCabinSelect={setSelectedCapacity} />
      <Facilities />
      <HowItWorks />
      <div id="timings"><Timings /></div>
      <Pricing defaultCapacity={selectedCapacity} />
      <Educators />
      <div id="kits"><Kits /></div>
      <Booking />
      <Contact />
    </>
  );
}
