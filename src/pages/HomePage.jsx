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
import { SEO }         from '../components/seo/SEO';
import { getLocalBusinessSchema } from '../components/seo/schema';

export function HomePage() {
  const [selectedCapacity, setSelectedCapacity] = useState(10);

  return (
    <>
      <SEO
        title="Classroom & Teaching Space for Rent in Gurugram | Mentors Studio"
        description="Furnished, AC classrooms for rent on Golf Course Extension Road, Sector 57, Gurugram. Pay per seat, flexible monthly packages. Built for tutors, coaches & trainers."
        canonicalPath="/"
        schema={getLocalBusinessSchema()}
      />

      <Hero />

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
