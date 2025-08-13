'use client';
import React, { useEffect, useMemo, useState } from 'react';
import '../app/globals.css';
import { PROMPTS } from '../lib/prompts';
import { pdf } from '@react-pdf/renderer';
import { ReflectionPDF } from '../components/ReflectionPDF.jsx';

function formatDateISO(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
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
    const safeTheme = (theme || 'Reflection').replace(/\s+/g,'_');
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
    document.documentElement.style.fontSize = (fontSize * 100) + '%';
    document.body.style.fontFamily = useLexend ? 'Lexend, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' : 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
  }, [contrast, fontSize, useLexend]);

  async function handleDownload() {
    const doc = <ReflectionPDF date={date} prompt={prompt} reflection={reflection} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'reflection.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const disabled = reflection.trim().length === 0;

  return (
    <main className="min-h-screen">
      <header className="w-full border-b border-gray-200 bg-white/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Allyship Companion" className="h-8 w-auto" />
          </div>
          <nav className="text-sm text-gray-600">
            <a href="#privacy" className="hover:underline">Privacy</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto container px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-navyDeep mb-2">Pause with purpose—reflect, grow, and act with intention</h1>
        <p className="text-gray-600 mb-6">A gentle daily nudge to practice allyship in three minutes or less.</p>

        <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Accessibility & Display</h2>
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={useLexend} onChange={e=>setUseLexend(e.target.checked)} />
              Dyslexia-friendly font (Lexend)
            </label>
            <label className="flex items-center gap-2">
              Text size
              <input type="range" min="0.9" max="1.4" step="0.05" value={fontSize} onChange={e=>setFontSize(parseFloat(e.target.value))} />
              <span>{Math.round(fontSize*100)}%</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={contrast==='high'} onChange={e=>setContrast(e.target.checked?'high':'normal')} />
              High contrast
            </label>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <label className="flex items-center gap-2 font-semibold">Date
                <input
                  type="date"
                  className="ml-3 border rounded px-2 py-1"
                  value={date}
                  onChange={e=>setDate(e.target.value)}
                />
              </label>
              <label className="flex items-center gap-2 font-semibold">Theme
                <select className="ml-3 border rounded px-2 py-1" value={theme} onChange={e=>setTheme(e.target.value)}>
                  <option>Belonging</option>
                  <option>Bias</option>
                  <option>Visibility</option>
                  <option>Inclusion</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <div className="rounded-md bg-tealSoft/10 border border-tealSoft p-4">
              <div className="text-xs uppercase tracking-wide text-tealSoft font-semibold mb-1">Daily prompt</div>
              <div className="text-lg">{prompt}</div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <label className="block font-semibold mb-2">Reflection <span className="text-gray-500 text-sm">(max 500 words)</span></label>
            <textarea
              className="w-full min-h-[160px] border rounded-md p-3 outline-none focus:ring-2 focus:ring-tealSoft"
              value={reflection}
              onChange={e=>setReflection(e.target.value)}
              placeholder="Write your reflection here…"
            />
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span>{reflection.trim().split(/\s+/).filter(Boolean).length} / 500 words</span>
              <span className={reflection.trim().split(/\s+/).filter(Boolean).length > 500 ? 'text-red-600' : ''}>
                {reflection.trim().split(/\s+/).filter(Boolean).length > 500 ? 'Please shorten to 500 words.' : ''}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <label className="block font-semibold mb-2">Filename</label>
            <input
              className="w-full border rounded-md p-2"
              value={filename}
              onChange={e=>setFilename(e.target.value)}
            />
            <p className="text-sm text-gray-600 mt-1">Auto generated from date + theme. You can edit before download.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={disabled || reflection.trim().split(/\s+/).filter(Boolean).length > 500}
              className={`px-4 py-2 rounded-md text-white ${disabled ? 'bg-gray-400' : 'bg-navyDeep hover:opacity-90'}`}
              aria-disabled={disabled}
            >
              Download PDF
            </button>
            <a href="#privacy" className="px-4 py-2 rounded-md border">Privacy</a>
          </div>
        </div>

        <div id="privacy" className="mt-12 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Privacy</h2>
          <p>This app works in your browser. Your inputs are used only to generate a downloadable PDF and are not sent to any server.</p>
        </div>
      </section>
    </main>
  );
}
