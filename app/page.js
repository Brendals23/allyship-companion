'use client';
import React, { useEffect, useMemo, useState } from 'react';
import '../app/globals.css';
import { PROMPTS } from '../lib/prompts';
import { THEME_MAP } from '../lib/themes';
import { pdf } from '@react-pdf/renderer';
import { ReflectionPDF } from '../components/ReflectionPDF.jsx';
import { SprintWrapPDF } from '../components/SprintWrapPDF.jsx';

/* ---------------- helpers ---------------- */
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
// Week helpers (Mon..Sun)
function weekStartMonday(dateISO) {
  const d = new Date(dateISO + 'T00:00:00');
  const dow = d.getDay();              // 0 Sun .. 6 Sat
  const delta = (dow + 6) % 7;         // Mon = 0
  d.setDate(d.getDate() - delta);
  return formatDateISO(d);
}
function weekEndFromStart(startISO) {
  return addDays(startISO, 6);
}

/* ---------------- page ---------------- */
export default function Home() {
  // display prefs
  const [contrast, setContrast] = useState('normal'); // 'normal' | 'high'
  const [fontSize, setFontSize] = useState(1);
  const [useLexend, setUseLexend] = useState(true);

  // core state
  const today = useMemo(() => formatDateISO(new Date()), []);
  const [date, setDate] = useState(today);
  const [theme, setTheme] = useState('All');
  const [prompt, setPrompt] = useState('');
  const [reflection, setReflection] = useState('');
  const [filename, setFilename] = useState('');

  // cadence + sprint (nudges only; still no login/no server)
  const [cadence, setCadence] = useState('self');     // daily | 3x | weekly | self
  const [cadenceStart, setCadenceStart] = useState(today);
  const [sprintActive, setSprintActive] = useState(false);
  const [sprintStart, setSprintStart] = useState(today);
  const SPRINT_DAYS = 14;

  // on-device history for summaries
  const [history, setHistory] = useState([]);

  // load prefs/history
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

  // persist prefs + apply display
  useEffect(() => {
    try {
      localStorage.setItem('ac_prefs', JSON.stringify({
        contrast, fontSize, useLexend, theme, cadence, cadenceStart
      }));
    } catch {}
    document.documentElement.setAttribute('data-contrast', contrast === 'high' ? 'high' : 'normal');
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    document.body.style.fontFamily = useLexend
      ? 'Lexend, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      : 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
  }, [contrast, fontSize, useLexend, theme, cadence, cadenceStart]);

  // pick prompt from theme pool (stable per date)
  useEffect(() => {
    const pool = THEME_MAP[theme] || PROMPTS;
    const seed = Array.from(date).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const idx = seed % pool.length;
    setPrompt(pool[idx]);
  }, [date, theme]);

  // filename
  useEffect(() => {
    const safeTheme = (theme || 'Reflection').replace(/\s+/g, '_');
    setFilename(`${date}_${safeTheme}_Reflection.pdf`);
  }, [date, theme]);

  // optional SW
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  /* -------------- downloads -------------- */

  // Save today → history (local) + download single-day PDF
  async function downloadTodayPDF() {
    const entry = {
      date, theme, prompt, reflection,
      words: reflection.trim().split(/\s+/).filter(Boolean).length
    };
    const withoutSameDate = history.filter(h => h.date !== date);
    const updated = [entry, ...withoutSameDate].sort((a, b) => (a.date < b.date ? 1 : -1));
    setHistory(updated);
    try { localStorage.setItem('ac_history', JSON.stringify(updated)); } catch {}

    const doc = <ReflectionPDF date={date} prompt={prompt} reflection={reflection} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename || 'reflection.pdf'; a.click();
    URL.revokeObjectURL(url);
  }

  // Summary: if sprint active → sprint window (to-date if mid-sprint), else Mon..Sun of current week
  async function downloadSummaryPDF() {
    let start = weekStartMonday(date);
    let end   = weekEndFromStart(start);

    if (sprintActive) {
      start = sprintStart;
      const fullEnd = addDays(sprintStart, SPRINT_DAYS - 1);
      end = (new Date(today) < new Date(fullEnd)) ? today : fullEnd;
    }

    const entries = history
      .filter(h => h.date >= start && h.date <= end)
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    const doc = <SprintWrapPDF start={start} end={end} entries={entries} theme={theme} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sprintActive
      ? `Allyship_Sprint_${start}_to_${end}.pdf`
      : `Allyship_Weekly_${start}_to_${end}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // cadence / sprint calendars (.ics)
  function icsHeader() { return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Allyship Companion//EN','CALSCALE:GREGORIAN'].join('\r\n'); }
  function icsFooter() { return 'END:VCALENDAR'; }
  function fmtDate(dISO) { return dISO.replace(/-/g, ''); }
  function downloadICS(filename, vevents) {
    const content = [icsHeader(), ...vevents, icsFooter()].join('\r\n');
    const blob = new Blob([content], { type:'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  function downloadCadenceICS() {
    const dt = fmtDate(cadenceStart);
    let rrule = '';
    if (cadence === 'daily')   rrule = 'RRULE:FREQ=DAILY';
    if (cadence === 'weekly')  rrule = 'RRULE:FREQ=WEEKLY;BYDAY=MO';
    if (cadence === '3x')      rrule = 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR';
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

  /* -------------- UI state -------------- */
  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;
  const disableToday = reflection.trim().length === 0 || wordCount > 500;

  const weekStart = weekStartMonday(date);
  const weekEnd   = weekEndFromStart(weekStart);
  const weekHasEntries = history.some(h => h.date >= weekStart && h.date <= weekEnd);
  const sprintEndFull  = addDays(sprintStart, SPRINT_DAYS - 1);
  const sprintHasEntries = sprintActive &&
    history.some(h => h.date >= sprintStart && h.date <= (new Date(today) < new Date(sprintEndFull) ? today : sprintEndFull));
  const disableSummary = sprintActive ? !sprintHasEntries : !weekHasEntries;

  /* ---------------- render ---------------- */
  return (
    <main className="min-h-screen">
      <header className="w-full border-b border-gray-200 bg-white/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto container px-4 py-4">
          <span className="sr-only">Allyship Companion</span>
        </div>
      </header>

      <section className="mx-auto container px-4 py-8">
        {/* Title & intro */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-navyDeep mb-2">Allyship Companion</h1>
        <p className="text-lg text-gray-700 mb-3">A gentle nudge to practice allyship in three minutes or less.</p>
        <p className="text-gray-700 mb-6 max-w-2xl">
          Adjust your display, reflect on today’s prompt, then (optionally) set up reminders or a 14-day sprint.
          Everything stays on your device.
        </p>

        {/* Accessibility first */}
        <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Accessibility & display options</h2>
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

        {/* Prompt & Reflection */}
        <div className="grid gap-6">
          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <label className="flex items-center gap-2 font-semibold">
                Date
                <input type="date" className="ml-3 border rounded px-2 py-1" value={date} onChange={e=>setDate(e.target.value)} />
              </label>
              <label className="flex items-center gap-2 font-semibold">
                Theme
                <select className="ml-3 border rounded px-2 py-1" value={theme} onChange={e=>setTheme(e.target.value)}>
                  <option>All</option>
                  <option>Belonging</option>
                  <option>Bias</option>
                  <option>Visibility</option>
                  <option>Inclusion</option>
                  <option>Advocacy</option>
                </select>
              </label>
            </div>

            <div className="prompt-box rounded-md border border-tealSoft p-5">
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
              onChange={e=>setReflection(e.target.value)}
              placeholder="Type your reflection to the prompt above…"
            />
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span>{wordCount} / 500 words</span>
              <span className={wordCount > 500 ? 'text-red-600' : ''}>
                {wordCount > 500 ? 'Please shorten to 500 words.' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Downloads panel */}
        <div className="mt-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Download your reflections</h2>
          <p className="text-gray-700 mb-3 text-sm">
            Save your progress as PDFs. “Today” downloads what you’ve written above.
            “Summary” bundles entries you’ve saved — weekly (Mon–Sun) or your 14-day sprint if active.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={downloadTodayPDF}
              disabled={disableToday}
              className={`px-4 py-2 rounded-md text-white ${disableToday ? 'bg-gray-400' : 'bg-navyDeep hover:opacity-90'}`}
              title="Downloads a PDF of today’s reflection"
            >
              Download today’s reflection (PDF)
            </button>

            <button
              onClick={downloadSummaryPDF}
              disabled={disableSummary}
              className={`px-4 py-2 rounded-md border ${disableSummary ? 'opacity-50' : 'hover:bg-gray-50'}`}
              title={sprintActive
                ? 'Bundles entries from your sprint window'
                : 'Bundles entries saved this week (Mon–Sun)'}
            >
              Download summary {sprintActive ? '(sprint)' : '(this week)'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Tip: press “Today” after you write; summaries include entries already saved on this device.</p>
        </div>

        {/* Nudges & sprint */}
        <div className="mt-10 mb-6 p-4 rounded-lg border bg-white shadow-sm">
          <h2 className="font-semibold mb-3">Optional nudges & sprint</h2>

          <div className="grid gap-4 mb-5">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="font-semibold">Cadence:</span>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='daily'}  onChange={()=>setCadence('daily')} /> Daily</label>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='3x'}     onChange={()=>setCadence('3x')} /> 3× per week (Mon/Wed/Fri)</label>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='weekly'} onChange={()=>setCadence('weekly')} /> Weekly (Mon)</label>
              <label className="flex items-center gap-2"><input type="radio" name="cad" checked={cadence==='self'}   onChange={()=>setCadence('self')} /> Only when I choose</label>
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
          </div>

          <div>
            <h3 className="font-semibold mb-2">14-day sprint (one prompt per day)</h3>
            {!sprintActive ? (
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2">Start on
                  <input type="date" className="ml-2 border rounded px-2 py-1" value={sprintStart} onChange={e=>setSprintStart(e.target.value)} />
                </label>
                <button
                  onClick={() => { setSprintActive(true); try { localStorage.setItem('ac_sprint', JSON.stringify({active:true, startDate:sprintStart, days:SPRINT_DAYS})); } catch {} }}
                  className="px-3 py-1 rounded-md border"
                >
                  Start sprint
                </button>
                <button onClick={downloadSprintICS} className="px-3 py-1 rounded-md border">Download sprint calendar (.ics)</button>
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