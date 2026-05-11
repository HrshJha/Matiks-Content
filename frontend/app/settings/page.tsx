import { AppShell } from "@/components/app-shell";
import { CHANNELS } from "@backend/data";
import { AddChannelDialog } from "@/components/add-channel-dialog";
import {
  Shield,
  Key,
  Clock,
  Mic,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// Simulated config state for each channel mapping
const CHANNEL_CONFIG = CHANNELS.map((c) => ({
  ...c,
  voiceId: c.voice.includes("custom")
    ? `voice_${c.handle.replace(/\./g, "_")}`
    : null,
  postingWindow: c.cadence.includes("3/d")
    ? "06:00–09:00, 12:00–14:00, 18:00–21:00 IST"
    : "07:00–09:00, 18:00–21:00 IST",
  igConnected: c.status === "live" || c.status === "ramping",
  tokenExpiry: c.status === "live" ? "2026-07-14" : c.status === "ramping" ? "2026-06-28" : null,
  proxyId: c.status === "live" ? `proxy_res_${Math.floor(Math.random() * 20) + 1}` : null,
  modelStack: c.engineStack.slice(0, 3).join(" → "),
  systemPromptLength: Math.floor(Math.random() * 800) + 400,
}));

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`size-1.5 rounded-full shrink-0 ${
        ok ? "bg-foreground" : "bg-accent"
      }`}
    />
  );
}

export default function SettingsPage() {
  const connectedCount = CHANNEL_CONFIG.filter((c) => c.igConnected).length;
  const voiceCount = CHANNEL_CONFIG.filter((c) => c.voiceId).length;

  return (
    <AppShell active="/settings">
      {/* Header */}
      <section className="px-6 sm:px-10 py-12 border-b border-border">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>08 · Settings</span>
          <span className="size-1 rounded-full bg-accent" />
          <span className="text-accent">operator-only</span>
        </div>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          Channels are config rows,{" "}
          <span className="text-accent">not people.</span>
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Each channel is one Postgres row: niche, voice ID, posting window,
          IG credentials (encrypted at rest), model stack, and system prompt.
          Adding channel #13 tomorrow is an INSERT and an OAuth flow — not a
          hire.
        </p>
      </section>

      {/* Summary strip */}
      <section className="border-b border-border bg-card/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {[
            {
              label: "Channels configured",
              value: String(CHANNEL_CONFIG.length),
              sub: `${CHANNEL_CONFIG.filter((c) => c.status === "live").length} live · ${CHANNEL_CONFIG.filter((c) => c.status === "ramping").length} ramping`,
            },
            {
              label: "IG accounts linked",
              value: `${connectedCount}/${CHANNEL_CONFIG.length}`,
              sub: "OAuth + encrypted token storage",
            },
            {
              label: "Voice IDs assigned",
              value: `${voiceCount}/${CHANNEL_CONFIG.length}`,
              sub: "ElevenLabs multilingual v2",
            },
            {
              label: "Encryption",
              value: "AES-GCM",
              sub: "256-bit · tokens encrypted at rest",
            },
          ].map((m) => (
            <div key={m.label} className="bg-background px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.label}
              </p>
              <p className="mt-2 font-serif text-2xl leading-none">{m.value}</p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                {m.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Channel config list */}
      <section className="p-6 sm:p-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Channel configuration
            </p>
            <h2 className="font-serif text-2xl mt-1">Per-channel settings</h2>
          </div>
          <AddChannelDialog />
        </div>

        <div className="space-y-3">
          {CHANNEL_CONFIG.map((c) => (
            <div
              key={c.id}
              className="rounded-md border border-border bg-card overflow-hidden"
            >
              {/* Channel header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      c.status === "live"
                        ? "bg-foreground text-background"
                        : c.status === "ramping"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="font-mono text-xs">@{c.handle}</span>
                  <span className="text-sm text-muted-foreground">
                    {c.niche}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                  <span>{c.language}</span>
                  <span>·</span>
                  <span>{c.cadence}</span>
                  <span>·</span>
                  <span>
                    {(c.followers / 1000).toFixed(0)}k followers
                  </span>
                </div>
              </div>

              {/* Config grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50">
                {/* Voice */}
                <div className="bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Mic className="size-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Voice ID
                    </span>
                  </div>
                  {c.voiceId ? (
                    <div className="flex items-center gap-1.5">
                      <StatusDot ok />
                      <span className="font-mono text-xs">{c.voiceId}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <StatusDot ok={false} />
                      <span className="font-mono text-xs text-muted-foreground">
                        Not assigned
                      </span>
                    </div>
                  )}
                </div>

                {/* Posting window */}
                <div className="bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="size-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Posting window
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {c.postingWindow}
                  </p>
                </div>

                {/* IG OAuth */}
                <div className="bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Key className="size-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      IG credentials
                    </span>
                  </div>
                  {c.igConnected ? (
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3 text-foreground" />
                        <span className="font-mono text-xs">Connected</span>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">
                        token expires {c.tokenExpiry}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="size-3 text-accent" />
                      <span className="font-mono text-xs text-muted-foreground">
                        Not connected
                      </span>
                    </div>
                  )}
                </div>

                {/* Model stack */}
                <div className="bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Globe className="size-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Model stack
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {c.modelStack}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
                    system prompt: {c.systemPromptLength} tokens
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & encryption info */}
      <section className="border-t border-border p-6 sm:p-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Security
            </p>
            <h2 className="font-serif text-2xl mt-1">
              Credentials are never stored in plaintext.
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-md border border-border bg-card p-4">
            <Shield className="size-4 text-muted-foreground mb-2" />
            <p className="font-medium text-sm">AES-256-GCM encryption</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              All Instagram access tokens are encrypted at rest using
              AES-256-GCM with a 32-byte key stored in environment
              variables. Tokens are decrypted only at the moment of API
              call.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <Key className="size-4 text-muted-foreground mb-2" />
            <p className="font-medium text-sm">Row-Level Security</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Every table uses Supabase RLS policies scoped to{" "}
              <code className="font-mono text-[11px]">auth.uid()</code>.
              Operators can only see their own channels, reels, and
              metrics. Service role is used only for cron jobs.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <AlertTriangle className="size-4 text-muted-foreground mb-2" />
            <p className="font-medium text-sm">Token rotation</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Long-lived IG tokens expire after 60 days. The system
              monitors expiry dates and alerts the operator 7 days
              before expiration to re-authenticate via OAuth.
            </p>
          </div>
        </div>


      </section>
    </AppShell>
  );
}