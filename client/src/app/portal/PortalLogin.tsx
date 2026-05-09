import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router";
import SEO from "../components/SEO";
import { campusImages } from "../content/site";
import { portalRoleMeta, type PortalRole } from "../content/portal";
import { usePortalAuth } from "./AuthContext";
import { PortalLoadingScreen } from "./PortalComponents";

const roles = ["student", "parent", "teacher", "admin"] as const;

function isPortalRole(value: string | undefined): value is PortalRole {
  return Boolean(value && roles.includes(value as PortalRole));
}

export default function PortalLogin() {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isReady } = usePortalAuth();
  const locationState = (location.state as { from?: string; resetMessage?: string } | null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage] = useState(locationState?.resetMessage || "");

  if (!isPortalRole(role)) {
    return <Navigate to="/portal" replace />;
  }

  const portalRole = role;

  if (!isReady) {
    return <PortalLoadingScreen label="Preparing portal login" />;
  }

  if (isReady && user?.role === portalRole) {
    return <Navigate to={portalRoleMeta[portalRole].defaultPath} replace />;
  }

  const roleMeta = portalRoleMeta[portalRole];
  const from = locationState?.from;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(portalRole, formData);
      navigate(from || roleMeta.defaultPath, { replace: true });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to log in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <SEO
        title={`${roleMeta.label} Login`}
        description={roleMeta.loginDescription}
        image={campusImages.classroom}
      />
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.14)] lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
            {roleMeta.label} Access
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">{roleMeta.loginHeading}</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/78">{roleMeta.loginDescription}</p>
          <div className="mt-8 rounded-[1.5rem] bg-white/8 p-5">
            <p className="text-sm font-semibold text-white">Demo login details</p>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Use one of the seeded accounts with password <span className="font-semibold text-white">password123</span>.
              Student: <span className="font-semibold text-white">student@successacademy.edu.ng</span>.
              Parent: <span className="font-semibold text-white">parent@successacademy.edu.ng</span>.
              Teacher: <span className="font-semibold text-white">teacher@successacademy.edu.ng</span>.
              Admin: <span className="font-semibold text-white">admin@successacademy.edu.ng</span>.
            </p>
          </div>
          {portalRole === "student" && (
            <div className="mt-6 rounded-[1.5rem] border border-white/12 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">New student?</p>
              <p className="mt-2 text-sm leading-7 text-white/74">
                Activate your portal account first with your admission number and activation PIN before using student login.
              </p>
              <Link
                to="/portal/activate/student"
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Activate student account
              </Link>
              <Link
                to="/portal/reset/student"
                className="mt-4 ml-3 inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm font-semibold text-white"
              >
                Forgot password
              </Link>
            </div>
          )}
          {portalRole === "parent" && (
            <div className="mt-6 rounded-[1.5rem] border border-white/12 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">First-time parent?</p>
              <p className="mt-2 text-sm leading-7 text-white/74">
                Activate your portal account with your child's admission number and your registered phone number before
                using parent login.
              </p>
              <Link
                to="/portal/activate/parent"
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Activate parent account
              </Link>
              <Link
                to="/portal/reset/parent"
                className="mt-4 ml-3 inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm font-semibold text-white"
              >
                Forgot password
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="portal-email" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Email address
              </label>
              <input
                id="portal-email"
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder={`${roleMeta.shortLabel.toLowerCase()}@successacademy.edu.ng`}
                required
              />
            </div>

            <div>
              <label htmlFor="portal-password" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="rounded-[1rem] bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {error}
              </div>
            )}

            {successMessage && !error && (
              <div className="rounded-[1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-[1.2rem] bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : `Login as ${roleMeta.label}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
