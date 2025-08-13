# Allyship Companion — Starter (Next.js + Tailwind + Client-side PDF)

A tiny, installable web app (PWA) that shows a daily allyship prompt, lets the user reflect (≤500 words), and downloads a clean A4 PDF — with **no login** and **no server**.

## Features
- Random-but-stable daily prompt (from your prompt list) based on the selected date
- Reflection box with live word count (limited to 500 words)
- Theme tag (Belonging / Bias / Visibility / Inclusion / Other)
- Auto filename from date + theme
- Client-side **@react-pdf/renderer** PDF (selectable text)
- Accessibility controls: dyslexia-friendly font toggle (Lexend), text size slider, high-contrast mode
- PWA bits: manifest + minimal service worker

## Quick start

1. Ensure **Node 18+** is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Deploy
- Create a new project on **Vercel**, import this repo, and deploy.
- Set your domain (optional). HTTPS/SSL handled automatically by Vercel.

## Notes
- All data stays on-device; we do not send anything to a server.
- To customize colors, edit **tailwind.config.js** and **app/globals.css**.
- To change prompts, edit **lib/prompts.js**.
- To brand the PDF further (fonts, logos), update **components/ReflectionPDF.jsx**.

## Accessibility
- Screen-reader friendly labels and keyboard navigation
- High contrast toggle, adjustable font size
- Dyslexia-friendly font option (Lexend). (For production, add a webfont import for Lexend or self-host.)

## License
MIT
