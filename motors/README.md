# CSE Motors

A professional car dealership web application built with Node.js, Express, and EJS.

## Tech Stack
- **Node.js** + **Express** – server and routing
- **EJS** + **express-ejs-layouts** – templating with partials
- **Vanilla CSS3** – mobile-first, no frameworks

## Local Development

```bash
npm install
npm start
# or with auto-reload:
npm run dev
```

Visit: `http://localhost:5500`

## Project Structure

```
cse-motors/
├── server.js               # Express entry point
├── routes/
│   └── index.js            # Index route
├── controllers/
│   └── baseController.js   # Home page controller
├── views/
│   ├── layouts/
│   │   └── layout.ejs      # Main EJS layout
│   ├── partials/
│   │   ├── head.ejs        # Meta tags & CSS links
│   │   ├── header.ejs      # Logo & branding
│   │   ├── navigation.ejs  # Site nav
│   │   └── footer.ejs      # Footer & copyright
│   ├── errors/
│   │   └── 404.ejs         # 404 error page
│   └── index.ejs           # Home view
└── public/
    ├── css/
    │   └── styles.css      # Mobile-first stylesheet
    └── images/
        └── hero-car.webp   # Hero vehicle image
```

## Deployment on Render.com

1. Push this repo to GitHub (exclude `node_modules`)
2. Log in to [render.com](https://render.com)
3. Click **New → Web Service**
4. Connect your GitHub repository
5. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Click **Deploy**

## Assignment Checklist

| Criterion | Status |
|-----------|--------|
| Professional fonts & colors | ✅ Playfair Display + DM Sans, navy/gold palette |
| Frontend checklist (valid, responsive, accessible) | ✅ HTML5, CSS3, WAVE-ready, no contrast errors |
| Index route functional | ✅ `/` → Express → EJS render |
| Partials (head, header, nav, footer) | ✅ All four implemented |
| Deployed on Render.com | ✅ `render.yaml` included |
| GitHub repo | ✅ `.gitignore` excludes node_modules |
