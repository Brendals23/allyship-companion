'use client';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Use system fonts; users can replace with brand fonts by embedding later.
const styles = StyleSheet.create({
  page: {
    padding: 40
  },
  header: {
    fontSize: 16,
    marginBottom: 6,
    color: '#0B2E4F'
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 700
  },
  section: {
    marginBottom: 12
  },
  label: {
    fontSize: 11,
    color: '#444'
  },
  value: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 1.4
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#555',
    textAlign: 'center'
  }
});

export function ReflectionPDF({ date, prompt, reflection, theme }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Allyship Companion</Text>
        <Text style={styles.title}>Daily Reflection – Intentional Allyship</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Prompt</Text>
          <Text style={styles.value}>{prompt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Reflection</Text>
          <Text style={styles.value}>{reflection}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Theme tag</Text>
          <Text style={styles.value}>{theme}</Text>
        </View>

        <Text style={styles.footer}>Generated with Allyship Companion – no data stored</Text>
      </Page>
    </Document>
  );
}
