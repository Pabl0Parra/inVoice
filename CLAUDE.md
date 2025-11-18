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

# Part 1

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
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

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
  | {
      type: 'SET_CUSTOMER';
      payload: Pick<InvoiceData, 'customerName' | 'customerAddress'>;
    }
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

### Part 1: Core Setup

1. Initialize React 19 + Vite + TypeScript project
2. Configure Tailwind CSS
3. Set up type definitions
4. Create basic component structure

### Part 2: Voice Recognition. In this part we will have to add a tab for Part 1 and another tab for part 2 in the header.

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

We ARE READY FOR THE NEXT PHASE!

Here you go — a **clean, ready-to-use Markdown file** exactly as requested.
I fixed formatting, closed code blocks, corrected broken sections, and ensured it's fully valid **`.md`**.

---

# Part 2: Spanish Painting Company Enhancements

**Technical Specification & Feature Proposal**

## Overview

This document outlines the proposed _Part 2_ features for the Voice-Enabled Invoice Builder. These enhancements are designed specifically for the workflow of a commercial painting business in Spain, leveraging the existing React 19 architecture from Part 1.

**Prerequisites**: Part 1 must be complete with all core features implemented:

- ✅ Voice recognition system with Web Speech API
- ✅ Basic invoice data structure and state management
- ✅ Natural language processing for invoice commands
- ✅ Mobile-first UI components
- ✅ PDF generation capability
- ✅ Multi-language support (English, Spanish)

---

# Part 2: Spanish Painting Company Enhancements

## Spanish Fiscal Compliance (The "Autónomo" Pack)

### Overview

In Spain, invoicing for services (especially B2B) requires additional fiscal fields beyond standard VAT (IVA). This is critical for commercial painting businesses working with companies.

### Features

#### 1.1 IRPF Retention Logic

Automatic calculation of IRPF (Impuesto sobre la Renta de las Personas Físicas) - income tax withholding for freelancers.

**Business Rules**:

- Standard rate: 15% (general professional services)
- Reduced rate: 7% (for new freelancers in first 3 years)
- Applied to B2B invoices only (companies must withhold this amount)
- Subtracted from the total amount payable
- Must be clearly itemized on invoice

**Voice Commands**:

- "Apply IRPF of 15 percent"
- "Apply IRPF of 7 percent"
- "Set retention to 15"
- "Remove IRPF"
- "This is for a company" (auto-applies default IRPF)

#### 1.2 IVA (VAT) Presets

Spain has multiple VAT rates. Painting businesses need quick access to specific rates.

**Rate Presets**:

- **21%** - Standard rate (new construction, commercial work)
- **10%** - Reduced rate (renovation of housing > 2 years old)
- **4%** - Super-reduced (social housing, protected housing)
- **0%** - Exempt (Canary Islands, certain exports)

**Voice Commands**:

- "Set VAT to renovation rate" → 10%
- "Apply standard VAT" → 21%
- "Set IVA to 10 percent"
- "Tax exempt invoice"
- "This is new construction" → 21%
- "This is a renovation" → 10%

#### 1.3 Equivalence Surcharge (Recargo de Equivalencia)

For retail clients who operate under the equivalence regime (common in small retail).

**Business Rules**:

- Only applies to B2C sales of materials
- Rate: 5.2% (for standard 21% VAT) or 1.4% (for reduced 10% VAT)
- Added on top of VAT
- Not applicable if IRPF is applied (mutually exclusive)

**Voice Commands**:

- "Enable equivalence surcharge"
- "Apply recargo"
- "Client uses equivalence regime"
- "Remove surcharge"

### Technical Implementation

#### Type Definitions

```typescript
// Extend existing invoice.types.ts

interface SpanishTaxConfig {
  retentionRate: number; // IRPF percentage (0, 7, 15)
  vatRate: number; // IVA percentage (0, 4, 10, 21)
  equivalenceSurcharge: number; // Recargo percentage (0, 1.4, 5.2)
  isB2B: boolean; // Business-to-business flag
  taxExemptReason?: string; // If VAT = 0, reason required
}

interface InvoiceData {
  // ... existing Part 1 fields

  // Spanish fiscal fields
  spanishTax: SpanishTaxConfig;

  // Calculated amounts
  subtotal: number;
  vatAmount: number;
  retentionAmount: number; // IRPF amount
  surchargeAmount: number; // Recargo amount
  total: number; // Final amount to pay
}

// Preset configurations
type VATPreset = 'standard' | 'reduced' | 'super-reduced' | 'exempt';
type IRPFPreset = 'none' | 'new-freelancer' | 'standard';
```

#### Calculation Logic

```typescript
// utils/spanishTaxCalculations.ts

interface TaxCalculationResult {
  subtotal: number;
  vatAmount: number;
  retentionAmount: number;
  surchargeAmount: number;
  totalBeforeRetention: number;
  total: number;
}

export function calculateSpanishTaxes(
  items: InvoiceItem[],
  taxConfig: SpanishTaxConfig,
): TaxCalculationResult {
  // 1. Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  // 2. Calculate VAT
  const vatAmount = (subtotal * taxConfig.vatRate) / 100;

  // 3. Calculate Equivalence Surcharge (if applicable)
  let surchargeAmount = 0;
  if (taxConfig.equivalenceSurcharge > 0 && !taxConfig.isB2B) {
    surchargeAmount = (subtotal * taxConfig.equivalenceSurcharge) / 100;
  }

  // 4. Total before retention
  const totalBeforeRetention = subtotal + vatAmount + surchargeAmount;

  // 5. Calculate IRPF retention (if B2B)
  let retentionAmount = 0;
  if (taxConfig.isB2B && taxConfig.retentionRate > 0) {
    retentionAmount = (subtotal * taxConfig.retentionRate) / 100;
  }

  // 6. Final total (retention is subtracted)
  const total = totalBeforeRetention - retentionAmount;

  return {
    subtotal,
    vatAmount,
    retentionAmount,
    surchargeAmount,
    totalBeforeRetention,
    total,
  };
}

// Validation rules
export function validateSpanishTaxConfig(
  config: SpanishTaxConfig,
): string | null {
  // Cannot have both IRPF and equivalence surcharge
  if (config.retentionRate > 0 && config.equivalenceSurcharge > 0) {
    return 'Cannot apply both IRPF retention and equivalence surcharge';
  }

  // IRPF only for B2B
  if (config.retentionRate > 0 && !config.isB2B) {
    return 'IRPF retention only applies to business clients';
  }

  // Equivalence surcharge only for B2C
  if (config.equivalenceSurcharge > 0 && config.isB2B) {
    return 'Equivalence surcharge only applies to retail clients';
  }

  // Tax exempt reason required
  if (config.vatRate === 0 && !config.taxExemptReason) {
    return 'Tax exemption reason required when VAT is 0%';
  }

  return null; // Valid
}
```

#### Voice Command Parser Extension

```typescript
// utils/voiceParser.ts - extend existing parser

interface SpanishTaxCommand {
  type: 'SET_IRPF' | 'SET_VAT_PRESET' | 'SET_EQUIVALENCE' | 'SET_CLIENT_TYPE';
  payload: Partial<SpanishTaxConfig>;
}

export function parseSpanishTaxCommand(
  transcript: string,
): SpanishTaxCommand | null {
  const lowerTranscript = transcript.toLowerCase();

  // IRPF patterns
  const irpfPatterns = [
    /(?:apply|set|add)\s+irpf\s+(?:of\s+)?(\d+)\s*percent/i,
    /(?:apply|set)\s+retention\s+(?:to\s+)?(\d+)/i,
    /(?:this\s+is\s+)?for\s+(?:a\s+)?company/i,
  ];

  // VAT preset patterns
  const vatPresetPatterns = {
    standard: /(?:standard|normal)\s+(?:vat|iva)|new\s+construction/i,
    reduced: /(?:reduced|renovation)\s+(?:rate|vat|iva)|renovation/i,
    superReduced: /(?:super[\s-]?reduced|protected|social)\s+housing/i,
    exempt: /(?:tax\s+)?exempt|canary\s+islands|zero\s+(?:vat|iva)/i,
  };

  // Equivalence surcharge patterns
  const surchargePatterns = [
    /(?:enable|apply|add)\s+(?:equivalence\s+)?(?:surcharge|recargo)/i,
    /client\s+uses\s+equivalence/i,
  ];

  // Parse IRPF
  for (const pattern of irpfPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match) {
      const rate = match[1] ? parseInt(match[1]) : 15; // Default 15%
      return {
        type: 'SET_IRPF',
        payload: { retentionRate: rate, isB2B: true },
      };
    }
  }

  // Parse VAT presets
  for (const [preset, pattern] of Object.entries(vatPresetPatterns)) {
    if (pattern.test(lowerTranscript)) {
      const rates = {
        standard: 21,
        reduced: 10,
        superReduced: 4,
        exempt: 0,
      };
      return {
        type: 'SET_VAT_PRESET',
        payload: { vatRate: rates[preset as VATPreset] },
      };
    }
  }

  // Parse equivalence surcharge
  for (const pattern of surchargePatterns) {
    if (pattern.test(lowerTranscript)) {
      return {
        type: 'SET_EQUIVALENCE',
        payload: { equivalenceSurcharge: 5.2, isB2B: false },
      };
    }
  }

  return null;
}
```

#### State Management

```typescript
// hooks/useInvoiceState.ts - extend existing reducer

type InvoiceAction =
  | { type: 'ADD_ITEM'; payload: Omit<InvoiceItem, 'id' | 'total'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: InvoiceItem }
  | {
      type: 'SET_CUSTOMER';
      payload: Pick<InvoiceData, 'customerName' | 'customerAddress'>;
    }
  | { type: 'SET_TAX_RATE'; payload: number }
  // NEW Part 2 actions
  | { type: 'SET_IRPF'; payload: number }
  | { type: 'SET_VAT_PRESET'; payload: VATPreset }
  | { type: 'TOGGLE_EQUIVALENCE'; payload: boolean }
  | { type: 'SET_CLIENT_TYPE'; payload: 'B2B' | 'B2C' }
  | { type: 'SET_SPANISH_TAX'; payload: Partial<SpanishTaxConfig> };

function invoiceReducer(
  state: InvoiceData,
  action: InvoiceAction,
): InvoiceData {
  switch (action.type) {
    // ... existing Part 1 cases

    case 'SET_IRPF': {
      const newTaxConfig = {
        ...state.spanishTax,
        retentionRate: action.payload,
        isB2B: true,
        equivalenceSurcharge: 0, // Mutually exclusive
      };

      const validation = validateSpanishTaxConfig(newTaxConfig);
      if (validation) {
        console.error(validation);
        return state;
      }

      const calculations = calculateSpanishTaxes(state.items, newTaxConfig);

      return {
        ...state,
        spanishTax: newTaxConfig,
        ...calculations,
      };
    }

    case 'SET_VAT_PRESET': {
      const vatRates: Record<VATPreset, number> = {
        standard: 21,
        reduced: 10,
        'super-reduced': 4,
        exempt: 0,
      };

      const newTaxConfig = {
        ...state.spanishTax,
        vatRate: vatRates[action.payload],
      };

      const calculations = calculateSpanishTaxes(state.items, newTaxConfig);

      return {
        ...state,
        spanishTax: newTaxConfig,
        ...calculations,
      };
    }

    case 'TOGGLE_EQUIVALENCE': {
      const surchargeRate = action.payload ? 5.2 : 0;
      const newTaxConfig = {
        ...state.spanishTax,
        equivalenceSurcharge: surchargeRate,
        isB2B: false,
        retentionRate: 0, // Mutually exclusive
      };

      const calculations = calculateSpanishTaxes(state.items, newTaxConfig);

      return {
        ...state,
        spanishTax: newTaxConfig,
        ...calculations,
      };
    }

    case 'SET_CLIENT_TYPE': {
      const isB2B = action.payload === 'B2B';
      const newTaxConfig = {
        ...state.spanishTax,
        isB2B,
        // Reset conflicting settings
        retentionRate: isB2B ? state.spanishTax.retentionRate : 0,
        equivalenceSurcharge: isB2B ? 0 : state.spanishTax.equivalenceSurcharge,
      };

      const calculations = calculateSpanishTaxes(state.items, newTaxConfig);

      return {
        ...state,
        spanishTax: newTaxConfig,
        ...calculations,
      };
    }

    default:
      return state;
  }
}
```

### UI Components

#### SpanishTaxControls Component

```typescript
// components/Invoice/SpanishTaxControls.tsx

import React from 'react';
import type { SpanishTaxConfig, VATPreset, IRPFPreset } from '@/types';

interface SpanishTaxControlsProps {
  config: SpanishTaxConfig;
  onConfigChange: (config: Partial<SpanishTaxConfig>) => void;
}

export const SpanishTaxControls: React.FC<SpanishTaxControlsProps> = ({
  config,
  onConfigChange,
}) => {
  const vatPresets: Array<{ label: string; value: VATPreset; rate: number }> = [
    { label: 'Standard (21%)', value: 'standard', rate: 21 },
    { label: 'Renovation (10%)', value: 'reduced', rate: 10 },
    { label: 'Social Housing (4%)', value: 'super-reduced', rate: 4 },
    { label: 'Exempt (0%)', value: 'exempt', rate: 0 },
  ];

  const irpfPresets: Array<{ label: string; value: IRPFPreset; rate: number }> =
    [
      { label: 'None', value: 'none', rate: 0 },
      { label: 'New Freelancer (7%)', value: 'new-freelancer', rate: 7 },
      { label: 'Standard (15%)', value: 'standard', rate: 15 },
    ];

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-lg">Spanish Tax Settings</h3>

      {/* Client Type Toggle */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Client Type:</label>
        <div className="flex gap-2">
          <button
            onClick={() => onConfigChange({ isB2B: true })}
            className={`px-4 py-2 rounded ${
              config.isB2B
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            B2B (Company)
          </button>
          <button
            onClick={() => onConfigChange({ isB2B: false })}
            className={`px-4 py-2 rounded ${
              !config.isB2B
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            B2C (Individual)
          </button>
        </div>
      </div>

      {/* VAT Rate Selector */}
      <div>
        <label className="text-sm font-medium mb-2 block">IVA Rate:</label>
        <div className="grid grid-cols-2 gap-2">
          {vatPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onConfigChange({ vatRate: preset.rate })}
              className={`px-3 py-2 rounded text-sm ${
                config.vatRate === preset.rate
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* IRPF Selector (B2B only) */}
      {config.isB2B && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            IRPF Retention:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {irpfPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onConfigChange({ retentionRate: preset.rate })}
                className={`px-3 py-2 rounded text-sm ${
                  config.retentionRate === preset.rate
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Equivalence Surcharge (B2C only) */}
      {!config.isB2B && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Equivalence Surcharge:</label>
          <button
            onClick={() =>
              onConfigChange({
                equivalenceSurcharge: config.equivalenceSurcharge > 0 ? 0 : 5.2,
              })
            }
            className={`px-4 py-2 rounded ${
              config.equivalenceSurcharge > 0
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-300'
            }`}
          >
            {config.equivalenceSurcharge > 0 ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      )}

      {/* Tax Breakdown Display */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>VAT Rate:</span>
            <span className="font-medium">{config.vatRate}%</span>
          </div>
          {config.retentionRate > 0 && (
            <div className="flex justify-between">
              <span>IRPF Retention:</span>
              <span className="font-medium text-orange-600">
                -{config.retentionRate}%
              </span>
            </div>
          )}
          {config.equivalenceSurcharge > 0 && (
            <div className="flex justify-between">
              <span>Equivalence Surcharge:</span>
              <span className="font-medium text-purple-600">
                +{config.equivalenceSurcharge}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### PDF Template Updates

Update the invoice PDF template to include Spanish fiscal information:

```typescript
// components/PDF/SpanishInvoiceTemplate.tsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { InvoiceData } from '@/types';

const styles = StyleSheet.create({
  // ... existing styles

  taxBreakdown: {
    marginTop: 20,
    borderTop: 1,
    borderColor: '#E5E7EB',
    paddingTop: 10,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  taxLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  taxAmount: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  retentionRow: {
    backgroundColor: '#FEF3C7',
    padding: 5,
    marginTop: 5,
  },
  totalRow: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    marginTop: 10,
  },
});

export const SpanishInvoiceTemplate: React.FC<{ data: InvoiceData }> = ({
  data,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ... existing invoice header, items, etc. */}

      {/* Tax Breakdown Section */}
      <View style={styles.taxBreakdown}>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>Subtotal (Base Imponible)</Text>
          <Text style={styles.taxAmount}>€{data.subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>IVA ({data.spanishTax.vatRate}%)</Text>
          <Text style={styles.taxAmount}>€{data.vatAmount.toFixed(2)}</Text>
        </View>

        {data.spanishTax.equivalenceSurcharge > 0 && (
          <View style={styles.taxRow}>
            <Text style={styles.taxLabel}>
              Recargo de Equivalencia ({data.spanishTax.equivalenceSurcharge}%)
            </Text>
            <Text style={styles.taxAmount}>
              €{data.surchargeAmount.toFixed(2)}
            </Text>
          </View>
        )}

        {data.spanishTax.retentionRate > 0 && (
          <View style={[styles.taxRow, styles.retentionRow]}>
            <Text style={styles.taxLabel}>
              IRPF Retención ({data.spanishTax.retentionRate}%)
            </Text>
            <Text style={[styles.taxAmount, { color: '#D97706' }]}>
              -€{data.retentionAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={[styles.taxRow, styles.totalRow]}>
          <Text style={[styles.taxLabel, { fontSize: 12, fontWeight: 'bold' }]}>
            Total a Pagar
          </Text>
          <Text style={[styles.taxAmount, { fontSize: 14 }]}>
            €{data.total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Legal Notes */}
      <View style={{ marginTop: 20 }}>
        {data.spanishTax.retentionRate > 0 && (
          <Text style={{ fontSize: 8, color: '#6B7280', marginBottom: 5 }}>
            * El cliente retendrá {data.spanishTax.retentionRate}% de IRPF (€
            {data.retentionAmount.toFixed(2)}) según normativa fiscal vigente.
          </Text>
        )}
        {data.spanishTax.vatRate === 0 && data.spanishTax.taxExemptReason && (
          <Text style={{ fontSize: 8, color: '#6B7280' }}>
            * Operación exenta de IVA: {data.spanishTax.taxExemptReason}
          </Text>
        )}
      </View>
    </Page>
  </Document>
);
```

---

## 2. Material & Labor Tracking

### Overview

Painting projects have distinct cost structures. This feature helps separate materials from labor for better project analysis and tax reporting.

### Features

#### 2.1 Item Categories

Each invoice item can be categorized as:

- **Materials** (paint, supplies)
- **Labor** (hours worked)
- **Equipment** (scaffolding rental)
- **Other**

#### 2.2 Voice Commands

- "Add 20 liters of paint at 15 euros each as materials"
- "Add 8 hours of labor at 25 per hour"
- "Add scaffold rental for 500 euros as equipment"

#### 2.3 Cost Breakdown Display

Visual breakdown showing:

- Total materials cost
- Total labor cost
- Material/labor ratio
- Per-category VAT calculations (if different rates apply)

### Technical Implementation

```typescript
// types/invoice.types.ts

type ItemCategory = 'materials' | 'labor' | 'equipment' | 'other';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: ItemCategory; // NEW
  vatRate?: number; // Optional: item-specific VAT rate
}

interface CategoryBreakdown {
  materials: number;
  labor: number;
  equipment: number;
  other: number;
}

// utils/invoiceCalculations.ts

export function calculateCategoryBreakdown(
  items: InvoiceItem[],
): CategoryBreakdown {
  return items.reduce(
    (acc, item) => {
      acc[item.category] += item.total;
      return acc;
    },
    { materials: 0, labor: 0, equipment: 0, other: 0 },
  );
}
```

---

## 3. Project-Based Organization

### Overview

Commercial painting companies work on multi-phase projects. This feature groups invoices by project for better tracking.

### Features

#### 3.1 Project Metadata

- Project name
- Project address (can differ from client billing address)
- Project reference number
- Phase/milestone identifier

#### 3.2 Voice Commands

- "This is for project Casa Blanca Part 2"
- "Set project name to Office Renovation"
- "Project reference ABC-2024-001"

#### 3.3 Project History

- View all invoices for a project
- Calculate total project billing
- Track payment status per project

### Technical Implementation

```typescript
// types/invoice.types.ts

interface ProjectInfo {
  projectName: string;
  projectReference: string;
  projectAddress: string;
  phase?: string;
  milestone?: string;
}

interface InvoiceData {
  // ... existing fields
  project?: ProjectInfo; // Optional: only for project-based invoices
}

// Local storage structure
interface ProjectHistory {
  [projectReference: string]: {
    projectInfo: ProjectInfo;
    invoices: string[]; // Array of invoice IDs
    totalBilled: number;
    totalPaid: number;
  };
}
```

---

## 4. Quick Templates & Presets

### Overview

Painting businesses often bill for similar services. Templates speed up invoice creation.

### Features

#### 4.1 Service Templates

Predefined templates for common services:

- "Interior painting - standard room"
- "Exterior facade painting"
- "Primer + 2 coats"
- "Ceiling repair and paint"

#### 4.2 Voice Activation

- "Use template exterior facade"
- "Apply standard room preset"
- "Load ceiling repair template"

#### 4.3 Customizable Presets

Users can save their own templates with:

- Predefined items and quantities
- Standard pricing
- Category assignments
- Tax configurations

### Technical Implementation

```typescript
// types/templates.types.ts

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  items: Omit<InvoiceItem, 'id'>[]; // Items without IDs
  defaultTaxConfig?: Partial<SpanishTaxConfig>;
  category: 'interior' | 'exterior' | 'repair' | 'custom';
}

// Predefined templates
const DEFAULT_TEMPLATES: InvoiceTemplate[] = [
  {
    id: 'interior-standard-room',
    name: 'Interior Painting - Standard Room',
    description: 'Walls and ceiling, 15m², primer + 2 coats',
    items: [
      {
        description: 'Interior paint (white matte)',
        quantity: 5,
        unitPrice: 18,
        total: 90,
        category: 'materials',
      },
      {
        description: 'Primer (15L)',
        quantity: 1,
        unitPrice: 25,
        total: 25,
        category: 'materials',
      },
      {
        description: 'Labor - painting (8 hours)',
        quantity: 8,
        unitPrice: 25,
        total: 200,
        category: 'labor',
      },
    ],
    defaultTaxConfig: {
      vatRate: 10, // Renovation rate
      retentionRate: 0,
      equivalenceSurcharge: 0,
      isB2B: false,
    },
    category: 'interior',
  },
  // ... more templates
];

// Voice command parser
export function parseTemplateCommand(transcript: string): string | null {
  const templatePatterns = {
    'interior-standard-room':
      /(?:use|apply|load)\s+(?:template\s+)?(?:interior\s+)?(?:standard\s+)?room/i,
    'exterior-facade':
      /(?:use|apply|load)\s+(?:template\s+)?(?:exterior\s+)?facade/i,
    // ... more patterns
  };

  for (const [templateId, pattern] of Object.entries(templatePatterns)) {
    if (pattern.test(transcript.toLowerCase())) {
      return templateId;
    }
  }

  return null;
}
```

---

## 5. Enhanced PDF Customization

### Features

#### 5.1 Company Branding

- Logo upload and display
- Custom color scheme
- Company tax ID (NIF/CIF)
- Bank account details (IBAN)
- Legal text customization

#### 5.2 Multi-Language Support

- Spanish and English PDF generation
- Automatic field translation
- Currency format localization

#### 5.3 Professional Layout Options

- Compact (single page)
- Detailed (with project photos)
- Itemized (line-by-line breakdown)
- Summary (totals only)

### Technical Implementation

```typescript
// types/branding.types.ts

interface CompanyBranding {
  logoUrl?: string;
  companyName: string;
  taxId: string; // NIF/CIF
  address: string;
  phone: string;
  email: string;
  website?: string;
  iban?: string;
  bankName?: string;
  primaryColor: string; // Hex color
  secondaryColor: string;
  legalText?: string; // Custom footer text
}

interface PDFOptions {
  layout: 'compact' | 'detailed' | 'itemized' | 'summary';
  language: 'es' | 'en';
  showLogo: boolean;
  showBankDetails: boolean;
  showProjectDetails: boolean;
  showCategoryBreakdown: boolean;
}

// components/PDF/BrandedInvoiceTemplate.tsx

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

interface BrandedInvoiceTemplateProps {
  data: InvoiceData;
  branding: CompanyBranding;
  options: PDFOptions;
}

const createStyles = (branding: CompanyBranding) =>
  StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 10,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      borderBottom: 2,
      borderBottomColor: branding.primaryColor,
      paddingBottom: 15,
    },
    logo: {
      width: 120,
      height: 60,
      objectFit: 'contain',
    },
    companyInfo: {
      textAlign: 'right',
      fontSize: 9,
      color: '#4B5563',
    },
    // ... more styles with brand colors
  });

export const BrandedInvoiceTemplate: React.FC<BrandedInvoiceTemplateProps> = ({
  data,
  branding,
  options,
}) => {
  const styles = createStyles(branding);
  const t = translations[options.language];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View>
            {options.showLogo && branding.logoUrl && (
              <Image src={branding.logoUrl} style={styles.logo} />
            )}
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
              {t.invoice}
            </Text>
          </View>

          <View style={styles.companyInfo}>
            <Text style={{ fontWeight: 'bold', fontSize: 11 }}>
              {branding.companyName}
            </Text>
            <Text>{branding.taxId}</Text>
            <Text>{branding.address}</Text>
            <Text>{branding.phone}</Text>
            <Text>{branding.email}</Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={{ fontWeight: 'bold' }}>{t.invoiceNumber}:</Text>
            <Text>{data.invoiceNumber}</Text>
            <Text style={{ marginTop: 5 }}>
              {t.date}: {formatDate(data.date, options.language)}
            </Text>
            <Text>
              {t.dueDate}: {formatDate(data.dueDate, options.language)}
            </Text>
          </View>

          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontWeight: 'bold' }}>{t.billTo}:</Text>
            <Text>{data.customerName}</Text>
            <Text>{data.customerAddress}</Text>
          </View>
        </View>

        {/* Project Details (if applicable) */}
        {options.showProjectDetails && data.project && (
          <View
            style={{
              backgroundColor: '#F3F4F6',
              padding: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{t.projectDetails}:</Text>
            <Text>
              {data.project.projectName} - {data.project.projectReference}
            </Text>
            {data.project.phase && (
              <Text>
                {t.phase}: {data.project.phase}
              </Text>
            )}
            <Text>
              {t.location}: {data.project.projectAddress}
            </Text>
          </View>
        )}

        {/* Items Table */}
        <View style={{ marginBottom: 20 }}>
          {/* Table Header */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: branding.primaryColor,
              color: 'white',
              padding: 8,
              fontWeight: 'bold',
            }}
          >
            <Text style={{ flex: 3 }}>{t.description}</Text>
            {options.layout === 'itemized' && (
              <Text style={{ flex: 1, textAlign: 'center' }}>{t.category}</Text>
            )}
            <Text style={{ flex: 1, textAlign: 'center' }}>{t.quantity}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{t.unitPrice}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{t.total}</Text>
          </View>

          {/* Table Rows */}
          {data.items.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                padding: 8,
                backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB',
              }}
            >
              <Text style={{ flex: 3 }}>{item.description}</Text>
              {options.layout === 'itemized' && (
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 8 }}>
                  {t[item.category]}
                </Text>
              )}
              <Text style={{ flex: 1, textAlign: 'center' }}>
                {item.quantity}
              </Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                €{item.unitPrice.toFixed(2)}
              </Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                €{item.total.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Category Breakdown (if enabled) */}
        {options.showCategoryBreakdown && (
          <View
            style={{
              marginBottom: 20,
              padding: 10,
              backgroundColor: '#EFF6FF',
            }}
          >
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              {t.costBreakdown}:
            </Text>
            {Object.entries(calculateCategoryBreakdown(data.items)).map(
              ([category, amount]) =>
                amount > 0 && (
                  <View
                    key={category}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>{t[category]}:</Text>
                    <Text>€{amount.toFixed(2)}</Text>
                  </View>
                ),
            )}
          </View>
        )}

        {/* Tax Calculations */}
        <View style={{ alignSelf: 'flex-end', width: '40%' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
            }}
          >
            <Text>{t.subtotal}:</Text>
            <Text>€{data.subtotal.toFixed(2)}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
            }}
          >
            <Text>
              {t.vat} ({data.spanishTax.vatRate}%):
            </Text>
            <Text>€{data.vatAmount.toFixed(2)}</Text>
          </View>

          {data.spanishTax.equivalenceSurcharge > 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
              }}
            >
              <Text>
                {t.surcharge} ({data.spanishTax.equivalenceSurcharge}%):
              </Text>
              <Text>€{data.surchargeAmount.toFixed(2)}</Text>
            </View>
          )}

          {data.spanishTax.retentionRate > 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
                backgroundColor: '#FEF3C7',
              }}
            >
              <Text>
                {t.retention} ({data.spanishTax.retentionRate}%):
              </Text>
              <Text style={{ color: '#D97706' }}>
                -€{data.retentionAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              backgroundColor: branding.primaryColor,
              color: 'white',
              marginTop: 5,
              fontWeight: 'bold',
              fontSize: 12,
            }}
          >
            <Text>{t.totalToPay}:</Text>
            <Text>€{data.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Bank Details (if enabled) */}
        {options.showBankDetails && branding.iban && (
          <View
            style={{ marginTop: 30, padding: 10, backgroundColor: '#F3F4F6' }}
          >
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              {t.paymentDetails}:
            </Text>
            <Text>IBAN: {branding.iban}</Text>
            {branding.bankName && (
              <Text>
                {t.bank}: {branding.bankName}
              </Text>
            )}
          </View>
        )}

        {/* Legal Text / Footer */}
        <View
          style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            right: 30,
            borderTop: 1,
            borderTopColor: '#E5E7EB',
            paddingTop: 10,
          }}
        >
          {branding.legalText && (
            <Text
              style={{ fontSize: 7, color: '#6B7280', textAlign: 'center' }}
            >
              {branding.legalText}
            </Text>
          )}
          <Text
            style={{
              fontSize: 7,
              color: '#9CA3AF',
              textAlign: 'center',
              marginTop: 5,
            }}
          >
            {branding.companyName} - {branding.taxId} - {branding.email}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Translations
const translations = {
  es: {
    invoice: 'FACTURA',
    invoiceNumber: 'Nº Factura',
    date: 'Fecha',
    dueDate: 'Vencimiento',
    billTo: 'Facturar a',
    projectDetails: 'Detalles del Proyecto',
    phase: 'Fase',
    location: 'Ubicación',
    description: 'Descripción',
    category: 'Categoría',
    quantity: 'Cantidad',
    unitPrice: 'Precio Unit.',
    total: 'Total',
    materials: 'Materiales',
    labor: 'Mano de obra',
    equipment: 'Equipamiento',
    other: 'Otros',
    costBreakdown: 'Desglose de Costes',
    subtotal: 'Base Imponible',
    vat: 'IVA',
    surcharge: 'Recargo Equiv.',
    retention: 'Retención IRPF',
    totalToPay: 'TOTAL A PAGAR',
    paymentDetails: 'Datos de Pago',
    bank: 'Banco',
  },
  en: {
    invoice: 'INVOICE',
    invoiceNumber: 'Invoice No.',
    date: 'Date',
    dueDate: 'Due Date',
    billTo: 'Bill To',
    projectDetails: 'Project Details',
    phase: 'Phase',
    location: 'Location',
    description: 'Description',
    category: 'Category',
    quantity: 'Qty',
    unitPrice: 'Unit Price',
    total: 'Total',
    materials: 'Materials',
    labor: 'Labor',
    equipment: 'Equipment',
    other: 'Other',
    costBreakdown: 'Cost Breakdown',
    subtotal: 'Subtotal',
    vat: 'VAT',
    surcharge: 'Equiv. Surcharge',
    retention: 'IRPF Retention',
    totalToPay: 'TOTAL TO PAY',
    paymentDetails: 'Payment Details',
    bank: 'Bank',
  },
};

// Date formatting
function formatDate(date: Date, language: 'es' | 'en'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const locale = language === 'es' ? 'es-ES' : 'en-US';
  return date.toLocaleDateString(locale, options);
}
```

---

## 6. Payment Tracking & Status

### Overview

Track invoice payment status and generate reminders for overdue invoices.

### Features

#### 6.1 Payment Status

- **Pending** (default)
- **Partially Paid**
- **Paid**
- **Overdue**
- **Cancelled**

#### 6.2 Voice Commands

- "Mark invoice as paid"
- "Add partial payment of 500 euros"
- "Set payment received date"

#### 6.3 Payment History

Track multiple payments for a single invoice:

- Payment date
- Amount received
- Payment method (cash, transfer, check)
- Reference number

#### 6.4 Overdue Notifications

Visual indicators for:

- Invoices due within 7 days
- Overdue invoices
- Automatic calculation of days overdue

### Technical Implementation

```typescript
// types/payment.types.ts

type PaymentStatus =
  | 'pending'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled';

type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'check'
  | 'credit_card'
  | 'other';

interface Payment {
  id: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

interface PaymentTracking {
  status: PaymentStatus;
  payments: Payment[];
  totalPaid: number;
  remainingBalance: number;
  lastPaymentDate?: Date;
  daysOverdue?: number;
}

interface InvoiceData {
  // ... existing fields
  paymentTracking: PaymentTracking;
}

// utils/paymentCalculations.ts

export function calculatePaymentStatus(
  invoice: InvoiceData,
  currentDate: Date = new Date(),
): PaymentStatus {
  const totalPaid = invoice.paymentTracking.totalPaid;
  const total = invoice.total;

  // Check if paid in full
  if (totalPaid >= total) {
    return 'paid';
  }

  // Check if cancelled
  if (invoice.paymentTracking.status === 'cancelled') {
    return 'cancelled';
  }

  // Check if partially paid
  if (totalPaid > 0) {
    return 'partially_paid';
  }

  // Check if overdue
  if (currentDate > invoice.dueDate) {
    return 'overdue';
  }

  return 'pending';
}

export function calculateDaysOverdue(dueDate: Date): number {
  const today = new Date();
  if (today <= dueDate) return 0;

  const diffTime = Math.abs(today.getTime() - dueDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function addPayment(
  invoice: InvoiceData,
  payment: Omit<Payment, 'id'>,
): InvoiceData {
  const newPayment: Payment = {
    ...payment,
    id: generateId(),
  };

  const payments = [...invoice.paymentTracking.payments, newPayment];
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = invoice.total - totalPaid;

  const updatedTracking: PaymentTracking = {
    ...invoice.paymentTracking,
    payments,
    totalPaid,
    remainingBalance,
    lastPaymentDate: payment.date,
    status: calculatePaymentStatus({
      ...invoice,
      paymentTracking: {
        ...invoice.paymentTracking,
        totalPaid,
      },
    }),
  };

  return {
    ...invoice,
    paymentTracking: updatedTracking,
  };
}
```

#### UI Component

```typescript
// components/Invoice/PaymentStatusBadge.tsx

import React from 'react';
import type { PaymentStatus } from '@/types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  daysOverdue?: number;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  daysOverdue,
}) => {
  const config = {
    pending: {
      label: 'Pendiente',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    partially_paid: {
      label: 'Pago Parcial',
      className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    paid: {
      label: 'Pagado',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    overdue: {
      label: daysOverdue ? `Vencida (${daysOverdue}d)` : 'Vencida',
      className: 'bg-red-100 text-red-800 border-red-300',
    },
    cancelled: {
      label: 'Cancelada',
      className: 'bg-gray-100 text-gray-800 border-gray-300',
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
};
```

---

## 7. Recurring Invoices

### Overview

For maintenance contracts or recurring painting services (e.g., monthly building maintenance).

### Features

#### 7.1 Recurrence Patterns

- Weekly
- Bi-weekly
- Monthly
- Quarterly
- Yearly
- Custom interval

#### 7.2 Auto-Generation

Automatically create invoices based on schedule:

- Generate on specific day of month/week
- Increment invoice numbers automatically
- Send notifications when new invoice is created

#### 7.3 Voice Commands

- "Make this a monthly recurring invoice"
- "Set up quarterly billing for this project"
- "Repeat this invoice every 2 weeks"

### Technical Implementation

```typescript
// types/recurring.types.ts

type RecurrenceInterval =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'custom';

interface RecurringInvoiceConfig {
  isRecurring: boolean;
  interval: RecurrenceInterval;
  customDays?: number; // For custom interval
  startDate: Date;
  endDate?: Date; // Optional: indefinite if not set
  nextGenerationDate: Date;
  totalGenerated: number;
  maxOccurrences?: number; // Optional limit
}

interface InvoiceData {
  // ... existing fields
  recurringConfig?: RecurringInvoiceConfig;
  isRecurringInstance: boolean;
  parentRecurringId?: string; // Link to template invoice
}

// utils/recurringInvoices.ts

export function calculateNextGenerationDate(
  lastDate: Date,
  interval: RecurrenceInterval,
  customDays?: number,
): Date {
  const nextDate = new Date(lastDate);

  switch (interval) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'custom':
      if (customDays) {
        nextDate.setDate(nextDate.getDate() + customDays);
      }
      break;
  }

  return nextDate;
}

export function shouldGenerateRecurringInvoice(
  config: RecurringInvoiceConfig,
  currentDate: Date = new Date(),
): boolean {
  // Check if end date has passed
  if (config.endDate && currentDate > config.endDate) {
    return false;
  }

  // Check if max occurrences reached
  if (config.maxOccurrences && config.totalGenerated >= config.maxOccurrences) {
    return false;
  }

  // Check if it's time to generate
  return currentDate >= config.nextGenerationDate;
}

export function generateRecurringInvoice(template: InvoiceData): InvoiceData {
  if (!template.recurringConfig) {
    throw new Error('Template must have recurring configuration');
  }

  const newInvoice: InvoiceData = {
    ...template,
    id: generateId(),
    invoiceNumber: generateNextInvoiceNumber(template.invoiceNumber),
    date: new Date(),
    dueDate: calculateDueDate(new Date(), 30), // 30 days from creation
    isRecurringInstance: true,
    parentRecurringId: template.id,
    paymentTracking: {
      status: 'pending',
      payments: [],
      totalPaid: 0,
      remainingBalance: template.total,
    },
  };

  // Update template's recurring config
  const updatedConfig: RecurringInvoiceConfig = {
    ...template.recurringConfig,
    totalGenerated: template.recurringConfig.totalGenerated + 1,
    nextGenerationDate: calculateNextGenerationDate(
      template.recurringConfig.nextGenerationDate,
      template.recurringConfig.interval,
      template.recurringConfig.customDays,
    ),
  };

  return newInvoice;
}
```

---

## 8. Multi-Currency Support (EUR/USD)

### Overview

While primarily Euro-based, support for USD for international clients or materials purchased abroad.

### Features

#### 8.1 Currency Selection

- Primary currency per invoice
- Real-time exchange rate fetching (optional)
- Manual exchange rate entry

#### 8.2 Voice Commands

- "Set currency to dollars"
- "Convert to euros at rate 1.1"
- "This invoice is in USD"

### Technical Implementation

```typescript
// types/currency.types.ts

type Currency = 'EUR' | 'USD';

interface CurrencyConfig {
  currency: Currency;
  exchangeRate?: number; // If converting, store rate used
  originalCurrency?: Currency; // If converted from another currency
}

interface InvoiceData {
  // ... existing fields
  currencyConfig: CurrencyConfig;
}

// utils/currencyFormatting.ts

export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: string = 'es-ES',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number,
): number {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRate;
}
```

---

## 9. Client Database & History

### Overview

Maintain a database of clients with invoice history for quick lookups.

### Features

#### 9.1 Client Profiles

- Company/person name
- Tax ID
- Address
- Contact information
- Default payment terms
- Invoice history

#### 9.2 Voice Commands

- "Use client ABC Construcciones"
- "Show invoices for client John Smith"
- "Add new client with tax ID B12345678"

#### 9.3 Quick Fill

Auto-complete client information when creating new invoices.

### Technical Implementation

```typescript
// types/client.types.ts

interface Client {
  id: string;
  name: string;
  taxId?: string;
  address: string;
  phone?: string;
  email?: string;
  isCompany: boolean; // B2B flag
  defaultPaymentTerms: number; // Days
  defaultTaxConfig?: Partial<SpanishTaxConfig>;
  invoiceIds: string[]; // History
  totalBilled: number;
  totalPaid: number;
  createdAt: Date;
  lastInvoiceDate?: Date;
}

// Use browser's IndexedDB or localStorage
interface ClientDatabase {
  clients: Client[];
  addClient: (
    client: Omit<
      Client,
      'id' | 'invoiceIds' | 'totalBilled' | 'totalPaid' | 'createdAt'
    >,
  ) => Client;
  getClient: (id: string) => Client | null;
  searchClients: (query: string) => Client[];
  updateClient: (id: string, updates: Partial<Client>) => Client;
  deleteClient: (id: string) => boolean;
}
```

---

## 10. Offline Mode & Data Persistence

### Overview

Ensure the app works without internet connection and saves data locally.

### Features

#### 10.1 Local Storage Strategy

- Save all invoices to IndexedDB
- Sync when online (future cloud integration)
- Export/import functionality

#### 10.2 Offline Indicators

- Visual status showing online/offline state
- Queue actions when offline
- Automatic sync when connection restored

### Technical Implementation

```typescript
// utils/storage.ts

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface InvoiceDB extends DBSchema {
  invoices: {
    key: string;
    value: InvoiceData;
    indexes: {
      'by-date': Date;
      'by-client': string;
      'by-status': PaymentStatus;
    };
  };
  clients: {
    key: string;
    value: Client;
    indexes: {
      'by-name': string;
      'by-tax-id': string;
    };
  };
  templates: {
    key: string;
    value: InvoiceTemplate;
  };
}

class InvoiceStorage {
  private db: IDBPDatabase<InvoiceDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<InvoiceDB>('invoice-db', 1, {
      upgrade(db) {
        // Create invoices store
        const invoiceStore = db.createObjectStore('invoices', {
          keyPath: 'id',
        });
        invoiceStore.createIndex('by-date', 'date');
        invoiceStore.createIndex('by-client', 'customerName');
        invoiceStore.createIndex('by-status', 'paymentTracking.status');

        // Create clients store
        const clientStore = db.createObjectStore('clients', {
          keyPath: 'id',
        });
        clientStore.createIndex('by-name', 'name');
        clientStore.createIndex('by-tax-id', 'taxId');

        // Create templates store
        db.createObjectStore('templates', {
          keyPath: 'id',
        });
      },
    });
  }

  async saveInvoice(invoice: InvoiceData): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('invoices', invoice);
  }

  async getInvoice(id: string): Promise<InvoiceData | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('invoices', id);
  }

  async getAllInvoices(): Promise<InvoiceData[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('invoices');
  }

  async searchInvoices(filters: {
    clientName?: string;
    status?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
  }): Promise<InvoiceData[]> {
    if (!this.db) await this.init();
    let invoices = await this.getAllInvoices();

    if (filters.clientName) {
      invoices = invoices.filter((inv) =>
        inv.customerName
          .toLowerCase()
          .includes(filters.clientName!.toLowerCase()),
      );
    }

    if (filters.status) {
      invoices = invoices.filter(
        (inv) => inv.paymentTracking.status === filters.status,
      );
    }

    if (filters.startDate && filters.endDate) {
      invoices = invoices.filter(
        (inv) => inv.date >= filters.startDate! && inv.date <= filters.endDate!,
      );
    }

    return invoices;
  }

  async exportData(): Promise<string> {
    const invoices = await this.getAllInvoices();
    const clients = await this.db!.getAll('clients');
    const templates = await this.db!.getAll('templates');

    return JSON.stringify(
      {
        version: '2.0',
        exportDate: new Date().toISOString(),
        data: { invoices, clients, templates },
      },
      null,
      2,
    );
  }

  async importData(jsonData: string): Promise<void> {
    const { data } = JSON.parse(jsonData);

    // Import invoices
    for (const invoice of data.invoices) {
      await this.saveInvoice(invoice);
    }

    // Import clients
    for (const client of data.clients) {
      await this.db!.put('clients', client);
    }

    // Import templates
    for (const template of data.templates) {
      await this.db!.put('templates', template);
    }
  }
}

export const storage = new InvoiceStorage();
```

---

## Development Phases for Part 2

### Part 2.1: Spanish Fiscal Compliance (Week 1-2)

**Priority: CRITICAL - Core business requirement**

**Tasks:**

1. Extend TypeScript types for Spanish tax system

   - Add `SpanishTaxConfig` interface
   - Update `InvoiceData` with fiscal fields
   - Create validation types

2. Implement tax calculation engine

   - Build `calculateSpanishTaxes()` function
   - Add validation logic for mutual exclusivity (IRPF vs Surcharge)
   - Create preset configurations (21%, 10%, 4%, 0% VAT)

3. Extend voice command parser

   - Add Spanish tax command patterns
   - Implement IRPF, VAT preset, and surcharge recognition
   - Test with real Spanish phrases

4. Build `SpanishTaxControls` component

   - Create B2B/B2C toggle
   - Add VAT rate selector buttons
   - Implement IRPF and surcharge controls
   - Show real-time tax breakdown

5. Update invoice state management

   - Add new reducer actions for Spanish taxes
   - Integrate calculations into state updates
   - Add validation middleware

6. Update PDF template for Spanish invoices
   - Add fiscal breakdown section
   - Include legal notes for IRPF and exemptions
   - Format according to Spanish invoice regulations

**Testing:**

- Unit tests for all calculation functions
- Integration tests for voice commands
- Manual testing with real Spanish invoicing scenarios
- Validation of legal compliance with Spanish tax law

**Deliverables:**

- ✅ Fully functional Spanish tax system
- ✅ Voice-enabled tax configuration
- ✅ Legally compliant PDF output
- ✅ Documentation in Spanish and English

---

### Part 2.2: Material & Labor Tracking (Week 3)

**Priority: HIGH - Important for business intelligence**

**Tasks:**

1. Add category field to invoice items

   - Update `InvoiceItem` type
   - Create `ItemCategory` enum
   - Modify item creation/editing logic

2. Implement category breakdown calculations

   - Build `calculateCategoryBreakdown()` function
   - Add visual breakdown component
   - Calculate material/labor ratios

3. Extend voice command parser for categories

   - "Add X as materials"
   - "Add Y hours of labor"
   - Pattern matching for automatic categorization

4. Update UI components

   - Add category selector to item form
   - Create `CategoryBreakdown` display component
   - Add category badges to item list

5. Enhance PDF template
   - Optional category column in item table
   - Cost breakdown section
   - Visual charts (optional, using recharts)

**Testing:**

- Test category assignment via voice
- Verify calculation accuracy
- Validate PDF rendering with categories

**Deliverables:**

- ✅ Category tracking system
- ✅ Cost breakdown visualization
- ✅ Enhanced reporting capabilities

---

### Part 2.3: Project-Based Organization (Week 4)

**Priority: MEDIUM - Improves workflow organization**

**Tasks:**

1. Create project data structures

   - Define `ProjectInfo` interface
   - Create `ProjectHistory` storage schema
   - Extend `InvoiceData` with project fields

2. Build project management components

   - `ProjectSelector` dropdown/search
   - `ProjectDetails` display
   - `ProjectHistory` view

3. Implement project voice commands

   - "This is for project [name]"
   - "Set project reference [code]"
   - "Show project [name] invoices"

4. Add project filtering and search

   - Filter invoices by project
   - Calculate project totals
   - Generate project reports

5. Update storage layer
   - Index invoices by project
   - Store project metadata
   - Enable project-level exports

**Testing:**

- Multi-project invoice management
- Project history accuracy
- Search and filter functionality

**Deliverables:**

- ✅ Project tracking system
- ✅ Project-level reporting
- ✅ Enhanced invoice organization

---

### Part 2.4: Templates & Presets (Week 5)

**Priority: HIGH - Major productivity boost**

**Tasks:**

1. Create template data structures

   - Define `InvoiceTemplate` interface
   - Build default template library
   - Create template storage system

2. Implement template management

   - Template CRUD operations
   - Template preview
   - Template customization UI

3. Add voice template activation

   - "Use template [name]"
   - "Load preset [type]"
   - Template-specific command parsing

4. Build template components

   - `TemplateLibrary` browser
   - `TemplateEditor` for customization
   - Quick template buttons

5. Create default painting templates
   - Interior painting presets
   - Exterior painting presets
   - Repair and maintenance presets
   - Custom user templates

**Testing:**

- Template loading and application
- Voice command accuracy
- Template editing and saving

**Deliverables:**

- ✅ Template system with 10+ presets
- ✅ Voice-activated templates
- ✅ Custom template creation

---

### Part 2.5: Enhanced PDF & Branding (Week 6)

**Priority: HIGH - Professional presentation**

**Tasks:**

1. Create branding configuration system

   - Define `CompanyBranding` interface
   - Build branding settings UI
   - Implement logo upload

2. Develop PDF customization options

   - Multiple layout templates
   - Color scheme customization
   - Conditional section display

3. Add multi-language support

   - Spanish/English translations
   - Locale-aware date formatting
   - Currency formatting

4. Build branding components

   - `BrandingSettings` form
   - `LogoUploader` component
   - `PDFLayoutSelector`

5. Create professional templates
   - Modern design template
   - Classic invoice template
   - Compact single-page template
   - Detailed multi-page template

**Testing:**

- PDF generation with all layouts
- Logo display and positioning
- Multi-language rendering
- Print quality verification

**Deliverables:**

- ✅ Professional branded invoices
- ✅ Multiple PDF layouts
- ✅ Full bilingual support

---

### Part 2.6: Payment Tracking (Week 7)

**Priority: HIGH - Critical for cash flow management**

**Tasks:**

1. Implement payment tracking system

   - Define `Payment` and `PaymentTracking` types
   - Build payment calculation functions
   - Add overdue detection logic

2. Create payment management UI

   - `PaymentStatusBadge` component
   - `PaymentHistory` list
   - `AddPayment` form

3. Add payment voice commands

   - "Mark as paid"
   - "Add payment of [amount]"
   - "Set payment date to [date]"

4. Build payment analytics

   - Payment status dashboard
   - Overdue invoice list
   - Cash flow projections

5. Implement notification system
   - Visual overdue indicators
   - Payment reminders
   - Status change notifications

**Testing:**

- Payment calculation accuracy
- Status update logic
- Overdue detection
- Partial payment handling

**Deliverables:**

- ✅ Complete payment tracking
- ✅ Overdue management
- ✅ Payment history

---

### Part 2.7: Recurring Invoices (Week 8)

**Priority: MEDIUM - Valuable for recurring contracts**

**Tasks:**

1. Create recurring invoice system

   - Define `RecurringInvoiceConfig` type
   - Build date calculation logic
   - Implement auto-generation

2. Build recurring invoice UI

   - `RecurringSettings` configuration form
   - Recurrence pattern selector
   - Preview of upcoming invoices

3. Add voice commands

   - "Make this recurring monthly"
   - "Repeat every [interval]"
   - "Stop recurring invoices"

4. Implement background generation

   - Check for due recurring invoices
   - Auto-generate new invoices
   - Send notifications

5. Create recurring invoice management
   - List of recurring templates
   - History of generated invoices
   - Edit/pause/delete recurring patterns

**Testing:**

- Date calculation accuracy
- Auto-generation timing
- Invoice increment logic
- End date handling

**Deliverables:**

- ✅ Recurring invoice system
- ✅ Automated generation
- ✅ Recurring invoice management

---

### Part 2.8: Additional Features (Week 9-10)

#### Multi-Currency Support

**Tasks:**

1. Add currency selection to invoice form
2. Implement currency formatting
3. Optional: integrate exchange rate API
4. Update PDF templates for multi-currency

**Deliverables:**

- ✅ EUR/USD support
- ✅ Proper currency formatting

#### Client Database

**Tasks:**

1. Build client data structures
2. Implement IndexedDB client storage
3. Create client management UI
4. Add client search and autocomplete
5. Link invoices to client profiles

**Deliverables:**

- ✅ Client database
- ✅ Client history tracking
- ✅ Quick client lookup

#### Offline Mode & Data Persistence

**Tasks:**

1. Implement IndexedDB storage layer
2. Create offline detection system
3. Build export/import functionality
4. Add data backup features
5. Implement sync queue (for future cloud sync)

**Deliverables:**

- ✅ Full offline functionality
- ✅ Persistent data storage
- ✅ Data export/import
- ✅ Backup system

---

## Integration Guidelines

### Backward Compatibility

All Part 2 features must maintain compatibility with Part 1:

- Existing invoices continue to work
- Part 1 voice commands remain functional
- UI remains accessible for users who don't need Part 2 features
- Optional feature flags to enable/disable Part 2 functionality

### Migration Strategy

```typescript
// utils/migration.ts

interface MigrationConfig {
  fromVersion: string;
  toVersion: string;
  migrate: (data: any) => any;
}

const migrations: MigrationConfig[] = [
  {
    fromVersion: '1.0',
    toVersion: '2.0',
    migrate: (invoice: any) => ({
      ...invoice,
      // Add Spanish tax config with defaults
      spanishTax: {
        retentionRate: 0,
        vatRate: invoice.taxRate || 21,
        equivalenceSurcharge: 0,
        isB2B: false,
      },
      // Add payment tracking
      paymentTracking: {
        status: 'pending',
        payments: [],
        totalPaid: 0,
        remainingBalance: invoice.total,
      },
      // Add currency config
      currencyConfig: {
        currency: 'EUR',
      },
    }),
  },
];

export async function migrateInvoiceData(): Promise<void> {
  const invoices = await storage.getAllInvoices();

  for (const invoice of invoices) {
    const currentVersion = invoice.version || '1.0';

    if (currentVersion === '2.0') continue; // Already migrated

    const migration = migrations.find((m) => m.fromVersion === currentVersion);

    if (migration) {
      const migratedInvoice = migration.migrate(invoice);
      migratedInvoice.version = '2.0';
      await storage.saveInvoice(migratedInvoice);
    }
  }
}
```

### Feature Flags

```typescript
// utils/featureFlags.ts

interface FeatureFlags {
  spanishTaxes: boolean;
  projectTracking: boolean;
  recurringInvoices: boolean;
  paymentTracking: boolean;
  templates: boolean;
  clientDatabase: boolean;
  multiCurrency: boolean;
}

const defaultFlags: FeatureFlags = {
  spanishTaxes: true,
  projectTracking: true,
  recurringInvoices: true,
  paymentTracking: true,
  templates: true,
  clientDatabase: true,
  multiCurrency: false, // Off by default
};

export function getFeatureFlags(): FeatureFlags {
  const stored = localStorage.getItem('featureFlags');
  return stored ? JSON.parse(stored) : defaultFlags;
}

export function setFeatureFlag(
  flag: keyof FeatureFlags,
  enabled: boolean,
): void {
  const flags = getFeatureFlags();
  flags[flag] = enabled;
  localStorage.setItem('featureFlags', JSON.stringify(flags));
}
```

---

## Voice Command Reference (Complete Part 2)

### Spanish Tax Commands

```
"Apply IRPF of 15 percent"
"Apply IRPF of 7 percent"
"Set retention to 15"
"Remove IRPF"
"This is for a company"

"Set VAT to renovation rate" → 10%
"Apply standard VAT" → 21%
"Set IVA to 10 percent"
"Tax exempt invoice"
"This is new construction" → 21%
"This is a renovation" → 10%

"Enable equivalence surcharge"
"Apply recargo"
"Client uses equivalence regime"
"Remove surcharge"
```

### Category Commands

```
"Add 20 liters of paint at 15 euros as materials"
"Add 8 hours of labor at 25 per hour"
"Add scaffold rental for 500 euros as equipment"
"Categorize last item as materials"
```

### Project Commands

```
"This is for project Casa Blanca Part 2"
"Set project name to Office Renovation"
"Project reference ABC-2024-001"
"Show invoices for project [name]"
```

### Template Commands

```
"Use template exterior facade"
"Apply standard room preset"
"Load ceiling repair template"
"Save as template [name]"
```

### Payment Commands

```
"Mark invoice as paid"
"Add payment of 500 euros"
"Set payment received date to today"
"Partial payment 300 euros by bank transfer"
```

### Recurring Commands

```
"Make this a monthly recurring invoice"
"Set up quarterly billing"
"Repeat this invoice every 2 weeks"
"Stop recurring invoices"
```

### Client Commands

```
"Use client ABC Construcciones"
"Add new client John Smith"
"Set client address to [address]"
"Client tax ID B12345678"
```

### Currency Commands

```
"Set currency to dollars"
"Convert to euros"
"This invoice is in USD"
```

---

## Testing Strategy for Part 2

### Unit Tests

```typescript
// __tests__/spanishTaxCalculations.test.ts

describe('Spanish Tax Calculations', () => {
  test('calculates IRPF correctly for B2B invoice', () => {
    const result = calculateSpanishTaxes(mockItems, {
      retentionRate: 15,
      vatRate: 21,
      equivalenceSurcharge: 0,
      isB2B: true,
    });

    expect(result.retentionAmount).toBe(150); // 15% of 1000
    expect(result.total).toBe(1060); // 1000 + 210 VAT - 150 IRPF
  });

  test('prevents IRPF and surcharge on same invoice', () => {
    const invalidConfig = {
      retentionRate: 15,
      vatRate: 21,
      equivalenceSurcharge: 5.2,
      isB2B: true,
    };

    const error = validateSpanishTaxConfig(invalidConfig);
    expect(error).not.toBeNull();
  });

  test('applies correct VAT rates for renovation work', () => {
    const result = calculateSpanishTaxes(mockItems, {
      retentionRate: 0,
      vatRate: 10, // Renovation rate
      equivalenceSurcharge: 0,
      isB2B: false,
    });

    expect(result.vatAmount).toBe(100); // 10% of 1000
  });
});
```

### Integration Tests

```typescript
// __tests__/voiceCommands.integration.test.ts

describe('Voice Command Integration', () => {
  test('processes Spanish tax commands end-to-end', async () => {
    const { result } = renderHook(() => useInvoiceState());

    // Simulate voice command
    act(() => {
      result.current.processVoiceCommand('Apply IRPF of 15 percent');
    });

    expect(result.current.invoice.spanishTax.retentionRate).toBe(15);
    expect(result.current.invoice.spanishTax.isB2B).toBe(true);
  });

  test('applies templates via voice', async () => {
    const { result } = renderHook(() => useInvoiceState());

    act(() => {
      result.current.processVoiceCommand('Use template standard room');
    });

    expect(result.current.invoice.items.length).toBeGreaterThan(0);
    expect(result.current.invoice.items[0].category).toBe('materials');
  });
});
```

### E2E Tests (Manual Test Cases)

1. **Spanish Tax Workflow**

   - Create B2B invoice with 15% IRPF
   - Verify calculations on preview
   - Generate PDF and check fiscal breakdown
   - Validate legal notes appear

2. **Project-Based Invoicing**

   - Create new project
   - Generate 3 invoices for same project
   - View project history
   - Verify total project billing

3. **Template Usage**

   - Load "Interior Standard Room" template
   - Modify quantities via voice
   - Save as new template
   - Use saved template for new invoice

4. **Payment Tracking**

   - Create invoice
   - Add partial payment
   - Verify "partially paid" status
   - Add remaining payment
   - Verify "paid" status

5. **Recurring Invoices**
   - Set up monthly recurring invoice
   - Verify auto-generation date
   - Simulate date change and trigger generation
   - Verify new invoice created with incremented number

---

## Performance Optimization

### Lazy Loading

```typescript
// App.tsx - lazy load Part 2 features

const SpanishTaxControls = lazy(
  () => import('@/components/Invoice/SpanishTaxControls'),
);
const ProjectManagement = lazy(
  () => import('@/components/Project/ProjectManagement'),
);
const TemplateLibrary = lazy(
  () => import('@/components/Templates/TemplateLibrary'),
);
const PaymentTracking = lazy(
  () => import('@/components/Payment/PaymentTracking'),
);
```

### Memoization

```typescript
// Memoize expensive calculations

const taxCalculations = useMemo(
  () => calculateSpanishTaxes(items, spanishTax),
  [items, spanishTax],
);

const categoryBreakdown = useMemo(
  () => calculateCategoryBreakdown(items),
  [items],
);
```

### IndexedDB Performance

```typescript
// Batch operations for better performance

async function batchSaveInvoices(invoices: InvoiceData[]): Promise<void> {
  const tx = db.transaction('invoices', 'readwrite');

  await Promise.all([...invoices.map((inv) => tx.store.put(inv)), tx.done]);
}
```

---

## Security Considerations

### Data Privacy

- All data stored locally (IndexedDB)
- No cloud transmission (unless explicitly enabled in future)
- Sensitive tax information encrypted at rest (optional enhancement)

### Input Validation

```typescript
// Validate all user inputs and voice commands

function sanitizeVoiceInput(transcript: string): string {
  // Remove potentially harmful patterns
  return transcript
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

function validateTaxId(taxId: string): boolean {
  // Spanish NIF/CIF validation
  const nifPattern = /^[0-9]{8}[A-Z]$/;
  const cifPattern = /^[A-Z][0-9]{7}[A-Z0-9]$/;

  return nifPattern.test(taxId) || cifPattern.test(taxId);
}
```

### PDF Security

- Generate PDFs client-side only
- No server-side processing
- Sanitize all user inputs in PDF generation

---

## Documentation Requirements

### User Guide (Spanish & English)

1. **Getting Started with Spanish Invoicing**

   - Understanding IRPF
   - When to apply different VAT rates
   - Equivalence surcharge explained

2. **Voice Commands Cheat Sheet**

   - Complete list of commands
   - Example phrases
   - Tips for better recognition

3. **Project Management Guide**

   - Creating projects
   - Tracking multi-phase work
   - Generating project reports

4. **Template System**

   - Using presets
   - Creating custom templates
   - Best practices

5. **Payment Tracking**
   - Recording payments
   - Managing overdue invoices
   - Cash flow monitoring

### Developer Documentation

- API reference for all new types
- Extension points for custom features
- Database schema documentation
- Migration guide from Part 1

---

## Success Criteria for Part 2

### Functional Requirements

- ✅ Spanish tax calculations 100% accurate
- ✅ All voice commands work with 85%+ accuracy
- ✅ PDF generation includes all Part 2 data
- ✅ Offline mode fully functional
- ✅ Data migration from Part 1 works flawlessly
- ✅ 20+ invoice templates available
- ✅ Client database supports 1000+ clients
- ✅ Payment tracking updates in real-time

### Performance Requirements

- ✅ App loads in < 3 seconds on 3G (including Part 2 features)
- ✅ PDF generation completes in < 2 seconds
- ✅ Voice command processing < 500ms
- ✅ IndexedDB operations < 100ms for single records
- ✅ No UI blocking during calculations

### User Experience Requirements

- ✅ Intuitive Spanish tax controls
- ✅ Clear visual hierarchy for all new features
- ✅ Consistent design language with Part 1
- ✅ Helpful error messages in Spanish and English
- ✅ Comprehensive onboarding for new features

### Code Quality Requirements

- ✅ 90%+ test coverage for new code
- ✅ Zero TypeScript errors or warnings
- ✅ All functions documented with JSDoc
- ✅ Consistent code style throughout
- ✅ No performance regressions from Part 1

---

## Future Enhancements (Phase 3 Candidates)

### Cloud Sync

- Optional cloud backup
- Multi-device synchronization
- Shared invoices for teams

### Advanced Analytics

- Revenue trends
- Client profitability analysis
- Project cost analysis
- Tax reporting automation

### Expense Tracking

- Link expenses to projects
- Calculate profit margins
- Material cost tracking

### CRM Integration

- Email invoice delivery
- Automated reminders
- Client communication log

---

## Conclusion

Part 2 transforms the Voice-Enabled Invoice Builder into a comprehensive business management tool specifically designed for Spanish painting companies. The enhancements address real-world business needs while maintaining the innovative voice-first approach from Part 1.

**Key Benefits:**

- Legal compliance with Spanish tax regulations
- Significant productivity improvements through templates
- Better financial visibility with payment tracking
- Professional branded invoices
- Offline-first architecture for reliability
