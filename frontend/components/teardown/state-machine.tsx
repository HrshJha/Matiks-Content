import { STATUS_FLOW } from "@/lib/teardown-static"

const NODES = ["ideation", "scripting", "asset_gen", "qa", "scheduled", "posted", "analyzed", "failed"]

export function StateMachine({ flow = STATUS_FLOW }: { flow?: typeof STATUS_FLOW }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card p-4">
      <svg viewBox="0 0 1060 220" className="min-h-[220px] min-w-[980px]">
        {NODES.slice(0, 7).map((node, index) => {
          const x = 40 + index * 145
          return (
            <g key={node}>
              {index < 6 && (
                <>
                  <line x1={x + 104} y1="82" x2={x + 137} y2="82" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <path d={`M ${x + 137} 82 l -6 -4 v 8 z`} fill="currentColor" className="text-muted-foreground" />
                  <text x={x + 116} y="68" textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]">
                    {flow[index]?.transition.split(" ").slice(0, 2).join(" ")}
                  </text>
                </>
              )}
              <rect x={x} y="52" width="104" height="60" rx="6" className="fill-background stroke-border" />
              <text x={x + 52} y="87" textAnchor="middle" className="fill-foreground font-mono text-[11px]">
                {node}
              </text>
            </g>
          )
        })}
        <path d="M 476 112 C 476 172, 912 172, 912 120" fill="none" stroke="rgb(251 191 36 / 0.45)" strokeWidth="1.5" />
        <path d="M 912 120 l -5 7 h 10 z" fill="rgb(251 191 36 / 0.8)" />
        <rect x="860" y="142" width="104" height="48" rx="6" className="fill-background stroke-amber-500/40" />
        <text x="912" y="171" textAnchor="middle" className="fill-amber-300 font-mono text-[11px]">
          failed
        </text>
        <text x="694" y="160" textAnchor="middle" className="fill-amber-300 font-mono text-[10px]">
          exception / timeout / policy reject
        </text>
      </svg>
    </div>
  )
}
