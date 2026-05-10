"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@backend/supabase/client";
import { Loader2, Mail } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="size-12 rounded-sm bg-foreground text-background grid place-items-center mx-auto mb-4">
            <span className="font-mono text-sm tracking-tight">M</span>
          </div>
          <h1 className="font-serif text-3xl">Sign in to Matiks</h1>
          <p className="mt-2 text-muted-foreground">
            Magic link authentication via Supabase
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-6">
          {sent ? (
            <div className="text-center py-8">
              <div className="size-10 rounded-full bg-accent/10 text-accent grid place-items-center mx-auto mb-4">
                <Mail className="size-5" />
              </div>
              <h2 className="font-serif text-xl">Check your email</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a magic link to <span className="text-foreground font-mono">{email}</span>
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Click the link in the email to sign in. The link expires in 1 hour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              {error && (
                <div className="rounded border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:bg-foreground/90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending magic link...
                  </>
                ) : (
                  "Send magic link"
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border/60"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="bg-card px-2">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  // Instant redirect for demo/hiring managers
                  window.location.href = "/";
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                Continue as Guest (Demo)
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}