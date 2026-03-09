# AGENTS.md -- Read Before Working on This Repo
> Universal entry point for ANY AI agent (Claude, Gemini, Copilot, Codeium, Cursor, etc.)

## What Is This?
**ataraxia-landing** -- Static HTML/CSS/JS landing page for Ataraxia IA Labs, deployed on Cloudflare Pages.

## Full Documentation

All detailed docs live in the **backend repo** (ataraxia-backend-core):
- GitHub: `Ataraxia-AI-Labs/ataraxia-backend-core/docs/agents/`

Most relevant files:
- `00_START_HERE.md` -- Overview, rules, architecture
- `03_BRAND_MINDSET.md` -- Visual identity, sales psychology, pricing
- `05_BACKLOG_ROADMAP.md` -- Pending items

## Key Info
- **URL**: https://ataraxiaialabs.ai
- **Deploy**: Cloudflare Pages (auto-deploy on push)
- **No build step** -- pure static files
- **Brand**: "Ataraxia IA Labs" (company name on landing, NOT "SofIA")

## Known Issues
- GA4 + Meta Pixel DISABLED (need activation)
- Sitemap has wrong domain (ataraxia.ai vs ataraxiaialabs.ai)
- Supabase anon key hardcoded in HTML (should be config)
- WhatsApp button points to placeholder number
- Plan name is STARTER (not Basic)
