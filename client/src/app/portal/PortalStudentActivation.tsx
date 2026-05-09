import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import SEO from "../components/SEO";
import { campusImages } from "../content/site";
import { usePortalAuth } from "./AuthContext";
import { PortalLoadingScreen } from "./PortalComponents";

const initialForm = {
  admissionNo: "",
  accessPin: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function PortalStudentActivation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activateStudent, isReady, user } = usePortalAuth();
  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    admissionNo: searchParams.get("admissionNo") || "",
    email: searchParams.get("email") || "",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isReady) {
    return <PortalLoadingScreen label="Preparing student portal activation" />;
  }

  if (user?.role === "student") {
    return <Navigate to="/portal/student" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.trim().length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      await activateStudent({
        admissionNo: formData.admissionNo,
        accessPin: formData.accessPin,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/portal/student", { replace: true });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to activate your portal account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <SEO
        title="Student Portal Activation"
        description="Activate your Success Academy student portal account with your admission details."
        image={campusImages.classroom}
      />
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.14)] lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
            First-time student access
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Activate your student portal before your first login.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/78">
            Success Academy students do not create open public accounts. Your admission record is created by the school,
            then you activate your portal access with your admission number and activation PIN.
          </p>
          {(searchParams.get("admissionNo") || searchParams.get("email")) && (
            <div className="mt-6 rounded-[1.5rem] border border-white/12 bg-white/5 p-5 text-sm leading-7 text-white/78">
              Your invitation link has prefilled part of this form for you. Complete the remaining identity checks to
              activate your student portal.
            </div>
          )}
          <div className="mt-8 rounded-[1.5rem] bg-white/8 p-5">
            <p className="text-sm font-semibold text-white">Demo activation details</p>
            <p className="mt-3 text-sm leading-7 text-white/74">
              Admission No: <span className="font-semibold text-white">SA-2026-002</span>. Surname:{" "}
              <span className="font-semibold text-white">Adebayo</span>. Activation PIN:{" "}
              <span className="font-semibold text-white">223344</span>.
            </p>
          </div>
          <div className="mt-6 text-sm text-white/72">
            Already activated?{" "}
            <Link to="/portal/login/student" className="font-semibold text-[var(--brand-gold-soft)]">
              Go to student login
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="activation-admission-no" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Admission number
              </label>
              <input
                id="activation-admission-no"
                type="text"
                value={formData.admissionNo}
                onChange={(event) => setFormData((current) => ({ ...current, admissionNo: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm uppercase outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder="SA-2026-002"
                required
              />
            </div>

            <div>
              <label htmlFor="activation-pin" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Activation PIN
              </label>
              <input
                id="activation-pin"
                type="text"
                value={formData.accessPin}
                onChange={(event) => setFormData((current) => ({ ...current, accessPin: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder="Enter your activation PIN"
                required
              />
            </div>

            <div>
              <label htmlFor="activation-last-name" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Surname
              </label>
              <input
                id="activation-last-name"
                type="text"
                value={formData.lastName}
                onChange={(event) => setFormData((current) => ({ ...current, lastName: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder="Enter your surname"
                required
              />
            </div>

            <div>
              <label htmlFor="activation-email" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Email address
              </label>
              <input
                id="activation-email"
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder="student@successacademy.edu.ng"
                required
              />
            </div>

            <div>
              <label htmlFor="activation-password" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Create password
              </label>
              <input
                id="activation-password"
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder="Create a secure password"
                required
              />
            </div>

            <div>
              <label htmlFor="activation-confirm-password" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                Confirm password
              </label>
              <input
                id="activation-confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                placeholder="Repeat your password"
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
              disabled={isSubmitting}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-[1.2rem] bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Activating..." : "Activate student account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
