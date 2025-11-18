import { type FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTab, type AppTab } from '../../contexts/TabContext';

export const Header: FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab } = useTab();

  const handleTabClick = (tab: AppTab): void => {
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              🎤 {t.appTitle}
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
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle language"
            >
              <span className="text-lg">{language === 'es' ? '🇪🇸' : '🇺🇸'}</span>
              <span className="hidden sm:inline">{language === 'es' ? 'ES' : 'EN'}</span>
            </button>

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
    </header>
  );
};
