# CSE Motors — Web Application

A Node.js / Express / EJS car dealership web application built for CSE Web Backend Development.

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Run in Production

```bash
npm start
```

The server starts on `http://localhost:5500` by default.

## Project Structure

```
cse-motors/
├── public/
│   ├── css/
│   │   └── styles.css       ← Mobile-first external stylesheet
│   ├── images/
│   │   ├── vehicles/        ← Hero/featured vehicle images
│   │   └── upgrades/        ← Vehicle category thumbnail images
│   └── js/
│       └── nav.js           ← Mobile navigation toggle
├── routes/
│   ├── index.js             ← Home (/) route
│   └── static.js            ← Static file serving
├── utilities/
│   └── index.js             ← Shared helpers (nav builder, error wrapper)
├── views/
│   ├── layouts/
│   │   └── layout.ejs       ← Main EJS layout
│   ├── partials/
│   │   ├── head.ejs         ← <head> partial
│   │   ├── header.ejs       ← Site header partial
│   │   ├── navigation.ejs   ← Navigation partial
│   │   └── footer.ejs       ← Footer partial
│   ├── errors/
│   │   └── error.ejs        ← Error page view
│   └── index.ejs            ← Home page view
├── server.js                ← Express app entry point
├── package.json
└── .gitignore
```

## Replacing Placeholder Images

The `/public/images/` folder contains SVG placeholder images.  
Replace them with real vehicle photos from your course's starter package:

- `public/images/vehicles/delorean.jpg` — hero/featured vehicle
- `public/images/upgrades/sedan.jpg`
- `public/images/upgrades/suv.jpg`
- `public/images/upgrades/truck.jpg`
- `public/images/upgrades/electric.jpg`

## Deployment (Render.com)

1. Push project to GitHub.
2. Create a new **Web Service** on Render.com.
3. Connect your GitHub repo.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Set **Environment Variable**: `NODE_ENV=production`
7. Deploy — your app will be live at your Render URL.

## Accessibility

- WCAG AA color contrast on all text elements
- Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Skip-to-content link for keyboard users
- ARIA labels on interactive elements
- Visible `:focus-visible` ring on all interactive elements

## Assignment Checklist

- [x] EJS partials: head, header, navigation, footer
- [x] `express-ejs-layouts` layout file
- [x] Index route delivers home view
- [x] Mobile-first external CSS in `public/css/`
- [x] Responsive layout with media queries for larger screens
- [x] Professional fonts (Playfair Display + Source Sans 3)
- [x] Accessible color scheme (WCAG AA compliant)
- [x] No horizontal scroll on any device size
- [x] `media="screen"` attribute on CSS link
- [x] Semantic HTML5 structure
- [x] WAVE-compatible (no accessibility or contrast errors)
