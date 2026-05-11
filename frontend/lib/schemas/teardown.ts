import { z } from "zod"

export const EvidenceTier = z.enum(["CONFIRMED", "INFERRED", "SPECULATIVE"])
export const ConfidenceLevel = z.enum(["LOW", "MEDIUM", "HIGH"])
export const AutomationLevel = z.enum(["FULL", "PARTIAL", "MANUAL"])
export const HumanInvolvement = z.enum(["NONE", "EXCEPTION", "REQUIRED"])

const ClaimSchema = z.object({
  text: z.string(),
  evidenceTier: EvidenceTier,
  confidence: ConfidenceLevel.optional(),
})

const EntityReconSchema = z.object({
  entity: z.string(),
  contentFingerprint: z.array(ClaimSchema),
  engagementSignals: z.array(ClaimSchema),
})

export const ReconOutput = z.object({
  entities: z.tuple([EntityReconSchema, EntityReconSchema]),
  anomalyLog: z.array(ClaimSchema),
  hypotheses: z.array(ClaimSchema),
})

const PipelineStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  operation: z.string(),
  tool: z.object({
    name: z.string(),
    evidenceTier: EvidenceTier,
    confidence: ConfidenceLevel,
  }),
  automationLevel: AutomationLevel,
  humanInvolvement: HumanInvolvement,
  primaryFailureMode: z.string(),
})

const ToolingRowSchema = z.object({
  layer: z.string(),
  likelyTool: z.string(),
  evidenceTier: EvidenceTier,
  confidence: ConfidenceLevel,
  whyThisToolFits: z.string(),
  replacementRisk: z.string(),
})

export const ArchitectureOutput = z.object({
  pipelineReconstruction: z.array(PipelineStageSchema),
  toolingStack: z.array(ToolingRowSchema),
  automationArchitecture: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      transition: z.string(),
    }),
  ),
  teamStructure: z.object({
    requiredRoles: z.array(z.string()),
    optionalRoles: z.array(z.string()),
    notes: z.string(),
  }),
  confidenceMap: z.object({
    evidenceBacked: z.array(z.string()),
    speculative: z.array(z.string()),
  }),
})

const TechStackRowSchema = z.object({
  layer: z.string(),
  primary: z.string(),
  fallback: z.string(),
  cost: z.string(),
  integrationComplexity: z.string(),
  why: z.string(),
})

const SopSchema = z.object({
  id: z.string(),
  title: z.string(),
  trigger: z.string(),
  timeEstimate: z.string(),
  steps: z.array(z.string()),
})

const CostRowSchema = z.object({
  item: z.string(),
  mvp: z.string(),
  intermediate: z.string(),
  industrial: z.string(),
})

export const BlueprintOutput = z.object({
  techStack: z.array(TechStackRowSchema),
  databaseSchema: z.string(),
  sopLibrary: z.array(SopSchema),
  scalingRoadmap: z.object({
    phases: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        throughput: z.string(),
      }),
    ),
    softwareProviderCosts: z.array(CostRowSchema),
    humanOperatingCosts: z.array(CostRowSchema),
  }),
  riskRegister: z.array(
    z.object({
      risk: z.string(),
      probability: z.string(),
      impact: z.string(),
      detectionSignal: z.string(),
      mitigation: z.string(),
      highlight: z.boolean().optional(),
    }),
  ),
  moatAnalysis: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
})

export type EvidenceTier = z.infer<typeof EvidenceTier>
export type ConfidenceLevel = z.infer<typeof ConfidenceLevel>
export type AutomationLevel = z.infer<typeof AutomationLevel>
export type HumanInvolvement = z.infer<typeof HumanInvolvement>
export type ReconOutput = z.infer<typeof ReconOutput>
export type ArchitectureOutput = z.infer<typeof ArchitectureOutput>
export type BlueprintOutput = z.infer<typeof BlueprintOutput>
