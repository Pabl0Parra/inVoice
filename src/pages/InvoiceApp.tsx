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
          customerName: updates.customerName ?? invoiceData.customerName,
          customerAddress: updates.customerAddress ?? invoiceData.customerAddress,
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
          {/* Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-[1920px] mx-auto">
            {/* Left Column: Editor (Voice, Forms, List) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              {/* Voice Control Section - Full Width Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      {t.voiceInput}
                    </h2>
                    <div className="flex items-center gap-2">
                       {/* Status Indicator */}
                       <div className={`w-2 h-2 rounded-full ${
                          voiceStatus === 'listening' ? 'bg-red-500 animate-pulse' : 
                          voiceStatus === 'processing' ? 'bg-yellow-500' : 'bg-gray-300'
                       }`} />
                       <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {voiceStatus}
                       </span>
                    </div>
                  </div>

                  {/* Microphone & Visualizer */}
                  <div className={`relative flex flex-col items-center justify-center transition-all duration-500 ease-in-out bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden ${
                    voiceStatus === 'listening' ? 'h-64' : 'h-40'
                  }`}>
                    <div className={`transition-all duration-500 z-10 ${
                      voiceStatus === 'listening' ? 'scale-125 -translate-y-4' : 'scale-100'
                    }`}>
                      <MicrophoneButton
                        status={voiceStatus}
                        onToggle={handleToggleVoice}
                      />
                    </div>
                    
                    {/* Visualizer Container */}
                    <div className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                      voiceStatus === 'listening' ? 'h-32 opacity-100' : 'h-12 opacity-30'
                    }`}>
                       <VoiceVisualizer status={voiceStatus} className="w-full h-full" />
                    </div>
                  </div>

                  {/* Transcription & Feedback */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4 min-h-[100px] border border-gray-100 dark:border-gray-700">
                       <TranscriptionDisplay
                        segments={transcripts}
                        interimTranscript={interimTranscript}
                      />
                    </div>
                    
                    {lastCommand && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <VoiceCommandProcessor lastCommand={lastCommand} />
                      </div>
                    )}

                    {transcripts.length > 0 && (
                      <button
                        onClick={resetTranscripts}
                        className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {t.clearTranscription}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Voice Commands Help - Right after mic */}
              <InvoiceFieldGuide invoiceData={invoiceData} />

              {/* Forms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manual Add Item */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </span>
                      {t.addItemManually}
                   </h3>
                   <AddItemForm onAddItem={addItem} />
                </div>

                {/* Invoice Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </span>
                      {t.invoiceDetails}
                   </h3>
                   <InvoiceForm
                    invoiceData={invoiceData}
                    onUpdate={handleInvoiceUpdate}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
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
            </div>

            {/* Right Column: Preview (Sticky) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Preview Card */}
                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                  <div className="p-4 bg-gray-800/50 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Live Preview</h3>
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                       <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                  </div>
                  <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900/50 overflow-x-auto">
                     <InvoicePreview invoiceData={invoiceData} />
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                   <PDFGenerator ref={pdfGeneratorRef} invoiceData={invoiceData} />
                </div>
              </div>
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
