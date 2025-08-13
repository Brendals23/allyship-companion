'use client';
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 22, marginBottom: 8, fontWeight: 700 },
  meta: { fontSize: 12, marginBottom: 16, color: '#444' },
  section: { marginBottom: 10 },
  entryDate: { fontSize: 12, marginBottom: 4, color: '#0B2E4F' },
  label: { fontSize: 11, color: '#555' },
  value: { fontSize: 12, marginTop: 2, lineHeight: 1.4 },
  divider: { marginVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  }
});

export function SprintWrapPDF({ start, end, entries = [], theme }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Allyship 14‑Day Sprint — Wrap‑Up</Text>
        <Text style={styles.meta}>Dates: {start} to {end} • Theme: {theme}</Text>

        {entries.length === 0 ? (
          <Text style={styles.value}>
            No entries saved for this sprint window on this device.
          </Text>
        ) : (
          entries.map((e, i) => (
            <View key={i} style={styles.section}>
              <Text style={styles.entryDate}>Day {i + 1} • {e.date}</Text>
              <Text style={styles.label}>Prompt</Text>
              <Text style={styles.value}>{e.prompt}</Text>
              <View style={styles.divider} />
              <Text style={styles.label}>Reflection</Text>
              <Text style={styles.value}>{e.reflection}</Text>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          Generated with Allyship Companion – no data stored
        </Text>
      </Page>
    </Document>
  );
}