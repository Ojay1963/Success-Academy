import { useState } from "react";
import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { admissionsSteps, campusImages, contactDetails } from "../content/site";

type ApplicationForm = {
  childName: string;
  age: string;
  programme: string;
  parentName: string;
  email: string;
  phone: string;
  notes: string;
};

const initialForm: ApplicationForm = {
  childName: "",
  age: "",
  programme: "",
  parentName: "",
  email: "",
  phone: "",
  notes: "",
};

export default function Admissions() {
  const [formData, setFormData] = useState<ApplicationForm>(initialForm);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/admissions/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "We could not submit your application right now.");
      }

      setStatus({
        type: "success",
        message: data.message || "Application submitted successfully. Our admissions team will contact you shortly.",
      });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while sending your application.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Admissions"
        description="Apply to Success Academy, review the admissions process, and send an application for nursery, primary, or secondary entry."
        image={campusImages.hero}
      />

      <PageHero
        eyebrow="Admissions"
        title="A clear admissions process with real support for families from first enquiry to enrolment."
        description="Use the application form below, speak to our admissions office, or book a visit to explore the best programme and entry point for your child."
        image={campusImages.hero}
        primaryAction={{ label: "Apply Now", to: "/admissions" }}
        secondaryAction={{ label: "Contact School", to: "/contact" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.12)] lg:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
              Admissions journey
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Every step is designed to help families make informed, confident decisions.
            </h2>
            <div className="mt-8 space-y-4">
              {admissionsSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="rounded-[1.5rem] bg-white/8 p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-[var(--brand-ink)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/60">Step {index + 1}</p>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/76">{step.description}</p>
                  </article>
                );
              })}
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-white/8 p-5 text-sm leading-7 text-white/76">
              Prefer to speak to someone first? Call <a href={contactDetails.phoneHref} className="font-semibold text-white">{contactDetails.phone}</a> or <Link to="/contact" className="font-semibold text-white">book a visit</Link>.
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
                Application form
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Start an application</h2>
              <p className="text-sm leading-7 text-[var(--brand-muted)]">
                Required fields are marked automatically by the browser and validated before submission.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="childName" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Child&apos;s full name
                </label>
                <input
                  id="childName"
                  type="text"
                  value={formData.childName}
                  onChange={(event) => setFormData((current) => ({ ...current, childName: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="Enter your child's full name"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="age" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="2"
                    max="18"
                    value={formData.age}
                    onChange={(event) => setFormData((current) => ({ ...current, age: event.target.value }))}
                    className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                    placeholder="Child's age"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="programme" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                    Programme
                  </label>
                  <select
                    id="programme"
                    value={formData.programme}
                    onChange={(event) => setFormData((current) => ({ ...current, programme: event.target.value }))}
                    className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                    required
                  >
                    <option value="">Select a programme</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="parentName" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                    Parent or guardian name
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    value={formData.parentName}
                    onChange={(event) => setFormData((current) => ({ ...current, parentName: event.target.value }))}
                    className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="+234 900 000 0000"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Additional notes
                </label>
                <textarea
                  id="notes"
                  rows={5}
                  value={formData.notes}
                  onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="Tell us about preferred entry term, current school, or anything helpful."
                />
              </div>

              {status.type !== "idle" && (
                <div
                  role="status"
                  className={`rounded-[1rem] px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-rose-50 text-rose-800"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-14 flex-1 items-center justify-center rounded-[1.2rem] bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting application..." : "Submit Application"}
                </button>
                <Link
                  to="/contact"
                  className="inline-flex min-h-14 items-center justify-center rounded-[1.2rem] border border-[var(--brand-border)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
                >
                  Book a Visit
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
