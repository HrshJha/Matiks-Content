import { AppShell } from "@/components/app-shell"
import { CHANNELS } from "../../backend/lib/data"

export default function ChannelsPage() {
  return (
    <AppShell active="/channels">
      <section className="px-6 sm:px-10 py-12 border-b border-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          03 · Portfolio
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight">
          Channels are configs, not people.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
          Each channel is one Postgres row: niche, voice ID, format, model
          stack, hook whitelist, and posting cadence. Adding the 13th channel
          tomorrow is an INSERT, not a hire.
        </p>
      </section>

      <section className="p-6 sm:p-10">
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card/60 text-left">
                {[
                  "id",
                  "handle",
                  "niche",
                  "lang",
                  "voice",
                  "format",
                  "cadence",
                  "agent",
                  "stack",
                  "followers",
                  "hook %",
                  "save %",
                  "status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border last:border-b-0 hover:bg-card/40"
                >
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-3 py-3 font-mono text-xs">@{c.handle}</td>
                  <td className="px-3 py-3 max-w-[180px]">{c.niche}</td>
                  <td className="px-3 py-3 font-mono text-xs">{c.language}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                    {c.voice}
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground max-w-[220px] truncate">
                    {c.format}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{c.cadence}</td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-foreground text-background">
                      {c.ownerAgent}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {c.engineStack.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">
                    {(c.followers / 1000).toFixed(1)}k
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{c.hookRate}</td>
                  <td className="px-3 py-3 font-mono text-xs">{c.saveRate}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        c.status === "live"
                          ? "bg-foreground text-background"
                          : c.status === "ramping"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ["12", "channels", "live + ramping"],
            ["8", "niches", "EN-9 · HI-2 · mix-1"],
            ["4", "owner-agents", "Atlas · Ravi · Kira · Nexus"],
            ["26", "reels/day", "today's locked queue"],
          ].map(([n, l, s]) => (
            <div key={l} className="rounded-md border border-border bg-card p-4">
              <p className="font-serif text-4xl leading-none">{n}</p>
              <p className="mt-2 text-sm">{l}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
