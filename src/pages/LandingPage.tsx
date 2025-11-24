import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FeatureCarousel } from '../components/Landing/FeatureCarousel';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';
import logoEs from '../assets/logo_es.png';

export function LandingPage() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.4),rgba(0,0,0,1))]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            language === 'en' 
              ? 'bg-white text-black' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            language === 'es' 
              ? 'bg-white text-black' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          ES
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col justify-between items-center py-6">
        
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-4 flex-shrink-0"
        >
          <motion.img 
            src={language === 'es' ? logoEs : logo} 
            alt="InVoice Logo" 
            className="w-28 h-28 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-4 md:mb-3 rounded-2xl shadow-2xl shadow-blue-500/20"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <h1 className="text-5xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-3 md:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            {t.landingTitlePrefix} <br />
            <span className="text-blue-500">{t.landingTitleHighlight}</span>
          </h1>
          <p className="text-xl md:text-lg lg:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
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
          className="group relative px-6 py-3 bg-white text-black rounded-full font-bold text-base tracking-wide overflow-hidden flex-shrink-0"
        >
          <span className="relative z-10 flex items-center gap-2">
            {t.launchApp}
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </motion.button>

        {/* Feature Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="w-full px-4 mb-8 flex-shrink-0"
        >
          <FeatureCarousel />
        </motion.div>
      </div>
    </div>
  );
}
