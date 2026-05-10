import { AppShell } from "@/components/app-shell"
import { ArrowDown, AlertTriangle, Wrench, Repeat } from "lucide-react"

function H2({ children, num }: { children: React.ReactNode; num: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {num}
      </span>
      <h2 className="font-serif text-3xl tracking-tight">{children}</h2>
    </div>
  )
}

function StepRow({
  step,
  title,
  detail,
  tools,
}: {
  step: string
  title: string
  detail: string
  tools: string[]
}) {
  return (
    <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[80px_1fr_280px] gap-4 py-4 border-t border-border first:border-t-0">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pt-0.5">
        {step}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{detail}</p>
      </div>
      <div className="sm:col-start-3 col-span-2 sm:col-span-1 flex flex-wrap gap-1">
        {tools.map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-card text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function Bottleneck({
  title,
  detail,
  fix,
}: { title: string; detail: string; fix: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-3.5 text-accent" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Bottleneck
        </p>
      </div>
      <p className="mt-2 font-medium text-sm">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{detail}</p>
      <div className="mt-3 flex items-start gap-2 border-t border-border pt-3">
        <Wrench className="size-3.5 text-foreground mt-0.5 shrink-0" />
        <p className="text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-1">
            How I'd fix it:
          </span>
          {fix}
        </p>
      </div>
    </div>
  )
}

export default function TeardownPage() {
  return (
    <AppShell active="/teardown">
      <article className="px-6 sm:px-10 lg:px-16 py-12 max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Part 1 · Reverse-engineering
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-balance">
          What's actually under the hood of a viral content factory.
        </h1>
        <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-3xl">
          I spent some time looking at how modern AI-native pages operate. Most people think they just "post good content," but that's the wrong framing. These aren't content creators. They're automated workflow systems. I broke down two common archetypes to figure out how they route inputs, pick models, handle rate limits, and where humans actually fit into the loop.
        </p>

        {/* TOC */}
        <nav className="mt-10 flex flex-wrap gap-2 text-sm">
          {[
            ["A", "Faceless page architecture"],
            ["B", "AI-UGC DTC brands"],
            ["C", "How to build this natively"],
          ].map(([n, t]) => (
            <a
              key={n}
              href={`#case-${n}`}
              className="px-3 py-1.5 rounded-full border border-border bg-card hover:bg-card/60 transition-colors"
            >
              <span className="font-mono text-[10px] text-muted-foreground mr-2">
                {n}
              </span>
              {t}
            </a>
          ))}
        </nav>

        {/* CASE A */}
        <section id="case-A" className="mt-16">
          <H2 num="Case A">
            Faceless AI pages (the finance/tech bro archetype)
          </H2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            You've probably seen these everywhere. It's the standard template on Reels right now: a personal finance or AI-tools page posting 2 or 3 times a day. They all share the same visual language. Bold, burned-in captions. Stock or generic AI b-roll in the background. An AI male voiceover with a very specific cadence. And they always use a 7-second hook that looks like "X things you didn't know" or "Stop doing X right now." It's highly predictable, which means it's highly programmable.
          </p>

          <div className="mt-8 rounded-md border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="font-mono text-xs text-muted-foreground">
                Inferred workflow
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                pipeline
              </p>
            </div>
            <div className="px-4">
              <StepRow
                step="Ingest"
                title="Mining for topics"
                detail="They likely scrape a few hundred high-performing finance or tech reels daily. Add in some top posts from Reddit and Google Trends. They probably dump all the hooks, captions, and proxy metrics (like view-to-like ratios) into a database to figure out what's hitting right now."
                tools={["Scraping cluster", "Postgres"]}
              />
              <StepRow
                step="Select"
                title="Hook clustering"
                detail="Based on the output patterns, an LLM groups the scraped hooks into a few reusable templates (like 'shocking-stat' or 'hidden-cost'). It ranks today's topics by novelty and matches them to a hook template. The result is a batch of idea cards ready for production."
                tools={["LLM router", "Vector DB"]}
              />
              <StepRow
                step="Script"
                title="Writing with strict constraints"
                detail="The script generation seems highly constrained. Hook under 7 seconds. Context under 8 seconds. A few beats of value, then a quick call to action. They probably force the LLM to output JSON so the downstream systems can parse the beats easily."
                tools={["LLM (Writer)", "Structured output"]}
              />
              <StepRow
                step="Voice"
                title="TTS generation"
                detail="Almost certainly ElevenLabs or a similar high-quality TTS. They lock in one specific voice ID per channel for consistency. The system generates the audio and probably extracts the timecodes for the captioner later."
                tools={["TTS API"]}
              />
              <StepRow
                step="Assets"
                title="B-roll fetching"
                detail="For background visuals, they probably hit a stock API first because it's cheap and fast. If that fails, it falls back to an AI video generator. Most faceless pages seem to overuse AI b-roll, which probably hurts retention after a while. It gets uncanny."
                tools={["Stock API", "Video Gen API"]}
              />
              <StepRow
                step="Assemble"
                title="Putting it together"
                detail="A programmatic video editor stitches the timeline: audio track, video clips, and burned-in captions. The styling is usually hardcoded. My guess is 90% of these videos render and queue up without anyone ever looking at them."
                tools={["Auto-editor"]}
              />
              <StepRow
                step="QA"
                title="The human exception loop"
                detail="Operators likely only step in when something breaks. Maybe an automated judge flags a video for weird lip-sync, or the claim density is too high, or it hits a brand-safety filter. Everything else goes straight to the schedule."
                tools={["LLM (Judge)", "Safety filters"]}
              />
              <StepRow
                step="Post"
                title="Publishing and feedback"
                detail="They post via official APIs or fallback schedulers. After a day, a cron job pulls the metrics. The best performing hooks get fed back into the idea pool for the next day, closing the loop automatically."
                tools={["Social APIs", "Cron"]}
              />
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Bottleneck
              title="Audience saturation"
              detail="Hearing the exact same AI voice read the exact same hook templates gets old fast. Engagement probably drops off a cliff after a few months."
              fix="Rotate a few different voice profiles per channel. Add logic to prevent the same hook template from being used too often in a given week."
            />
            <Bottleneck
              title="Generative video fatigue"
              detail="Relying too heavily on AI-generated b-roll makes the page feel cheap. Saves and shares usually drop even if initial views look okay."
              fix="Cap AI video generation to maybe a third of the video. Rely more on high-quality stock footage matched via semantic search."
            />
            <Bottleneck
              title="Platform dependency"
              detail="If Instagram flags the account, the whole pipeline dies. A lot of these setups seem to run on a single API token."
              fix="Isolate API tokens per channel. Have fallback posting methods ready if the primary API acts up."
            />
            <Bottleneck
              title="Echo chamber effect"
              detail="Because everyone is scraping the same viral videos, the content pool gets stale. They all end up making the exact same videos."
              fix="Pull from orthogonal sources. Ingest niche newsletters, podcasts, or old books—stuff that isn't already optimized for social."
            />
          </div>
        </section>

        <div className="my-16 flex justify-center text-muted-foreground">
          <ArrowDown className="size-5" />
        </div>

        {/* CASE B */}
        <section id="case-B">
          <H2 num="Case B">
            AI-UGC brands (the performance marketing archetype)
          </H2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            This is what modern DTC brands are doing. Instead of paying creators for hundreds of variations of an ad, they use AI actors. It looks like a real person reviewing a supplement or a skincare product, but it's completely synthetic. They can spin up thousands of variations of a brief and test them all programmatically.
          </p>

          <div className="mt-8 rounded-md border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="font-mono text-xs text-muted-foreground">
                Inferred workflow
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                pipeline
              </p>
            </div>
            <div className="px-4">
              <StepRow
                step="Brief"
                title="The initial spec"
                detail="It starts with a human performance marketer dropping a brief into a tracker. Just the basics: target audience, pain point, the product claim, and the offer. An automation picks it up from there."
                tools={["Task tracker", "Automation layer"]}
              />
              <StepRow
                step="Angles"
                title="Multiplying the idea"
                detail="An LLM takes that single brief and explodes it into dozens of angle variations. It mixes different hooks, tones, and awareness levels. Suddenly one idea is 30 different database rows."
                tools={["LLM (Expander)"]}
              />
              <StepRow
                step="Script"
                title="Writing for avatars"
                detail="The scripts are written specifically for AI actors. They include stage directions like 'look excited' or 'hold up product'. The structure is usually very rigid to optimize for ad conversions."
                tools={["LLM (Writer)"]}
              />
              <StepRow
                step="Actor"
                title="Synthesizing the video"
                detail="They pass the script to an avatar API. They likely have a roster of specific AI models tested for different demographics. The API spits back a video of a 'person' talking to the camera."
                tools={["Avatar API"]}
              />
              <StepRow
                step="Demo"
                title="Splicing in reality"
                detail="This is where the human touch comes back. They usually shoot a batch of real product b-roll once a quarter. The system cuts the AI actor video with the real product footage to make it believable."
                tools={["Video API"]}
              />
              <StepRow
                step="Learn"
                title="Testing at scale"
                detail="The final videos get pushed directly to ad networks. A day later, the system pulls the ROAS and engagement data. Winning angles get fed back into the generator; losers are tossed. It's evolutionary design for ads."
                tools={["Ad APIs", "Analytics DB"]}
              />
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Bottleneck
              title="Avatar blindness"
              detail="When the exact same AI actor shows up in 200 different ads on someone's feed, they scroll past immediately. The illusion breaks."
              fix="Cycle through a wider roster of actors. Put strict caps on how many impressions a single avatar can get before being rotated out."
            />
            <Bottleneck
              title="Compliance risks"
              detail="If an LLM hallucinates a medical claim and the AI actor says it, the brand is still liable. This is a huge risk for supplement brands."
              fix="Implement a hard schema for claims. Put a secondary LLM judge in place just to check for compliance, backed up by strict regex blocklists."
            />
            <Bottleneck
              title="The b-roll starvation"
              detail="The entire system depends on having fresh, real product footage. If they launch a new product, the pipeline halts until someone films it."
              fix="Build a dedicated SOP for filming b-roll. Spend one day a quarter banking hundreds of generic product shots, nicely tagged and stored."
            />
            <Bottleneck
              title="Ad account bans"
              detail="Pushing this much synthetic volume can trigger spam filters on ad networks. Losing an ad account is catastrophic."
              fix="Distribute the load across multiple business managers. Throttle the upload rate and monitor the account risk scores closely."
            />
          </div>
        </section>

        <div className="my-16 flex justify-center text-muted-foreground">
          <ArrowDown className="size-5" />
        </div>

        {/* CASE C - recreation */}
        <section id="case-C">
          <H2 num="Case C">How to build this natively</H2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            If you look closely, both of those examples are basically the same machine. It's just a queue of jobs moving through different processing nodes, with humans only stepping in to handle exceptions or provide raw inputs. That's the architecture behind Frame OS. Here is how I'd approach building an autonomous media layer from scratch.
          </p>

          <ol className="mt-8 space-y-3">
            {[
              [
                "Channels are configuration, not headcount.",
                "An Instagram account is just a database row. It has a niche, a voice profile, posting rules, and an assigned agent. Scaling up means adding rows, not hiring more social media managers.",
              ],
              [
                "Treat it like a distributed system.",
                "There's one central queue with distinct stages: Idea, Research, Script, Asset, QA, Schedule, Post. Every piece of content is an object moving through state transitions. The workers doing the actual processing should be modular. If a better video model comes out tomorrow, you just swap the API call.",
              ],
              [
                "LLMs execute. Humans curate.",
                "Mining trends, scripting, writing captions—let the models handle the execution. The human operator's job is to define the taste. You set the guardrails, tune the prompts, build the blocklists, and let the system run. You only intervene when the QA node flags an anomaly.",
              ],
              [
                "Keep the stack boring.",
                "Don't overcomplicate the infrastructure. Postgres for state. A robust queueing system. Object storage for the media files. Keep the logic simple and rely on external APIs for the heavy lifting.",
              ],
              [
                "Test the structure, not just the output.",
                "Think of hooks as templates. You aren't just A/B testing a single video; you're testing the underlying structural pattern. When you find a template that works, you can map new topics onto it programmatically.",
              ],
              [
                "Automate the feedback loop.",
                "You shouldn't need a weekly analytics meeting. Build a job that looks at yesterday's top performers and automatically weights those patterns higher in tomorrow's idea generation.",
              ],
              [
                "Optimize for operator leverage.",
                "One person should be able to manage a fleet of channels. Their daily routine should be a quick audit, clearing the QA queue, and pruning trends. If they are spending time on manual data entry, the system is failing.",
              ],
            ].map(([title, detail], i) => (
              <li
                key={title}
                className="grid grid-cols-[36px_1fr] gap-3 rounded-md border border-border bg-card p-4 hover:border-foreground/20 transition-colors"
              >
                <div className="font-serif text-2xl text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-md border-2 border-foreground bg-card p-6">
            <div className="flex items-center gap-2">
               <Repeat className="size-4" />
              <p className="font-mono text-[10px] uppercase tracking-widest">
                The leverage model
              </p>
            </div>
            <p className="mt-3 font-serif text-2xl leading-tight">
              1 operator × 4 agents × 3 channels × 2 reels/day = 24
              reels/day. Scaling to 48 just means spinning up more agents.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Blended cost is maybe $0.60 per reel. The operator spends a few minutes clearing flags. The rest of the time, the infrastructure just hums along.
            </p>
          </div>
        </section>
      </article>
    </AppShell>
  )
}
