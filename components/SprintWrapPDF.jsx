'use client';
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page:   { padding: 40 },
  title:  { fontSize: 20, fontWeight: 700, color: '#0B2E4F', marginBottom: 6 },
  meta:   { fontSize: 10, color: '#555', marginBottom: 16 },
  card:   { borderColor: '#e5e5e5', borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 10 },
  label:  { fontSize: 9, color: '#666', marginBottom: 4 },
  prompt: { fontSize: 12, fontStyle: 'italic', marginBottom: 6 },
  body:   { fontSize: 11, lineHeight: 1.35 },
  empty:  { fontSize: 12, color: '#666', fontStyle: 'italic' },
  footer: { position: 'absolute', left: 40, right: 40, bottom: 28, fontSize: 9, color: '#666', textAlign: 'center' },
});

export function SprintWrapPDF({ start, end, entries = [], theme = 'All' }) {
  const sorted = [...entries].sort((a,b) => (a.date < b.date ? -1 : 1));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reflection Summary — {theme === 'All' ? 'All Themes' : theme}</Text>
        <Text style={styles.meta}>
          Period: {start} to {end} • {sorted.length} entr{sorted.length === 1 ? 'y' : 'ies'}
        </Text>

        {sorted.length === 0 ? (
          <Text style={styles.empty}>No entries found in this period on this device.</Text>
        ) : (
          sorted.map((e, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.label}>{e.date}  •  Theme: {e.theme}</Text>
              <Text style={styles.prompt}>{e.prompt}</Text>
              <Text style={styles.body}>{e.reflection || '—'}</Text>
            </View>
          ))
        )}

        <Text style={styles.footer}>Generated with Allyship Companion — no data stored</Text>
      </Page>
    </Document>
  );
}