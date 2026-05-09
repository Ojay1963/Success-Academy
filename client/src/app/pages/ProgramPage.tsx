import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { admissionsSteps, campusImages, programmes, type ProgramKey } from "../content/site";

type ProgramPageProps = {
  programKey: ProgramKey;
};

export default function ProgramPage({ programKey }: ProgramPageProps) {
  const programme = programmes[programKey];

  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title={programme.title}
        description={`${programme.title} at Success Academy offers ${programme.ageRange.toLowerCase()} learners a structured pathway with strong teaching, care, and confident progression.`}
        image={programme.image}
      />

      <PageHero
        eyebrow={`${programme.title} Programme`}
        title={`${programme.title} education that feels ambitious, supportive, and age-appropriate.`}
        description={programme.description}
        image={programme.image}
        primaryAction={{ label: programme.ctaLabel, to: "/admissions" }}
        secondaryAction={{ label: "Book a Visit", to: "/contact" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              Age range
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{programme.ageRange}</h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">{programme.description}</p>
            <ul className="mt-8 space-y-3">
              {programme.focusPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-[1.2rem] bg-[var(--brand-surface)] px-4 py-4 text-sm font-medium text-[var(--brand-ink)]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[1.8rem]">
            <ImageWithFallback
              src={programme.image}
              alt={`${programme.title} learners at Success Academy`}
              className="h-full min-h-[21rem] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {programme.curriculum.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-surface-strong)] text-[var(--brand-ink)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.12)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
              Moving forward
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Admission support is built around readiness, confidence, and smooth transition.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/76">
              Families can start with an enquiry, speak with admissions, and receive guidance on placement before completing enrolment.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/admissions"
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                View Admissions
              </Link>
              <Link
                to="/academics"
                className="inline-flex min-h-12 items-center rounded-full border border-white/18 px-5 text-sm font-semibold text-white"
              >
                Explore Academics
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {admissionsSteps.slice(0, 3).map((step, index) => (
              <article key={step.title} className="rounded-[1.5rem] bg-white/8 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold-soft)]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/76">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="overflow-hidden rounded-[1.8rem]">
              <ImageWithFallback
                src={campusImages.hero}
                alt="Campus environment at Success Academy"
                className="h-full min-h-[20rem] w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
                Next step for families
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                See the classrooms, speak with staff, and find the right entry point.
              </h2>
              <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
                Visits are a simple way to understand the day-to-day school experience before applying.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white"
                >
                  Book a Visit
                </Link>
                <Link
                  to="/gallery"
                  className="inline-flex min-h-12 items-center rounded-full border border-[var(--brand-border)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
