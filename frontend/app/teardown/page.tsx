import { AppShell } from "@/components/app-shell"
import { ArrowDown, AlertTriangle, Wrench, Repeat, GitCommit, Database, ArrowRight } from "lucide-react"

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
            Fix:
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
          If you look closely at how modern AI-native media companies operate, you realize something pretty fast: they aren't creators. They're workflow systems. The "content" is just an output artifact of a continuous job queue. I spent a few weeks pulling apart two common archetypes to see what's actually running under the hood. Not the marketing pitch—the actual routing logic, the queue structures, and the exact spots where humans are still forced to intervene.
        </p>

        {/* TOC */}
        <nav className="mt-10 flex flex-wrap gap-2 text-sm">
          {[
            ["A", "Faceless page architecture"],
            ["B", "AI-UGC DTC brands"],
            ["C", "How I'd actually build this"],
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
          </div>

          <p className="mt-8 text-sm text-muted-foreground border-l-2 border-border pl-4">
            <strong>The failure state:</strong> A lot of these faceless pages collapse once the content factory outruns the feedback loop. They scale output volume infinitely, but they don't scale taste calibration. Eventually, the channel just pumps out pure noise, the audience drops off, and the algorithm chokes it entirely.
          </p>
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
            </div>
          </div>

          <div className="mt-10 space-y-5 text-base text-muted-foreground max-w-3xl leading-relaxed">
            <p>
              I probably wouldn't start with full multi-agent orchestration if I were building this internally. Operational simplicity matters way more than theoretical autonomy at this scale. Having five agents negotiating with each other in the background sounds cool, but it's a nightmare to debug when a live ad hallucinates an FDA-violating health claim.
            </p>
            <p>
              The real bottleneck here isn't the video generation—it's compliance and asset starvation. The whole pipeline starves if you don't have fresh, real-world product clips to splice over the avatar. It creates a very physical constraint in an otherwise entirely digital system.
            </p>
          </div>
        </section>

        <div className="my-16 flex justify-center text-muted-foreground">
          <ArrowDown className="size-5" />
        </div>

        {/* CASE C - recreation */}
        <section id="case-C">
          <H2 num="Case C">How I'd actually build this</H2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            Zoom out, and both of those archetypes are the exact same machine. The queue is the actual product. Content just moves through processing nodes, and humans only exist to handle exceptions. That's the core thesis of Frame OS.
          </p>

          <div className="mt-8 p-6 rounded-md border border-border bg-card/50 overflow-x-auto shadow-sm">
            <div className="flex items-center min-w-[600px] gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="flex-1 p-3 rounded border border-border bg-background text-center shadow-sm">Ideation</div>
              <ArrowRight className="size-3 shrink-0" />
              <div className="flex-1 p-3 rounded border border-border bg-background text-center shadow-sm">Scripting</div>
              <ArrowRight className="size-3 shrink-0" />
              <div className="flex-1 p-3 rounded border border-border bg-background text-center shadow-sm">Asset Gen</div>
              <ArrowRight className="size-3 shrink-0" />
              <div className="flex-1 p-3 rounded border border-amber-500/30 bg-amber-500/5 text-amber-500 text-center shadow-sm">QA / Human</div>
              <ArrowRight className="size-3 shrink-0" />
              <div className="flex-1 p-3 rounded border border-border bg-background text-center shadow-sm">Scheduled</div>
            </div>
            <div className="mt-5 pt-4 border-t border-border/50 text-xs text-muted-foreground max-w-lg leading-relaxed">
              * Every transition writes a log to the database. If any node fails, the state machine rolls back and increments <code className="text-foreground">retry_count</code>.
            </div>
          </div>

          <p className="mt-12 text-foreground font-medium">The Queue State Schema</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            If I were building this from scratch today, I'd start entirely with the data model. No video rendering, no LLM calls until the state machine is perfectly defined. Here is roughly what the core Supabase table looks like to drive the entire factory:
          </p>

          <div className="mt-5 bg-[#0a0a0a] text-[#d4d4d4] p-5 rounded-md border border-border/40 font-mono text-[13px] overflow-x-auto shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground/60 pb-2 border-b border-border/20">
              <Database className="size-3" />
              <span>public.content_queue</span>
            </div>
<pre className="leading-[1.7]"><code className="block">
<span className="text-[#c678dd]">CREATE TABLE</span> <span className="text-[#61afef]">content_queue</span> (
  <span className="text-[#e06c75]">id</span> <span className="text-[#d19a66]">uuid</span> <span className="text-[#c678dd]">PRIMARY KEY DEFAULT</span> <span className="text-[#56b6c2]">gen_random_uuid</span>(),
  <span className="text-[#e06c75]">channel_id</span> <span className="text-[#d19a66]">text</span> <span className="text-[#c678dd]">NOT NULL</span>,
  
  <span className="text-[#5c6370] italic">-- The state machine transitions</span>
  <span className="text-[#e06c75]">status</span> <span className="text-[#d19a66]">text</span> <span className="text-[#c678dd]">NOT NULL CHECK</span> (
    status <span className="text-[#c678dd]">IN</span> (<span className="text-[#98c379]">'ideation'</span>, <span className="text-[#98c379]">'scripting'</span>, <span className="text-[#98c379]">'asset_gen'</span>, <span className="text-[#98c379]">'qa'</span>, <span className="text-[#98c379]">'scheduled'</span>, <span className="text-[#98c379]">'failed'</span>)
  ),
  
  <span className="text-[#5c6370] italic">-- Operational state</span>
  <span className="text-[#e06c75]">retry_count</span> <span className="text-[#d19a66]">int</span> <span className="text-[#c678dd]">DEFAULT</span> 0,
  <span className="text-[#e06c75]">error_log</span> <span className="text-[#d19a66]">text</span>,
  <span className="text-[#e06c75]">provider_used</span> <span className="text-[#d19a66]">text</span>,
  <span className="text-[#e06c75]">qa_flagged</span> <span className="text-[#d19a66]">boolean</span> <span className="text-[#c678dd]">DEFAULT</span> false,
  <span className="text-[#e06c75]">scheduled_for</span> <span className="text-[#d19a66]">timestamptz</span>,
  
  <span className="text-[#5c6370] italic">-- Ties back to the winning structural pattern</span>
  <span className="text-[#e06c75]">hook_primitive_id</span> <span className="text-[#d19a66]">text</span> <span className="text-[#c678dd]">REFERENCES</span> <span className="text-[#61afef]">hook_primitives</span>(id), 
  
  <span className="text-[#5c6370] italic">-- The structured beats parsed by the video compiler</span>
  <span className="text-[#e06c75]">script_payload</span> <span className="text-[#d19a66]">jsonb</span>, 
  
  <span className="text-[#5c6370] italic">-- Artifact pointers</span>
  <span className="text-[#e06c75]">render_url</span> <span className="text-[#d19a66]">text</span>,
  
  <span className="text-[#e06c75]">created_at</span> <span className="text-[#d19a66]">timestamptz</span> <span className="text-[#c678dd]">DEFAULT</span> <span className="text-[#56b6c2]">now</span>()
);
</code></pre>
          </div>

          <div className="mt-12 space-y-5 text-base text-muted-foreground max-w-3xl leading-relaxed">
            <p>
              Most of this architecture probably just becomes debugging provider inconsistencies and retry logic. Having an LLM write a script is trivial. Handling what happens when the video rendering API silently times out after 14 minutes, locks the queue row, and orphans the state machine is the actual engineering work. Webhook retries and failed state recovery are always more annoying than the generation itself.
            </p>
          </div>

          <p className="mt-10 text-foreground font-medium">The Queue Worker (Node.js)</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            This is the only thing that actually runs on a cron. A dumb loop that picks up the next stale job, locks the row so we don't double-render, and hands it to the right execution module.
          </p>

          <div className="mt-5 bg-[#0a0a0a] text-[#d4d4d4] p-5 rounded-md border border-border/40 font-mono text-[13px] overflow-x-auto shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground/60 pb-2 border-b border-border/20">
              <span className="text-yellow-400">⚡</span>
              <span>workers/queue-processor.ts</span>
            </div>
<pre className="leading-[1.7]"><code className="block">
<span className="text-[#c678dd]">async function</span> <span className="text-[#61afef]">processQueue</span>() {'{'}
  <span className="text-[#5c6370] italic">// 1. Lock the next available job to prevent race conditions</span>
  <span className="text-[#c678dd]">const</span> job = <span className="text-[#c678dd]">await</span> db.<span className="text-[#61afef]">raw</span>(<span className="text-[#98c379]">{"\`"}</span>
    <span className="text-[#98c379]">UPDATE content_queue</span>
    <span className="text-[#98c379]">SET status = 'processing', updated_at = now()</span>
    <span className="text-[#98c379]">WHERE id = (</span>
      <span className="text-[#98c379]">SELECT id FROM content_queue</span>
      <span className="text-[#98c379]">WHERE status = 'ideation' AND retry_count &lt; 3</span>
      <span className="text-[#98c379]">ORDER BY created_at ASC</span>
      <span className="text-[#98c379]">FOR UPDATE SKIP LOCKED</span>
      <span className="text-[#98c379]">LIMIT 1</span>
    <span className="text-[#98c379]">) RETURNING *;</span>
  <span className="text-[#98c379]">{"\`"}</span>);

  <span className="text-[#c678dd]">if</span> (!job) <span className="text-[#c678dd]">return</span>; <span className="text-[#5c6370] italic">// Queue is empty</span>

  <span className="text-[#c678dd]">try</span> {'{'}
    <span className="text-[#c678dd]">const</span> payload = <span className="text-[#c678dd]">await</span> <span className="text-[#56b6c2]">generateScript</span>(job.channel_id);
    
    <span className="text-[#c678dd]">await</span> db.<span className="text-[#61afef]">update</span>(<span className="text-[#98c379]">'content_queue'</span>, {'{'}
      status: <span className="text-[#98c379]">'scripting'</span>,
      script_payload: payload
    {'}'}).<span className="text-[#61afef]">where</span>(<span className="text-[#98c379]">'id'</span>, job.id);
    
  {'}'} <span className="text-[#c678dd]">catch</span> (error) {'{'}
    <span className="text-[#5c6370] italic">// 2. The reality of API integrations: things break.</span>
    <span className="text-[#c678dd]">await</span> db.<span className="text-[#61afef]">raw</span>(<span className="text-[#98c379]">{"\`"}</span>
      <span className="text-[#98c379]">UPDATE content_queue </span>
      <span className="text-[#98c379]">SET status = 'failed', </span>
      <span className="text-[#98c379]">    error_log = ?,</span>
      <span className="text-[#98c379]">    retry_count = retry_count + 1</span>
      <span className="text-[#98c379]">WHERE id = ?</span>
    <span className="text-[#98c379]">{"\`"}</span>, [error.message, job.id]);
  {'}'}
{'}'}
</code></pre>
          </div>

          <div className="mt-12 space-y-6 max-w-3xl">
            <div>
              <p className="font-medium">1. Channels are configuration, not headcount.</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                An Instagram account should just be a database row. You give it a niche, a voice profile, and posting rules. Scaling up your media presence means adding a row to a table, not hiring another social media manager.
              </p>
            </div>
            
            <div>
              <p className="font-medium">2. Treat it like a distributed system.</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Every reel is just an object moving through transitions: Idea, Script, Asset, QA. Make the workers modular. If a cheaper video model drops tomorrow, you just swap the endpoint. The queue doesn't care.
              </p>
            </div>

            <div>
              <p className="font-medium">3. LLMs execute. Humans curate.</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Stop using humans for raw execution. Let the models mine the trends and write the captions. The operator's only job is to define the taste—setting guardrails, tuning blocklists, and checking the anomaly queue when a render fails.
              </p>
            </div>

            <div>
              <p className="font-medium">4. Keep the stack boring.</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Don't overcomplicate the plumbing. Postgres for state, a rock-solid background job runner, and standard object storage. Keep your internal logic simple and let the external providers do the heavy compute.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-md border-2 border-foreground bg-card p-6 max-w-2xl">
            <div className="flex items-center gap-2 text-foreground">
               <GitCommit className="size-4" />
              <p className="font-mono text-[10px] uppercase tracking-widest">
                The Narrative Entropy Problem
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              The actual bottleneck in modern media isn't generation quality anymore. <strong>It's narrative entropy.</strong> 
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Once every channel optimizes the exact same hook structures from the exact same dataset, audiences stop emotionally distinguishing between creators. The system eats itself. The only moats left in this space are proprietary data ingestion (scraping things that aren't already optimized for social media) and highly calibrated human taste. 
            </p>
          </div>
        </section>
      </article>
    </AppShell>
  )
}
