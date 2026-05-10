import Link from "next/link"
import type { ReactNode } from "react"
import {
  LayoutDashboard,
  FileSearch,
  Radio,
  KanbanSquare,
  Sparkles,
  LineChart,
  Network,
  Settings,
  CommandIcon,
} from "lucide-react"
import { TICKER } from "@backend/data"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandMenu } from "@/components/command-menu"

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard, mono: "01" },
  { href: "/teardown", label: "Teardown", icon: FileSearch, mono: "02" },
  { href: "/channels", label: "Channels", icon: Radio, mono: "03" },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare, mono: "04" },
  { href: "/studio", label: "Studio", icon: Sparkles, mono: "05", live: true },
  { href: "/analytics", label: "Analytics", icon: LineChart, mono: "06" },
  { href: "/architecture", label: "Architecture", icon: Network, mono: "07" },
  { href: "/settings", label: "Settings", icon: Settings, mono: "08" },
  { href: "/sign-in", label: "Sign In", icon: CommandIcon, mono: "09" },
]

export function AppShell({
  children,
  active,
}: {
  children: ReactNode
  active: string
}) {
  return (
    <div className="min-h-svh bg-background bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="flex items-center gap-3 px-4 sm:px-6 h-12">
          <Link href="/" className="flex items-center gap-2">
            <img src="/frame_os_logo.svg" alt="Frame OS Logo" className="size-6 rounded-sm" />
            <span className="font-serif text-lg leading-none">
              Frame <span className="text-muted-foreground">OS</span>
            </span>
          </Link>

          <span className="hidden md:inline text-muted-foreground/60">/</span>
          <span className="hidden md:inline font-mono text-xs text-muted-foreground">
            org.frame · operator: harsh@ · v0.7.3
          </span>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <CommandMenu />
            <Link href="/channels" className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card border border-border hover:bg-accent/10 transition-colors">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" aria-hidden />
              <span className="font-mono text-[11px] text-muted-foreground">
                12 channels live
              </span>
            </Link>
          </div>
        </div>

        {/* Live ticker */}
        <div className="border-t border-border/60 bg-card/60 overflow-hidden">
          <div className="flex h-7 items-center">
            <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground border-r border-border/80 h-full grid place-items-center">
              live · ops feed
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div className="marquee-track flex gap-8 whitespace-nowrap font-mono text-[11px] text-muted-foreground py-1">
                {[...TICKER, ...TICKER].map((line, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-accent/70" />
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col border-r border-border/80 min-h-[calc(100svh-5rem)] sticky top-20 self-start bg-sidebar">
          <nav className="flex-1 py-4">
            <p className="px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Operator
            </p>
            <ul className="flex flex-col">
              {NAV.map((item) => {
                const isActive = item.href === active
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? "text-foreground bg-card"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-px bg-accent" aria-hidden />
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground/70 w-4">
                        {item.mono}
                      </span>
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                      {item.live && (
                        <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-accent">
                          ai
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 px-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Agents
              </p>
              <ul className="space-y-1.5 font-mono text-[11px]">
                {[
                  ["Atlas", "EN · finance + mindset"],
                  ["Ravi", "EN · history + interviews"],
                  ["Kira", "EN · soft + recipes"],
                  ["Nexus", "HI/EN · DTC + dev"],
                ].map(([name, desc]) => (
                  <li key={name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-foreground/70" />
                      {name}
                    </span>
                    <span className="text-muted-foreground/80 truncate max-w-[110px]">
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="m-3 p-3 rounded border border-border bg-card">
            <p className="font-serif text-base leading-tight">
              Autonomous media infrastructure.
              Twelve channels. Zero overhead.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              One operator · 12 channels · 26 reels/day.
            </p>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
