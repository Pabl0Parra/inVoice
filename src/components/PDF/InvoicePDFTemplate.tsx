import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { InvoiceData } from '../../types';
import type { Translations, Language } from '../../locales/translations';
import { formatCurrency } from '../../utils/currency';

/**
 * Styles for PDF document
 */
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  companyInfo: {
    fontSize: 9,
    color: '#6B7280',
    lineHeight: 1.4,
  },
  invoiceHeader: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#2563EB',
  },
  invoiceTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  invoiceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaBlock: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937',
  },
  billToSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  billToBox: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
  },
  customerName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  customerAddress: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  dueDate: {
    marginTop: 10,
  },
  dueDateLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 3,
  },
  dueDateValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: 8,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 8,
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  colDescription: {
    flex: 3,
  },
  colQuantity: {
    flex: 1,
    textAlign: 'center',
  },
  colPrice: {
    flex: 1,
    textAlign: 'right',
  },
  colTotal: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  totalsBox: {
    width: 250,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  totalLabel: {
    fontSize: 9,
    color: '#374151',
  },
  totalValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1F2937',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: 10,
    marginTop: 8,
    borderRadius: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  grandTotalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  notesSection: {
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  notesTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 7,
    color: '#9CA3AF',
  },
});

/**
 * Props for InvoicePDFTemplate
 */
interface InvoicePDFTemplateProps {
  /** Invoice data to render */
  invoiceData: InvoiceData;
  /** Translations for the current language */
  translations: Translations;
  /** Current language */
  language: Language;
}

/**
 * PDF Invoice Template using @react-pdf/renderer
 * Creates a professional, print-ready invoice document
 * Supports Spanish and English
 */
export const InvoicePDFTemplate = ({
  invoiceData,
  translations: t,
  language,
}: InvoicePDFTemplateProps) => {
  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{t.pdfCompanyName}</Text>
          <Text style={styles.companyInfo}>
            {t.pdfCompanyAddress}{'\n'}
            {language === 'es' ? 'Ciudad, Estado 12345' : 'City, State 12345'}{'\n'}
            {t.pdfCompanyPhone}: (555) 123-4567{'\n'}
            {t.pdfCompanyEmail}: info@{language === 'es' ? 'empresa' : 'company'}.com
          </Text>
        </View>

        {/* Invoice Header */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>{t.pdfInvoiceTitle}</Text>
          <View style={styles.invoiceMetaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>{t.invoiceNumber}</Text>
              <Text style={styles.metaValue}>
                {invoiceData.invoiceNumber || 'N/A'}
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>{t.invoiceDate}</Text>
              <Text style={styles.metaValue}>
                {formatDate(invoiceData.date)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bill To Section */}
        <View style={styles.billToSection}>
          <Text style={styles.sectionTitle}>{t.pdfBillTo}</Text>
          <View style={styles.billToBox}>
            <Text style={styles.customerName}>
              {invoiceData.customerName || (language === 'es' ? 'Nombre del Cliente' : 'Customer Name')}
            </Text>
            <Text style={styles.customerAddress}>
              {invoiceData.customerAddress || (language === 'es' ? 'Dirección del Cliente' : 'Customer Address')}
            </Text>
          </View>
          <View style={styles.dueDate}>
            <Text style={styles.dueDateLabel}>{t.dueDate}</Text>
            <Text style={styles.dueDateValue}>
              {formatDate(invoiceData.dueDate)}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>{t.description}</Text>
            <Text style={styles.colQuantity}>{t.pdfQty}</Text>
            <Text style={styles.colPrice}>{t.unitPrice}</Text>
            <Text style={styles.colTotal}>{t.total}</Text>
          </View>

          {/* Table Rows */}
          {invoiceData.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowAlt : {},
              ]}
            >
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.unitPrice, language)}</Text>
              <Text style={styles.colTotal}>{formatCurrency(item.total, language)}</Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t.subtotal}</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoiceData.subtotal, language)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {t.tax} ({(invoiceData.taxRate * 100).toFixed(1)}%)
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoiceData.tax, language)}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>{t.pdfTotalDue}</Text>
              <Text style={styles.grandTotalValue}>
                {formatCurrency(invoiceData.total, language)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        {invoiceData.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>{t.notes}</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t.pdfThankYou}</Text>
          <Text style={styles.footerSubtext}>
            {t.pdfPaymentInstructions}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
