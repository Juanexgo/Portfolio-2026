# Juan Canul — Portfolio

Production-ready, content-driven portfolio for a Full Stack Software Engineer.
Built with **Next.js 16** (App Router + Turbopack), **React 19**, TypeScript,
Tailwind, shadcn-style primitives and Framer Motion.

The portfolio is **fully driven by a single content file** — UI components do
not contain visible copy. Edit one file (or use the visual `/admin` editor) to
update everything you see.

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # set ADMIN_PASSWORD inside
npm run dev                        # http://localhost:3000
```

Then open:

- `http://localhost:3000` — the portfolio
- `http://localhost:3000/admin` — the visual content editor

---

## Editing content

### Option A — Edit the content file directly (recommended)

Open [`src/content/portfolio.ts`](src/content/portfolio.ts). It exports a single
`portfolioContent` object that drives every visible part of the site:

| Field             | What it controls                                                |
| ----------------- | --------------------------------------------------------------- |
| `personal`        | Name, role, email, resume URL, location, availability pill      |
| `nav`             | Top nav links, brand, CTA button                                |
| `hero`            | Headline, subtitle, description, CTAs, stack pills              |
| `about`           | About section heading + the 8 focus-area cards                  |
| `experience`      | Timeline roles, highlights, metrics, stack badges               |
| `projects`        | Project bento grid: name, description, capabilities, etc.       |
| `architecture`    | System architecture layers + legend                             |
| `principles`      | Engineering principles cards                                    |
| `techStack`       | Tech stack categories and items                                 |
| `contact`         | Contact section + channel links                                 |
| `footer`          | Footer tagline, status, copyright, socials                      |

All field shapes are typed in [`src/types/portfolio.ts`](src/types/portfolio.ts)
— your editor will autocomplete and error-check as you go.

Save the file — the dev server hot-reloads instantly.

### Option B — Use the `/admin` visual editor

A built-in form-based editor lives at [`/admin`](http://localhost:3000/admin).
It lets you:

- Edit every field with form inputs (text, textarea, icon picker, ordered lists)
- Add / remove / reorder array items (focus areas, roles, projects, etc.)
- **Preview** your edits as a fully rendered portfolio
- **Copy JSON** of the edited content to your clipboard
- **Download JSON** as a file
- View the raw JSON output in a collapsible panel

Edits live in your browser only — they are not persisted to a database. To make
them permanent, copy the JSON and paste it into the `portfolioContent` object
literal in `src/content/portfolio.ts`.

#### Admin authentication

The `/admin` route is gated by a password set in `.env.local`:

```bash
# .env.local
ADMIN_PASSWORD=your-strong-password-here
```

If `ADMIN_PASSWORD` is not set, the login screen will display a setup notice and
deny access. **Set this before deploying to production.**

The cookie is `httpOnly`, `sameSite=lax`, expires in 24h, and is `secure` in
production.

---

## Icons

The content layer uses string icon names (e.g. `"HeartPulse"`) because content
must stay JSON-serializable. Names are mapped to Lucide React components in
[`lib/icons.tsx`](lib/icons.tsx).

Render with the `<Icon name="..." />` wrapper — it goes through
`React.createElement` and satisfies React 19's strict
`react-hooks/static-components` rule. (Assigning `const X = getIcon(name)` and
using `<X />` in JSX is forbidden in React 19.)

To use a new icon:

1. Add the import + entry to the `icons` map in `lib/icons.tsx`.
2. Reference it by name (string) anywhere in `src/content/portfolio.ts`.

The admin editor's icon inputs autocomplete from the registry.

---

## Updating your resume

Replace [`public/resume.pdf`](public/resume.pdf) with your real PDF (same
filename). The "Download Resume" buttons reference it via the
`personal.resumeUrl` content field (default: `/resume.pdf`).

If you want to host the resume externally, change `personal.resumeUrl` and the
relevant CTA `href` fields to a full URL — and set `external: true` on the CTA
buttons.

---

## Project structure

```
.
├── app/
│   ├── admin/                # /admin route — auth + visual editor
│   │   ├── page.tsx          # server component (auth gate)
│   │   ├── login-form.tsx    # password form (client)
│   │   ├── admin-editor.tsx  # full editor + preview (client)
│   │   ├── editor-primitives.tsx  # shared form widgets
│   │   └── actions.ts        # login/logout server actions
│   ├── layout.tsx            # metadata pulled from content
│   ├── page.tsx              # homepage wires content → sections
│   ├── not-found.tsx
│   └── globals.css
├── components/               # Section components (UI only — no copy)
│   ├── nav.tsx
│   ├── hero.tsx
│   ├── about.tsx
│   ├── experience.tsx
│   ├── projects.tsx
│   ├── architecture.tsx
│   ├── principles.tsx
│   ├── tech-stack.tsx
│   ├── contact.tsx
│   ├── footer.tsx
│   ├── ui/                   # Button, Badge, Card, SectionHeading
│   └── visuals/              # Decorative dashboard mockups
├── lib/
│   ├── utils.ts              # cn() class helper
│   └── icons.tsx             # Lucide icon registry + <Icon> wrapper
└── src/
    ├── content/portfolio.ts  # ★ Single source of truth for content
    └── types/portfolio.ts    # ★ TypeScript types for all content
```

★ = files you'll typically edit.

---

## Decorative dashboard mockups

The illustrative dashboards in the Hero and Project cards
(`components/visuals/*.tsx`) intentionally contain illustrative labels (e.g.
"us-east-1", "SOC2", fake order IDs). These are **visual design**, not personal
content, so they're not exposed in the content layer. Edit them in
`components/visuals/` if you want to change the look.

---

## Scripts

```bash
npm run dev         # local dev server
npm run build       # production build (also typechecks + lints)
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. **Set environment variables** in Project Settings → Environment Variables:
   - `ADMIN_PASSWORD` — strong password for `/admin`
4. Deploy. Subsequent pushes auto-deploy.

> ⚠️ If you skip step 3, the `/admin` login will refuse to authenticate and
> display a setup notice — which is the safe default.

After your first deploy:

- The `/admin` route is `force-dynamic` (it reads cookies/env at request time),
  so it won't be statically generated even though every other page is static.
- The portfolio itself remains static / fully prerendered.

---

## Tech reference

- **Next.js 16** (App Router, Turbopack) — server components for the page,
  client components for interactive sections, server actions for the admin
  login/logout
- **React 19** — uses `useFormState`/`useFormStatus`; async `cookies()` API
- **TypeScript** in strict mode
- **Tailwind CSS** with custom design tokens (see `tailwind.config.ts` +
  `app/globals.css`)
- **shadcn/ui** primitives (Button, Badge, Card) — composed in
  `components/ui/`
- **Framer Motion** for scroll reveals
- **Lucide React** icons via the [`lib/icons.tsx`](lib/icons.tsx) registry.
  Always render via `<Icon name="..." />` — assigning `getIcon(...)` to a
  component variable trips React 19's `react-hooks/static-components` rule.
- **ESLint flat config** ([`eslint.config.mjs`](eslint.config.mjs)) — `next lint`
  was removed in Next 16, so the `lint` script runs `eslint .` directly
- **Geist Sans + Mono** via `next/font`

Node.js 20.9+ is required by Next 16.

No database, CMS, or external services are required to run or deploy this
portfolio. The only environment variable is `ADMIN_PASSWORD`.
