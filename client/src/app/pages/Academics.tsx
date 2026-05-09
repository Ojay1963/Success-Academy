import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { campusImages, programmes } from "../content/site";

const pillars = [
  {
    title: "Literacy and communication",
    description: "Reading fluency, strong writing habits, speaking confidence, and thoughtful discussion across all key stages.",
  },
  {
    title: "Mathematics and reasoning",
    description: "Daily problem solving, number confidence, and analytical thinking supported by practical explanation.",
  },
  {
    title: "Science and discovery",
    description: "Observation, experimentation, and STEM learning that connects theory with hands-on understanding.",
  },
  {
    title: "Character and leadership",
    description: "Routines, responsibility, mentoring, and service opportunities that shape well-rounded learners.",
  },
];

export default function Academics() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Academics"
        description="Explore the academic pathway at Success Academy across nursery, primary, and secondary levels, including curriculum priorities and learner development."
        image={campusImages.library}
      />

      <PageHero
        eyebrow="Academics"
        title="An academic pathway designed to build strong foundations, independent thinking, and confident progression."
        description="Success Academy balances structured teaching, practical learning, and personal development so each learner can make steady, meaningful progress."
        image={campusImages.library}
        primaryAction={{ label: "Apply Now", to: "/admissions" }}
        secondaryAction={{ label: "Contact School", to: "/contact" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
            >
              <h2 className="text-xl font-semibold">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
          <div className="overflow-hidden rounded-[1.8rem]">
            <ImageWithFallback
              src={campusImages.stem}
              alt="Science and STEM learning at Success Academy"
              className="h-full min-h-[22rem] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              Across every stage
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Each section has its own pace, but all learners benefit from clear expectations and rich support.
            </h2>
            <div className="mt-8 grid gap-4">
              {Object.values(programmes).map((programme) => (
                <article key={programme.title} className="rounded-[1.5rem] bg-[var(--brand-surface)] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                        {programme.ageRange}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold">{programme.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{programme.description}</p>
                    </div>
                    <Link
                      to={programme.path}
                      className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
                    >
                      Explore
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,var(--brand-ink),#204f73)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.12)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
                Academic support
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Need help choosing the right programme or year-group entry?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">
                Our team can guide you through placement, transition, and what to expect from each stage of learning.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Contact School
              </Link>
              <Link
                to="/admissions"
                className="inline-flex min-h-12 items-center rounded-full border border-white/18 px-5 text-sm font-semibold text-white"
              >
                View Admissions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
