import { type FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { InvoiceData } from '../../types';

interface InvoiceFieldGuideProps {
  invoiceData: InvoiceData;
  className?: string;
}

interface FieldStatus {
  name: string;
  label: string;
  isComplete: boolean;
  isRequired: boolean;
  icon: string;
}

/**
 * Visual guide showing which invoice fields need to be filled
 * Helps users track their progress through the invoice creation process
 */
export const InvoiceFieldGuide: FC<InvoiceFieldGuideProps> = ({
  invoiceData,
  className = '',
}) => {
  const { t, language } = useLanguage();

  // Define fields and their completion status
  const fields: FieldStatus[] = [
    {
      name: 'invoiceNumber',
      label: t.invoiceNumber,
      isComplete: !!invoiceData.invoiceNumber,
      isRequired: true,
      icon: '📋',
    },
    {
      name: 'customerName',
      label: t.customerName,
      isComplete: !!invoiceData.customerName,
      isRequired: true,
      icon: '👤',
    },
    {
      name: 'items',
      label: t.invoiceItems,
      isComplete: invoiceData.items.length > 0,
      isRequired: true,
      icon: '📦',
    },
    {
      name: 'tax',
      label: t.tax,
      isComplete: invoiceData.taxRate > 0,
      isRequired: false,
      icon: '💰',
    },
    {
      name: 'customerAddress',
      label: t.customerAddress,
      isComplete: !!invoiceData.customerAddress,
      isRequired: false,
      icon: '📍',
    },
  ];

  const requiredFields = fields.filter((f) => f.isRequired);
  const completedRequired = requiredFields.filter((f) => f.isComplete).length;
  const progress = (completedRequired / requiredFields.length) * 100;

  // Find next field to fill
  const nextField = fields.find((f) => f.isRequired && !f.isComplete);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {language === 'es' ? 'Progreso de Factura' : 'Invoice Progress'}
        </h3>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          {completedRequired}/{requiredFields.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Next field indicator */}
      {nextField && (
        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
          <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
            {language === 'es' ? 'Siguiente paso:' : 'Next step:'}
          </p>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mt-1">
            {nextField.icon} {nextField.label}
          </p>
        </div>
      )}

      {/* Field checklist */}
      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={`flex items-center gap-2 text-sm ${
              field.isComplete
                ? 'text-green-700 dark:text-green-400'
                : field.isRequired
                ? 'text-gray-700 dark:text-gray-300'
                : 'text-gray-500 dark:text-gray-500'
            }`}
          >
            {field.isComplete ? (
              <span className="text-green-500">✓</span>
            ) : field.isRequired ? (
              <span className="text-gray-400 dark:text-gray-600">○</span>
            ) : (
              <span className="text-gray-300 dark:text-gray-700">○</span>
            )}
            <span className="flex-1">
              {field.icon} {field.label}
            </span>
            {field.isRequired && !field.isComplete && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded">
                {language === 'es' ? 'Requerido' : 'Required'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Completion message */}
      {progress === 100 && (
        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-center">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            ✨ {language === 'es' ? '¡Factura lista para generar!' : 'Invoice ready to generate!'}
          </p>
        </div>
      )}
    </div>
  );
};
