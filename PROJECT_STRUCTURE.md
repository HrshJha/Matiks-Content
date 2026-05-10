# AI Content Engine - Project Structure Documentation

## Overview

This is a **Next.js 16 (App Router)** application called **Matiks Content OS** - an AI-first content engine for managing multiple Instagram channels with automated content generation. It uses **Supabase** for backend/database and integrates with various AI providers for content generation.

---

## Directory Structure

```
ai-content-engine/
├── app/                    # Next.js App Router pages
├── components/             # React components (UI + custom)
├── hooks/                  # Custom React hooks
├── lib/                   # Core utilities, schemas, queries
├── public/                # Static assets
├── supabase/              # Database migrations
├── styles/                # Global styles
└── config files           # Root configuration files
```

---

## Root Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Project dependencies and scripts (Next.js, React 19, Supabase, Radix UI, Recharts, Vercel Analytics) |
| `tsconfig.json` | TypeScript configuration |
| `next.config.mjs` | Next.js configuration |
| `postcss.config.mjs` | PostCSS configuration for Tailwind CSS v4 |
| `components.json` | shadcn/ui component configuration |
| `vercel.json` | Vercel deployment configuration |
| `.env.example` | Example environment variables |
| `proxy.ts` | Proxy configuration |

---

## `/app` - Next.js Pages

The main application pages using App Router architecture.

### Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | **Home/Dashboard** - Shows overview of all channels, pipeline status, ticker events |
| `/studio` | `app/studio/page.tsx` | **Content Studio** - AI-powered reel generation interface |
| `/pipeline` | `app/pipeline/page.tsx` | **Pipeline View** - Kanban-style board showing all reels in production stages |
| `/channels` | `app/channels/page.tsx` | **Channels List** - View all 12 managed Instagram channels |
| `/channels/[id]` | `app/channels/[id]/page.tsx` | **Channel Detail** - Individual channel analytics and settings |
| `/analytics` | `app/analytics/page.tsx` | **Analytics Dashboard** - Metrics and performance charts |
| `/architecture` | `app/architecture/page.tsx` | **System Architecture** - Visual diagram of the content engine |
| `/teardown` | `app/teardown/page.tsx` | **Teardown View** - System breakdown and cleanup |
| `/settings` | `app/settings/page.tsx` | **Settings** - User preferences and configuration |
| `/sign-in` | `app/sign-in/page.tsx` | **Sign In** - Authentication page |

### API Routes

| Route | File | Description |
|-------|------|-------------|
| `/api/studio` | `app/api/studio/route.ts` | POST endpoint for AI content generation |

### Layout & Styling

| File | Description |
|------|-------------|
| `app/layout.tsx` | Root layout with fonts (Geist, Instrument Serif), viewport config, analytics |
| `app/globals.css` | Global CSS with Tailwind v4, CSS variables, shadcn theme |

---

## `/components` - React Components

### Custom Components

| Component | File | Description |
|-----------|------|-------------|
| `AppShell` | `components/app-shell.tsx` | Main application shell with navigation sidebar |
| `StudioClient` | `components/studio-client.tsx` | Client-side studio component for AI content generation |
| `ThemeProvider` | `components/theme-provider.tsx` | Theme context provider (light/dark mode via next-themes) |

### UI Components (`components/ui/`)

Reusable UI components built with **Radix UI** primitives and **shadcn/ui** design system.

#### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| `Accordion` | `components/ui/accordion.tsx` | Collapsible accordion (Radix) |
| `AspectRatio` | `components/ui/aspect-ratio.tsx` | Aspect ratio container |
| `Collapsible` | `components/ui/collapsible.tsx` | Collapsible content |
| `Resizable` | `components/ui/resizable.tsx` | Resizable panels (react-resizable-panels) |
| `ScrollArea` | `components/ui/scroll-area.tsx` | Custom scrollable area |
| `Sheet` | `components/ui/sheet.tsx` | Slide-out drawer (Vaul) |
| `Drawer` | `components/ui/drawer.tsx` | Mobile drawer (Vaul) |
| `Sidebar` | `components/ui/sidebar.tsx` | Navigation sidebar |

#### Form & Input Components

| Component | File | Description |
|-----------|------|-------------|
| `Button` | `components/ui/button.tsx` | Button with variants (default, destructive, outline, ghost, link) |
| `Input` | `components/ui/input.tsx` | Text input |
| `Textarea` | `components/ui/textarea.tsx` | Text area |
| `Select` | `components/ui/select.tsx` | Dropdown select (Radix) |
| `Checkbox` | `components/ui/checkbox.tsx` | Checkbox (Radix) |
| `Switch` | `components/ui/switch.tsx` | Toggle switch (Radix) |
| `Slider` | `components/ui/slider.tsx` | Range slider (Radix) |
| `InputGroup` | `components/ui/input-group.tsx` | Grouped inputs |
| `InputOTP` | `components/ui/input-otp.tsx` | One-time password input |
| `Field` | `components/ui/field.tsx` | Form field wrapper |
| `Label` | `components/ui/label.tsx` | Form label |
| `Form` | `components/ui/form.tsx` | React Hook Form integration |

#### Feedback Components

| Component | File | Description |
|-----------|------|-------------|
| `Alert` | `components/ui/alert.tsx` | Alert/notification |
| `AlertDialog` | `components/ui/alert-dialog.tsx` | Confirmation dialog |
| `Toast` | `components/ui/toast.tsx` | Toast notifications |
| `Toaster` | `components/ui/toaster.tsx` | Toast display area |
| `Sonner` | `components/ui/sonner.tsx` | Toast library integration |
| `Progress` | `components/ui/progress.tsx` | Progress bar |
| `Spinner` | `components/ui/spinner.tsx` | Loading spinner |

#### Navigation Components

| Component | File | Description |
|-----------|------|-------------|
| `NavigationMenu` | `components/ui/navigation-menu.tsx` | Navigation menu (Radix) |
| `Tabs` | `components/ui/tabs.tsx` | Tabbed interface (Radix) |
| `Breadcrumb` | `components/ui/breadcrumb.tsx` | Breadcrumb navigation |
| `Pagination` | `components/ui/pagination.tsx` | Pagination controls |
| `MenuBar` | `components/ui/menubar.tsx` | Menu bar (Radix) |
| `Command` | `components/ui/command.tsx` | Command palette (cmdk) |

#### Data Display Components

| Component | File | Description |
|-----------|------|-------------|
| `Card` | `components/ui/card.tsx` | Card container |
| `Avatar` | `components/ui/avatar.tsx` | User avatar |
| `Badge` | `components/ui/badge.tsx` | Status badge |
| `Table` | `components/ui/table.tsx` | Data table |
| `EmptyState` | `components/ui/empty.tsx` | Empty state placeholder |
| `HoverCard` | `components/ui/hover-card.tsx` | Hoverable card |
| `Chart` | `components/ui/chart.tsx` | Chart wrapper (Recharts) |
| `Calendar` | `components/ui/calendar.tsx` | Date calendar |
| `Kbd` | `components/ui/kbd.tsx` | Keyboard key display |

#### Overlay Components

| Component | File | Description |
|-----------|------|-------------|
| `Dialog` | `components/ui/dialog.tsx` | Modal dialog (Radix) |
| `Popover` | `components/ui/popover.tsx` | Popover overlay (Radix) |
| `Tooltip` | `components/ui/tooltip.tsx` | Tooltip (Radix) |
| `DropdownMenu` | `components/ui/dropdown-menu.tsx` | Dropdown menu (Radix) |
| `ContextMenu` | `components/ui/context-menu.tsx` | Right-click context menu (Radix) |

#### Interactive Components

| Component | File | Description |
|-----------|------|-------------|
| `Toggle` | `components/ui/toggle.tsx` | Toggle button (Radix) |
| `ToggleGroup` | `components/ui/toggle-group.tsx` | Group of toggles (Radix) |
| `RadioGroup` | `components/ui/radio-group.tsx` | Radio button group (Radix) |
| `ButtonGroup` | `components/ui/button-group.tsx` | Grouped buttons |
| `Separator` | `components/ui/separator.tsx` | Divider line |
| `Skeleton` | `components/ui/skeleton.tsx` | Loading skeleton |

#### Utility Hooks (in UI folder)

| Hook/File | File | Description |
|-----------|------|-------------|
| `use-toast` | `components/ui/use-toast.ts` | Toast hook for notifications |
| `use-mobile` | `components/ui/use-mobile.tsx` | Mobile detection hook |

---

## `/lib` - Core Utilities

### Authentication (`lib/auth/`)

| File | Description |
|------|-------------|
| `lib/auth/session.ts` | Session management |
| `lib/auth/encrypt.ts` | Encryption utilities |

### Supabase Integration (`lib/supabase/`)

| File | Description |
|------|-------------|
| `lib/supabase/client.ts` | Client-side Supabase client (browser) |
| `lib/supabase/server.ts` | Server-side Supabase client (SSR) |
| `lib/supabase/service.ts` | Service role client (admin operations) |

### Data Queries (`lib/queries/`)

| File | Description |
|------|-------------|
| `lib/queries/index.ts` | Query exports |
| `lib/queries/channels.ts` | Channel data queries |
| `lib/queries/reels.ts` | Reel data queries |
| `lib/queries/briefs.ts` | Brief/idea queries |
| `lib/queries/patterns.ts` | Content pattern queries |
| `lib/queries/metrics.ts` | Analytics/metrics queries |

### Schemas (`lib/schemas/`)

Zod validation schemas for type safety.

| File | Description |
|------|-------------|
| `lib/schemas/index.ts` | Schema exports |
| `lib/schemas/channel.ts` | Channel validation schema |
| `lib/schemas/reel.ts` | Reel validation schema |
| `lib/schemas/brief.ts` | Brief validation schema |
| `lib/schemas/reel-brief.ts` | Reel brief validation schema |
| `lib/schemas/pattern.ts` | Pattern validation schema |
| `lib/schemas/metric.ts` | Metric validation schema |
| `lib/schemas/studio-request.ts` | Studio API request validation |

### AI Providers (`lib/providers/`)

| File | Description |
|------|-------------|
| `lib/providers/index.ts` | Provider exports |
| `lib/providers/elevenlabs.ts` | ElevenLabs AI voice integration |
| `lib/providers/ig-graph.ts` | Instagram Graph API integration |
| `lib/providers/types.ts` | Provider type definitions |

### Utilities (`lib/`)

| File | Description |
|------|-------------|
| `lib/utils.ts` | General utilities (cn - classname merger, formatters) |
| `lib/data.ts` | **Mock operational data** - Channel, Reel, PipelineStage types and sample data for all 12 channels |

---

## `/hooks` - Custom React Hooks

| File | Description |
|------|-------------|
| `hooks/use-toast.ts` | Toast notification hook |
| `hooks/use-mobile.ts` | Mobile viewport detection hook |

---

## `/public` - Static Assets

| File | Description |
|------|-------------|
| `public/icon.svg` | App icon SVG |
| `public/icon-dark-32x32.png` | Dark mode icon 32x32 |
| `public/icon-light-32x32.png` | Light mode icon 32x32 |
| `public/apple-icon.png` | Apple touch icon |
| `public/placeholder.svg` | Placeholder image SVG |
| `public/placeholder.jpg` | Placeholder JPEG |
| `public/placeholder-user.jpg` | User placeholder |
| `public/placeholder-logo.png` | Logo placeholder |
| `public/placeholder-logo.svg` | Logo placeholder SVG |

---

## `/styles` - Global Styles

| File | Description |
|------|-------------|
| `styles/globals.css` | Additional global styles |

---

## `/supabase` - Database Migrations

SQL migrations for Supabase PostgreSQL database.

| File | Description |
|------|-------------|
| `supabase/migrations/0001_init.sql` | Initial schema setup |
| `supabase/migrations/0002_seed.sql` | Seed data |
| `supabase/migrations/0003_storage_buckets.sql` | Storage bucket configuration |

---

## Data Models (from `lib/data.ts`)

### Channel Type
```typescript
{
  id: string           // ch_01, ch_02, etc.
  handle: string       // Instagram handle
  niche: string        // Content niche
  language: "EN" | "HI" | "EN/HI"
  voice: string        // Voice configuration
  format: string       // Content format
  cadence: string      // Posts per day
  followers: number    // Follower count
  d7Reach: number      // 7-day reach
  engineStack: string[] // AI tools used
  ownerAgent: "Atlas" | "Ravi" | "Kira" | "Nexus"
  status: "live" | "ramping" | "paused"
  hookRate: number     // % viewers past 3s
  saveRate: number     // % saves / views
}
```

### Pipeline Stages
```typescript
| "idea"       // Auto · 5m  - Trend Bot
| "research"   // Auto · 8m  - Researcher
| "script"     // Auto · 4m  - Writer LLM
| "asset_gen"  // Queue · 6-14m - Render Farm
| "qa"         // Human · 30s - Operator
| "scheduled"  // Auto - Scheduler
| "posted"     // — - Graph API
| "analyzed"   // +24h - Feedback Bot
```

### Reel Type
```typescript
{
  id: string           // Unique reel ID
  channelId: string   // Parent channel
  hook: string        // Opening hook text
  stage: PipelineStage
  niche: string       // Content niche
  blocked?: string    // Blockage reason (if in QA)
  views?: number      // View count (if posted)
  saveRate?: number   // Save rate (if posted)
  scheduledFor?: string // Schedule time
  thumb?: string      // Thumbnail emoji/label
  scoreInbound?: number // Virality score 0-100
}
```

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4, CSS Variables |
| UI Components | Radix UI + shadcn/ui |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI/ML | Vercel AI SDK, OpenAI, ElevenLabs |
| Analytics | Vercel Analytics, Recharts |
| Forms | React Hook Form + Zod |
| State | React hooks (useState, useEffect) |
| Deployment | Vercel |

---

## 12 Instagram Channels

1. **ch_01** - ai.money.engine (Personal finance × AI, English, 184K followers)
2. **ch_02** - solo.builder.diary (Indie hacker journals, English, 92K followers)
3. **ch_03** - ceo.deepcuts (Founder interview clips, English, 311K followers)
4. **ch_04** - neon.recipes (60-second recipes, English, 421K followers)
5. **ch_05** - midnight.history (Dark history facts, English, 612K followers)
6. **ch_06** - quiet.therapy (Soft journaling prompts, English, 88K followers)
7. **ch_07** - iron.philosophy (Stoic/mindset, English, 503K followers)
8. **ch_08** - paisa.product (DTC product reviews, Hindi, 71K followers)
9. **ch_09** - dev.dispatch (Daily dev news, English, 142K followers)
10. **ch_10** - fit.protocol (Fitness science, English, 256K followers)
11. **ch_11** - vault.creators (Creator economy data, English, 49K followers)
12. **ch_12** - luxe.cars.daily (Supercar facts, English, 388K followers)

---

## Running the Project

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

---

## Environment Variables

Create `.env.local` based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# Add other API keys as needed
```