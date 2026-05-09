import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { campusImages } from "../content/site";
import { apiRequest } from "../portal/api";

type LookupResult = {
  candidate: string;
  className: string;
  term: string;
  average: string;
  results: { subject: string; score: number; grade: string }[];
};

export default function ResultChecker() {
  const [formData, setFormData] = useState({ studentId: "", accessPin: "" });
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const downloadDetails = useMemo(
    () =>
      result
        ? `data:text/plain;charset=utf-8,${encodeURIComponent(
            [
              `Student: ${result.candidate}`,
              `Class: ${result.className}`,
              `Term: ${result.term}`,
              `Average: ${result.average}`,
              ...result.results.map((item) => `${item.subject}: ${item.score}% (${item.grade})`),
            ].join("\n"),
          )}`
        : "",
    [result],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.studentId || !formData.accessPin) {
      setError("Enter both student ID and access PIN to continue.");
      setResult(null);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<LookupResult>("/api/results/check", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setResult(response);
    } catch (lookupError) {
      setError(
        lookupError instanceof Error ? lookupError.message : "Unable to check results.",
      );
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Result Checker"
        description="Use the Success Academy result checker demo to preview learner results and prepare for backend integration."
        image={campusImages.learners}
      />

      <PageHero
        eyebrow="Check Results"
        title="A simple result-checking experience that can later connect to your real examination backend."
        description="This demo page gives families a realistic result-checker flow today while keeping the UI ready for live API integration later."
        image={campusImages.learners}
        primaryAction={{ label: "Login to Portal", to: "/portal/login/student" }}
        secondaryAction={{ label: "Contact School", to: "/contact" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_45px_rgba(9,31,43,0.05)] lg:p-8">
            <h2 className="text-3xl font-semibold">Result Checker</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              Use any values below to view the mock result output.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="studentId" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Student ID
                </label>
                <input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(event) => setFormData((current) => ({ ...current, studentId: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm"
                  placeholder="SA-2026-001"
                />
              </div>
              <div>
                <label htmlFor="accessPin" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Access PIN
                </label>
                <input
                  id="accessPin"
                  value={formData.accessPin}
                  onChange={(event) => setFormData((current) => ({ ...current, accessPin: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm"
                  placeholder="Enter PIN"
                />
              </div>
              {error && (
                <div className="rounded-[1rem] bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
              )}
              <button
                type="submit"
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white"
              >
                {isSubmitting ? "Checking..." : "Check Results"}
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_45px_rgba(9,31,43,0.05)] lg:p-8">
            {!result ? (
              <div className="rounded-[1.5rem] bg-[var(--brand-surface)] p-5">
                <h2 className="text-2xl font-semibold">Result preview</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  No lookup has been run yet. Submit the form to preview the demo result sheet.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-[1.5rem] bg-[var(--brand-surface)] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">{result.term}</p>
                  <h2 className="mt-3 text-2xl font-semibold">{result.candidate}</h2>
                  <p className="mt-2 text-sm text-[var(--brand-muted)]">{result.className}</p>
                  <p className="mt-2 text-sm text-[var(--brand-muted)]">Average score: {result.average}</p>
                </div>
                <div className="overflow-hidden rounded-[1.2rem] border border-[var(--brand-border)]">
                  <div className="grid grid-cols-3 bg-[var(--brand-surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--brand-ink)]">
                    <div>Subject</div>
                  <div>Score</div>
                  <div>Grade</div>
                </div>
                  {result.results.map((item) => (
                    <div key={item.subject} className="grid grid-cols-3 border-t border-[var(--brand-border)] px-4 py-3 text-sm text-[var(--brand-muted)]">
                      <div>{item.subject}</div>
                      <div>{item.score}%</div>
                      <div>{item.grade}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={downloadDetails}
                    download="success-academy-result.txt"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
                  >
                    <Download className="h-4 w-4" />
                    Download Preview
                  </a>
                  <Link
                    to="/portal/login/student"
                    className="inline-flex min-h-12 items-center rounded-full border border-[var(--brand-border)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
                  >
                    Login to Portal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
