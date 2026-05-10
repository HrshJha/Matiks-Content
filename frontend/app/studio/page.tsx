import { AppShell } from "@/components/app-shell"
import { StudioClient } from "@/components/studio-client"

export default function StudioPage() {
  return (
    <AppShell active="/studio">
      <section className="px-6 sm:px-10 py-12 border-b border-border">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>05 · Studio</span>
          <span className="size-1 rounded-full bg-accent" />
          <span className="text-accent">Part 2 deliverable · live</span>
        </div>
        <h1 className="mt-3 font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight">
          The bottleneck is scripting. <br className="hidden sm:block" />
          <span className="text-accent">So we automated it.</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base text-muted-foreground leading-relaxed">
          The single biggest manual cost in a 10+ channel setup is{" "}
          <em>writing 20+ scripts a day at a brand-tight voice</em>. This studio is
          the working prototype: pick a channel, give it an angle, and the
          system streams a production-ready reel brief —{" "}
          <span className="text-foreground">3 hook variants, a 4-beat script with B-roll prompts,
          caption, hashtags, voice direction, thumbnail prompt, and a QA-risk
          note</span> — in one structured object the rest of the pipeline can consume.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground/80">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">
            stack
          </span>{" "}
          Vercel AI SDK · @ai-sdk/google · gemini-2.5-flash · structured streaming via{" "}
          <code className="font-mono">Output.object()</code>. Replace the model
          string to A/B test Claude Opus or GPT-5 — same output schema.
        </p>
      </section>

      <StudioClient />
    </AppShell>
  )
}
