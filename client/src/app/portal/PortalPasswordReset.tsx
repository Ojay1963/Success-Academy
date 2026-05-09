import { useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router";
import SEO from "../components/SEO";
import { portalRoleMeta, type PortalRole } from "../content/portal";
import { campusImages } from "../content/site";
import { apiRequest } from "./api";
import { usePortalAuth } from "./AuthContext";
import { PortalLoadingScreen } from "./PortalComponents";

const resetRoles = ["student", "parent"] as const;

function isResetRole(value: string | undefined): value is Extract<PortalRole, "student" | "parent"> {
  return Boolean(value && resetRoles.includes(value as Extract<PortalRole, "student" | "parent">));
}

type ResetRequestResponse = {
  message: string;
  delivery: "demo" | "email";
  resetCode: string | null;
  resetUrl?: string | null;
  expiresInMinutes?: number;
};

export default function PortalPasswordReset() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isReady } = usePortalAuth();
  const queryEmail = searchParams.get("email") || "";
  const queryCode = searchParams.get("code") || "";
  const [requestForm, setRequestForm] = useState({ email: queryEmail });
  const [confirmForm, setConfirmForm] = useState({
    email: queryEmail,
    code: queryCode,
    password: "",
    confirmPassword: "",
  });
  const [requestMessage, setRequestMessage] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [demoResetUrl, setDemoResetUrl] = useState("");
  const [error, setError] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!isResetRole(role)) {
    return <Navigate to="/portal" replace />;
  }

  if (!isReady) {
    return <PortalLoadingScreen label="Preparing password recovery" />;
  }

  if (user?.role === role) {
    return <Navigate to={portalRoleMeta[role].defaultPath} replace />;
  }

  const roleMeta = portalRoleMeta[role];

  async function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setRequestMessage("");
    setDemoCode("");
    setDemoResetUrl("");
    setIsRequesting(true);

    try {
      const data = await apiRequest<ResetRequestResponse>("/api/auth/password-reset/request", {
        method: "POST",
        body: JSON.stringify({
          role,
          email: requestForm.email,
        }),
      });

      setRequestMessage(data.message);
      setDemoCode(data.resetCode || "");
      setDemoResetUrl(data.resetUrl || "");
      setConfirmForm((current) => ({
        ...current,
        email: requestForm.email,
        code: data.resetCode || current.code,
      }));
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to start password recovery right now.",
      );
    } finally {
      setIsRequesting(false);
    }
  }

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (confirmForm.password !== confirmForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (confirmForm.password.trim().length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsResetting(true);

    try {
      const data = await apiRequest<{ message: string }>("/api/auth/password-reset/confirm", {
        method: "POST",
        body: JSON.stringify({
          role,
          email: confirmForm.email,
          code: confirmForm.code,
          password: confirmForm.password,
        }),
      });

      navigate(`/portal/login/${role}`, {
        replace: true,
        state: {
          resetMessage: data.message,
          resetEmail: confirmForm.email,
        },
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to reset password right now.",
      );
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <SEO
        title={`${roleMeta.label} Password Recovery`}
        description={`Reset your ${roleMeta.label.toLowerCase()} portal password for Success Academy.`}
        image={campusImages.classroom}
      />
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.14)] lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
            Password recovery
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Reset your {roleMeta.label.toLowerCase()} portal password.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/78">
            Request a reset code with your portal email, then use that code to set a new password. In production this
            flow is ready for email delivery; locally, the demo reset code is shown on screen for testing.
          </p>
          {queryCode && queryEmail && (
            <div className="mt-6 rounded-[1.5rem] border border-white/12 bg-white/5 p-5 text-sm leading-7 text-white/78">
              Your reset link has been opened. We prefilled the email address and reset code for you below.
            </div>
          )}
          <div className="mt-8 rounded-[1.5rem] bg-white/8 p-5">
            <p className="text-sm font-semibold text-white">Portal access help</p>
            <p className="mt-3 text-sm leading-7 text-white/74">
              If you have never activated your account yet, use the activation flow first instead of password recovery.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={role === "student" ? "/portal/activate/student" : "/portal/activate/parent"}
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Activate {roleMeta.label} Account
              </Link>
              <Link
                to={`/portal/login/${role}`}
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm font-semibold text-white"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">1. Request reset code</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
              Enter the email address currently linked to your portal account.
            </p>
            <form onSubmit={handleRequest} className="mt-5 space-y-5">
              <div>
                <label htmlFor="reset-request-email" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Email address
                </label>
                <input
                  id="reset-request-email"
                  type="email"
                  value={requestForm.email}
                  onChange={(event) => setRequestForm({ email: event.target.value })}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder={`${roleMeta.shortLabel.toLowerCase()}@successacademy.edu.ng`}
                  required
                />
              </div>

              {requestMessage && (
                <div className="rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {requestMessage}
                </div>
              )}

              {demoCode && (
                <div className="space-y-3 rounded-[1rem] bg-[var(--brand-surface)] px-4 py-3 text-sm text-[var(--brand-ink)]">
                  <div>
                    Demo reset code: <span className="font-semibold">{demoCode}</span>
                  </div>
                  {demoResetUrl && (
                    <div className="break-all">
                      Demo reset link:{" "}
                      <a href={demoResetUrl} className="font-semibold text-[var(--brand-accent)] underline">
                        {demoResetUrl}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isRequesting}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRequesting ? "Requesting..." : "Request reset code"}
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
            <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">2. Set a new password</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
              Enter the reset code and choose a new password for your portal account.
            </p>
            <form onSubmit={handleReset} className="mt-5 space-y-5">
              <div>
                <label htmlFor="reset-confirm-email" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Email address
                </label>
                <input
                  id="reset-confirm-email"
                  type="email"
                  value={confirmForm.email}
                  onChange={(event) => setConfirmForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder={`${roleMeta.shortLabel.toLowerCase()}@successacademy.edu.ng`}
                  required
                />
              </div>

              <div>
                <label htmlFor="reset-confirm-code" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Reset code
                </label>
                <input
                  id="reset-confirm-code"
                  type="text"
                  value={confirmForm.code}
                  onChange={(event) => setConfirmForm((current) => ({ ...current, code: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm tracking-[0.18em] outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="Enter your reset code"
                  required
                />
              </div>

              <div>
                <label htmlFor="reset-confirm-password" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  New password
                </label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  value={confirmForm.password}
                  onChange={(event) => setConfirmForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="Create a new password"
                  required
                />
              </div>

              <div>
                <label htmlFor="reset-confirm-confirm-password" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Confirm new password
                </label>
                <input
                  id="reset-confirm-confirm-password"
                  type="password"
                  value={confirmForm.confirmPassword}
                  onChange={(event) =>
                    setConfirmForm((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="Repeat your new password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-[1rem] bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isResetting}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isResetting ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
