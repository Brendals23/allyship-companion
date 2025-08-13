// app/page.js
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import '../app/globals.css';
import { pdf } from '@react-pdf/renderer';
import { PROMPT_PAIRS, THEMES } from '../lib/prompts';
import { ReflectionPDF } from '../components/ReflectionPDF.jsx';
import { SprintWrapPDF } from '../components/SprintWrapPDF.jsx';

/* ---------- helpers ---------- */
function formatDateISO(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
function addDays(dateISO, n) {
  const d = new Date(dateISO + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return formatDateISO(d);
}
function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}
function weekStartMonday(dateISO) {
  const d = new Date(dateISO + 'T00:00:00');
  const dow = d.getDay();
  const delta = (dow + 6) % 7; // Mon=0
  d.setDate(d.getDate() - delta);
  return formatDateISO(d);
}
function weekEndFromStart(startISO) { return addDays(startISO, 6); }

function seededPick(arr, seedStr) {
  if (!arr?.length) return null;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const idx = seed % arr.length;
  return arr[idx];
}
function categoryForCadence(cadence) {
  if (cadence === 'weekly') return 'week';
  if (cadence === '3x') return 'fewDays';
  return 'daily';
}

/* ---------- page ---------- */
export default function Home() {
  // display prefs
  const [contrast, setContrast] = useState('normal');
  const [fontSize, setFontSize] = useState(1);
  const [useLexend, setUseLexend] = useState(true);

  // core state
  const today = useMemo(() => formatDateISO(new Date()), []);
  const [date, setDate] = useState(today);
  const [cadence, setCadence] = useState('self'); // daily | 3x | weekly | self
  const [theme, setTheme] = useState('All');
  const [reflection, setReflection] = useState('');
  const [filename, setFilename] = useState('');

  // sprint
  const [sprintActive, setSprintActive] = useState(false);
  const [sprintStart, setSprintStart] = useState(today);
  const SPRINT_DAYS = 14;

  // local history
  const [history, setHistory] = useState([]);

  // selected prompts
  const [promptReflection, setPromptReflection] = useState('');
  const [promptAction, setPromptAction] = useState('');

  // load prefs/history
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ac_prefs') || '{}');
      if (saved.contrast) setContrast(saved.contrast);
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.useLexend !== undefined) setUseLexend(saved.useLexend);
      if (saved.cadence) setCadence(saved.cadence);
      if (saved.theme) setTheme(saved.theme);

      const sprint = JSON.parse(localStorage.getItem('ac_sprint') || 'null');
      if (sprint?.active) { setSprintActive(true); setSprintStart(sprint.startDate || today); }

      const hist = JSON.parse(localStorage.getItem('ac_history') || '[]');
      setHistory(Array.isArray(hist) ? hist : []);
    } catch {}
  }, [today]);

  // persist prefs + apply display
  useEffect(() => {
    try { localStorage.setItem('ac_prefs', JSON.stringify({ contrast, fontSize, useLexend, cadence, theme })); } catch {}
    document.documentElement.setAttribute('data-contrast', contrast === 'high' ? 'high' : 'normal');
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    document.body.style.fontFamily = useLexend
      ? 'Lexend, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      : 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
  }, [contrast, fontSize, useLexend, cadence, theme]);

  // choose prompt pair based on date + cadence + theme (with filtering)
  useEffect(() => {
    const cat   = categoryForCadence(cadence);
    const pool  = PROMPT_PAIRS[cat] || PROMPT_PAIRS.daily;
    const t     = theme || 'All';
    const filt  = (t === 'All') ? pool : pool.filter(p => (p.themes || []).includes(t));
    const final = filt.length ? filt : pool;

    const seed  = `${date}|${cadence}|${t}`;
    const pick  = seededPick(final, seed);

    setPromptReflection(pick?.reflection || '');
    setPromptAction(pick?.action || '');
  }, [date, cadence, theme]);

  // filename
  useEffect(() => {
    const safeCat   = categoryForCadence(cadence);
    const safeTheme = (theme || 'All').replace(/\s+/g, '_');
    setFilename(`${date}_${safeCat}_${safeTheme}_Reflection.pdf`);
  }, [date, cadence, theme]);

  // service worker (optional)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  /* ---------- downloads ---------- */
  async function downloadTodayPDF() {
    const entry = {
      date,
      theme,
      cadence,
      prompt: promptReflection,
      action: promptAction,
      reflection,
      words: reflection.trim().split(/\s+/).filter(Boolean).length
    };
    const withoutSameDate = history.filter(h => h.date !== date);
    const updated = [entry, ...withoutSameDate].sort((a, b) => (a.date < b.date ? 1 : -1));
    setHistory(updated);
    try { localStorage.setItem('ac_history', JSON.stringify(updated)); } catch {}

    const doc = <ReflectionPDF date={date} prompt={promptReflection} reflection={reflection} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename || 'reflection.pdf'; a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadSummaryPDF() {
    const start = sprintActive ? sprintStart : weekStartMonday(date);
    const fullEnd = sprintActive ? addDays(sprintStart, SPRINT_DAYS - 1) : weekEndFromStart(weekStartMonday(date));
    const end = sprintActive && new Date(fullEnd) > new Date(today) ? today : fullEnd;

    const entries = history
      .filter(h => h.date >= start && h.date <= end)
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    const doc  = <SprintWrapPDF start={start} end={end} entries={entries} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = sprintActive ? `Allyship_Sprint_${start}_to_${end}.pdf` : `Allyship_Weekly_${start}_to_${end}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // .ics helpers (cadence + sprint)
  function icsHeader() { return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Allyship Companion//EN','CALSCALE:GREGORIAN'].join('\r\n'); }
  function icsFooter() { return 'END:VCALENDAR'; }
  function fmtDate(dISO) { return dISO.replace(/-/g, ''); }
  function downloadICS(filename, vevents) {
    const content = [icsHeader(), ...vevents, icsFooter()].join('\r\n');
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  function downloadCadenceICS(startISO) {
    const dt = fmtDate(startISO);
    let rrule = '';
    if (cadence === 'daily') rrule = 'RRULE:FREQ=DAILY';
    if (cadence === 'weekly') rrule = 'RRULE:FREQ=WEEKLY;BYDAY=MO';
    if (cadence === '3x')    rrule = 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR';
    const vev = ['BEGIN:VEVENT', `UID:ac-${dt}-${cadence}@allyship`, `DTSTART;VALUE=DATE:${dt}`, `SUMMARY:Allyship reflection (${cadence})`, rrule, 'END:VEVENT'];
    downloadICS('allyship-cadence.ics', vev);
  }
  function downloadSprintICS() {
    const events = [];
    for (let i = 0; i < SPRINT_DAYS; i++) {
      const d = fmtDate(addDays(sprintStart, i));
      events.push('BEGIN:VEVENT', `UID:sprint-${d}-${i}@allyship`, `DTSTART;VALUE=DATE:${d}`, `SUMMARY:Allyship 14-day sprint — Day ${i+1}`, 'END:VEVENT');
    }
    downloadICS('allyship-sprint-14d.ics', events);
  }

  // derived UI state
  const words = reflection.trim().split(/\s+/).filter(Boolean).length;
  const disableToday = reflection.trim().length === 0 || words > 500;

  const weekStart = weekStartMonday(date);
  const weekEnd   = weekEndFromStart(weekStart);
  const weekHasEntries = history.some(h => h.date >= weekStart && h.date <= weekEnd);

  const sprintEndFull  = addDays(sprintStart, SPRINT_DAYS - 1);
  const sprintHasEntries = sprintActive &&
    history.some(h => h.date >= sprintStart && h.date <= (new Date(today) < new Date(sprintEndFull) ? today : sprintEndFull));

  const disableSummary = sprintActive ? !sprintHasEntries : !weekHasEntries;

  /* ---------- render ---------- */
  return (
    <main className="min-h-screen">
      <header className="w-full border-b border-gray-200 bg-white/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto container px-4 py-4">
          <span className="sr-only">Allyship Companion</span>
        </div>
      </header>

      <section className="mx-auto container px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-navyDeep mb-2">Allyship Companion</h1>
        <p className="text-lg text-gray-700 mb-3">A gentle nudge to practice allyship in three minutes or less.</p>
        <p className="text-gray-700 mb-6 max-w-2xl">
          Adjust your display, reflect on today’s prompt, then (optionally) set up reminders or a 14-day sprint. Everything stays on your device.
        </p>

        {/* Accessibility */}
        <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Accessibility & display options</h2>
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={useLexend} onChange={(e)=>setUseLexend(e.target.checked)} />
              Dyslexia-friendly font (Lexend)
            </label>
            <label className="flex items-center gap-2">
              Text size
              <input type="range" min="0.9" max="1.4" step="0.05" value={fontSize} onChange={(e)=>setFontSize(parseFloat(e.target.value))} />
              <span>{Math.round(fontSize*100)}%</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={contrast==='high'} onChange={(e)=>setContrast(e.target.checked?'high':'normal')} />
              High contrast
            </label>
          </div>
        </div>

        {/* Prompt & Reflection */}
        <div className="grid gap-6">
          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <label className="flex items-center gap-2 font-semibold">Date
                <input type="date" className="ml-3 border rounded px-2 py-1" value={date} onChange={(e)=>setDate(e.target.value)} />
              </label>
              <label className="flex items-center gap-2 font-semibold">Theme
                <select className="ml-3 border rounded px-2 py-1" value={theme} onChange={(e)=>setTheme(e.target.value)}>
                  {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 font-semibold">Cadence
                <select className="ml-3 border rounded px-2 py-1" value={cadence} onChange={(e)=>setCadence(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="3x">3× per week</option>
                  <option value="weekly">Weekly</option>
                  <option value="self">Only when I choose</option>
                </select>
              </label>
            </div>

            <div className="rounded-md border border-tealSoft p-5">
              <div className="text-xs uppercase tracking-wide text-tealSoft font-semibold mb-2 text-center">
                Prompt ({categoryForCadence(cadence)}) • {theme}
              </div>
              <div className="text-xl italic text-center mb-3">{promptReflection}</div>
              <div className="text-sm text-gray-700 text-center">
                <span className="font-semibold">Action suggestion: </span>{promptAction}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <label className="block font-semibold mb-2">
              Reflection <span className="text-gray-500 text-sm">(max 500 words)</span>
            </label>
            <textarea
              className="w-full min-h-[160px] border rounded-md p-3 outline-none focus:ring-2 focus:ring-tealSoft"
              value={reflection}
              onChange={(e)=>setReflection(e.target.value)}
              placeholder="Type your reflection to the prompt above…"
            />
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span>{reflection.trim().split(/\s+/).filter(Boolean).length} / 500 words</span>
              <span className={reflection.trim().split(/\s+/).filter(Boolean).length > 500 ? 'text-red-600' : ''}>
                {reflection.trim().split(/\s+/).filter(Boolean).length > 500 ? 'Please shorten to 500 words.' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Downloads */}
        <div className="mt-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Download your reflections</h2>
          <p className="text-gray-700 mb-3 text-sm">
            “Today” downloads what you wrote above. “Summary” bundles weekly (Mon–Sun) entries or your 14-day sprint if active.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={downloadTodayPDF}
              disabled={reflection.trim().length === 0 || reflection.trim().split(/\s+/).filter(Boolean).length > 500}
              className={`px-4 py-2 rounded-md text-white ${reflection.trim().length === 0 ? 'bg-gray-400' : 'bg-navyDeep hover:opacity-90'}`}
            >
              Download today’s reflection (PDF)
            </button>
            <button
              onClick={downloadSummaryPDF}
              disabled={sprintActive
                ? !history.some(h => h.date >= sprintStart && h.date <= addDays(sprintStart, SPRINT_DAYS - 1))
                : !history.some(h => h.date >= weekStartMonday(date) && h.date <= weekEndFromStart(weekStartMonday(date)))}
              className="px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Download summary {sprintActive ? '(sprint)' : '(this week)'}
            </button>
          </div>
        </div>

        {/* Sprint controls */}
        <div className="mt-10 mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-3">Optional nudges & sprint</h2>
          {!sprintActive ? (
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2">Start on
                <input type="date" className="ml-2 border rounded px-2 py-1" value={sprintStart} onChange={(e)=>setSprintStart(e.target.value)} />
              </label>
              <button
                onClick={() => { setSprintActive(true); try { localStorage.setItem('ac_sprint', JSON.stringify({active:true, startDate:sprintStart, days:SPRINT_DAYS})); } catch {} }}
                className="px-3 py-1 rounded-md border"
              >
                Start sprint
              </button>
              <button
                onClick={downloadSprintICS}
                className="px-3 py-1 rounded-md border"
              >
                Download sprint calendar (.ics)
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block rounded-md bg-white border px-3 py-1 shadow-sm">
                Sprint active • Day {Math.min(SPRINT_DAYS, Math.max(1, daysBetween(sprintStart, date)+1))} of {SPRINT_DAYS} (started {sprintStart})
              </span>
              <button
                onClick={() => { setSprintActive(false); try { localStorage.setItem('ac_sprint', JSON.stringify({active:false})); } catch {} }}
                className="px-3 py-1 rounded-md border"
              >
                End sprint
              </button>
            </div>
          )}
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