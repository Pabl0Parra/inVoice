# Voice-Enabled Invoice Builder - Technical Specification
# Voice-Enabled Invoice Builder - Technical Specification

## Project Overview
Build a mobile-first React 19 application with TypeScript that allows users to create invoices through voice input. The application must support real-time speech-to-text conversion, intelligent invoice data extraction, and PDF generation.

## Tech Stack Requirements
- **Framework**: React 19 with TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS (mobile-first approach)
- **Speech Recognition**: Web Speech API with fallback to `react-speech-recognition` library
- **PDF Generation**: `@react-pdf/renderer` or `jspdf` with `html2canvas`
- **State Management**: React 19 hooks (useState, useReducer, useContext)
- **Build Tool**: Vite
- **Type Safety**: NO `any` types - use proper TypeScript types throughout

## Core Features

### 1. Voice Input System
- Continuous speech recognition with visual feedback (waveform or pulse animation)
- Start/stop recording controls optimized for touch
- Real-time transcription display
- Support for multiple languages (start with English, Spanish)
- Error handling for unsupported browsers
- Microphone permission management with clear UI states

### 2. Invoice Data Structure
```typescript
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
}
```

### 3. Natural Language Processing
Implement intelligent parsing to extract invoice data from spoken commands:
- "Add 5 units of Product X at $20 each"
- "Customer name is John Smith"
- "Set tax rate to 10 percent"
- "Remove last item"
- "Change quantity of item 2 to 10"

Use pattern matching and keyword extraction to update invoice state.

### 4. Mobile-First UI Components

#### Required Components:
1. **MicrophoneButton**: Large, accessible button with recording states
   - Idle, Recording, Processing, Error states
   - Visual feedback (color changes, animations)
   - Haptic feedback support (if available)

2. **TranscriptionDisplay**: Shows real-time voice input
   - Auto-scroll to latest content
   - Confidence indicators
   - Edit capability for corrections

3. **InvoiceForm**: Dynamic form that updates from voice input
   - Touch-optimized input fields as fallback
   - Real-time calculation display
   - Validation with error messages
   - Add/remove items manually

4. **InvoiceItemsList**: Scrollable list of invoice items
   - Swipe-to-delete gesture
   - Tap to edit
   - Visual total calculations

5. **InvoicePreview**: Real-time preview of the final invoice
   - PDF-like rendering
   - Responsive layout

6. **PDFExportButton**: Generate and download PDF
   - Loading state during generation
   - Success/error feedback

### 5. Responsive Design Requirements
- **Mobile (320px - 768px)**: Primary target, single column layout
- **Tablet (768px - 1024px)**: Two-column layout (form + preview)
- **Desktop (1024px+)**: Three-column layout (input + form + preview)

Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`

### 6. Voice Command System

#### Supported Commands:
- **Add items**: "Add [quantity] [product name] at [price] each"
- **Customer info**: "Customer is [name]", "Address is [address]"
- **Dates**: "Invoice date [date]", "Due date [date]"
- **Modifications**: "Change item [number] quantity to [number]"
- **Remove**: "Delete item [number]" or "Remove last item"
- **Calculate**: "Set tax to [percentage]"
- **Navigation**: "Show preview", "Generate PDF"

### 7. PDF Generation Specifications
- Professional invoice template with company branding area
- Itemized list with proper formatting
- Subtotal, tax, and total clearly displayed
- Invoice metadata (number, dates, customer info)
- Footer with notes/terms
- Proper page breaks for long invoices
- File naming: `invoice-[number]-[date].pdf`

## Technical Implementation Guidelines

### 1. TypeScript Standards
```typescript
// ✅ Good - Explicit types
interface VoiceCommand {
  type: 'add_item' | 'update_customer' | 'set_tax' | 'remove_item';
  payload: Record<string, string | number>;
}

// ❌ Bad - Using any
const handleCommand = (command: any) => { ... }
```

### 2. Speech Recognition Setup
```typescript
// Use Web Speech API with proper typing
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
```

### 3. State Management Pattern
Use `useReducer` for complex invoice state management:
```typescript
type InvoiceAction = 
  | { type: 'ADD_ITEM'; payload: Omit<InvoiceItem, 'id' | 'total'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: InvoiceItem }
  | { type: 'SET_CUSTOMER'; payload: Pick<InvoiceData, 'customerName' | 'customerAddress'> }
  | { type: 'SET_TAX_RATE'; payload: number };
```

### 4. Error Handling
- Graceful degradation if speech recognition unavailable
- Clear error messages for users
- Retry mechanisms for failed operations
- Form validation with Zod or similar

### 5. Performance Optimization
- Debounce voice input processing
- Memoize calculations (useMemo for totals)
- Lazy load PDF generation library
- Optimize re-renders with React.memo where appropriate

### 6. Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for voice status
- High contrast mode support
- Focus management

## File Structure
```
src/
├── components/
│   ├── VoiceInput/
│   │   ├── MicrophoneButton.tsx
│   │   ├── TranscriptionDisplay.tsx
│   │   └── VoiceCommandProcessor.tsx
│   ├── Invoice/
│   │   ├── InvoiceForm.tsx
│   │   ├── InvoiceItem.tsx
│   │   ├── InvoiceItemsList.tsx
│   │   └── InvoicePreview.tsx
│   └── PDF/
│       ├── PDFGenerator.tsx
│       └── InvoiceTemplate.tsx
├── hooks/
│   ├── useSpeechRecognition.ts
│   ├── useInvoiceState.ts
│   └── useVoiceCommands.ts
├── types/
│   ├── invoice.types.ts
│   ├── voice.types.ts
│   └── index.ts
├── utils/
│   ├── voiceParser.ts
│   ├── invoiceCalculations.ts
│   └── pdfGenerator.ts
└── App.tsx
```

## Development Phases

### Phase 1: Core Setup
1. Initialize React 19 + Vite + TypeScript project
2. Configure Tailwind CSS
3. Set up type definitions
4. Create basic component structure

### Phase 2: Voice Recognition
1. Implement Web Speech API integration
2. Create microphone controls
3. Build transcription display
4. Add browser compatibility checks

### Phase 3: Natural Language Processing
1. Build command parser
2. Implement pattern matching for invoice commands
3. Create state update logic
4. Add validation

### Phase 4: Invoice Management
1. Build invoice form components
2. Implement calculations
3. Create item management (add/edit/delete)
4. Add data persistence (localStorage)

### Phase 5: PDF Generation
1. Design invoice template
2. Implement PDF rendering
3. Add download functionality
4. Test with various data

### Phase 6: Polish & Testing
1. Responsive design refinement
2. Error handling improvements
3. Accessibility audit
4. Performance optimization
5. User testing feedback

## Testing Requirements
- Unit tests for utilities (voice parser, calculations)
- Component tests with React Testing Library
- Integration tests for voice-to-invoice flow
- Manual testing on various mobile devices
- Cross-browser testing (Chrome, Safari, Firefox)

## Code Quality Standards
- ESLint with TypeScript rules
- Prettier for formatting
- Strict TypeScript configuration
- No `any` types
- Proper error boundaries
- Comprehensive JSDoc comments for complex functions

## Success Criteria
- ✅ Users can create complete invoices via voice on mobile devices
- ✅ 90%+ accuracy in command recognition for common phrases
- ✅ PDF generation works reliably with proper formatting
- ✅ App loads in < 3 seconds on 3G connection
- ✅ No TypeScript errors or warnings
- ✅ Passes WCAG 2.1 Level AA accessibility standards
- ✅ Works on iOS Safari and Chrome Android

## Agent Persona
Act as a **Senior React Developer** with 8+ years of experience specializing in:
- Modern React patterns and best practices
- TypeScript advanced types and generics
- Speech recognition and Web APIs
- Mobile-first responsive design
- PDF generation libraries
- Performance optimization
- Accessibility compliance

Provide code that is:
- Production-ready with proper error handling
- Well-documented with clear comments
- Type-safe with comprehensive TypeScript coverage
- Optimized for mobile performance
- Following React 19 best practices
- Maintainable and scalable
