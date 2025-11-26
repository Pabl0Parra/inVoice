import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { FeatureCarousel } from '../components/Landing/FeatureCarousel';
import { useLanguage } from '../contexts/LanguageContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      duration: 1 + Math.random() * 2,
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.4),rgba(0,0,0,1))]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-50 flex gap-4">
        <button
          onClick={() => setLanguage('es')}
          className={`text-4xl transition-all duration-300 hover:scale-110 ${
            language === 'es' 
              ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
              : 'opacity-40 hover:opacity-70 grayscale'
          }`}
          aria-label="Switch to Spanish"
        >
          🇪🇸
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`text-4xl transition-all duration-300 hover:scale-110 ${
            language === 'en' 
              ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
              : 'opacity-40 hover:opacity-70 grayscale'
          }`}
          aria-label="Switch to English"
        >
          🇬🇧
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col justify-center items-center py-12">
        
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 mt-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            {t.landingTitlePrefix} <br />
            <span className="text-blue-500">{t.landingTitleHighlight}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            {t.landingSubtitle}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          onClick={() => navigate('/app')}
          className="btn magnetic rounded-full mb-auto"
        >
          <span className="relative z-10 flex items-center gap-2">
            {t.launchApp}
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
          <div className="particles-field" id="particleField">
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  '--x': `${p.x}px`,
                  '--y': `${p.y}px`,
                  animation: `particleFloat ${p.duration}s infinite`,
                  left: `${p.left}%`,
                  top: `${p.top}%`
                } as React.CSSProperties}
              />
            ))}
          </div>
        </motion.button>

        {/* Feature Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="w-full px-4 mt-12"
        >
          <FeatureCarousel />
        </motion.div>
      </div>
    </div>
  );
}
