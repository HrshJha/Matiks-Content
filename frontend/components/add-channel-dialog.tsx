"use client";

import { useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

type FormState = {
  handle: string;
  niche: string;
  language: "EN" | "HI" | "ES" | "PT";
  status: "active" | "paused" | "warming";
  voiceId: string;
  postingWindow: string;
};

const DEFAULTS: FormState = {
  handle: "",
  niche: "",
  language: "EN",
  status: "warming",
  voiceId: "",
  postingWindow: "",
};

export function AddChannelDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function close() {
    setOpen(false);
    setForm(DEFAULTS);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        handle: form.handle.replace(/^@/, "").trim(),
        niche: form.niche.trim(),
        language: form.language,
        status: form.status,
        ...(form.voiceId.trim() ? { voiceId: form.voiceId.trim() } : {}),
        ...(form.postingWindow.trim()
          ? { postingWindow: form.postingWindow.trim() }
          : {}),
      };

      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg =
          json?.error ??
          (json?.details
            ? JSON.stringify(json.details)
            : "Failed to create channel");
        setError(msg);
        return;
      }

      close();
      router.refresh(); // re-fetch server component data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        id="add-channel-btn"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-3 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors"
      >
        <Plus className="size-3.5" />
        Add channel
      </button>

      {/* Modal backdrop + dialog */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          aria-labelledby="add-channel-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card shadow-xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  New channel
                </p>
                <h2
                  id="add-channel-title"
                  className="font-serif text-xl mt-0.5"
                >
                  Add a channel
                </h2>
              </div>
              <button
                onClick={close}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Handle */}
              <div className="space-y-1.5">
                <label
                  htmlFor="channel-handle"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Handle <span className="text-accent">*</span>
                </label>
                <div className="flex items-center rounded-md border border-border bg-background focus-within:ring-1 focus-within:ring-foreground/30">
                  <span className="pl-3 text-muted-foreground text-sm select-none">
                    @
                  </span>
                  <input
                    id="channel-handle"
                    name="handle"
                    type="text"
                    required
                    placeholder="reelsbyharsh"
                    value={form.handle}
                    onChange={handleChange}
                    className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Niche */}
              <div className="space-y-1.5">
                <label
                  htmlFor="channel-niche"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Niche <span className="text-accent">*</span>
                </label>
                <input
                  id="channel-niche"
                  name="niche"
                  type="text"
                  required
                  placeholder="e.g. Personal finance · India"
                  value={form.niche}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-foreground/30"
                />
              </div>

              {/* Language + Status — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="channel-language"
                    className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    Language
                  </label>
                  <select
                    id="channel-language"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-foreground/30"
                  >
                    <option value="EN">EN — English</option>
                    <option value="HI">HI — Hindi</option>
                    <option value="ES">ES — Spanish</option>
                    <option value="PT">PT — Portuguese</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="channel-status"
                    className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    Status
                  </label>
                  <select
                    id="channel-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-foreground/30"
                  >
                    <option value="warming">Warming</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              {/* Voice ID (optional) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="channel-voice"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Voice ID{" "}
                  <span className="normal-case text-muted-foreground/60">
                    (optional)
                  </span>
                </label>
                <input
                  id="channel-voice"
                  name="voiceId"
                  type="text"
                  placeholder="ElevenLabs voice ID"
                  value={form.voiceId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-foreground/30"
                />
              </div>

              {/* Posting window (optional) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="channel-window"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Posting window{" "}
                  <span className="normal-case text-muted-foreground/60">
                    (optional)
                  </span>
                </label>
                <input
                  id="channel-window"
                  name="postingWindow"
                  type="text"
                  placeholder="e.g. 07:00–09:00, 18:00–21:00 IST"
                  value={form.postingWindow}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-foreground/30"
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="rounded-md bg-accent/10 border border-accent/30 px-3 py-2.5 text-sm text-accent font-mono">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={submitting}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  id="add-channel-submit"
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create channel"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
