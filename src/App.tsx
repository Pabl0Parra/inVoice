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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">inVoice</h1>
            <p className="text-sm text-gray-500 hidden sm:block">
              Voice-Enabled Invoice Builder
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
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
                <h3 className="text-sm font-medium text-yellow-800">
                  Voice input not available
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Speech recognition is not supported in this browser. Please use Chrome or
                  Edge for voice features. You can still create invoices manually.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Voice Error Display */}
        {voiceError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
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
                <h3 className="text-sm font-medium text-red-800">Voice Recognition Error</h3>
                <p className="mt-1 text-sm text-red-700">{voiceError.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-First Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Voice Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Voice Control */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Input</h2>

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
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h2>
              <InvoiceItemsList
                items={invoiceData.items}
                editingItemId={editingItemId}
                onEditItem={updateItem}
                onDeleteItem={removeItem}
              />
            </div>

            {/* Invoice Form - Mobile */}
            <InvoiceForm
              invoiceData={invoiceData}
              onUpdate={handleInvoiceUpdate}
              className="lg:hidden"
            />
          </div>

          {/* Right Column: Preview & PDF */}
          <div className="lg:col-span-1 space-y-6">
            {/* Invoice Preview */}
            <InvoicePreview invoiceData={invoiceData} />

            {/* PDF Generator */}
            <PDFGenerator invoiceData={invoiceData} />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Voice Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-2">Add Items:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>"Add 5 units of Product X at $20"</li>
                <li>"Add laptop at 999 dollars"</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Customer Info:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>"Customer is John Smith"</li>
                <li>"Address is 123 Main Street"</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Invoice Details:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>"Set tax to 10 percent"</li>
                <li>"Invoice number is INV-001"</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Actions:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>"Remove last item"</li>
                <li>"Generate PDF"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            inVoice - Voice-Enabled Invoice Builder | Built with React 19 & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
