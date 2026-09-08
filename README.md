# lightor-site

The public marketing page for **Lightor** — booking websites and appointment
management for small service businesses — served at `lightor.app`.

It is deliberately separate from the three product apps:

| App | Address | What it is |
|---|---|---|
| **this repo** | `lightor.app` | public marketing page, no login |
| `lightor-register` | `register.lightor.app` | AI onboarding wizard and signup |
| `lightor-front` | `<business>.lightor.app` | the generated booking sites |
| `lightor-dashboard` | `dashboard.lightor.app` | the owner portal |

## Why it exists

Beyond marketing, two external reviews require a public page that explains the
product without a login:

- **Google's OAuth branding verification**, which gates Google sign-in for the
  mobile app. It rejected `dashboard.lightor.app` for being behind a login and
  for not explaining the app's purpose.
- **Apple's App Store submission**, which requires a marketing URL.

Both are automated checks that may not run JavaScript, so `index.html` carries a
real `<noscript>` summary of the product. **Keep it in step with the hero and
feature copy** — it is what those reviewers actually read.

## Stack

React 18 + Vite + TypeScript + Tailwind, `react-i18next` (Hebrew and English,
right-to-left included), framer-motion, and a Vanta/three.js hero background.

```bash
npm install
npm run dev      # http://localhost:5177
npm run build    # -> dist/
```

All page copy lives in `src/i18n/locales/{en,he}.ts`. The three getting-started
steps carry their own images and live in `src/components/Projects.tsx`.

## History

Adapted from an unused commercial agency site. Two things were removed rather
than rebranded: a contact form that called the Meta Graph API directly from the
browser using a WhatsApp token read from `import.meta.env` — which shipped that
token inside the public bundle — and the tracked `.env` that held it. This repo
starts from a fresh history so neither is carried over.
