import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation }       from './components/Navigation';
import { Footer }           from './components/Footer';
import { CustomCursor }     from './components/CustomCursor';
import { StickyBookingCTA } from './components/StickyBookingCTA';

import { HomePage }         from './pages/HomePage';
import { SpacesPage }       from './pages/SpacesPage';
import { FacilitiesPage }   from './pages/FacilitiesPage';
import { HowItWorksPage }   from './pages/HowItWorksPage';
import { PricingPage }      from './pages/PricingPage';
import { EducatorsPage }    from './pages/EducatorsPage';
import { ContactPage }      from './pages/ContactPage';
import { ADMIN_ROUTE }      from './admin/constants';

const AdminPage = lazy(() =>
  import('./admin/AdminPage').then((module) => ({ default: module.AdminPage }))
);

function AppContent() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === ADMIN_ROUTE ||
    location.pathname.startsWith(`${ADMIN_ROUTE}/`);

  if (isAdminRoute) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route path={ADMIN_ROUTE} element={<AdminPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <CustomCursor />
      <Navigation />

      <main>
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/spaces"       element={<SpacesPage />} />
          <Route path="/facilities"   element={<FacilitiesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing"      element={<PricingPage />} />
          <Route path="/educators"    element={<EducatorsPage />} />
          <Route path="/contact"      element={<ContactPage />} />
          {/* Catch-all → home */}
          <Route path="*"             element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
      <StickyBookingCTA />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
