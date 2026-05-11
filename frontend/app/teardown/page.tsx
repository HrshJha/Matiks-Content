"use client"

import { FormEvent, useState } from "react"
import { useCompletion } from "@ai-sdk/react"
import { AppShell } from "@/components/app-shell"
import { ArchitectureTab } from "@/components/teardown/architecture-tab"
import { BlueprintTab } from "@/components/teardown/blueprint-tab"
import { ReconTab } from "@/components/teardown/recon-tab"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Play, StopCircle } from "lucide-react"

type Phase = "A" | "B" | "C" | "DONE" | "IDLE"

export default function TeardownPage() {
  const [entityA, setEntityA] = useState("faceless finance reels")
  const [entityB, setEntityB] = useState("AI UGC DTC brand")
  const [activeTab, setActiveTab] = useState("recon")
  const [phase, setPhase] = useState<Phase>("IDLE")
  const [error, setError] = useState<string | null>(null)

  const blueprint = useCompletion({
    api: "/api/teardown",
    onFinish: () => setPhase("DONE"),
    onError: (err) => {
      setPhase("IDLE")
      setError(err.message)
    },
  })

  const architecture = useCompletion({
    api: "/api/teardown",
    onFinish: (_prompt, completion) => {
      setPhase("C")
      setActiveTab("blueprint")
      blueprint.complete("Run Prompt C", {
        body: { entityA, entityB, phase: "C", priorOutput: completion },
      })
    },
    onError: (err) => {
      setPhase("IDLE")
      setError(err.message)
    },
  })

  const recon = useCompletion({
    api: "/api/teardown",
    onFinish: (_prompt, completion) => {
      setPhase("B")
      setActiveTab("architecture")
      architecture.complete("Run Prompt B", {
        body: { entityA, entityB, phase: "B", priorOutput: completion },
      })
    },
    onError: (err) => {
      setPhase("IDLE")
      setError(err.message)
    },
  })

  const isRunning = recon.isLoading || architecture.isLoading || blueprint.isLoading

  function runTeardown(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPhase("A")
    setActiveTab("recon")
    architecture.setCompletion("")
    blueprint.setCompletion("")
    recon.complete("Run Prompt A", {
      body: { entityA, entityB, phase: "A" },
    })
  }

  function stopAll() {
    recon.stop()
    architecture.stop()
    blueprint.stop()
    setPhase("IDLE")
  }

  return (
    <AppShell active="/teardown">
      <div className="px-4 py-8 sm:px-8 lg:px-10">
        <div className="max-w-[1500px]">
          <header className="border-b border-border pb-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              02 · Teardown
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-pretty">
              Competitive intelligence for autonomous content systems.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Run the Precision Intelligence Protocol across Recon, Architecture, and Blueprint.
              The static framework stays visible until live analysis streams in.
            </p>
          </header>

          <section className="mt-6 rounded-md border border-border bg-card p-4">
            <form onSubmit={runTeardown} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <Field label="Entity A handle / niche">
                <Input value={entityA} onChange={(event) => setEntityA(event.target.value)} />
              </Field>
              <Field label="Entity B handle / niche">
                <Input value={entityB} onChange={(event) => setEntityB(event.target.value)} />
              </Field>
              <div className="flex gap-2">
                <Button type="submit" disabled={isRunning || !entityA || !entityB} className="min-w-40">
                  {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                  Run Teardown
                </Button>
                {isRunning && (
                  <Button type="button" variant="outline" size="icon" onClick={stopAll} aria-label="Stop teardown">
                    <StopCircle className="size-4" />
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ProgressStep label="RECON" active={phase === "A"} complete={["B", "C", "DONE"].includes(phase)} />
              <ProgressLine />
              <ProgressStep label="ARCHITECTURE" active={phase === "B"} complete={["C", "DONE"].includes(phase)} />
              <ProgressLine />
              <ProgressStep label="BLUEPRINT" active={phase === "C"} complete={phase === "DONE"} />
            </div>

            {error && (
              <div className="mt-4 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-md border border-border bg-card p-1">
              <TabsTrigger value="recon" className="rounded-sm font-mono text-[11px] uppercase tracking-widest">
                Recon
              </TabsTrigger>
              <TabsTrigger value="architecture" className="rounded-sm font-mono text-[11px] uppercase tracking-widest">
                Architecture
              </TabsTrigger>
              <TabsTrigger value="blueprint" className="rounded-sm font-mono text-[11px] uppercase tracking-widest">
                Blueprint
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recon" className="mt-6">
              <ReconTab streamedText={recon.completion} />
            </TabsContent>
            <TabsContent value="architecture" className="mt-6">
              <ArchitectureTab streamedText={architecture.completion} />
            </TabsContent>
            <TabsContent value="blueprint" className="mt-6">
              <BlueprintTab streamedText={blueprint.completion} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function ProgressStep({
  label,
  active,
  complete,
}: {
  label: string
  active: boolean
  complete: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : complete
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-border bg-background text-muted-foreground"
      }`}
    >
      <span className={`size-1.5 rounded-full ${active ? "animate-pulse bg-accent" : complete ? "bg-emerald-400" : "bg-muted-foreground"}`} />
      {label}
    </div>
  )
}

function ProgressLine() {
  return <span className="hidden h-px w-8 bg-border sm:block" />
}
