# Salma, will you be my date? ❤️

A funny, viral single-page site built with **Next.js + TypeScript + Tailwind CSS + Framer Motion**.

It asks one important question — and the **NO** button is physically impossible to click.

## Features

- Full-screen romantic gradient background with soft glows
- Glassmorphism card, mobile-first and fully responsive
- Cute floating hearts animation (ambient, behind everything)
- **YES ❤️** and **NO 😢** buttons
- The NO button **runs away** the moment your cursor (or finger) gets close
  - Jumps to a random spot, always staying on screen
  - Smooth spring animation on every dodge
  - Works on desktop (hover/proximity) **and** mobile (tap/drag proximity)
- Each failed attempt:
  - changes the message above the buttons
  - grows the YES button a little
  - triggers a funny shake
  - increments an attempt counter
- When YES is clicked: confetti 🎉, a heart shower, and a celebration screen
- A "Start over" button to reset
- Respects `prefers-reduced-motion`

## Customize

Open `lib/config.ts` and change the `NAME` and any of the copy. That's it.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build a static site

```bash
npm run build
```

The fully static output is generated in the `out/` folder.

## Deploy to Netlify

**Option A — Git (recommended)**
1. Push this project to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**.
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Deploy. Done.

**Option B — Drag & drop**
1. Run `npm run build` locally.
2. Go to https://app.netlify.com/drop and drop the `out/` folder.

## Tech

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS 3
- Framer Motion 11
- canvas-confetti

Made with ❤️.
