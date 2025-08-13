'use client';
import React, { useEffect, useMemo, useState } from 'react';
import '../app/globals.css';
import { PROMPTS } from '../lib/prompts';
import { pdf } from '@react-pdf/renderer';
import { ReflectionPDF } from '../components/ReflectionPDF.jsx';

function formatDateISO(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  const [contrast, setContrast] = useState('normal');
  const [fontSize, setFontSize] = useState(1); // 1 = 100%
  const [useLexend, setUseLexend] = useState(true);

  const today = useMemo(() => formatDateISO(new Date()), []);
  const [date, setDate] = useState(today);
  const [prompt, setPrompt] = useState('');
  const [reflection, setReflection] = useState('');
  const [theme, setTheme] = useState('Belonging');
  const [filename, setFilename] = useState('');

  // Stable daily prompt: seeded by date string
  useEffect(() => {
    const seed = Array.from(date).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const idx = seed % PROMPTS.length;
    setPrompt(PROMPTS[idx]);
  }, [date]);

  // Auto filename
  useEffect(() => {
    const safeTheme = (theme || 'Reflection').replace(/\s+/g, '_');
    setFilename(`${date}_${safeTheme}_Reflection.pdf`);
  }, [date, theme]);

  // Persist UI prefs
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ac_prefs') || '{}');
      if (saved.contrast) setContrast(saved.contrast);
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.useLexend !== undefined) setUseLexend(saved.useLexend);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ac_prefs', JSON.stringify({ contrast, fontSize, useLexend }));
    } catch {}
    document.documentElement.setAttribute('data-contrast', contrast === 'high' ? 'high' : 'normal');
    document.documentElement.style.fontSize = fontSize * 100 + '%';
    document.body.style.fontFamily = useLexend
      ? 'Lexend, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      : 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
  }, [contrast, fontSize, useLexend]);

  async function handleDownload() {
    const doc = <ReflectionPDF date={date} prompt={prompt} reflection={reflection} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob
