# GĐPT Anôma website

Official chapter site for Gia Đình Phật Tử Anôma. Astro + Tailwind tokens. Near-zero client JS.

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install |
| `bun run dev` | Dev server |
| `bun run build` | Typecheck + build |
| `bun run preview` | Preview production |

## Edit content

Markdown collections under `src/content/`:

- `schedule/` — Sunday handout rows
- `events/` — dated events
- `announcements/` — family notes
- `nganh/` — age groups
- `staff/` — leaders

Copy strings and contact facts: `src/i18n/site.ts`.  
Visual tokens: `DESIGN.md` + `src/styles/global.css`.

## Env (optional)

- `GOOGLE_CALENDAR_API_KEY` / `GOOGLE_CALENDAR_ID` — schedule page feed
- `SMTP_*` / `CONTACT_EMAIL_TO` — contact form mailer
