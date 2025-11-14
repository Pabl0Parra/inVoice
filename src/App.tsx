import { useEffect, useState } from 'react';
import { useSpeechRecognition, useInvoiceState, useVoiceCommands } from './hooks';
import {
  MicrophoneButton,
  TranscriptionDisplay,
  VoiceCommandProcessor,
} from './components/VoiceInput';
import {
  AddItemForm,
  InvoiceForm,
  InvoiceItemsList,
  InvoicePreview,
} from './components/Invoice';
import { PDFGenerator } from './components/PDF';
import type { VoiceCommand, InvoiceData } from './types';

/**
 * Main application component
 * Voice-enabled invoice builder with mobile-first responsive design
 */
function App() {
  // State management
  const {
    invoiceData,
    dispatch,
    addItem,
    removeItem,
    updateItem,
  } = useInvoiceState();

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

  // Track last processed command for UI feedback
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);

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

    setLastCommand(command);

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
    Object.entries(updates).forEach(([key, value]) => {
      switch (key) {
        case 'invoiceNumber':
          dispatch({ type: 'SET_INVOICE_NUMBER', payload: value as string });
          break;
        case 'date':
          dispatch({ type: 'SET_DATE', payload: value as Date });
          break;
        case 'dueDate':
          dispatch({ type: 'SET_DUE_DATE', payload: value as Date });
          break;
        case 'customerName':
        case 'customerAddress':
          if ('customerName' in updates || 'customerAddress' in updates) {
            dispatch({
              type: 'SET_CUSTOMER',
              payload: {
                customerName: updates.customerName || invoiceData.customerName,
                customerAddress: updates.customerAddress || invoiceData.customerAddress,
              },
            });
          }
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Animated wave background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header with wave gradient */}
      <header className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 border-b-4 border-cyan-400 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                in<span className="text-cyan-200">Voice</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100 font-medium">
              🏄 Voice-Enabled Invoice Builder
            </p>
          </div>
        </div>
        {/* Wave SVG decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-4">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none">
            <path d="M0 0L50 10C100 20 200 40 300 46.7C400 53 500 47 600 43.3C700 40 800 40 900 46.7C1000 53 1100 67 1150 73.3L1200 80V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0V0Z" fill="rgb(240 253 250)" />
          </svg>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-orange-900 mb-1">
                  🌊 Voice input not available
                </h3>
                <p className="text-xs sm:text-sm text-orange-800">
                  Speech recognition is not supported in this browser. Please use Chrome or Edge for voice features. You can still create invoices manually.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Voice Error Display */}
        {voiceError && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-red-900 mb-1">Voice Recognition Error</h3>
                <p className="text-xs sm:text-sm text-red-800">{voiceError.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fully Responsive Layout: 1 col (mobile) -> 2 col (tablet) -> 3 col (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Left Column: Voice Input & Controls */}
          <div className="md:col-span-1 xl:col-span-1 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Voice Control Card */}
            <div className="relative bg-gradient-to-br from-white via-cyan-50 to-blue-50 rounded-2xl shadow-xl border-2 border-cyan-200 p-5 sm:p-6 backdrop-blur-sm overflow-hidden">
              {/* Decorative wave pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200 to-transparent rounded-full blur-2xl opacity-30"></div>

              <h2 className="relative text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent mb-4 sm:mb-5">
                🎤 Voice Input
              </h2>

              {/* Microphone Button */}
              <div className="flex justify-center mb-4">
                <MicrophoneButton status={voiceStatus} onToggle={handleToggleVoice} />
              </div>

              {/* Status Text */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  {voiceStatus === 'listening' && 'Listening...'}
                  {voiceStatus === 'processing' && 'Processing...'}
                  {voiceStatus === 'idle' && isSupported && 'Click to start'}
                  {voiceStatus === 'unsupported' && 'Not supported'}
                  {voiceStatus === 'error' && 'Error occurred'}
                </p>
              </div>

              {/* Transcription Display */}
              <TranscriptionDisplay
                segments={transcripts}
                interimTranscript={interimTranscript}
                className="mb-4"
              />

              {/* Last Command Feedback */}
              {lastCommand && <VoiceCommandProcessor lastCommand={lastCommand} />}

              {/* Clear Transcripts Button */}
              {transcripts.length > 0 && (
                <button
                  onClick={resetTranscripts}
                  className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear transcripts
                </button>
              )}
            </div>

            {/* Manual Add Item Form */}
            <AddItemForm onAddItem={addItem} />

            {/* Invoice Details Form */}
            <InvoiceForm
              invoiceData={invoiceData}
              onUpdate={handleInvoiceUpdate}
              className="hidden lg:block"
            />
          </div>

          {/* Middle Column: Items List */}
          <div className="md:col-span-1 xl:col-span-1 space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="relative bg-gradient-to-br from-white via-teal-50 to-cyan-50 rounded-2xl shadow-xl border-2 border-teal-200 p-5 sm:p-6 backdrop-blur-sm overflow-hidden">
              {/* Decorative element */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-200 to-transparent rounded-full blur-2xl opacity-30"></div>

              <h2 className="relative text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent mb-4 sm:mb-5">
                📋 Invoice Items
              </h2>
              <InvoiceItemsList
                items={invoiceData.items}
                editingItemId={editingItemId}
                onEditItem={updateItem}
                onDeleteItem={removeItem}
              />
            </div>

            {/* Invoice Form - Tablet/Mobile */}
            <InvoiceForm
              invoiceData={invoiceData}
              onUpdate={handleInvoiceUpdate}
              className="xl:hidden"
            />
          </div>

          {/* Right Column: Preview & PDF */}
          <div className="md:col-span-2 xl:col-span-1 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Invoice Preview Card */}
            <div className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden">
              <InvoicePreview invoiceData={invoiceData} />
            </div>

            {/* PDF Generator Card */}
            <div className="relative bg-gradient-to-br from-white via-orange-50 to-amber-50 rounded-2xl shadow-xl border-2 border-orange-300 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <span className="text-xl">📄</span>
                Generate PDF
              </h3>
              <PDFGenerator invoiceData={invoiceData} />
            </div>
          </div>
        </div>

        {/* Help Section - Surfing Theme */}
        <div className="mt-8 sm:mt-10 lg:mt-12 relative bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100 border-2 border-cyan-300 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl overflow-hidden">
          {/* Wave decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-cyan-300 to-transparent rounded-full blur-3xl opacity-20"></div>

          <div className="relative">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-700 via-blue-700 to-teal-700 bg-clip-text text-transparent mb-5 sm:mb-6 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🏄‍♂️</span>
              Voice Commands Guide
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-cyan-200 hover:shadow-lg transition-shadow">
                <p className="font-bold text-cyan-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  Add Items:
                </p>
                <ul className="space-y-2 text-sm text-cyan-900">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 flex-shrink-0">•</span>
                    <span>"Add 5 units of Product X at $20"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 flex-shrink-0">•</span>
                    <span>"Add laptop at 999 dollars"</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
                <p className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Customer Info:
                </p>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>"Customer is John Smith"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>"Address is 123 Main Street"</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-teal-200 hover:shadow-lg transition-shadow">
                <p className="font-bold text-teal-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  Invoice Details:
                </p>
                <ul className="space-y-2 text-sm text-teal-900">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 flex-shrink-0">•</span>
                    <span>"Set tax to 10 percent"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 flex-shrink-0">•</span>
                    <span>"Invoice number is INV-001"</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-cyan-200 hover:shadow-lg transition-shadow">
                <p className="font-bold text-cyan-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  Actions:
                </p>
                <ul className="space-y-2 text-sm text-cyan-900">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 flex-shrink-0">•</span>
                    <span>"Remove last item"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 flex-shrink-0">•</span>
                    <span>"Generate PDF"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Ocean Wave Theme */}
      <footer className="relative mt-16 sm:mt-20 bg-gradient-to-r from-cyan-700 via-blue-700 to-teal-700 border-t-4 border-cyan-400 overflow-hidden">
        {/* Wave SVG decoration at top */}
        <div className="absolute top-0 left-0 right-0 h-4 transform rotate-180">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none">
            <path d="M0 0L50 10C100 20 200 40 300 46.7C400 53 500 47 600 43.3C700 40 800 40 900 46.7C1000 53 1100 67 1150 73.3L1200 80V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0V0Z" fill="rgb(240 253 250)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌊</span>
              <p className="text-base sm:text-lg font-bold text-white">
                inVoice - Voice-Enabled Invoice Builder
              </p>
              <span className="text-2xl">🏄</span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100">
              Built with React 19, TypeScript & @react-pdf/renderer
            </p>
            <p className="text-xs text-cyan-200">
              Ride the wave of productivity! 🌊✨
            </p>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400"></div>
      </footer>
    </div>
  );
}

export default App;
