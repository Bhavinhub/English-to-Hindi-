# Bolo English

**Hindi se English. Speak with confidence.** — a Hindi-to-English learning web app with guided lessons, speaking practice, translation practice, flashcards and progress tracking, built on a liquid-glass design system.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

No API keys are needed. The whole guest experience runs in the browser.

## What works locally (no external services)

| Feature | Notes |
| --- | --- |
| Landing page, onboarding, placement activity | Placement is a *suggested starting point*, not a certified test |
| 6 courses × 3 complete lessons | Objective, Hindi explanation, examples, pattern activity, dialogue, graded practice, speaking prompt, recap |
| Lesson completion, resume, bookmarks, next lesson | Saved in `localStorage` |
| Demo speaking practice (10 topics) | Curated **branching scripts**, labelled “Demo · scripted”, with scripted sample coaching |
| Hindi → English lookup + practice challenge | 34 curated examples, Devanagari and Romanized input, fuzzy matching |
| Flashcards (45 words) | Listen, save, search, Leitner-style spaced review |
| Dashboard, progress, achievements | Calculated only from real guest activity; new users start at zero |
| Settings | Interface language, explanation language, theme, reduced motion/transparency, speech speed, daily goal, export, clear data (with confirmation) |

### Browser speech features

- **Playback uses natural neural voices** generated with the free [`edge-tts`](https://github.com/rany2/edge-tts) tool (no API key): Indian English *Neerja* (female — Mira, examples, vocabulary) and *Prabhat* (male dialogue speakers). 469 clips live in `public/audio` and ship with the site, so no TTS service is called at runtime. Text without a clip (e.g. connected-AI replies) falls back to the best available browser voice. Audio never autoplays; a “read replies aloud” toggle is off by default, and the speed slider applies to clips too.
- **Microphone input** uses `SpeechRecognition` where supported (Chrome, Edge, Safari). It starts only after a tap and is aborted when you stop, end the session or leave the page. In some browsers (e.g. Chrome) audio is processed by the browser vendor’s servers — the UI says so. The app never stores audio.
- Everything has a typed fallback when speech isn’t supported or permission is denied.
- **No pronunciation scores** are shown: no assessment service is connected, and a transcript can’t measure pronunciation.

### Regenerating the voice clips

After editing lessons, phrases, vocabulary or conversations:

```bash
python3 -m pip install edge-tts
npm run audio:collect                  # writes scripts/audio-lines.json + src/data/audio-manifest.json
python3 scripts/generate_audio.py      # creates missing clips, removes unused ones
```

`edge-tts` uses Microsoft Edge's online read-aloud service, so generation needs internet; the generated MP3s work offline. To use a different free voice, change `FEMALE`/`MALE` in `scripts/collect-audio-lines.mts` (list voices with `edge-tts --list-voices`), delete `public/audio`, and run both steps again.

## Optional: connected AI

Copy `.env.example` to `.env.local` and set:

```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=...
AI_MODEL=claude-sonnet-5-5   # optional
```

This enables:
- **Connected AI** conversation mode (`POST /api/tutor`), clearly labelled separately from demo mode.
- Free-form Hindi → English translation for sentences outside the curated set (`POST /api/translate`).

Keys stay server-side (`src/server/ai.ts`, `server-only`). `GET /api/status` tells the client which services are configured.

## Not implemented (requires external services)

- Accounts and cross-device sync — swap `src/lib/persistence.ts` for an authenticated API.
- Payments — none. As a **launch offer every feature is free**; the offer text lives in `freeOffer` in `src/data/site.ts`.
- Pronunciation assessment — `pronunciationConfigured` in `src/server/ai.ts` stays `false` until a real service is added.
- Speaking partner matchmaking — shown as “Coming soon”; no simulated connection.

## Project structure

```
src/
  app/                  routes (/, onboarding, dashboard, courses, courses/[slug], learn/[lessonId],
                        practice, translate, vocabulary, progress, pricing, settings, api/*)
  components/glass/     GlassCard, GlassButton, GlassInput, GlassModal, GlassNavbar, GlassTabs
  components/layout/    App shell, floating navbar + mobile menu, mobile bottom nav, footer
  components/landing/   Landing sections, Mira tutor preview
  components/learn/     Onboarding, course library/detail, lesson player, dashboard, progress
  components/practice/  Practice workspace, translator, vocabulary
  data/                 courses, lessons, vocabulary, phrases, conversations, plans/FAQ/placement
  lib/                  store (localStorage), speech hooks, answer checking, copy (EN/HI UI text)
  server/ai.ts          server-side AI provider adapter
```

## Design system

Tokens live in `src/app/globals.css` (`:root` and `[data-theme="dark"]`). Glass surfaces use 70–85 % translucent backgrounds, 20 px blur with mild saturation, thin borders, an inner highlight and a non-interactive `::before` sheen. Nested surfaces (`.glass-inset`) skip the extra backdrop blur. There is an opaque fallback when `backdrop-filter` is unsupported, plus in-app **reduced transparency** and **reduced motion** settings (system `prefers-reduced-motion` is respected too). Fonts: Inter + Noto Sans Devanagari, with taller line height for Hindi.

## Content

Lessons teach meaning and context and accept multiple valid answers (case, punctuation, contractions, missing apostrophes and “please” are ignored). Accent differences are never treated as mistakes. All copy is original. There are no testimonials, user counts, ratings or fluency guarantees.
