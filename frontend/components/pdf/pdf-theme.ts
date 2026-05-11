import { StyleSheet } from "@react-pdf/renderer"

export const pdfColors = {
  paper: "#f7f1e7",
  paperDeep: "#eee3d2",
  ink: "#1c1915",
  mutedInk: "#6f665a",
  faintInk: "#968a7a",
  rule: "#d8c9b6",
  card: "#fbf7ef",
  accent: "#b05a20",
  accentPale: "#ead4be",
}

export const pdfFonts = {
  serif: "Times-Roman",
  serifBold: "Times-Bold",
  sans: "Helvetica",
  sansBold: "Helvetica-Bold",
  mono: "Courier",
  monoBold: "Courier-Bold",
}

export const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: pdfColors.paper,
    color: pdfColors.ink,
    fontFamily: pdfFonts.sans,
    fontSize: 10,
    lineHeight: 1.45,
    paddingTop: 44,
    paddingRight: 42,
    paddingBottom: 54,
    paddingLeft: 42,
  },
  topRule: {
    borderTopWidth: 1.5,
    borderTopColor: pdfColors.ink,
    borderTopStyle: "solid",
    paddingTop: 12,
  },
  kicker: {
    color: pdfColors.mutedInk,
    fontFamily: pdfFonts.monoBold,
    fontSize: 7.5,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: pdfFonts.serifBold,
    fontSize: 31,
    lineHeight: 1,
  },
  subtitle: {
    color: pdfColors.mutedInk,
    fontFamily: pdfFonts.sans,
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  metaGrid: {
    borderTopWidth: 1,
    borderTopColor: pdfColors.rule,
    borderTopStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.rule,
    borderBottomStyle: "solid",
    flexDirection: "row",
    marginTop: 18,
    paddingVertical: 10,
  },
  metaCell: {
    flexGrow: 1,
    flexBasis: 0,
    paddingRight: 12,
  },
  label: {
    color: pdfColors.faintInk,
    fontFamily: pdfFonts.monoBold,
    fontSize: 7,
    letterSpacing: 0.8,
    marginBottom: 3,
    textTransform: "uppercase",
  },
  metaValue: {
    color: pdfColors.ink,
    fontFamily: pdfFonts.sansBold,
    fontSize: 9.5,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  sectionNumber: {
    color: pdfColors.accent,
    fontFamily: pdfFonts.monoBold,
    fontSize: 7.5,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: pdfFonts.serifBold,
    fontSize: 17,
  },
  sectionSub: {
    color: pdfColors.mutedInk,
    fontSize: 8,
  },
  card: {
    backgroundColor: pdfColors.card,
    borderWidth: 1,
    borderColor: pdfColors.rule,
    borderStyle: "solid",
    padding: 12,
  },
  hookText: {
    fontFamily: pdfFonts.serifBold,
    fontSize: 17,
    lineHeight: 1.18,
  },
  body: {
    fontSize: 10.5,
    lineHeight: 1.45,
  },
  smallMuted: {
    color: pdfColors.mutedInk,
    fontSize: 8.5,
    lineHeight: 1.35,
  },
  monoSmall: {
    color: pdfColors.mutedInk,
    fontFamily: pdfFonts.mono,
    fontSize: 8,
    lineHeight: 1.35,
  },
  footer: {
    bottom: 26,
    color: pdfColors.mutedInk,
    fontFamily: pdfFonts.mono,
    fontSize: 7,
    left: 42,
    position: "absolute",
    right: 42,
  },
})
