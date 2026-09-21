# Vaishnavi Hiremath: Portfolio

Personal portfolio of **Vaishnavi Hiremath**, an Electronics & Communication graduate working on
embedded systems: firmware, communication protocols, PCB design and board bring-up.

It is a static, single-page site with no build step: plain HTML, CSS and JavaScript.

## Tech stack
- **HTML / CSS / vanilla JS**: no framework, no bundler
- **[GSAP](https://gsap.com/) + ScrollTrigger**: scroll and entrance animations
- **[Lenis](https://lenis.darkroom.engineering/)**: smooth scrolling
- **[Three.js](https://threejs.org/)**: the WebGL point-field background (loaded on demand)
- **Google Fonts**: Archivo, Instrument Serif, JetBrains Mono

All libraries are stored in `js/lib/`, so the site doesn't depend on a CDN.

## Project structure
```
.
├── index.html                          # All page content (edit text here)
├── 404.html                            # "No signal" error page
├── css/
│   └── styles.css                      # Colours, type, layout, responsive rules
├── js/
│   ├── main.js                         # Animations, WebGL field, PCB hero, project rows, progress bar
│   └── lib/                            # GSAP, ScrollTrigger, Lenis, Three.js
└── assets/
    └── Vaishnavi_Hiremath_Resume.pdf   # Résumé linked from the site
```

## Features
- **Loading screen:** a firmware boot log with a 000→100 counter.
- **Hero:** generated PCB traces, pads and vias behind the name, with pulses of 1s and 0s travelling
  along the tracks. It is drawn by `initPCB()` in `js/main.js` from a fixed random seed, so it looks the
  same on every load.
- **Background field:** one WebGL point field behind the whole page. It ripples around the cursor
  and morphs as you scroll: grid → rolling wave → a quadcopter with sound rings pulsing from its
  rotors (Experience) → chip outline → the initials "VH".
- **Work:** project rows that expand when clicked, each with its own animated drawing. On desktop a
  preview follows the cursor.
- **Listening demo:** opening the 3D Sound Source Localization project starts a live 2D demo with
  8 microphones, wavefronts from the cursor (or a tap on phones) and a least-squares
  time-difference-of-arrival bearing estimate (`initListeningDemo()` in `js/main.js`). It only runs
  while the panel is open.
- **Progress bar:** an oscilloscope trace along the bottom showing the current section.
- **Accessible:** without JavaScript or WebGL the page is still complete and readable, and all
  motion is turned off for visitors who ask for reduced motion.

## Run locally
Double-clicking `index.html` works. For the most reliable results, use a local server:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy on Vercel
1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), choose **Add New… → Project** and import the repo.
3. Set **Framework Preset** to **Other**. Leave the build command and output directory empty.
4. Click **Deploy**.

Every push to `main` redeploys the site automatically. `404.html` is used for missing pages.

The site also works as-is on Netlify or GitHub Pages.

## Editing
| To change | Where |
|---|---|
| Text and sections | `index.html` |
| Colours | `:root` variables at the top of `css/styles.css` (`--copper` is the accent) |
| Projects | Copy a `<li class="project">` block in `index.html`; set `data-art` to `sphere`, `pulse`, `hand` or `pixels` |
| Skills table | The `<table class="datasheet">` rows in `index.html` |
| Résumé | Replace `assets/Vaishnavi_Hiremath_Resume.pdf` (keep the same file name) |
| Morph shapes | `dronePts`, `chipPts` and `vhPts` in `js/main.js`; `targetsForProgress()` sets when each appears |

**After editing `css/styles.css` or `js/main.js`**, bump the `?v=4` number on their links in `index.html`
so visitors' browsers load the new version instead of a cached one.

## Contact
- GitHub: [@vaishnaviuh](https://github.com/vaishnaviuh)
- LinkedIn: [vaishnaviuh](https://www.linkedin.com/in/vaishnaviuh)
- Email: vaishhiremath2004@gmail.com
