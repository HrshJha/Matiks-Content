import type { BlueprintOutput } from "@/lib/schemas/teardown"
import { STATIC_BLUEPRINT } from "@/lib/teardown-static"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StateMachine } from "./state-machine"
import { SectionHeader, StreamPanel, WarningLabel } from "./teardown-primitives"

export function BlueprintTab({
  data = STATIC_BLUEPRINT,
  streamedText,
}: {
  data?: BlueprintOutput
  streamedText?: string
}) {
  return (
    <div className="space-y-10">
      <StreamPanel title="Live Blueprint Stream" text={streamedText} />

      <section>
        <SectionHeader eyebrow="Prompt C" title="Tech Stack" />
        <DataTable
          headers={["Layer", "Primary", "Fallback", "Cost", "Complexity", "Why"]}
          rows={data.techStack.map((row) => [
            row.layer,
            row.primary,
            row.fallback,
            row.cost,
            row.integrationComplexity,
            row.why,
          ])}
        />
      </section>

      <section>
        <SectionHeader eyebrow="State" title="Database Schema" />
        <pre className="overflow-x-auto rounded-md border border-border bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {data.databaseSchema}
        </pre>
        <div className="mt-4">
          <StateMachine />
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Runbook" title="SOP Library" />
        <Accordion type="multiple" className="rounded-md border border-border bg-card px-4">
          {data.sopLibrary.map((sop) => (
            <AccordionItem key={sop.id} value={sop.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="grid w-full gap-2 text-left md:grid-cols-[96px_1fr_160px] md:items-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{sop.id}</span>
                  <span>
                    <span className="block font-medium">{sop.title}</span>
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">{sop.trigger}</span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {sop.timeEstimate}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-2 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                  {sop.steps.map((step, index) => (
                    <li key={step} className="grid grid-cols-[28px_1fr] gap-2">
                      <span className="font-mono text-[10px] text-foreground">{String(index + 1).padStart(2, "0")}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section>
        <SectionHeader eyebrow="Scale" title="Scaling Roadmap" />
        <div className="grid gap-3 md:grid-cols-3">
          {data.scalingRoadmap.phases.map((phase) => (
            <div key={phase.name} className="rounded-md border border-border bg-card p-4">
              <p className="font-serif text-xl">{phase.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-accent">{phase.throughput}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <DataTable
            caption="Monthly software/provider cost"
            headers={["Item", "MVP", "Intermediate", "Industrial"]}
            rows={data.scalingRoadmap.softwareProviderCosts.map((row) => [row.item, row.mvp, row.intermediate, row.industrial])}
          />
          <DataTable
            caption="Human operating cost"
            headers={["Item", "MVP", "Intermediate", "Industrial"]}
            rows={data.scalingRoadmap.humanOperatingCosts.map((row) => [row.item, row.mvp, row.intermediate, row.industrial])}
          />
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Failure" title="Risk Register" />
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[900px] text-left font-mono text-xs">
            <thead className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-3">Risk</th>
                <th className="p-3">Probability</th>
                <th className="p-3">Impact</th>
                <th className="p-3">Detection signal</th>
                <th className="p-3">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {data.riskRegister.map((row) => (
                <tr
                  key={row.risk}
                  className={`border-b border-border last:border-b-0 ${row.highlight ? "bg-amber-500/10" : ""}`}
                >
                  <td className="p-3 text-foreground">
                    {row.highlight ? <WarningLabel>{row.risk}</WarningLabel> : row.risk}
                  </td>
                  <td className="p-3">{row.probability}</td>
                  <td className="p-3">{row.impact}</td>
                  <td className="p-3 text-muted-foreground">{row.detectionSignal}</td>
                  <td className="p-3 text-muted-foreground">{row.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Defensibility" title="Moat Analysis" />
        <div className="grid gap-3 md:grid-cols-3">
          {data.moatAnalysis.map((item) => (
            <div key={item.question} className="rounded-md border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{item.question}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function DataTable({
  headers,
  rows,
  caption,
}: {
  headers: string[]
  rows: string[][]
  caption?: string
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      {caption && (
        <div className="border-b border-border p-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {caption}
        </div>
      )}
      <table className="w-full min-w-[720px] text-left font-mono text-xs">
        <thead className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
          <tr>{headers.map((header) => <th key={header} className="p-3">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="border-b border-border last:border-b-0">
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className={`p-3 ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
