import { type FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Part2Placeholder component
 * Displays a "coming soon" message for Part 2 features
 * Will be replaced with actual Spanish Painting Company features
 */
export const Part2Placeholder: FC = () => {
  const { language } = useLanguage();

  const features = language === 'es'
    ? [
        'Cumplimiento Fiscal Español (IRPF, IVA, Recargo de Equivalencia)',
        'Seguimiento de Materiales y Mano de Obra',
        'Organización por Proyectos',
        'Plantillas y Preajustes de Servicios',
        'Personalización Avanzada de PDF',
        'Seguimiento de Pagos y Estado',
        'Facturas Recurrentes',
        'Soporte Multi-Moneda (EUR/USD)',
        'Base de Datos de Clientes',
        'Modo Offline y Persistencia de Datos',
      ]
    : [
        'Spanish Fiscal Compliance (IRPF, VAT, Equivalence Surcharge)',
        'Material & Labor Tracking',
        'Project-Based Organization',
        'Service Templates & Presets',
        'Enhanced PDF Customization',
        'Payment Tracking & Status',
        'Recurring Invoices',
        'Multi-Currency Support (EUR/USD)',
        'Client Database',
        'Offline Mode & Data Persistence',
      ];

  const title = language === 'es' ? 'Funciones Avanzadas' : 'Advanced Features';
  const subtitle = language === 'es'
    ? 'Funciones Empresariales para Empresas de Pintura Comercial'
    : 'Business Features for Commercial Painting Companies';
  const comingSoon = language === 'es' ? 'Próximamente' : 'Coming Soon';
  const description = language === 'es'
    ? 'El Parte 2 incluirá funciones avanzadas diseñadas específicamente para empresas de pintura comercial en España:'
    : 'Part 2 will include advanced features designed specifically for commercial painting businesses in Spain:';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-blue-800 dark:text-blue-200 text-sm font-semibold">
              {comingSoon}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            {description}
          </p>

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                {language === 'es' ? 'Nota de Desarrollo' : 'Development Note'}
              </h3>
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                {language === 'es'
                  ? 'Estas funciones están en desarrollo activo. Mientras tanto, puedes usar la pestaña "Generador de Facturas" para crear facturas básicas con entrada de voz.'
                  : 'These features are in active development. Meanwhile, you can use the "Invoice Generator" tab to create basic invoices with voice input.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
