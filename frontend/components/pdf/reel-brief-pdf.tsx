import {
  type DocumentProps,
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer"
import type React from "react"
import type { ReelBrief } from "@backend/schemas/reel-brief"
import { estimateBriefDuration, formatExportTimestamp, getTimelineRows } from "@/components/pdf/pdf-utils"
import { pdfColors, pdfFonts, pdfStyles } from "@/components/pdf/pdf-theme"

type ReelBriefPdfProps = {
  brief: ReelBrief
  channelHandle: string
  generatedAt: Date
}

export function ReelBriefPdf({
  brief,
  channelHandle,
  generatedAt,
}: ReelBriefPdfProps): React.ReactElement<DocumentProps> {
  const exportedAt = formatExportTimestamp(generatedAt)
  const duration = estimateBriefDuration(brief)
  const timelineRows = getTimelineRows(brief)

  return (
    <Document
      title={`Frame OS Reel Brief - ${channelHandle}`}
      author="Frame OS"
      subject="AI Studio Reel Brief"
      creator="Frame OS AI Studio"
      producer="Frame OS"
    >
      <Page size="A4" style={pdfStyles.page} wrap>
        <View fixed style={pdfStyles.footer}>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: pdfColors.rule,
              borderTopStyle: "solid",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 8,
            }}
          >
            <Text>Confidential - Frame OS</Text>
            <Text
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
            />
          </View>
        </View>

        <View style={pdfStyles.topRule}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 18 }}>
            <View style={{ flex: 1 }}>
              <Text style={pdfStyles.kicker}>Frame OS / AI Studio / Reel Dossier</Text>
              <Text style={[pdfStyles.title, { marginTop: 7 }]}>Reel Brief</Text>
              <Text style={[pdfStyles.subtitle, { marginTop: 8 }]}>
                Structured production handoff for scripting, voiceover, asset resolution,
                captions, thumbnail direction, and operator review.
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", justifyContent: "flex-start", width: 138 }}>
              <Text style={pdfStyles.kicker}>Channel</Text>
              <Text style={{ fontFamily: pdfFonts.serifBold, fontSize: 18, marginTop: 5 }}>
                @{channelHandle.replace(/^@/, "")}
              </Text>
            </View>
          </View>

          <View style={pdfStyles.metaGrid}>
            <Meta label="Cluster" value={brief.cluster} />
            <Meta label="Duration" value={duration} />
            <Meta label="Hooks" value={`${brief.hooks.length} variants`} />
            <Meta label="Exported" value={exportedAt} />
          </View>
        </View>

        <PdfSection number="01" title="Primary Hook" subtitle="First-three-seconds operator lock.">
          <View style={pdfStyles.card} wrap={false}>
            <Text style={pdfStyles.hookText}>{brief.hooks[0]}</Text>
          </View>
        </PdfSection>

        <PdfSection number="02" title="Hook Variants" subtitle="Alternate openings for A/B/n testing.">
          <View style={{ gap: 8 }}>
            {brief.hooks.map((hook, index) => (
              <View key={`${hook}-${index}`} style={pdfStyles.card} wrap={false}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text style={[pdfStyles.label, { color: pdfColors.accent, width: 18 }]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                  <Text style={[pdfStyles.body, { flex: 1, fontFamily: pdfFonts.serifBold, fontSize: 13 }]}>
                    {hook}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </PdfSection>

        <PdfSection number="03" title="Script Timeline" subtitle="Timestamped voiceover and B-roll handoff.">
          <View style={{ borderWidth: 1, borderColor: pdfColors.rule, borderStyle: "solid" }}>
            {timelineRows.map((row, index) => (
              <View
                key={`${row.label}-${index}`}
                minPresenceAhead={46}
                style={{
                  backgroundColor: index % 2 === 0 ? pdfColors.card : pdfColors.paper,
                  borderBottomWidth: index === timelineRows.length - 1 ? 0 : 1,
                  borderBottomColor: pdfColors.rule,
                  borderBottomStyle: "solid",
                  flexDirection: "row",
                  gap: 12,
                  padding: 11,
                }}
              >
                <View style={{ width: 76 }}>
                  <Text style={pdfStyles.label}>{row.label}</Text>
                  <Text style={pdfStyles.monoSmall}>{row.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={pdfStyles.body}>{row.line}</Text>
                  {row.broll ? (
                    <Text style={[pdfStyles.monoSmall, { marginTop: 5 }]}>B-roll: {row.broll}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </PdfSection>

        <View style={{ flexDirection: "row", gap: 16 }} wrap={false}>
          <PdfSection number="04" title="Voice Profile" grow>
            <View style={pdfStyles.card}>
              <Text style={pdfStyles.body}>{brief.voiceDirection}</Text>
            </View>
          </PdfSection>

          <PdfSection number="05" title="CTA" grow>
            <View style={pdfStyles.card}>
              <Text style={pdfStyles.body}>{brief.script.cta}</Text>
            </View>
          </PdfSection>
        </View>

        <PdfSection number="06" title="Caption" subtitle="Instagram-ready post copy.">
          <View style={pdfStyles.card} wrap={false}>
            <Text style={pdfStyles.body}>{brief.caption}</Text>
          </View>
        </PdfSection>

        <PdfSection number="07" title="Hashtags" subtitle="Stored without hash symbols in schema.">
          <View style={[pdfStyles.card, { flexDirection: "row", flexWrap: "wrap", gap: 6 }]}>
            {brief.hashtags.map((tag) => (
              <Text
                key={tag}
                style={{
                  backgroundColor: pdfColors.paperDeep,
                  borderWidth: 1,
                  borderColor: pdfColors.rule,
                  borderStyle: "solid",
                  color: pdfColors.ink,
                  fontFamily: pdfFonts.mono,
                  fontSize: 8,
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                }}
              >
                #{tag}
              </Text>
            ))}
          </View>
        </PdfSection>

        <PdfSection number="08" title="Thumbnail Direction" subtitle="Image-generation prompt and cover intent.">
          <View style={pdfStyles.card} wrap={false}>
            <Text style={pdfStyles.monoSmall}>{brief.thumbnailPrompt}</Text>
          </View>
        </PdfSection>

        <PdfSection number="09" title="Operator QA" subtitle="Risk notes for review routing.">
          <View
            style={[
              pdfStyles.card,
              {
                backgroundColor:
                  brief.riskNotes.toLowerCase() === "none" ? pdfColors.card : pdfColors.accentPale,
                borderColor:
                  brief.riskNotes.toLowerCase() === "none" ? pdfColors.rule : pdfColors.accent,
              },
            ]}
            wrap={false}
          >
            <Text style={pdfStyles.body}>{brief.riskNotes}</Text>
          </View>
        </PdfSection>
      </Page>
    </Document>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={pdfStyles.metaCell}>
      <Text style={pdfStyles.label}>{label}</Text>
      <Text style={pdfStyles.metaValue}>{value}</Text>
    </View>
  )
}

function PdfSection({
  number,
  title,
  subtitle,
  children,
  grow = false,
}: {
  number: string
  title: string
  subtitle?: string
  children: React.ReactNode
  grow?: boolean
}) {
  const sectionStyle = grow ? [pdfStyles.section, { flex: 1 }] : pdfStyles.section

  return (
    <View style={sectionStyle}>
      <View style={pdfStyles.sectionHeader}>
        <Text style={pdfStyles.sectionNumber}>{number}</Text>
        <Text style={pdfStyles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={pdfStyles.sectionSub}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  )
}
