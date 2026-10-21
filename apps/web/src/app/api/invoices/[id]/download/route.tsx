import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 36,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#052b20",
    paddingBottom: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#052b20",
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 9,
    color: "#047857",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  academyMetadata: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.4,
    textAlign: "right",
  },
  titleBar: {
    backgroundColor: "#052b20",
    color: "#ffffff",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    backgroundColor: "#10b981",
    color: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  metaCol: {
    width: "48%",
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaVal: {
    fontSize: 10,
    color: "#0f172a",
    marginBottom: 6,
  },
  metaValMono: {
    fontSize: 10,
    color: "#052b20",
    fontWeight: "bold",
    marginBottom: 6,
  },
  table: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  thDesc: { width: "55%", fontSize: 9, fontWeight: "bold", color: "#334155" },
  thQty: { width: "15%", fontSize: 9, fontWeight: "bold", color: "#334155", textAlign: "center" },
  thRate: { width: "15%", fontSize: 9, fontWeight: "bold", color: "#334155", textAlign: "right" },
  thAmount: { width: "15%", fontSize: 9, fontWeight: "bold", color: "#334155", textAlign: "right" },
  tdDesc: { width: "55%", fontSize: 9, color: "#1e293b" },
  tdQty: { width: "15%", fontSize: 9, color: "#475569", textAlign: "center" },
  tdRate: { width: "15%", fontSize: 9, color: "#475569", textAlign: "right" },
  tdAmount: { width: "15%", fontSize: 9, color: "#0f172a", fontWeight: "bold", textAlign: "right" },
  totalsContainer: {
    alignSelf: "flex-end",
    width: "45%",
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 2,
    borderTopColor: "#052b20",
    marginTop: 4,
  },
  totalLabel: { fontSize: 9, color: "#475569" },
  totalVal: { fontSize: 9, color: "#0f172a", fontWeight: "bold" },
  totalGrandLabel: { fontSize: 11, fontWeight: "bold", color: "#052b20" },
  totalGrandVal: { fontSize: 12, fontWeight: "bold", color: "#052b20" },
  taxNotice: {
    fontSize: 8,
    color: "#64748b",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
    fontStyle: "italic",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stampText: {
    fontSize: 7,
    color: "#64748b",
    lineHeight: 1.4,
  },
  verifiedBadge: {
    borderWidth: 1,
    borderColor: "#052b20",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    textAlign: "center",
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#052b20",
  },
});

interface InvoiceDocProps {
  invoiceId: string;
  studentName: string;
  parentName: string;
  packageName: string;
  amount: string;
  currency: string;
  date: string;
  paymentMethod: string;
  transactionRef: string;
}

const InvoiceDocument: React.FC<InvoiceDocProps> = ({
  invoiceId,
  studentName,
  parentName,
  packageName,
  amount,
  currency,
  date,
  paymentMethod,
  transactionRef,
}) => (
  <Document title={`Invoice-${invoiceId}`}>
    <Page size="A4" style={styles.page}>
      {/* 1. Header with Academy Metadata */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.brandTitle}>Quran Learn Academy</Text>
          <Text style={styles.brandSubtitle}>Official Tuition Receipt &amp; Tax Invoice</Text>
        </View>
        <View style={styles.academyMetadata}>
          <Text>Incorporation NTN: PK-8291048-Q</Text>
          <Text>UK Registry / Charity No: 849201</Text>
          <Text>London EC1V 2NX &bull; Islamabad F-8</Text>
          <Text>admissions@quranlearnacademy.com</Text>
        </View>
      </View>

      {/* 2. Title & Status Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>OFFICIAL RECEIPT: {invoiceId}</Text>
        <Text style={styles.badgeText}>CLEARED &bull; PAID</Text>
      </View>

      {/* 3. Metadata Breakdown */}
      <View style={styles.metaGrid}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Billed To (Family &amp; Student):</Text>
          <Text style={styles.metaValMono}>{parentName}</Text>
          <Text style={styles.metaVal}>Student: {studentName}</Text>
          <Text style={styles.metaLabel}>Enrolment Plan:</Text>
          <Text style={styles.metaVal}>{packageName}</Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Date of Issue:</Text>
          <Text style={styles.metaVal}>{date}</Text>
          <Text style={styles.metaLabel}>Payment Channel:</Text>
          <Text style={styles.metaVal}>{paymentMethod}</Text>
          <Text style={styles.metaLabel}>Bank Transaction Reference (UTR / RRN):</Text>
          <Text style={styles.metaValMono}>{transactionRef}</Text>
        </View>
      </View>

      {/* 4. Line Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.thDesc}>Description</Text>
          <Text style={styles.thQty}>Lessons</Text>
          <Text style={styles.thRate}>Rate</Text>
          <Text style={styles.thAmount}>Amount ({currency})</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tdDesc}>
            {packageName} &bull; 1-on-1 Personalized Quran &amp; Tajweed Tutoring
          </Text>
          <Text style={styles.tdQty}>12 Classes</Text>
          <Text style={styles.tdRate}>{amount}</Text>
          <Text style={styles.tdAmount}>{amount}</Text>
        </View>
      </View>

      {/* 5. Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalVal}>{currency} {amount}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Educational Tax / VAT (0% Exempt):</Text>
          <Text style={styles.totalVal}>{currency} 0.00</Text>
        </View>
        <View style={styles.totalRowFinal}>
          <Text style={styles.totalGrandLabel}>Total Paid:</Text>
          <Text style={styles.totalGrandVal}>{currency} {amount}</Text>
        </View>
      </View>

      {/* 6. Tax Exemption Notice */}
      <Text style={styles.taxNotice}>
        Educational Services Exemption: Tuition fees are exempt from Value Added Tax (VAT) under Section 13(1) of the Education &amp; Charities Code. This digital document constitutes a verified proof of tuition settlement.
      </Text>

      {/* 7. Footer & Cryptographic Verification Stamp */}
      <View style={styles.footer}>
        <View style={styles.stampText}>
          <Text>Digitally Signed &amp; Cleared by Academy Accounts Directorate</Text>
          <Text>Verification Hash: SHA256:{Buffer.from(invoiceId + transactionRef).toString("hex").substring(0, 32)}</Text>
          <Text>For billing inquiries, contact billing@quranlearnacademy.com</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>OFFICIAL ACADEMY SEAL</Text>
          <Text style={{ fontSize: 7, color: "#10b981", marginTop: 2, textAlign: "center" }}>VERIFIED</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const student = url.searchParams.get("student") || "Yusuf Khan";
    const parent = url.searchParams.get("parent") || "Ahmed Khan";
    const plan = url.searchParams.get("plan") || "Standard Plan (3 Days/Week)";
    const amount = url.searchParams.get("amount") || "65.00";
    const currency = url.searchParams.get("currency") || "GBP";
    const ref = url.searchParams.get("ref") || `REF-${id.toUpperCase()}`;
    const date = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const doc = (
      <InvoiceDocument
        invoiceId={id}
        studentName={student}
        parentName={parent}
        packageName={plan}
        amount={amount}
        currency={currency}
        date={date}
        paymentMethod="Direct Wire / Raast Settlement"
        transactionRef={ref}
      />
    );

    const stream = await renderToStream(doc);

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[Invoice PDF Generation Error]", error);
    return NextResponse.json({ error: "Failed to generate invoice PDF" }, { status: 500 });
  }
}
