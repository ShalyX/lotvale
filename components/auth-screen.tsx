"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Brand } from "./brand";
import { authClient } from "@/lib/auth/client";
export function AuthScreen({ mode }: { mode: string }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(mode === "verify-email");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetComplete, setResetComplete] = useState(false);
  const signup = mode === "sign-up",
    forgot = mode === "forgot-password",
    reset = mode === "reset-password";
  useEffect(() => {
    if (reset) {
      const params = new URLSearchParams(window.location.search);
      setResetToken(params.get("token"));
      if (!params.get("token") || params.has("error"))
        setError("This reset link is invalid or expired. Request a new one.");
    }
  }, [reset]);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  async function resend() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (!verificationEmail.trim())
        throw Error("Enter your account email address first.");
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: verificationEmail.trim(),
        type: "email-verification",
      });
      if (result.error)
        throw Error(
          result.error.message || "Could not send a code. Please try again.",
        );
      setMessage("Check your inbox and spam folder for the verification code.");
      setCooldown(60);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send the code.");
    } finally {
      setBusy(false);
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      let result;
      if (verifying) {
        result = await authClient.emailOtp.verifyEmail({
          email: verificationEmail.trim(),
          otp: String(f.get("otp")).trim(),
        });
      } else if (forgot) {
        result = await authClient.requestPasswordReset({
          email: String(f.get("email")),
          redirectTo: window.location.origin + "/auth/reset-password",
        });
      } else if (reset) {
        const token = resetToken;
        if (!token)
          throw Error("This reset link is incomplete. Request a new one.");
        if (f.get("password") !== f.get("confirmPassword"))
          throw Error("The passwords do not match.");
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
      if (
        result.error &&
        !signup &&
        !reset &&
        !forgot &&
        result.error.code === "EMAIL_NOT_VERIFIED"
      ) {
        setVerificationEmail(String(f.get("email")));
        setVerifying(true);
        setCooldown(60);
        setMessage(
          "Verify your email to open your business workspace. Check your inbox for the code.",
        );
        return;
      }
      if (result.error)
        throw Error(result.error.message || "Could not complete this request.");
      if (
        signup &&
        !verifying &&
        !(
          result.data &&
          "user" in result.data &&
          result.data.user?.emailVerified
        )
      ) {
        setVerificationEmail(String(f.get("email")));
        setVerifying(true);
        setCooldown(60);
        setMessage(
          "Account created. Enter the code from your email to continue.",
        );
      } else if (forgot)
        setMessage(
          "If an account exists for that email, a reset link will be sent.",
        );
      else if (reset) {
        setMessage("Password updated. Sign in with your new password.");
        setResetComplete(true);
        window.history.replaceState({}, "", window.location.pathname);
      } else window.location.assign("/business");
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
            {verifying
              ? "Verify your email"
              : signup
                ? "Create your account"
                : forgot
                  ? "Reset your password"
                  : reset
                    ? "Choose a new password"
                    : "Welcome back."}
          </h2>
          <p>
            {verifying
              ? "Enter the six-digit code sent to your account email. Your purchases stay private until you verify."
              : signup
                ? "Your business details come next."
                : "Sign in to your cloud workspace."}
          </p>
          {!resetComplete && (!reset || resetToken) && (
            <form onSubmit={submit}>
              {signup && !verifying && (
                <label>
                  Your name
                  <input
                    disabled={busy}
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
                    key={verifying ? "verification-email" : "account-email"}
                    disabled={busy}
                    value={verifying ? verificationEmail : undefined}
                    onChange={
                      verifying
                        ? (e) => setVerificationEmail(e.target.value)
                        : undefined
                    }
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                  />
                </label>
              )}
              {verifying && (
                <label>
                  Verification code
                  <input
                    name="otp"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    disabled={busy}
                  />
                </label>
              )}
              {!forgot && !verifying && (
                <label>
                  Password
                  <input
                    disabled={busy}
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
              {reset && (
                <label>
                  Confirm new password
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    disabled={busy}
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
                  : verifying
                    ? "Verify email"
                    : signup
                      ? "Create account"
                      : forgot
                        ? "Send reset link"
                        : reset
                          ? "Update password"
                          : "Sign in"}
              </button>
            </form>
          )}
          {(resetComplete || (reset && !resetToken)) && (
            <p
              role={resetComplete ? "status" : "alert"}
              className={resetComplete ? "" : "form-error"}
            >
              {resetComplete ? message : error}
            </p>
          )}
          {verifying && (
            <button
              className="button secondary"
              disabled={busy || cooldown > 0}
              onClick={() => void resend()}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Send a new code"}
            </button>
          )}
          <div className="auth-links">
            <Link href={signup ? "/auth/sign-in" : "/auth/sign-up"}>
              {signup
                ? "Already have an account? Sign in"
                : "New to Lotvale? Create an account"}
            </Link>
            <Link href="/auth/forgot-password">Forgot password?</Link>
            <Link href="/auth/verify-email">Verify an existing account</Link>
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
