export type Language = 'es' | 'en';

export interface Translations {
  // Header
  appTitle: string;
  darkMode: string;
  lightMode: string;

  // Voice Input
  voiceInput: string;
  startListening: string;
  stopListening: string;
  listening: string;
  processing: string;
  unsupported: string;
  voiceNotSupported: string;
  microphoneError: string;

  // Transcription
  transcription: string;
  noTranscriptionYet: string;
  clearTranscription: string;

  // Last Command
  lastCommand: string;
  commandType: string;
  noCommandYet: string;

  // Add Item Form
  addItemManually: string;
  description: string;
  quantity: string;
  unitPrice: string;
  addItem: string;

  // Invoice Items
  invoiceItems: string;
  noItemsYet: string;
  edit: string;
  delete: string;

  // Invoice Details
  invoiceDetails: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  notes: string;

  // Calculations
  subtotal: string;
  tax: string;
  total: string;

  // PDF
  generatePDF: string;
  generating: string;

  // PDF Template
  pdfInvoiceTitle: string;
  pdfBillTo: string;
  pdfQty: string;
  pdfTotalDue: string;
  pdfThankYou: string;
  pdfPaymentInstructions: string;
  pdfCompanyName: string;
  pdfCompanyAddress: string;
  pdfCompanyPhone: string;
  pdfCompanyEmail: string;

  // Voice Commands Help
  voiceCommandsHelp: string;
  commandExamples: string;
  addItemCommand: string;
  customerCommand: string;
  taxCommand: string;

  // Errors
  error: string;
  required: string;
  invalidNumber: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Header
    appTitle: 'Facturación por Voz',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',

    // Voice Input
    voiceInput: 'Entrada de Voz',
    startListening: 'Iniciar Escucha',
    stopListening: 'Detener',
    listening: 'Escuchando...',
    processing: 'Procesando...',
    unsupported: 'No Compatible',
    voiceNotSupported: 'Tu navegador no soporta reconocimiento de voz',
    microphoneError: 'Error con el micrófono. Verifica los permisos.',

    // Transcription
    transcription: 'Transcripción',
    noTranscriptionYet: 'No hay transcripción todavía. Presiona el botón para comenzar.',
    clearTranscription: 'Limpiar',

    // Last Command
    lastCommand: 'Último Comando',
    commandType: 'Tipo de Comando',
    noCommandYet: 'No hay comandos todavía',

    // Add Item Form
    addItemManually: 'Agregar Artículo Manualmente',
    description: 'Descripción',
    quantity: 'Cantidad',
    unitPrice: 'Precio Unitario',
    addItem: 'Agregar',

    // Invoice Items
    invoiceItems: 'Artículos de la Factura',
    noItemsYet: 'No hay artículos todavía. Usa voz o el formulario para agregar.',
    edit: 'Editar',
    delete: 'Eliminar',

    // Invoice Details
    invoiceDetails: 'Detalles de la Factura',
    invoiceNumber: 'N° de Factura',
    invoiceDate: 'Fecha',
    dueDate: 'Vencimiento',
    customerName: 'Cliente',
    customerAddress: 'Dirección',
    notes: 'Notas',

    // Calculations
    subtotal: 'Subtotal',
    tax: 'Impuesto',
    total: 'Total',

    // PDF
    generatePDF: 'Generar PDF',
    generating: 'Generando...',

    // PDF Template
    pdfInvoiceTitle: 'FACTURA',
    pdfBillTo: 'Facturar a',
    pdfQty: 'Cant.',
    pdfTotalDue: 'Total a Pagar',
    pdfThankYou: '¡Gracias por su preferencia!',
    pdfPaymentInstructions: 'Por favor realice el pago antes de la fecha de vencimiento. Para consultas, contáctenos a info@empresa.com',
    pdfCompanyName: 'Tu Empresa',
    pdfCompanyAddress: 'Calle Principal 123',
    pdfCompanyPhone: 'Teléfono',
    pdfCompanyEmail: 'Email',

    // Voice Commands Help
    voiceCommandsHelp: 'Ayuda de Comandos de Voz',
    commandExamples: 'Ejemplos de comandos',
    addItemCommand: 'Añadir 5 laptops a 999',
    customerCommand: 'Cliente es Juan Pérez',
    taxCommand: 'IVA 21',

    // Errors
    error: 'Error',
    required: 'Requerido',
    invalidNumber: 'Número inválido',
  },

  en: {
    // Header
    appTitle: 'Voice Invoicing',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',

    // Voice Input
    voiceInput: 'Voice Input',
    startListening: 'Start Listening',
    stopListening: 'Stop',
    listening: 'Listening...',
    processing: 'Processing...',
    unsupported: 'Unsupported',
    voiceNotSupported: 'Your browser does not support voice recognition',
    microphoneError: 'Microphone error. Check permissions.',

    // Transcription
    transcription: 'Transcription',
    noTranscriptionYet: 'No transcription yet. Press the button to start.',
    clearTranscription: 'Clear',

    // Last Command
    lastCommand: 'Last Command',
    commandType: 'Command Type',
    noCommandYet: 'No commands yet',

    // Add Item Form
    addItemManually: 'Add Item Manually',
    description: 'Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    addItem: 'Add',

    // Invoice Items
    invoiceItems: 'Invoice Items',
    noItemsYet: 'No items yet. Use voice or the form to add.',
    edit: 'Edit',
    delete: 'Delete',

    // Invoice Details
    invoiceDetails: 'Invoice Details',
    invoiceNumber: 'Invoice #',
    invoiceDate: 'Date',
    dueDate: 'Due Date',
    customerName: 'Customer',
    customerAddress: 'Address',
    notes: 'Notes',

    // Calculations
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',

    // PDF
    generatePDF: 'Generate PDF',
    generating: 'Generating...',

    // PDF Template
    pdfInvoiceTitle: 'INVOICE',
    pdfBillTo: 'Bill To',
    pdfQty: 'Qty',
    pdfTotalDue: 'Total Due',
    pdfThankYou: 'Thank you for your business!',
    pdfPaymentInstructions: 'Please make payment by the due date. For questions, contact us at info@company.com',
    pdfCompanyName: 'Your Company Name',
    pdfCompanyAddress: '123 Business Street',
    pdfCompanyPhone: 'Phone',
    pdfCompanyEmail: 'Email',

    // Voice Commands Help
    voiceCommandsHelp: 'Voice Commands Help',
    commandExamples: 'Command examples',
    addItemCommand: 'Add 5 laptops at 999',
    customerCommand: 'Customer is John Smith',
    taxCommand: 'Set tax to 21',

    // Errors
    error: 'Error',
    required: 'Required',
    invalidNumber: 'Invalid number',
  },
};
