```
╔══════════════════════════════════════════════╗
║  SofIA by Ataraxia IA Labs                   ║
║  Landing Page — Neofuturist Cinematic        ║
╚══════════════════════════════════════════════╝
```

> Your clinic never sleeps. SofIA operates it 24/7.

## Stack

```
HTML/CSS/JS       Static, zero frameworks
Tailwind CSS      Sentient Interface design system (via CDN)
Playwright        E2E testing (SEO, responsive, forms, accessibility)
Vercel            Hosting + CDN
```

## Structure

```
index.html          Main landing page (single file, cinematic design)
logo_mono_blanco.svg  Brand logo (v3, mono white)
og-image.png        Open Graph share image
favicon.ico         Favicon
tests/
  playwright/       248 E2E tests across 5 spec files
```

## Design

**Sentient Interface v1.0** — neofuturist cinematic treatment.

```
BACKGROUND    VOID #050507 with film grain overlay
TYPOGRAPHY    font-mono for all body text, font-display for hero
PALETTE       12-color closed system (purple #8B5CF6, cyan #06D6A0, amber #F5C842)
CTA           Solid bg-brand-purple, never gradient
SECTIONS      Full-viewport cinematic panels
PRICING       STARTER $119K · PRO $319K · BUSINESS $549K COP/mo
```

## Testing

```bash
npx playwright test             # All 248 tests
npx playwright test --project chromium
npx playwright test --project mobile
```

## Deploy

Vercel auto-deploys from `main`.

---

```
Ataraxia IA Labs SAS · Colombia
ataraxia.centrodecontrol@gmail.com
```
