"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Brand } from "./brand";
import { authClient } from "@/lib/auth/client";
export function AuthScreen({ mode }: { mode: string }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const signup = mode === "sign-up",
    forgot = mode === "forgot-password",
    reset = mode === "reset-password";
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      let result;
      if (forgot) {
        result = await authClient.requestPasswordReset({
          email: String(f.get("email")),
          redirectTo: window.location.origin + "/auth/reset-password",
        });
      } else if (reset) {
        const token = new URLSearchParams(location.search).get("token");
        if (!token)
          throw Error("This reset link is incomplete. Request a new one.");
        result = await authClient.resetPassword({
          newPassword: String(f.get("password")),
          token,
        });
      } else if (signup) {
        result = await authClient.signUp.email({
          name: String(f.get("name")),
          email: String(f.get("email")),
          password: String(f.get("password")),
        });
      } else {
        result = await authClient.signIn.email({
          email: String(f.get("email")),
          password: String(f.get("password")),
        });
      }
      if (result.error)
        throw Error(result.error.message || "Could not complete this request.");
      if (forgot)
        setMessage(
          "If an account exists for that email, a reset link will be sent.",
        );
      else if (reset) setMessage("Password updated. You can sign in now.");
      else window.location.assign("/business");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="business-entry">
      <header>
        <Link href="/" aria-label="Lotvale home">
          <Brand />
        </Link>
        <Link href="/app?sample=1">Try the sample purchase ↗</Link>
      </header>
      <main className="auth-layout">
        <section className="auth-intro">
          <span className="eyebrow">YOUR BUSINESS, ALL TOGETHER</span>
          <h1>A home for every purchase.</h1>
          <p>
            Keep your quotes, buying decisions and order drafts together. Pick
            up where you left off, from another browser or device.
          </p>
          <div className="auth-rule">
            One business. A clear view of what comes next.
          </div>
        </section>
        <section className="auth-panel">
          <h2>
            {signup
              ? "Create your account"
              : forgot
                ? "Reset your password"
                : reset
                  ? "Choose a new password"
                  : "Welcome back."}
          </h2>
          <p>
            {signup
              ? "Your business details come next."
              : "Sign in to your cloud workspace."}
          </p>
          <form onSubmit={submit}>
            {signup && (
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={160}
                />
              </label>
            )}
            {!reset && (
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                />
              </label>
            )}
            {!forgot && (
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    signup || reset ? "new-password" : "current-password"
                  }
                  minLength={8}
                  maxLength={128}
                  required
                />
              </label>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            {message && <p role="status">{message}</p>}
            <button className="button primary" disabled={busy}>
              {busy
                ? "Please wait…"
                : signup
                  ? "Create account"
                  : forgot
                    ? "Send reset link"
                    : reset
                      ? "Update password"
                      : "Sign in"}
            </button>
          </form>
          <div className="auth-links">
            <Link href={signup ? "/auth/sign-in" : "/auth/sign-up"}>
              {signup
                ? "Already have an account? Sign in"
                : "New to Lotvale? Create an account"}
            </Link>
            <Link href="/auth/forgot-password">Forgot password?</Link>
            {reset && <Link href="/auth/sign-in">Return to sign in</Link>}
          </div>
          <p className="quiet">
            The sample purchase stays available without an account. Your
            business purchases are stored in your account.
          </p>
        </section>
      </main>
    </div>
  );
}
