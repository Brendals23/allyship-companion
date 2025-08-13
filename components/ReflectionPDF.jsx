'use client';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// System fonts by default (works without network). Add Font.register if you later want Lexend.
const styles = StyleSheet.create({
  page:   { padding: 40 },
  header: { color: '#0B2E4F', marginBottom: 10 },
  h1:     { fontSize: 20, fontWeight: 700, marginBottom: 2 },
  meta:   { fontSize: 10, color: '#555' },
  box:    { borderColor: '#25B3A7', borderWidth: 1, borderRadius: 6, padding: 10, marginTop: 14 },
  label:  { fontSize: 10, color: '#444', marginBottom: 4 },
  prompt: { fontSize: 14, fontStyle: 'italic' },
  body:   { fontSize: 12, lineHeight: 1.4 },
  footer: { position: 'absolute', left: 40, right: 40, bottom: 28, fontSize: 9, color: '#666', textAlign: 'center' },
});

export function ReflectionPDF({ date, prompt, reflection, theme }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.h1}>Daily Reflection — Intentional Allyship</Text>
          <Text style={styles.meta}>
            {date}  •  Theme: {theme}
          </Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>PROMPT</Text>
          <Text style={styles.prompt}>{prompt}</Text>
        </View>

        <View style={[styles.box, { marginTop: 18 }]}>
          <Text style={styles.label}>REFLECTION</Text>
          <Text style={styles.body}>{reflection || '—'}</Text>
        </View>

        <Text style={styles.footer}>Generated with Allyship Companion — no data stored</Text>
      </Page>
    </Document>
  );
}