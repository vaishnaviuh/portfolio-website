# Vaishnavi Hiremath: Portfolio

A static, single-page portfolio. It needs no build step: open `index.html` or host the folder.

## Files
| File | What it is |
|---|---|
| `index.html` | All page content (edit text here) |
| `styles.css` | Design: colours, type, layout, responsive rules |
| `main.js` | Animations, the WebGL background field, PCB hero layer, project rows, datasheet chip, progress bar |
| `404.html` | "No signal" error page |
| `lib/` | GSAP + ScrollTrigger, Lenis and Three.js, stored locally so the site never depends on a CDN |
| `Vaishnavi_Hiremath_Resume.pdf` | Résumé linked from the site (replace this file to update it) |

Fonts come from Google Fonts; everything else is served from this folder.

## What moves
- **Loading screen:** a firmware boot log with a 000→100 counter.
- **Hero:** generated PCB traces, pads and vias sit behind your name, with pulses of light
  travelling along a few tracks: single 1s and 0s that flip as they move. Behind the name are a
  hatched copper pour, a QFP footprint and silkscreen part labels. All of it is drawn by `initPCB()`
  in `main.js` from a fixed random seed, so it looks the same on every load; change the seed for a
  different board.
- **Background field:** one WebGL point field sits behind the whole page. It ripples where your
  cursor goes, and as you scroll it morphs: grid → rolling wave (About/Experience) →
  chip outline (Work/Skills) → the initials VH (Contact), while the camera tilts from a perspective
  view to a plan view. The shapes are drawn on a small 2D canvas in `main.js` (`chipPts`, `vhPts`);
  `targetsForProgress()` sets which scroll range each one appears in.
- **Work:** projects are rows that expand when clicked, each with its own animated drawing;
  on desktop a preview follows the cursor while hovering a row.
- **Progress bar:** an oscilloscope trace along the bottom showing the section and how far down you are.
- Everything degrades gracefully: without JavaScript or WebGL, the page is still complete and readable,
  and all motion is disabled for visitors who ask for reduced motion.

## Run locally
Double-clicking `index.html` works. For the most reliable results, use a local server:

```
python -m http.server 8000
```
Then open http://localhost:8000

## Deploy (free)
- **Netlify:** drag this folder onto https://app.netlify.com/drop
- **Vercel:** `npx vercel` inside this folder
- **GitHub Pages:** push the folder to a repo named `vaishnaviuh.github.io`. The site will be at https://vaishnaviuh.github.io

Upload only the site files (`index.html`, `styles.css`, `main.js`, `404.html`, `lib/`, the résumé PDF).
Do not upload the `resume/` folder: it holds your older résumés and someone else's.

## Common edits
- **After editing `styles.css` or `main.js`:** bump the `?v=3` number on their links near the
  top and bottom of `index.html`, so visitors' browsers fetch the new version instead of a cached one
- **Colours:** `:root` variables at the top of `styles.css` (`--copper` is the accent)
- **Add a project:** copy one `<li class="project">` block in `index.html`, and set `data-art` to
  `sphere`, `pulse`, `hand` or `pixels`
- **Skills table:** the `<table class="datasheet">` rows in `index.html`
- **Morph shapes:** `chipPts` and `vhPts` near the top of the field section in `main.js` are drawn on a
  small 2D canvas; draw anything there and the dots will form it
- **When each shape appears:** `targetsForProgress()` in `main.js` maps scroll position (0–1) to each shape
