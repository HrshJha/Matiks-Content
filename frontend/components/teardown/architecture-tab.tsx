import type { ArchitectureOutput } from "@/lib/schemas/teardown"
import { STATIC_ARCHITECTURE } from "@/lib/teardown-static"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StateMachine } from "./state-machine"
import { Chip, ConfidenceBadge, EvidenceBadge, SectionHeader, StreamPanel } from "./teardown-primitives"

export function ArchitectureTab({
  data = STATIC_ARCHITECTURE,
  streamedText,
}: {
  data?: ArchitectureOutput
  streamedText?: string
}) {
  return (
    <div className="space-y-10">
      <StreamPanel title="Live Architecture Stream" text={streamedText} />

      <section>
        <SectionHeader
          eyebrow="Prompt B"
          title="Pipeline Reconstruction"
          description="Ten stages from trend intake to feedback, with automation posture and failure modes surfaced for operator review."
        />
        <Accordion type="single" collapsible className="rounded-md border border-border bg-card px-4">
          {data.pipelineReconstruction.map((stage) => (
            <AccordionItem key={stage.id} value={stage.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="grid w-full gap-3 text-left md:grid-cols-[72px_1fr_auto] md:items-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {stage.id}
                  </span>
                  <span>
                    <span className="block font-medium">{stage.name}</span>
                    <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">
                      {stage.operation}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-1.5 md:justify-end">
                    <Chip tone={stage.automationLevel === "FULL" ? "green" : stage.automationLevel === "PARTIAL" ? "amber" : "neutral"}>
                      {stage.automationLevel}
                    </Chip>
                    <Chip>{stage.humanInvolvement}</Chip>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 border-t border-border pt-4 md:grid-cols-2">
                  <div className="rounded-md border border-border bg-background p-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Tool</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm">{stage.tool.name}</span>
                      <EvidenceBadge tier={stage.tool.evidenceTier} />
                      <ConfidenceBadge confidence={stage.tool.confidence} />
                    </div>
                  </div>
                  <div className="rounded-md border border-border bg-background p-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Primary failure mode
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.primaryFailureMode}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section>
        <SectionHeader eyebrow="Stack" title="Tooling Stack" />
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[860px] text-left font-mono text-xs">
            <thead className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-3">Layer</th>
                <th className="p-3">Likely tool</th>
                <th className="p-3">Evidence</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Why</th>
                <th className="p-3">Replacement risk</th>
              </tr>
            </thead>
            <tbody>
              {[...data.toolingStack].sort((a, b) => a.layer.localeCompare(b.layer)).map((row) => (
                <tr key={row.layer} className="border-b border-border last:border-b-0">
                  <td className="p-3 text-foreground">{row.layer}</td>
                  <td className="p-3">{row.likelyTool}</td>
                  <td className="p-3"><EvidenceBadge tier={row.evidenceTier} /></td>
                  <td className="p-3"><ConfidenceBadge confidence={row.confidence} /></td>
                  <td className="p-3 text-muted-foreground">{row.whyThisToolFits}</td>
                  <td className="p-3 text-muted-foreground">{row.replacementRisk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Queue" title="Automation Architecture" />
        <StateMachine flow={data.automationArchitecture} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-md border border-border bg-card p-4">
          <SectionHeader eyebrow="Org" title="Team Structure" />
          <p className="text-sm leading-relaxed text-muted-foreground">{data.teamStructure.notes}</p>
          <div className="mt-4 space-y-3">
            <RoleList label="Required" roles={data.teamStructure.requiredRoles} />
            <RoleList label="Optional" roles={data.teamStructure.optionalRoles} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ConfidenceList title="Evidence-Backed" items={data.confidenceMap.evidenceBacked} />
          <ConfidenceList title="Speculative" items={data.confidenceMap.speculative} />
        </div>
      </section>
    </div>
  )
}

function RoleList({ label, roles }: { label: string; roles: string[] }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {roles.map((role) => <Chip key={role}>{role}</Chip>)}
      </div>
    </div>
  )
}

function ConfidenceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  )
}
