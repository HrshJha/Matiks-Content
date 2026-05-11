import type { ReconOutput } from "@/lib/schemas/teardown"
import { STATIC_RECON } from "@/lib/teardown-static"
import { ClaimCard, SectionHeader, StreamPanel } from "./teardown-primitives"

export function ReconTab({
  data = STATIC_RECON,
  streamedText,
}: {
  data?: ReconOutput
  streamedText?: string
}) {
  return (
    <div className="space-y-8">
      <StreamPanel title="Live Recon Stream" text={streamedText} />

      <section>
        <SectionHeader
          eyebrow="Prompt A"
          title="Recon"
          description="A side-by-side read of each entity's public content machinery: fingerprint, engagement signals, anomalies, and operating hypotheses."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {data.entities.map((entity) => (
            <div key={entity.entity} className="rounded-md border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-serif text-xl">{entity.entity}</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  entity column
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Content Fingerprint
                  </p>
                  <div className="space-y-2">
                    {entity.contentFingerprint.map((claim) => (
                      <ClaimCard key={claim.text} {...claim} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Engagement Signals
                  </p>
                  <div className="space-y-2">
                    {entity.engagementSignals.map((claim) => (
                      <ClaimCard key={claim.text} {...claim} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Cross-entity" title="Anomaly Log" />
          <div className="space-y-2">
            {data.anomalyLog.map((claim) => (
              <ClaimCard key={claim.text} {...claim} />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader eyebrow="Cross-entity" title="Hypotheses" />
          <div className="space-y-2">
            {data.hypotheses.map((claim) => (
              <ClaimCard key={claim.text} {...claim} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
