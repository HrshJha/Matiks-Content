"use client"

import { useState } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { reelBriefSchema } from "@/app/api/studio/route"
import { CHANNELS, NICHES, FORMATS } from "@backend/data"
import { Loader2, Wand2, Copy, Check, AlertTriangle, ChevronRight } from "lucide-react"

type Channel = (typeof CHANNELS)[number]

const TREND_PRESETS = [
  "use a contrarian shock-stat hook",
  "open with a confession / unexpected admission",
  "expose an invisible-cost most people miss",
  "ride a current news beat from this week",
  "tear down a popular piece of advice",
  "tell it as a 'I tried X for 30 days' format",
]

export function StudioClient() {
  const [channel, setChannel] = useState<Channel>(CHANNELS[0])
  const [niche, setNiche] = useState<string>(CHANNELS[0].niche)
  const [format, setFormat] = useState<string>(FORMATS[0])
  const [trend, setTrend] = useState<string>(TREND_PRESETS[0])
  const [language, setLanguage] = useState<"EN" | "HI">("EN")

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/studio",
    schema: reelBriefSchema,
  })

  const onGenerate = () => {
    submit({
      channelHandle: channel.handle,
      niche,
      format,
      trend,
      language,
    })
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[400px_1fr]">
      {/* Brief inputs */}
      <aside className="border-b lg:border-b-0 lg:border-r border-border p-6 sm:p-8 bg-card/30">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Brief
        </p>
        <h2 className="font-serif text-2xl mt-1">Tell the system what to ship.</h2>

        <div className="mt-6 space-y-4">
          <Field label="Channel">
            <select
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
              value={channel.id}
              onChange={(e) => {
                const c = CHANNELS.find((x) => x.id === e.target.value)!
                setChannel(c)
                setNiche(c.niche)
                setLanguage(c.language === "HI" ? "HI" : "EN")
              }}
            >
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>
                  @{c.handle} — {c.niche}
                </option>
              ))}
            </select>
            <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
              voice: {channel.voice} · stack: {channel.engineStack[0]}
            </p>
          </Field>

          <Field label="Niche / topic">
            <select
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Format">
            <select
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Angle / trend">
            <textarea
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
              value={trend}
              onChange={(e) => setTrend(e.target.value)}
              placeholder="What's the angle? Today's news beat, contrarian frame, etc."
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {TREND_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrend(t)}
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-background hover:bg-card text-muted-foreground hover:text-foreground"
                >
                  {t.slice(0, 28)}…
                </button>
              ))}
            </div>
          </Field>

          <Field label="Language">
            <div className="grid grid-cols-2 gap-1 rounded border border-border p-1 bg-background">
              {(["EN", "HI"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={`py-1.5 rounded text-sm font-mono ${
                    language === l
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onGenerate}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:bg-foreground/90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Streaming brief…
                </>
              ) : (
                <>
                  <Wand2 className="size-4" />
                  Generate reel brief
                </>
              )}
            </button>
            {isLoading && (
              <button
                type="button"
                onClick={() => stop()}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-card"
              >
                Stop
              </button>
            )}
          </div>

          {error && (
            <div className="mt-2 rounded border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {error.message}
            </div>
          )}
        </div>

        <div className="mt-8 rounded border border-border bg-background p-4 text-xs text-muted-foreground leading-relaxed">
          <p className="font-mono text-[10px] uppercase tracking-widest text-foreground">
            What this saves
          </p>
          <p className="mt-2">
            Manual: ~25 min/script × 26 reels/day = <span className="text-foreground">~10.8 hours/day</span>{" "}
            of writing. With this service, the operator only reviews the ~8% the QA
            judge flags — about <span className="text-foreground">14 minutes/day</span>.
          </p>
        </div>
      </aside>

      {/* Live brief output */}
      <div className="p-6 sm:p-8 min-h-[600px]">
        {!object && !isLoading && <EmptyState />}

        {(object || isLoading) && (
          <BriefOutput
            brief={object as Partial<typeof reelBriefSchema._type> | undefined}
            isStreaming={isLoading}
            channelHandle={channel.handle}
          />
        )}
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function EmptyState() {
  return (
    <div className="h-full min-h-[500px] grid place-items-center">
      <div className="max-w-md text-center">
        <div className="mx-auto size-10 rounded-full bg-foreground text-background grid place-items-center">
          <Wand2 className="size-4" />
        </div>
        <p className="mt-4 font-serif text-2xl leading-tight">
          Pick a channel, set an angle, hit generate.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          The system streams a structured object into the panel below — the
          same one our render workers consume next.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-2 text-left">
          {[
            ["3", "hook variants"],
            ["4", "voice beats"],
            ["1", "thumbnail prompt"],
          ].map(([n, l]) => (
            <div key={l} className="rounded border border-border bg-card p-3">
              <p className="font-serif text-2xl">{n}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BriefOutput({
  brief,
  isStreaming,
  channelHandle,
}: {
  brief: Partial<typeof reelBriefSchema._type> | undefined
  isStreaming: boolean
  channelHandle: string
}) {
  return (
    <div className="space-y-6">
      {/* Status bar */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
          <span
            className={`size-1.5 rounded-full ${
              isStreaming ? "bg-accent animate-pulse" : "bg-foreground"
            }`}
          />
          <span className="text-muted-foreground">
            {isStreaming ? "streaming" : "complete"}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground">
            channel @{channelHandle}
          </span>
          {brief?.cluster && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-foreground">cluster: {brief.cluster}</span>
            </>
          )}
        </div>
        {brief && !isStreaming && (
          <CopyJSON data={brief} />
        )}
      </div>

      {/* Hooks */}
      <Section
        n="01"
        title="Hooks (3 variants)"
        sub="A/B/n — same idea, three radically different first-3-seconds."
      >
        <ul className="space-y-2">
          {(brief?.hooks ?? [undefined, undefined, undefined]).map((h, i) => (
            <li
              key={i}
              className="rounded-md border border-border bg-card p-3 flex gap-3"
            >
              <span className="font-mono text-[10px] text-muted-foreground mt-0.5 w-6">
                {String.fromCharCode(65 + i)}
              </span>
              <p className="font-serif text-xl leading-snug text-pretty min-h-[1.5em]">
                {h ?? <Skeleton w="80%" />}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Script */}
      <Section
        n="02"
        title="Script"
        sub="The full voiceover, beat by beat, with B-roll prompts your render worker can consume directly."
      >
        <div className="rounded-md border border-border bg-card divide-y divide-border">
          <ScriptRow label="HOOK" line={brief?.script?.hook} time="0:00 – 0:07" />
          <ScriptRow label="CONTEXT" line={brief?.script?.context} time="0:07 – 0:15" />
          {(brief?.script?.beats ?? []).map((b, i) => (
            <ScriptRow
              key={i}
              label={`BEAT ${i + 1}`}
              line={b.line}
              broll={b.broll}
              time={`0:${(15 + i * 8).toString().padStart(2, "0")} – 0:${(
                23 +
                i * 8
              ).toString().padStart(2, "0")}`}
            />
          ))}
          {brief?.script?.beats && brief.script.beats.length === 0 && (
            <ScriptRow label="BEAT 1" line={undefined} time="…" />
          )}
          <ScriptRow label="CTA" line={brief?.script?.cta} time="0:43 – 0:48" />
        </div>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section n="03" title="Caption">
          <div className="rounded-md border border-border bg-card p-4 min-h-[80px]">
            <p className="text-sm leading-relaxed text-pretty">
              {brief?.caption ?? <Skeleton w="90%" />}
            </p>
          </div>
        </Section>

        <Section n="04" title="Hashtags">
          <div className="rounded-md border border-border bg-card p-4 min-h-[80px]">
            <div className="flex flex-wrap gap-1.5">
              {(brief?.hashtags ?? []).map((t, i) => (
                <span
                  key={i}
                  className="font-mono text-xs px-2 py-0.5 rounded border border-border bg-background"
                >
                  #{t}
                </span>
              ))}
              {!brief?.hashtags && <Skeleton w="60%" />}
            </div>
          </div>
        </Section>

        <Section n="05" title="Voice direction" sub="Goes to ElevenLabs.">
          <div className="rounded-md border border-border bg-card p-4 min-h-[80px]">
            <p className="text-sm leading-relaxed">
              {brief?.voiceDirection ?? <Skeleton w="80%" />}
            </p>
          </div>
        </Section>

        <Section n="06" title="Thumbnail prompt" sub="Goes to image gen.">
          <div className="rounded-md border border-border bg-card p-4 min-h-[80px]">
            <p className="font-mono text-xs leading-relaxed text-muted-foreground">
              {brief?.thumbnailPrompt ?? <Skeleton w="70%" />}
            </p>
          </div>
        </Section>
      </div>

      {/* QA risk */}
      <Section n="07" title="QA · risk note" sub="Auto-routed to operator if non-'none'.">
        <div
          className={`rounded-md border p-4 flex items-start gap-3 ${
            brief?.riskNotes && brief.riskNotes.toLowerCase() !== "none"
              ? "border-accent/50 bg-accent/5"
              : "border-border bg-card"
          }`}
        >
          <AlertTriangle
            className={`size-4 mt-0.5 ${
              brief?.riskNotes && brief.riskNotes.toLowerCase() !== "none"
                ? "text-accent"
                : "text-muted-foreground"
            }`}
          />
          <p className="text-sm">{brief?.riskNotes ?? <Skeleton w="50%" />}</p>
        </div>
      </Section>

      {/* Next-stage handoff */}
      {!isStreaming && brief?.script && (
        <div className="rounded-md border-2 border-foreground bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Next stage handoff
          </p>
          <p className="mt-2 font-serif text-xl leading-tight">
            This brief is now a job on the queue. Pipeline workers pick it up next.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <ChevronRight className="size-3" /> ElevenLabs · render voiceover (channel-locked voice ID)
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="size-3" /> Asset workers · resolve each B-roll prompt (Pexels → Veo 3 fallback)
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="size-3" /> Submagic · burn-in captions on brand kit
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="size-3" /> Scheduler · post via Instagram Graph API at the channel&apos;s reach window
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="size-3" /> Feedback bot · pull insights at +24h and rewrite tomorrow&apos;s idea pool
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

function Section({
  n,
  title,
  sub,
  children,
}: {
  n: string
  title: string
  sub?: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {n}
        </span>
        <h3 className="font-serif text-xl">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground">— {sub}</p>}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function ScriptRow({
  label,
  line,
  broll,
  time,
}: {
  label: string
  line?: string
  broll?: string
  time: string
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 p-3">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">
          {time}
        </p>
      </div>
      <div>
        <p className="text-sm leading-relaxed min-h-[1.25em]">
          {line ?? <Skeleton w="80%" />}
        </p>
        {broll && (
          <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
            ▸ b-roll: {broll}
          </p>
        )}
      </div>
    </div>
  )
}

function Skeleton({ w = "60%" }: { w?: string }) {
  return (
    <span
      className="inline-block bg-muted/80 rounded animate-pulse align-middle"
      style={{ width: w, height: "0.9em" }}
    />
  )
}

function CopyJSON({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1 font-mono text-[10px] hover:bg-card/60"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "copied" : "copy json"}
    </button>
  )
}
