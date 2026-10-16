import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import { OrnamentDefs } from './components/Ornaments';

// Guests never open the dashboard, so keep it out of the invitation's bundle.
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));

// Pages cross-fade instead of cutting; "wait" lets the old page finish leaving before the next
// one mounts, so the two pages' smooth-scroll instances never overlap.
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/wardrobe/:slug" element={<Wardrobe />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <AdminDashboard />
              </Suspense>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <OrnamentDefs />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
