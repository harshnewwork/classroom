import { Link } from 'react-router-dom';
import { ArrowRight, Home, Compass, MessageCircle, HelpCircle } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { SEO } from '../components/seo/SEO';

export function NotFoundPage() {
  return (
    <div className="bg-warm-stone min-h-screen">
      <SEO
        title="Page Not Found (404) | Mentors Studio"
        description="The page you requested could not be found. Explore furnished classrooms for rent, pricing, and facilities at Mentors Studio, Gurugram."
        canonicalPath="/404"
        breadcrumbs={[{ name: '404 Not Found' }]}
      />

      <PageHero
        label="Error 404"
        title={<>Page Not Found — <span className="text-gradient">Let's Get You Back on Track.</span></>}
        subtitle="The link you followed may be broken or the page may have been moved. Browse our main sections below to find the classroom and teaching details you need."
        image="/images/reception-lobby.png"
      />

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="p-6 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm hover:border-[#C9A96B] transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-sm bg-[#C9A96B]/15 text-[#C9A96B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A96B] group-hover:text-[#1A1A1A] transition-colors">
              <Home size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#1A1A1A] text-lg group-hover:text-[#C9A96B] transition-colors">
                Return to Homepage
              </h3>
              <p className="font-body text-[#7A6A50] text-sm mt-1 font-light">
                Discover our managed teaching facility on Golf Course Extension Road, Sector 57.
              </p>
            </div>
          </Link>

          <Link
            to="/spaces"
            className="p-6 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm hover:border-[#C9A96B] transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-sm bg-[#C9A96B]/15 text-[#C9A96B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A96B] group-hover:text-[#1A1A1A] transition-colors">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#1A1A1A] text-lg group-hover:text-[#C9A96B] transition-colors">
                Browse Teaching Cabins
              </h3>
              <p className="font-body text-[#7A6A50] text-sm mt-1 font-light">
                Explore all 9 cabins (6–24 seats), photos, seating configurations, and tech setups.
              </p>
            </div>
          </Link>

          <Link
            to="/pricing"
            className="p-6 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm hover:border-[#C9A96B] transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-sm bg-[#C9A96B]/15 text-[#C9A96B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A96B] group-hover:text-[#1A1A1A] transition-colors">
              <ArrowRight size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#1A1A1A] text-lg group-hover:text-[#C9A96B] transition-colors">
                Transparent Pricing
              </h3>
              <p className="font-body text-[#7A6A50] text-sm mt-1 font-light">
                Check per-seat session rates, volume packages, and our interactive billing calculator.
              </p>
            </div>
          </Link>

          <Link
            to="/faq"
            className="p-6 bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm hover:border-[#C9A96B] transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-sm bg-[#C9A96B]/15 text-[#C9A96B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A96B] group-hover:text-[#1A1A1A] transition-colors">
              <HelpCircle size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#1A1A1A] text-lg group-hover:text-[#C9A96B] transition-colors">
                Frequently Asked Questions
              </h3>
              <p className="font-body text-[#7A6A50] text-sm mt-1 font-light">
                Read answers on minimum billing, deposits, weekend availability, and equipment.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1A1A1A] text-[#F7F2EA] font-body font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#3E2F1F] transition-colors"
          >
            <MessageCircle size={14} /> Contact Manager
          </Link>
        </div>
      </section>
    </div>
  );
}

