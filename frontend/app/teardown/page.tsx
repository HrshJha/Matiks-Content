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
          Reverse-engineering the modern content factory.
        </h1>
        <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-3xl">
          If you look closely at how modern AI-native media companies operate, you realize something pretty fast: they aren't creators. They're workflow systems. The "content" is just exhaust from a well-oiled state machine. I spent a few weeks pulling apart two common archetypes to see what's actually running under the hood. Not the marketing pitch—the actual routing logic, the queue structures, and the exact spots where humans are still forced to intervene.
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
            These are everywhere. The standard Reels template right now is a faceless finance or tech page churning out 3 posts a day. The visual grammar is identical across accounts: heavy burned-in captions, generic AI b-roll, that same synthetic cadence. Every hook is some variation of "Stop doing X right now." It feels repetitive because it is. And because it's repetitive, it's trivial to automate.
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
                detail="It usually starts with a daily scrape. They'll pull a few hundred high-performing reels, maybe mix in some Reddit threads. The goal isn't to copy the video, but to extract the underlying hook structure and dump it into a database."
                tools={["Data scraping layer", "Relational DB"]}
              />
              <StepRow
                step="Select"
                title="Hook clustering"
                detail="An LLM looks at the scrape and clusters the hooks into reusable primitives—things like 'the hidden cost' or 'the contrarian take'. Then it maps today's trending topics onto those primitives. You end up with a queue of idea cards."
                tools={["LLM router", "Vector index"]}
              />
              <StepRow
                step="Script"
                title="Writing with strict constraints"
                detail="The writing step is totally rigid. Hook under 7 seconds, 3 beats of context, quick CTA. They force the LLM to spit out structured JSON so the next node in the pipeline can read it without failing."
                tools={["LLM inference", "JSON schema"]}
              />
              <StepRow
                step="Voice"
                title="TTS generation"
                detail="A standard TTS call. They lock a specific voice ID to the channel profile so it always sounds like the same 'person'. The script gets converted to audio, and they extract the word-level timecodes to sync the captions later."
                tools={["Voice synthesis"]}
              />
              <StepRow
                step="Assets"
                title="B-roll fetching"
                detail="This is where most pages get lazy. They hit a stock footage API, or worse, lean entirely on generative video. The heavy use of AI b-roll is why these pages feel uncanny after a few seconds."
                tools={["Stock retrieval", "Video generation"]}
              />
              <StepRow
                step="Assemble"
                title="Putting it together"
                detail="Everything gets stitched programmatically. Audio track, cuts, and those massive burned-in captions. The styling rules are hardcoded. I'd bet 90% of these render out without a human ever checking the timeline."
                tools={["Programmatic editor"]}
              />
              <StepRow
                step="QA"
                title="The human exception loop"
                detail="Humans are just exception handlers here. An automated judge might flag a render if the audio peaks or the text runs off-screen. If it passes, it goes straight to the outbox. The operator only looks at the rejects."
                tools={["Automated QA", "Heuristics"]}
              />
              <StepRow
                step="Post"
                title="Publishing and feedback"
                detail="They hit the social APIs, publish, and wait. The smart setups have a cron job that pulls the 24-hour metrics, finds the winning hooks, and feeds them right back into the ingest layer for tomorrow."
                tools={["Social APIs", "Analytics cron"]}
              />
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Bottleneck
              title="Audience saturation"
              detail="The audience catches on. Hearing the same TTS voice read the same 'Stop doing X' template causes a massive drop in retention over time."
              fix="Introduce variance logic. Cycle through different voice profiles and enforce a cooldown period on overused hook templates."
            />
            <Bottleneck
              title="Generative video fatigue"
              detail="Uncanny valley kicks in hard. Leaning entirely on generative video tanks your save and share metrics, even if the hook gets them to watch the first 3 seconds."
              fix="Hard-cap generative video usage. Fall back to high-quality stock matched by semantic search for the bulk of the timeline."
            />
            <Bottleneck
              title="Platform dependency"
              detail="These pipelines are fragile. One shadowban or API token expiration and the entire factory grinds to a halt."
              fix="Decouple the infrastructure. Isolate tokens per channel and build a fallback posting queue."
            />
            <Bottleneck
              title="Echo chamber effect"
              detail="When your ingest layer only scrapes Instagram, you end up making the exact same content as everyone else scraping Instagram."
              fix="Point the ingest layer at orthogonal data. Parse niche newsletters, old forums, or podcast transcripts to find ideas that haven't been beaten to death."
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
            This is the performance marketing playbook right now. Instead of paying influencers for endless ad variations, DTC brands are using synthetic actors. It looks exactly like a real person holding a supplement bottle, but it's generated. The advantage is scale—you can take one brief and spin up two thousand programmatic variations to see what converts.
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
                detail="A performance marketer writes a raw brief. Target audience, the core pain point, and the offer. That's the only real manual input."
                tools={["Issue tracker", "Webhook"]}
              />
              <StepRow
                step="Angles"
                title="Multiplying the idea"
                detail="The system expands that single brief into a massive matrix of angles. It mixes tones, awareness levels, and hook structures. One idea becomes fifty rows in a database."
                tools={["LLM expansion"]}
              />
              <StepRow
                step="Script"
                title="Writing for avatars"
                detail="These aren't normal scripts. They're written explicitly for synthetic actors, including metadata for stage directions like 'slight smile' or 'point down'. The pacing is brutal to optimize for thumb-stops."
                tools={["Script generator"]}
              />
              <StepRow
                step="Actor"
                title="Synthesizing the video"
                detail="The script hits an avatar API. Brands usually lock in a roster of specific synthetic actors that historically convert well for their demographic. It returns a clean video of a 'person' talking."
                tools={["Synthetic video layer"]}
              />
              <StepRow
                step="Demo"
                title="Splicing in reality"
                detail="You still need real product shots to sell physical goods. They usually bank a ton of human-shot b-roll once a quarter, and the system programmatically splices those clips over the synthetic actor to ground the ad in reality."
                tools={["Asset assembly"]}
              />
              <StepRow
                step="Learn"
                title="Testing at scale"
                detail="The renders are pushed straight to the ad networks. The system pulls ROAS data daily, kills the losers, and tells the angle generator to double down on the winning patterns. It's basically an evolutionary algorithm for ad spend."
                tools={["Ad network APIs", "Data warehouse"]}
              />
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Bottleneck
              title="Avatar blindness"
              detail="People pattern-match quickly. If the same synthetic guy shows up in 40 different ads on your feed, the illusion shatters and thumb-stop rates plummet."
              fix="Manage actors like ad inventory. Put strict impression caps on specific avatars before forcing a rotation."
            />
            <Bottleneck
              title="Compliance risks"
              detail="If the script generator hallucinates an FDA-violating health claim and the avatar reads it, the brand is still on the hook. This is the biggest actual risk in the pipeline."
              fix="Enforce a rigid claim schema. Run a separate LLM pass purely for compliance checking, backed by hard regex blocklists."
            />
            <Bottleneck
              title="The b-roll starvation"
              detail="The whole synthetic pipeline starves if it doesn't have fresh, real-world product clips to splice in. It creates a weird physical bottleneck."
              fix="Standardize the physical shoots. Bank hundreds of generic, well-lit product clips quarterly and tag them meticulously so the system can pull them."
            />
            <Bottleneck
              title="Ad account bans"
              detail="Dumping massive volume from API connections makes ad networks nervous. Tripping a spam filter and losing a business manager account is a disaster."
              fix="Shard the risk. Distribute the ad load across multiple accounts and deliberately throttle the upload velocity."
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
            Zoom out, and both of those archetypes are the exact same machine. The "queue" is the actual product. Content just moves through processing nodes, and humans only exist to handle exceptions. That's the core thesis of Frame OS. If I were building an autonomous media layer today, here's the architecture I'd use.
          </p>

          <ol className="mt-8 space-y-3">
            {[
              [
                "Channels are configuration, not headcount.",
                "An Instagram account should just be a database row. You give it a niche, a voice profile, and posting rules. Scaling up your media presence means adding a row to a table, not hiring another social media manager.",
              ],
              [
                "Treat it like a distributed system.",
                "Build one central queue with distinct states. Every reel is just an object moving through transitions: Idea, Script, Asset, QA. Make the workers modular. If a cheaper video model drops tomorrow, you just swap the endpoint. The queue doesn't care.",
              ],
              [
                "LLMs execute. Humans curate.",
                "Stop using humans for raw execution. Let the models mine the trends and write the captions. The operator's only job is to define the taste—setting guardrails, tuning blocklists, and checking the anomaly queue when a render fails.",
              ],
              [
                "Keep the stack boring.",
                "Don't overcomplicate the plumbing. Use Postgres for state, a rock-solid background job runner, and standard object storage. Keep your internal logic simple and let the external providers do the heavy compute.",
              ],
              [
                "Test the structure, not just the output.",
                "Hooks are reusable primitives. You shouldn't just A/B test a finished video; you should test the underlying structural pattern. Once a pattern hits, you can programmatically map fifty new topics onto it.",
              ],
              [
                "Automate the feedback loop.",
                "Weekly analytics meetings are too slow. Write a background job that parses yesterday's top quartile performers and automatically weights those exact patterns higher in tomorrow's script generation.",
              ],
              [
                "Optimize for operator leverage.",
                "A single operator should comfortably manage a dozen channels. Their day is just clearing the QA queue and adjusting the trend weights. If they're manually copying and pasting anything, the system is broken.",
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
              One operator managing four agents. Each agent runs three channels. Two posts a day per channel. That's 24 posts daily with near-zero friction. Scaling to 48 just means spinning up more agents.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              The blended compute cost sits around $0.60 per post. The operator spends a few minutes a day clearing flagged items. For the other 23 hours, the infrastructure just hums.
            </p>
          </div>
        </section>
      </article>
    </AppShell>
  )
}
