import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  return (
    <AppShell active="/settings">
      <section className="px-6 sm:px-10 py-12 border-b border-border">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Settings</span>
        </div>
        <h1 className="mt-3 font-serif text-4xl leading-[1.05]">
          Channel configuration
        </h1>
        <p className="mt-5 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Configure per-channel settings including voice IDs, posting windows, 
          and Instagram OAuth tokens. Tokens are encrypted at rest.
        </p>
      </section>

      <section className="p-6 sm:p-8">
        <div className="rounded-md border border-border bg-card p-8 text-center">
          <p className="font-serif text-xl">Channel settings</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect Supabase to enable channel management.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-muted/50 font-mono text-xs text-muted-foreground">
            NEXT_PUBLIC_SUPABASE_URL not configured
          </div>
        </div>
      </section>
    </AppShell>
  );
}