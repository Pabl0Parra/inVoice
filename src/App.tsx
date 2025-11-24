import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './pages/LandingPage';
import { InvoiceApp } from './pages/InvoiceApp';
import { PageTransition } from './components/Layout/PageTransition';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <LandingPage />
                </PageTransition>
              }
            />
            <Route
              path="/app"
              element={
                <PageTransition>
                  <InvoiceApp />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
