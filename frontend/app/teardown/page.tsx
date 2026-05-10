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
            How we&apos;d fix it:
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
          What&apos;s actually under the hood of a viral AI content machine.
        </h1>
        <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-3xl">
          Two case studies. We bypass the &ldquo;they post good content!&rdquo;
          surface read and treat each operation as an engineering system —
          inputs, services, queues, model choices, rate limits, and the
          humans who only touch exceptions.
        </p>

        {/* TOC */}
        <nav className="mt-10 flex flex-wrap gap-2 text-sm">
          {[
            ["A", "Faceless AI page · @aimoneyhacks"],
            ["B", "AI-UGC brand · Lyma / Arcads-style DTC"],
            ["C", "How we recreate + scale internally"],
          ].map(([n, t]) => (
            <a
              key={n}
              href={`#case-${n}`}
              className="px-3 py-1.5 rounded-full border border-border bg-card hover:bg-card/60"
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
            Faceless AI page · the &ldquo;ai money hacks&rdquo; archetype
          </H2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            The dominant template on Reels in 2026: a faceless personal-finance /
            AI-tools page posting 2–3× a day, ~700K followers, near-identical
            visual grammar — bold sans-serif captions burned in, a generic
            stock or AI b-roll background, an ElevenLabs male voice with the
            same cadence, and a 7-second hook formatted as either{" "}
            <em>&ldquo;X most people don&apos;t know&hellip;&rdquo;</em> or{" "}
            <em>&ldquo;Stop doing X. Do Y instead.&rdquo;</em>
          </p>

          <div className="mt-8 rounded-md border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="font-mono text-xs text-muted-foreground">
                Inferred end-to-end workflow
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                ideation → posted
              </p>
            </div>
            <div className="px-4">
              <StepRow
                step="01 · INGEST"
                title="Trend & topic mining"
                detail="Daily scrape of 200–400 high-RPM finance / AI Reels (Apify or Phantombuster), Reddit r/personalfinance + r/sidehustle hot posts, and Google Trends Rising. Captions, hooks, hashtags, watch-thru proxies (likes:views ratio) are dumped into a Postgres / Airtable trends table."
                tools={["Apify", "Phantombuster", "Reddit API", "Google Trends", "Postgres"]}
              />
              <StepRow
                step="02 · SELECT"
                title="Hook clustering & idea picking"
                detail="An LLM groups scraped hooks into ~15 reusable templates (e.g. 'shock-stat', 'invisible-cost', 'tool-stack-reveal') and ranks today's topics by template × topic novelty. Output: 6–10 idea cards, each with a topic + a hook template assignment."
                tools={["GPT-5", "OpenAI embeddings", "pgvector"]}
              />
              <StepRow
                step="03 · SCRIPT"
                title="60-second script with structural slots"
                detail="Strict schema: HOOK (≤7s, contrarian), CONTEXT (≤8s), 3 BEATS (≤30s total), CTA (≤5s, save/follow). Each beat carries a B-roll prompt for the asset stage. Tone-locked to a per-channel voice card."
                tools={["GPT-5", "Claude Opus 4.6", "Output.object()"]}
              />
              <StepRow
                step="04 · VOICE"
                title="ElevenLabs voiceover with locked voice ID"
                detail="One voice ID per channel. SSML breaks tuned to the script's slot timing. Output: a single .mp3 + per-line timecodes used downstream by the captioner."
                tools={["ElevenLabs v3", "ssml"]}
              />
              <StepRow
                step="05 · ASSETS"
                title="B-roll: stock + Veo 3 fallback"
                detail="Each beat's prompt is matched against a Pexels / Storyblocks library first (fast, free). Misses fall back to a Veo 3 (or Runway) generation queue. Faceless pages keep heavy generative use to a minimum because watch-time cratered when AI b-roll was over-used."
                tools={["Pexels API", "Storyblocks", "Veo 3", "Runway Gen-4"]}
              />
              <StepRow
                step="06 · ASSEMBLE"
                title="Auto-edit + burned-in captions"
                detail="Submagic or Captions.ai composes the timeline: voice waveform → beat-cuts → captions auto-styled to the page's burned-in look (Inter Black, 88px, off-white on black stroke). ~90% of reels finish here without a human touching them."
                tools={["Submagic", "Captions.ai", "Creatomate"]}
              />
              <StepRow
                step="07 · QA"
                title="Operator approves only the 8% flagged"
                detail="A QA scorer (LLM + heuristic) flags reels with: lip-sync drift, factual claim density too high, profanity, brand-safety risks. Everything else auto-promotes to Scheduled."
                tools={["GPT-5 (judge)", "OpenCV (lipsync)", "PerspectiveAPI"]}
              />
              <StepRow
                step="08 · POST"
                title="Native posting via Graph API + 2 backups"
                detail="Primary: Instagram Graph API (Reel container + publish). Backup queue: Buffer / Postiz / Blotato in case of token rotation. Post times follow a per-channel reach-curve (12 PM IST + 7 PM IST is typical)."
                tools={["Instagram Graph API", "Postiz", "Blotato", "Buffer"]}
              />
              <StepRow
                step="09 · ANALYTICS"
                title="24h cohort analysis → next day's idea pool"
                detail="A cron job (Vercel Cron / n8n) pulls insights/{reel-id} after 24h, writes to a posts_metrics table. A feedback bot promotes high-performing hooks back into the idea queue with structural variants — closing the loop."
                tools={["IG Insights API", "n8n", "cron", "Postgres"]}
              />
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Bottleneck
              title="Voice / model fatigue"
              detail="Same ElevenLabs voice + same hook templates → audience saturation. Watch-thru on hook 3 starts dropping after ~12 weeks."
              fix="Rotate 3 voice IDs per channel on a stratified schedule; ban any hook template > 18% of last 30 reels."
            />
            <Bottleneck
              title="Cinematic over-reliance"
              detail="When pages over-use Veo / Runway for every beat, reels feel uncanny — saves drop even when views hold."
              fix="Hard-cap generative b-roll at 30% of beats; default to stock matched by CLIP-embedding distance."
            />
            <Bottleneck
              title="Single-account risk"
              detail="One Instagram block kills the entire stack (token, posting, insights). Lots of these pages run on a single Meta business asset."
              fix="Per-channel Meta business account, isolated tokens, 2 backup posters (Postiz + manual fallback)."
            />
            <Bottleneck
              title="Idea pool collapse"
              detail="Trend scraping converges → every faceless page posts the same hooks the same week."
              fix="Add an 'orthogonal source' branch: niche newsletters, books, court records, podcast archives — sources LLMs aren&apos;t already saturating."
            />
          </div>
        </section>

        <div className="my-16 flex justify-center text-muted-foreground">
          <ArrowDown className="size-5" />
        </div>

        {/* CASE B */}
        <section id="case-B">
          <H2 num="Case B">
            AI-UGC brand · the &ldquo;Lyma / Arcads-style&rdquo; archetype
          </H2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            A DTC brand (think a wellness, supplement, or skincare label —
            Lyma, Bloom Nutrition, Magic Mind, Vessi shoes are public examples)
            scaling{" "}
            <em>thousands of ad creatives a month</em> using AI UGC actors
            instead of paying real creators per asset. Same brand voice, 50+
            &ldquo;testimonials&rdquo; a week, A/B/n tested at the platform level.
          </p>

          <div className="mt-8 rounded-md border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="font-mono text-xs text-muted-foreground">
                Inferred end-to-end workflow
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                brief → spend
              </p>
            </div>
            <div className="px-4">
              <StepRow
                step="01 · BRIEF"
                title="Performance team drops a creative brief"
                detail="One brief = product, audience segment, pain point, claim, offer. Performance brief lives in Notion / Linear; an automation watches the 'ready-for-creative' status."
                tools={["Notion API", "Linear", "n8n"]}
              />
              <StepRow
                step="02 · ANGLES"
                title="Angle generator: one brief → 30 angles"
                detail="GPT-5 expands the brief into 30 angle variants (problem-aware vs. solution-aware × 5 tones × 3 hooks). Each angle is one row in a creatives table — never more than that."
                tools={["GPT-5", "Output.object()", "Postgres"]}
              />
              <StepRow
                step="03 · SCRIPT"
                title="UGC scripts in 60-90s with built-in B-roll cues"
                detail="Strict schema again: HOOK · BUILD · CLAIM · DEMO · OFFER · CTA. The script is written for an AI actor with explicit emotion + camera notes ('lean-in', 'half-laugh', 'product-up')."
                tools={["GPT-5", "Claude Opus 4.6"]}
              />
              <StepRow
                step="04 · ACTOR"
                title="Arcads / Creatify generate the actor video"
                detail="A locked roster of ~12 AI actors (per persona × per market) speaks the script. Arcads is the leader for naturalism; Creatify is used for sheer volume + price; HeyGen for IVR-style explainer angles."
                tools={["Arcads", "Creatify", "HeyGen", "Topview AI"]}
              />
              <StepRow
                step="05 · DEMO"
                title="Real product B-roll spliced in"
                detail="The one human-shot asset: 30s of unedited product b-roll filmed quarterly. AI actor video + product b-roll + lower-third caption are auto-assembled."
                tools={["Creatomate", "Submagic", "After Effects template"]}
              />
              <StepRow
                step="06 · CAPTION"
                title="Burned-in captions matched to brand kit"
                detail="A locked Submagic style (font, motion, emoji rules) is applied automatically. No designer time per ad."
                tools={["Submagic", "Captions.ai"]}
              />
              <StepRow
                step="07 · LAUNCH"
                title="Push to Meta + TikTok ad libraries via API"
                detail="Each creative is auto-uploaded to a fresh ad set with one of N pre-approved primary texts. Naming convention encodes angle, actor, hook template — so the data team can decompose performance later."
                tools={["Meta Marketing API", "TikTok Ads API", "Smartly.io"]}
              />
              <StepRow
                step="08 · LEARN"
                title="Daily creative-performance digest"
                detail="A cron pulls 24h spend + ROAS + thumbstop, scores by hook template × actor × angle, and writes 'winning patterns' back into the brief generator's preferred-templates pool. The losers are auto-archived."
                tools={["BigQuery", "Hex", "n8n", "Slack digest"]}
              />
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Bottleneck
              title="Actor saturation"
              detail="When the same Arcads actor is in 200 ads, audiences pattern-match and thumbstop falls."
              fix="Treat actors like a media spend: rotate, cap impressions per actor per market, retire on a fatigue threshold."
            />
            <Bottleneck
              title="Brand-safety + compliance"
              detail="A bad health claim from an AI actor is the brand's liability — not the platform's."
              fix="Hard schema on claim language, an LLM judge plus a regex blocklist; nothing publishes without passing."
            />
            <Bottleneck
              title="Real-product B-roll bottleneck"
              detail="The one human input — quarterly b-roll — gates everything. New colorways or SKUs starve the pipeline."
              fix="Spin up a 'B-roll factory' SOP: 1 day per quarter, 200 clips banked, tagged by SKU + lighting + scene."
            />
            <Bottleneck
              title="Ad account bans"
              detail="High-velocity AI creatives trigger auto-flags on Meta. One ban kills the spend."
              fix="Multi-asset structure (3+ BMs, identity-aware naming), spend-pacing across them, and a flagging rule that quarantines accounts at 80% risk score."
            />
          </div>
        </section>

        <div className="my-16 flex justify-center text-muted-foreground">
          <ArrowDown className="size-5" />
        </div>

        {/* CASE C - recreation */}
        <section id="case-C">
          <H2 num="Case C">How we recreate this internally — and scale it</H2>
          <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
            Both archetypes look different, but underneath they&apos;re the
            same shape: <em>a queue of creative jobs flowing through a fixed
            pipeline of services, with humans inserted only at exception
            handling and quarterly inputs</em>. That&apos;s the system Matiks
            Content OS rebuilds. Below: how we&apos;d recreate it — in the order
            we&apos;d ship.
          </p>

          <ol className="mt-8 space-y-3">
            {[
              [
                "Channel = config, not a person.",
                "Each Instagram channel is a row: niche, voice ID, hook template whitelist, posting times, model stack, owner-agent. Adding a channel = adding a row, not hiring.",
              ],
              [
                "One queue, eight stages.",
                "Idea → Research → Script → Asset → QA → Schedule → Post → Analyze. Every reel is an object that walks the queue. Stage workers are pluggable — swap Veo 3 for Sora 2 by changing one provider.",
              ],
              [
                "LLMs do everything except taste.",
                "Trend mining, clustering, scripting, judging, captioning — all model calls. The operator&apos;s job is to set the taste — voice cards, banned hook templates, brand-safety rules — and audit exceptions.",
              ],
              [
                "Run on Postgres + a cron + a queue.",
                "Don&apos;t over-engineer. Postgres for state, a single queue (Inngest / Trigger.dev / a Vercel Cron + an outbox table), object storage for assets. Everything else is provider calls.",
              ],
              [
                "Treat hooks as the unit of A/B testing.",
                "We A/B test the hook template, not the reel. The same script can ship as 3 hook variants to 3 channels of similar audience to find the winning template before scaling.",
              ],
              [
                "Feedback is a service, not a meeting.",
                "A daily bot rewrites the next-day idea pool from yesterday&apos;s top quartile. The operator only intervenes when the system gets stuck on a template.",
              ],
              [
                "Operators run pods, not posts.",
                "One operator owns 3–4 channels (an &ldquo;owner-agent&rdquo;). Their day is 1.5h: morning audit, midday QA review, evening trend prune. Anything beyond that is a system bug.",
              ],
            ].map(([title, detail], i) => (
              <li
                key={title}
                className="grid grid-cols-[36px_1fr] gap-3 rounded-md border border-border bg-card p-4"
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
                Operator capacity model
              </p>
            </div>
            <p className="mt-3 font-serif text-2xl leading-tight">
              1 operator × 4 owner-agents × 3 channels × 2 reels/day = 24
              reels/day. Tomorrow that becomes 48 by adding agents, not humans.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Cost per reel: $0.62 (model + render + captions, blended).
              Operator time per reel: ~4 minutes (only on the ~8% that QA
              flags). Everything else is the system running itself.
            </p>
          </div>
        </section>
      </article>
    </AppShell>
  )
}
