import { type FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAllCommands } from '../../utils/voiceCommandExamples';

interface VoiceCommandHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCommandHelp: FC<VoiceCommandHelpProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const commands = getAllCommands(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎤</span>
            {language === 'es' ? 'Comandos de Voz' : 'Voice Commands'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {language === 'es'
              ? 'Puedes usar los siguientes comandos de voz para controlar la aplicación:'
              : 'You can use the following voice commands to control the application:'}
          </p>

          <div className="grid gap-4">
            {commands.map((cmd, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                    {language === 'es' ? cmd.titleEs : cmd.titleEn}
                  </span>
                </div>
                <ul className="space-y-1">
                  {(language === 'es' ? cmd.examplesEs : cmd.examplesEn).map(
                    (example, idx) => (
                      <li
                        key={idx}
                        className="text-sm font-mono text-gray-700 dark:text-gray-300 flex items-start gap-2"
                      >
                        <span className="text-gray-400 select-none">•</span>
                        {example}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {language === 'es' ? 'Entendido' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
