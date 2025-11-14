import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { InvoiceData } from '../../types';

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
}

/**
 * PDF Invoice Template using @react-pdf/renderer
 * Creates a professional, print-ready invoice document
 */
export const InvoicePDFTemplate = ({ invoiceData }: InvoicePDFTemplateProps) => {
  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
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
          <Text style={styles.companyName}>Your Company Name</Text>
          <Text style={styles.companyInfo}>
            123 Business Street{'\n'}
            City, State 12345{'\n'}
            Phone: (555) 123-4567{'\n'}
            Email: info@company.com
          </Text>
        </View>

        {/* Invoice Header */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <View style={styles.invoiceMetaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Invoice Number</Text>
              <Text style={styles.metaValue}>
                {invoiceData.invoiceNumber || 'N/A'}
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Invoice Date</Text>
              <Text style={styles.metaValue}>
                {formatDate(invoiceData.date)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bill To Section */}
        <View style={styles.billToSection}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.billToBox}>
            <Text style={styles.customerName}>
              {invoiceData.customerName || 'Customer Name'}
            </Text>
            <Text style={styles.customerAddress}>
              {invoiceData.customerAddress || 'Customer Address'}
            </Text>
          </View>
          <View style={styles.dueDate}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDateValue}>
              {formatDate(invoiceData.dueDate)}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colQuantity}>Qty</Text>
            <Text style={styles.colPrice}>Unit Price</Text>
            <Text style={styles.colTotal}>Total</Text>
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
              <Text style={styles.colPrice}>${item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.colTotal}>${item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                ${invoiceData.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Tax ({(invoiceData.taxRate * 100).toFixed(1)}%)
              </Text>
              <Text style={styles.totalValue}>
                ${invoiceData.tax.toFixed(2)}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Due</Text>
              <Text style={styles.grandTotalValue}>
                ${invoiceData.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        {invoiceData.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business!</Text>
          <Text style={styles.footerSubtext}>
            Please make payment by the due date. For questions, contact us at info@company.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};
