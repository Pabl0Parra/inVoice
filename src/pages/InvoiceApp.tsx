import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TabProvider, useTab } from '../contexts/TabContext';
import {
  useSpeechRecognition,
  useInvoiceState,
  useVoiceCommands,
} from '../hooks';
import {
  MicrophoneButton,
  TranscriptionDisplay,
  VoiceCommandProcessor,
  VoiceVisualizer,
} from '../components/VoiceInput';
import {
  AddItemForm,
  InvoiceForm,
  InvoiceItemsList,
  InvoicePreview,
  InvoiceFieldGuide,
} from '../components/Invoice';
import { PDFGenerator, type PDFGeneratorHandle } from '../components/PDF';
import { Header } from '../components/Layout/Header';
import { Part2Placeholder } from '../components/Part2';
import type { VoiceCommand, InvoiceData } from '../types';

/**
 * Main application component wrapped with providers
 */
function AppContent() {
  const { t } = useLanguage();
  const { activeTab } = useTab();

  // State management
  const { invoiceData, dispatch, addItem, removeItem, updateItem } =
    useInvoiceState();

  // Voice recognition
  const {
    status: voiceStatus,
    transcripts,
    interimTranscript,
    error: voiceError,
    isSupported,
    startListening,
    stopListening,
    resetTranscripts,
  } = useSpeechRecognition();

  // Voice command processing
  const { processTranscript, commandToAction } = useVoiceCommands();

  // Ref for PDF generator to trigger generation via voice command
  const pdfGeneratorRef = useRef<PDFGeneratorHandle>(null);

  // Track last processed command for UI feedback
  const lastCommand: VoiceCommand | null =
    transcripts.length > 0
      ? (() => {
          const lastTranscript = transcripts[transcripts.length - 1];
          return lastTranscript.isFinal
            ? processTranscript(lastTranscript.text)
            : null;
        })()
      : null;

  // Track which item is being edited
  const [editingItemId] = useState<string | null>(null);

  /**
   * Process new transcripts and execute voice commands
   */
  useEffect(() => {
    if (transcripts.length === 0) return;

    // Get the most recent final transcript
    const lastTranscript = transcripts[transcripts.length - 1];
    if (!lastTranscript.isFinal) return;

    // Parse the transcript into a voice command
    const command = processTranscript(lastTranscript.text);
    if (!command) return;

    // Handle special commands that don't map to invoice actions
    if (command.type === 'generate_pdf') {
      // Trigger PDF generation via ref
      if (pdfGeneratorRef.current) {
        pdfGeneratorRef.current.generatePDF();
      }
      return;
    }

    // Convert command to invoice action
    const action = commandToAction(command);
    if (action) {
      dispatch(action);
    }
  }, [transcripts, processTranscript, commandToAction, dispatch]);

  /**
   * Toggle voice recording
   */
  const handleToggleVoice = (): void => {
    if (voiceStatus === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  /**
   * Handle invoice data updates from form
   */
  const handleInvoiceUpdate = (updates: Partial<InvoiceData>): void => {
    // Handle customer fields as a single update to avoid multiple dispatches
    if ('customerName' in updates || 'customerAddress' in updates) {
      dispatch({
        type: 'SET_CUSTOMER',
        payload: {
          customerName: updates.customerName ?? '',
          customerAddress: updates.customerAddress ?? '',
        },
      });
    }

    // Process remaining updates
    Object.entries(updates).forEach(([key, value]) => {
      switch (key) {
        case 'customerName':
        case 'customerAddress':
          // Skip - already handled above
          break;
        case 'invoiceNumber':
          dispatch({ type: 'SET_INVOICE_NUMBER', payload: value as string });
          break;
        case 'date':
          dispatch({ type: 'SET_DATE', payload: value as Date });
          break;
        case 'dueDate':
          dispatch({ type: 'SET_DUE_DATE', payload: value as Date });
          break;
        case 'taxRate':
          dispatch({ type: 'SET_TAX_RATE', payload: value as number });
          break;
        case 'notes':
          dispatch({ type: 'SET_NOTES', payload: value as string });
          break;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header with language, theme toggles, and tab navigation */}
      <Header />

      {/* Render Part 2 if active */}
      {activeTab === 'part2' && <Part2Placeholder />}

      {/* Render Part 1 (Invoice Generator) if active */}
      {activeTab === 'part1' && (
        <main className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {t.voiceNotSupported}
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {t.microphoneError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Voice Error Display */}
          {voiceError && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {t.error}
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {voiceError.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Responsive Layout */}
          {/* Mobile: Single column stack */}
          {/* Tablet (768px+): Two columns side-by-side */}
          {/* Desktop (1280px+): Single column centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 md:gap-5 lg:gap-6 xl:max-w-5xl xl:mx-auto">
            {/* Left Column: Voice Input & Controls */}
            <div className="space-y-6">
              {/* Voice Control */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t.voiceInput}
                </h2>

                {/* Microphone Button */}
                <div className="flex justify-center mb-4">
                  <MicrophoneButton
                    status={voiceStatus}
                    onToggle={handleToggleVoice}
                  />
                </div>

                {/* Audio Visualizer */}
                <VoiceVisualizer status={voiceStatus} className="mb-4" />

                {/* Status Text */}
                <div className="text-center mb-4">
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {voiceStatus === 'listening' && t.listening}
                    {voiceStatus === 'processing' && t.processing}
                    {voiceStatus === 'idle' && isSupported && t.startListening}
                    {voiceStatus === 'unsupported' && t.unsupported}
                    {voiceStatus === 'error' && t.error}
                  </p>
                </div>

                {/* Transcription Display */}
                <TranscriptionDisplay
                  segments={transcripts}
                  interimTranscript={interimTranscript}
                  className="mb-4"
                />

                {/* Last Command Feedback */}
                {lastCommand && (
                  <VoiceCommandProcessor lastCommand={lastCommand} />
                )}

                {/* Clear Transcripts Button */}
                {transcripts.length > 0 && (
                  <button
                    onClick={resetTranscripts}
                    className="mt-4 w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
                  >
                    {t.clearTranscription}
                  </button>
                )}
              </div>

              {/* Invoice Field Guide */}
              <InvoiceFieldGuide invoiceData={invoiceData} />

              {/* Manual Add Item Form */}
              <AddItemForm onAddItem={addItem} />

              {/* Invoice Details Form - Show on tablet and desktop */}
              <InvoiceForm
                invoiceData={invoiceData}
                onUpdate={handleInvoiceUpdate}
                className="hidden md:block"
              />
            </div>

            {/* Middle Column: Items List & Forms */}
            <div className="space-y-6">
              {/* Invoice Items */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-5 lg:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t.invoiceItems}
                </h2>
                <InvoiceItemsList
                  items={invoiceData.items}
                  editingItemId={editingItemId}
                  onEditItem={updateItem}
                  onDeleteItem={removeItem}
                />
              </div>

              {/* Invoice Form - Show on mobile only */}
              <InvoiceForm
                invoiceData={invoiceData}
                onUpdate={handleInvoiceUpdate}
                className="md:hidden"
              />
            </div>

            {/* Right Column: Preview & PDF */}
            <div className="space-y-6 md:col-span-2 xl:col-span-1">
              {/* Invoice Preview */}
              <InvoicePreview invoiceData={invoiceData} />

              {/* PDF Generator */}
              <PDFGenerator ref={pdfGeneratorRef} invoiceData={invoiceData} />
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
              {t.voiceCommandsHelp}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-blue-800 dark:text-blue-300">
              <div>
                <p className="font-medium mb-2">{t.commandExamples}:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                  <li>"{t.addItemCommand}"</li>
                  <li>"{t.addItemCommand2}"</li>
                  <li>"{t.addItemCommand3}"</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-medium mb-1">{t.customerName}:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                    <li>"{t.customerCommand}"</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">{t.tax}:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                    <li>"{t.taxCommand}"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {t.appTitle} | React 19 & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * App wrapper with providers
 * TabProvider must be inside LanguageProvider to access translations
 */
export function InvoiceApp() {
  return (
    <TabProvider>
      <AppContent />
    </TabProvider>
  );
}
