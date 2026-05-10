import { AppShell } from "@/components/app-shell"
import { STAGES } from "@backend/data"
import { getChannelsByOwner } from "@backend/queries/channels"
import { getReelsByOwner } from "@backend/queries/reels"
import { requireUserId } from "@backend/auth/session"
import { AlertCircle } from "lucide-react"

export default async function PipelinePage() {
  const userId = await requireUserId()
  const CHANNELS = await getChannelsByOwner(userId)
  const REELS = await getReelsByOwner(userId)

  function getChannel(id: string) {
    return CHANNELS.find((c) => c.id === id)
  }

  return (
    <AppShell active="/pipeline">
      <section className="px-6 sm:px-10 py-10 border-b border-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          04 · Pipeline
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          Every reel is an object on a queue.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          The kanban below isn&apos;t a Trello board — it&apos;s a live read of the
          jobs queue. Each stage has an SLA, an owner (mostly automated), and
          an exception path that pages a human only when needed.
        </p>
      </section>

      <section className="overflow-x-auto">
        <div className="flex gap-3 p-4 sm:p-6 min-w-max">
          {STAGES.map((stage) => {
            const cards = REELS.filter((r) => r.stage === stage.id)
            return (
              <div
                key={stage.id}
                className="w-[280px] shrink-0 rounded-md border border-border bg-card flex flex-col"
              >
                <div className="px-3 py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-lg leading-none">{stage.label}</p>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-foreground text-background">
                      {cards.length}
                    </span>
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                    {stage.sla} · {stage.owner}
                  </p>
                </div>
                <div className="p-2 flex flex-col gap-2 max-h-[1200px] overflow-y-auto">
                  {cards.length === 0 && (
                    <div className="text-center text-muted-foreground/60 font-mono text-[10px] py-6">
                      empty queue
                    </div>
                  )}
                  {cards.map((r) => {
                    const ch = getChannel(r.channelId)
                    return (
                      <article
                        key={r.id}
                        className="rounded border border-border bg-background hover:border-foreground/40 transition-colors p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {r.id.slice(-6)}
                          </span>
                          {r.scoreInbound != null && (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              p<sub>viral</sub>{" "}
                              <span className="text-foreground">{r.scoreInbound}</span>
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-snug text-pretty">
                          {r.hook}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {ch ? `@${ch.handle}` : `ch:${r.channelId?.slice(-6) ?? '?'}`}
                          </span>
                          {r.scheduledFor && (
                            <span className="font-mono text-[10px] text-foreground">
                              {r.scheduledFor}
                            </span>
                          )}
                          {r.views != null && (
                            <span className="font-mono text-[10px] text-foreground">
                              {(r.views / 1000).toFixed(0)}k · {r.saveRate}% save
                            </span>
                          )}
                        </div>
                        {r.blocked && (
                          <div className="mt-2 flex items-start gap-1.5 rounded-sm border border-accent/40 bg-accent/10 px-2 py-1.5">
                            <AlertCircle className="size-3 text-accent mt-0.5 shrink-0" />
                            <p className="font-mono text-[10px] text-accent leading-snug">
                              {r.blocked}
                            </p>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-border px-6 sm:px-10 py-8 grid sm:grid-cols-3 gap-3">
        {[
          ["96.3%", "auto-promotion rate", "stage transitions without human"],
          ["8%", "QA flag rate", "of reels need an operator look"],
          ["4 min", "operator time per reel", "only when QA flags"],
        ].map(([n, l, s]) => (
          <div key={l} className="rounded-md border border-border bg-card p-4">
            <p className="font-serif text-3xl">{n}</p>
            <p className="mt-1 text-sm">{l}</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{s}</p>
          </div>
        ))}
      </section>
    </AppShell>
  )
}
