import type { ReelBrief } from "@backend/schemas/reel-brief"

export function formatExportDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function formatExportTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date)
}

export function createReelBriefPdfFilename(channelHandle: string, date = new Date()) {
  const channel = slugifyChannel(channelHandle)
  return `frameos-brief-${channel}-${formatExportDate(date)}.pdf`
}

export function estimateBriefDuration(brief: ReelBrief) {
  const beatSeconds = brief.script.beats.length * 8
  return `${7 + 8 + beatSeconds + 5}s`
}

export function getTimelineRows(brief: ReelBrief) {
  const rows: {
    label: string
    time: string
    line: string
    broll?: string
  }[] = [
    { label: "Hook", time: "0:00 - 0:07", line: brief.script.hook },
    { label: "Context", time: "0:07 - 0:15", line: brief.script.context },
  ]

  brief.script.beats.forEach((beat, index) => {
    const start = 15 + index * 8
    rows.push({
      label: `Beat ${index + 1}`,
      time: `0:${String(start).padStart(2, "0")} - 0:${String(start + 8).padStart(2, "0")}`,
      line: beat.line,
      broll: beat.broll,
    })
  })

  const ctaStart = 15 + brief.script.beats.length * 8
  rows.push({
    label: "CTA",
    time: `0:${String(ctaStart).padStart(2, "0")} - 0:${String(ctaStart + 5).padStart(2, "0")}`,
    line: brief.script.cta,
  })

  return rows
}

function slugifyChannel(channelHandle: string) {
  const normalized = channelHandle
    .replace(/^@/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")

  return normalized || "channel"
}
