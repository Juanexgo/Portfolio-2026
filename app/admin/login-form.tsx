"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { ok: false };

interface LoginFormProps {
  configured: boolean;
}

export function LoginForm({ configured }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 grid-bg mask-radial opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(199 92% 60% / 0.18), transparent 60%)",
        }}
      />
      <form
        action={formAction}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.07] bg-card/60 p-7 backdrop-blur-2xl"
        style={{
          boxShadow:
            "inset 0 1px 0 0 hsl(0 0% 100% / 0.05), 0 24px 64px -24px hsl(199 92% 60% / 0.18)",
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold text-foreground">
              Portfolio Admin
            </div>
            <div className="text-xs text-muted-foreground">
              Enter password to edit content
            </div>
          </div>
        </div>

        {!configured ? (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
            <div>
              <div className="font-medium text-amber-100">
                ADMIN_PASSWORD not set
              </div>
              <div className="mt-1 leading-relaxed">
                Create a{" "}
                <code className="rounded bg-amber-400/10 px-1 font-mono">
                  .env.local
                </code>{" "}
                file at the project root with:
                <pre className="mt-1.5 rounded-md bg-black/30 p-2 font-mono text-[0.65rem] text-amber-100">
                  ADMIN_PASSWORD=your_password_here
                </pre>
                Then restart the dev server.
              </div>
            </div>
          </div>
        ) : null}

        <label
          htmlFor="admin-password"
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Password
        </label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            disabled={!configured}
            className="h-10 w-full rounded-lg border border-border/60 bg-background/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50"
            placeholder={configured ? "••••••••" : "Set ADMIN_PASSWORD first"}
          />
        </div>

        {state.error ? (
          <div className="mt-3 text-xs text-rose-300">{state.error}</div>
        ) : null}

        <SubmitButton disabled={!configured} />

        <div className="mt-5 text-center text-[0.65rem] uppercase tracking-wider text-muted-foreground/60">
          Local editor — no data leaves your browser
        </div>
      </form>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="mt-4 w-full"
      disabled={disabled || pending}
    >
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}
