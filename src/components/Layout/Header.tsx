import { type FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTab, type AppTab } from '../../contexts/TabContext';
import { useState } from 'react';
import { VoiceCommandHelp } from '../VoiceInput/VoiceCommandHelp';

export const Header: FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab } = useTab();
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  const handleTabClick = (tab: AppTab): void => {
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t.appTitle}
            </h1>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            <button
              onClick={() => handleTabClick('part1')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  activeTab === 'part1'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              aria-label={t.tabPart1}
              aria-current={activeTab === 'part1' ? 'page' : undefined}
            >
              {t.tabPart1}
            </button>
            <button
              onClick={() => handleTabClick('part2')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  activeTab === 'part2'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              aria-label={t.tabPart2}
              aria-current={activeTab === 'part2' ? 'page' : undefined}
            >
              {t.tabPart2}
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Toggle */}
            {/* Voice Help Toggle */}
            <button
              onClick={() => setShowVoiceHelp(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              aria-label={language === 'es' ? 'Comandos de voz' : 'Voice commands'}
              title={language === 'es' ? 'Ver comandos de voz' : 'View voice commands'}
            >
              <span className="text-xl">🎤</span>
            </button>

            {/* Language Toggle */}
            <div className="flex items-center gap-4 mr-4">
              <button
                onClick={() => setLanguage('es')}
                className={`flex items-center gap-1 text-lg transition-all duration-300 hover:scale-110 ${
                  language === 'es' 
                    ? 'opacity-100 scale-110 drop-shadow-md' 
                    : 'opacity-40 hover:opacity-70 grayscale'
                }`}
                aria-label="Switch to Spanish"
              >
                <span className="text-2xl">🇪🇸</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">ES</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1 text-lg transition-all duration-300 hover:scale-110 ${
                  language === 'en' 
                    ? 'opacity-100 scale-110 drop-shadow-md' 
                    : 'opacity-40 hover:opacity-70 grayscale'
                }`}
                aria-label="Switch to English"
              >
                <span className="text-2xl">🇬🇧</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">EN</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={theme === 'light' ? t.darkMode : t.lightMode}
            >
              <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
              <span className="hidden sm:inline">
                {theme === 'light' ? t.darkMode : t.lightMode}
              </span>
            </button>
          </div>
        </div>
      </div>
      <VoiceCommandHelp isOpen={showVoiceHelp} onClose={() => setShowVoiceHelp(false)} />
    </header>
  );
};
