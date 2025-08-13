'use client';
import React, { useEffect, useMemo, useState } from 'react';
import '../app/globals.css';
import { PROMPTS } from '../lib/prompts';
import { pdf } from '@react-pdf/renderer';
import { ReflectionPDF } from '../components/ReflectionPDF.jsx';
import { SprintWrapPDF } from '../components/SprintWrapPDF.jsx'; // NEW
import { THEME_MAP } from '../lib/themes'; // NEW

function formatDateISO(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}
function addDays(dateISO, n) {
  const d = new Date(dateISO + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return formatDateISO(d);
}

export default function Home() {
  // ---------- Display prefs ----------
  const [contrast, setContrast] = useState('normal');
  const [fontSize, setFontSize] = useState(1);
  const [useLexend, setUseLexend] = useState(true);

  // ---------- App state ----------
  const today = useMemo(() => formatDateISO(new Date()), []);
  const [date, setDate] = useState(today);
  const [theme, setTheme] = useState('All');               // NEW: chosen theme
  const [cadence, setCadence] = useState('self');          // NEW: daily | 3x | weekly | self
  const [cadenceStart, setCadenceStart] = useState(today); // NEW: when to start nudges
  const [prompt, setPrompt] = useState('');
  const [reflection, setReflection] = useState('');
  const [filename, setFilename] = useState('');

  // ---------- Sprint state ----------
  const [sprintActive, setSprintActive] = useState(false);
  const [sprintStart, setSprintStart] = useState(today);
  const SPRINT_DAYS = 14;

  // ---------- Local history for wrap-up ----------
  const [history, setHistory] = useState([]); // {date, theme, prompt, reflection}

  // Load prefs + history
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ac_prefs') || '{}');
      if (saved.contrast) setContrast(saved.contrast);
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.useLexend !== undefined) setUseLexend(saved.useLexend);
      if (saved.theme) setTheme(saved.theme);
      if (saved.cadence) setCadence(saved.cadence);
      if (saved.cadenceStart) setCadenceStart(saved.cadenceStart);
      const sprint = JSON.parse(localStorage.getItem('ac_sprint') || 'null');
      if (sprint?.active) {
        setSprintActive(true);
        setSprintStart(sprint.startDate || today);
      }
      const hist = JSON.parse(localStorage.getItem('ac_history') || '[]');
      setHistory(Array.isArray(hist) ? hist : []);
    } catch {}
  }, [today]);

  // Persist prefs
  useEffect(() => {
    try {
      localStorage.setItem('ac_prefs', JSON.stringify({ contrast, fontSize, useLexend, theme, cadence, cadenceStart }));
    } catch {}
    document.documentElement.setAttribute('data-contrast', contrast === 'high' ? 'high' : 'normal');
    document.documentElement.style.fontSize = fontSize * 100 + '%';
    document.body.style.fontFamily = useLexend
      ? 'Lexend, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      : 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
  }, [contrast, fontSize, useLexend, theme, cadence, cadenceStart]);

  // Choose prompt from theme list (stable per date)
  useEffect(() => {
    const pool = theme === 'All' ? PROMPTS : THEME_MAP[theme] || PROMPTS;
    const seed = Array.from(date).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const idx = seed % pool.length;
    setPrompt(pool[idx]);
  }, [date, theme]);

  // Auto filename
  useEffect(() => {
    const safeTheme = (theme || 'Reflection').replace(/\s+/g, '_');
    setFilename(`${date}_${safeTheme}_Reflection.pdf`);
  }, [date, theme]);

  // PWA SW
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // ---------- Actions ----------
  async function handleDownload() {
    // save to local history quietly (helps sprint wrap-up)
    const entry = { date, theme, prompt, reflection, words: reflection.trim().split(/\s+/).filter(Boolean).length };
    const withoutSameDate = history.filter(h => h.date !== date);
    const updated = [entry, ...withoutSameDate].sort((a, b) => (a.date < b.date ? 1 : -1));
    setHistory(updated);
    try { localStorage.setItem('ac_history', JSON.stringify(updated)); } catch {}

    // generate the PDF
    const doc = <ReflectionPDF date={date} prompt={prompt} reflection={reflection} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'reflection.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleStartSprint() {
    setSprintActive(true);
    setSprintStart(date);
    try { localStorage.setItem('ac_sprint', JSON.stringify({ active: true, startDate: date, days: SPRINT_DAYS })); } catch {}
  }
  function handleEndSprint() {
    setSprintActive(false);
    try { localStorage.setItem('ac_sprint', JSON.stringify({ active: false })); } catch {}
  }

  // Sprint state helpers
  const sprintDay = sprintActive ? Math.min(SPRINT_DAYS, Math.max(1, daysBetween(sprintStart, date) + 1)) : null;
  const sprintOver = sprintActive && daysBetween(sprintStart, date) >= SPRINT_DAYS;

  // ---------- ICS calendar (nudges) ----------
  function icsHeader() {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Allyship Companion//EN',
      'CALSCALE:GREGORIAN',
    ].join('\r\n');
  }
  function icsFooter() { return 'END:VCALENDAR'; }
  function fmtDate(dISO) { return dISO.replace(/-/g, ''); }

  function downloadICS(filename, vevents) {
    const content = [icsHeader(), ...vevents, icsFooter()].join('\r\n');
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // Cadence ICS: all-day events with RRULE
  function downloadCadenceICS() {
    const dt = fmtDate(cadenceStart);
    let rrule = '';
    if (cadence === 'daily') rrule = 'RRULE:FREQ=DAILY';
    if (cadence === 'weekly') rrule = 'RRULE:FREQ=WEEKLY;BYDAY=MO';
    if (cadence === '3x')    rrule = 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR';
    const vev = [
      'BEGIN:VEVENT',
      `UID:ac-${dt}-${cadence}@allyship`,
      `DTSTART;VALUE=DATE:${dt}`,
      `SUMMARY:Allyship reflection (${cadence})`,
      rrule,
      'END:VEVENT'
    ];
    downloadICS('allyship-cadence.ics', vev);
  }

  // Sprint ICS: 14 daily events from sprintStart
  function downloadSprintICS() {
    const start = sprintStart;
    const events = [];
    for (let i = 0; i < SPRINT_DAYS; i++) {
      const d = fmtDate(addDays(start, i));
      events.push(
        'BEGIN:VEVENT',
        `UID:sprint-${d}-${i}@allyship`,
        `DTSTART;VALUE=DATE:${d}`,
        `SUMMARY:Allyship 14‑day sprint — Day ${i + 1}`,
        'END:VEVENT'
      );
    }
    downloadICS('allyship-sprint-14d.ics', events);
  }

  // Sprint wrap-up PDF (collect entries in the sprint window)
  async function handleSprintWrapPDF() {
    const start = sprintStart;
    const end = addDays(start, SPRINT_DAYS - 1);
    const inWindow = history.filter(h => h.date >= start && h.date <= end).sort((a,b)=> a.date<b.date? -1:1);
    const doc = <SprintWrapPDF start={start} end={end} entries={inWindow} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Allyship_Sprint_Wrap_${start}_to_${end}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;
  const disabled = reflection.trim().length === 0 || wordCount > 500;

  return (
    <main className="min-h-screen">
      {/* Minimal header; no logo/nav */}
      <header className="w-full border-b border-gray-200 bg-white/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto container px-4 py-4">
          <span className="sr-only">Allyship Companion</span>
        </div>
      </header>

      <section className="mx-auto container px-4 py-8">
        {/* Title + subheading + short intro */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-navyDeep mb-2">Allyship Companion</h1>
        <p className="text-lg text-gray-700 mb-3">A gentle nudge to practice allyship in three minutes or less.</p>
        <p className="text-gray-700 mb-6 max-w-2xl">
          Choose a cadence or join a 14‑day sprint, pick a theme (or All), and get reflective prompts.
          Everything stays on your device. Download calendar nudges and PDFs whenever you like.
        </p>

        {/* Setup: cadence + theme */}
        <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-3">Your setup</h2>
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="font-semibold">Cadence:</span>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='daily'} onChange={()=>setCadence('daily')} /> Daily</label>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='3x'} onChange={()=>setCadence('3x')} /> 3× per week (Mon/Wed/Fri)</label>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='weekly'} onChange={()=>setCadence('weekly')} /> Weekly (Mon)</label>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='self'} onChange={()=>setCadence('self')} /> Only when I choose</label>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2">Start date
                <input type="date" className="ml-2 border rounded px-2 py-1" value={cadenceStart} onChange={e=>setCadenceStart(e.target.value)} />
              </label>
              <button onClick={downloadCadenceICS} className="px-3 py-1 rounded-md border text-sm" disabled={cadence==='self'}>
                Download {cadence==='daily' ? 'daily' : cadence==='3x' ? 'Mon/Wed/Fri' : cadence==='weekly' ? 'weekly' : ''} calendar (.ics)
              </button>
              <span className="text-xs text-gray-600">Import .ics into Outlook or Google Calendar.</span>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="font-semibold">Theme:</label>
              <select className="border rounded px-2 py-1" value={theme} onChange={e=>setTheme(e.target.value)}>
                <option>All</option>
                <option>Belonging</option>
                <option>Bias</option>
                <option>Visibility</option>
                <option>Inclusion</option>
                <option>Advocacy</option>
              </select>
              <span className="text-xs text-gray-600">You can change this anytime.</span>
            </div>
          </div>
        </div>

        {/* Accessibility options */}
        <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Accessibility & display options</h2>
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={useLexend} onChange={(e) => setUseLexend(e.target.checked)} />
              Dyslexia-friendly font (Lexend)
            </label>
            <label className="flex items-center gap-2">
              Text size
              <input type="range" min="0.9" max="1.4" step="0.05" value={fontSize} onChange={(e) => setFontSize(parseFloat(e.target.value))} />
              <span>{Math.round(fontSize * 100)}%</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={contrast === 'high'} onChange={(e) => setContrast(e.target.checked ? 'high' : 'normal')} />
              High contrast
            </label>
          </div>
        </div>

        {/* Sprint controls */}
        <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-2">14‑day sprint (one prompt per day)</h2>
          {!sprintActive ? (
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2">Start on
                <input type="date" className="ml-2 border rounded px-2 py-1" value={sprintStart} onChange={e=>setSprintStart(e.target.value)} />
              </label>
              <button onClick={handleStartSprint} className="px-3 py-1 rounded-md border">Start sprint</button>
              <button onClick={downloadSprintICS} className="px-3 py-1 rounded-md border">Download sprint calendar (.ics)</button>
              <span className="text-xs text-gray-600">Import .ics into Outlook or Google Calendar.</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block rounded-md bg-white border px-3 py-1 shadow-sm">
                Sprint active • Day {sprintOver ? SPRINT_DAYS : sprintDay} of {SPRINT_DAYS} (started {sprintStart})
              </span>
              <button onClick={sprintOver ? handleEndSprint : downloadSprintICS} className="px-3 py-1 rounded-md border">
                {sprintOver ? 'End sprint' : 'Get calendar again'}
              </button>
              {sprintOver && (
                <button onClick={handleSprintWrapPDF} className="px-3 py-1 rounded-md border">Download sprint wrap‑up PDF</button>
              )}
            </div>
          )}
        </div>

        {/* Prompt & form */}
        <div className="grid gap-6">
          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <label className="flex items-center gap-2 font-semibold">
                Date
                <input type="date" className="ml-3 border rounded px-2 py-1" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="flex items-center gap-2 font-semibold">
                Theme
                <select className="ml-3 border rounded px-2 py-1" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option>All</option>
                  <option>Belonging</option>
                  <option>Bias</option>
                  <option>Visibility</option>
                  <option>Inclusion</option>
                  <option>Advocacy</option>
                </select>
              </label>
            </div>

            <div className="rounded-md bg-tealSoft/10 border border-tealSoft p-5">
              <div className="text-xs uppercase tracking-wide text-tealSoft font-semibold mb-2 text-center">Prompt</div>
              <div className="text-xl italic text-center">{prompt}</div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <label className="block font-semibold mb-2">
              Reflection <span className="text-gray-500 text-sm">(max 500 words)</span>
            </label>
            <textarea
              className="w-full min-h-[160px] border rounded-md p-3 outline-none focus:ring-2 focus:ring-tealSoft"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Type your reflection to the prompt above…"
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
            <input className="w-full border rounded-md p-2" value={filename} onChange={(e) => setFilename(e.target.value)} />
            <p className="text-sm text-gray-600 mt-1">Auto generated from date + theme. You can edit before download.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              disabled={disabled}
              className={`px-4 py-2 rounded-md text-white ${disabled ? 'bg-gray-400' : 'bg-navyDeep hover:opacity-90'}`}
              aria-disabled={disabled}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="mt-12 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Privacy</h2>
          <p>This app works in your browser. Your inputs are used only to generate a downloadable PDF and are not sent to any server.</p>
        </div>
      </section>
    </main>
  );
}