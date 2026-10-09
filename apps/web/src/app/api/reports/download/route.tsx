import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#0C4A3A',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    color: '#111827',
  }
});

const ReportDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Quran Academy Monthly Report</Text>
        <Text style={styles.text}>Student: Yusuf Khan</Text>
        <Text style={styles.text}>Date: October 2026</Text>
        <Text style={styles.text}>Overall Progress: 75%</Text>
        <Text style={styles.text}>Attendance: 11 / 12 lessons</Text>
        <Text style={styles.text}>Teacher Remarks: Excellent recitation. Keep practicing the Ghunnah rules.</Text>
      </View>
    </Page>
  </Document>
);

export async function GET(request: Request) {
  try {
    const stream = await renderToStream(<ReportDocument />);
    
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="student-report.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
