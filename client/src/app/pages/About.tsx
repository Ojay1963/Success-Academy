import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  campusImages,
  contactDetails,
  facilities,
  schoolName,
  testimonials,
  trustHighlights,
} from "../content/site";

const values = [
  "Excellence in learning and conduct",
  "Respect, kindness, and responsibility",
  "Strong family-school partnership",
  "Safe, inclusive, and purposeful routines",
];

export default function About() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="About Us"
        description={`Learn about ${schoolName}, our mission, values, facilities, and commitment to nursery, primary, and secondary education.`}
        image={campusImages.learners}
      />

      <PageHero
        eyebrow="About Us"
        title="A school built to help children feel known, challenged, and well prepared for the future."
        description="Success Academy serves families with a clear educational vision: strong teaching, reliable routines, warm pastoral care, and meaningful preparation for each next stage of learning."
        image={campusImages.learners}
        primaryAction={{ label: "View Admissions", to: "/admissions" }}
        secondaryAction={{ label: "Contact School", to: "/contact" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:grid-cols-[1fr_1fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              Our mission
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              To educate the whole child with discipline, curiosity, and confidence.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
              We want every learner to leave Success Academy with strong academic foundations, healthy self-belief, and the character needed to contribute well at home, in school, and in the wider world.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value} className="rounded-[1.25rem] bg-[var(--brand-surface)] px-4 py-4 text-sm font-medium text-[var(--brand-ink)]">
                  {value}
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.8rem]">
            <ImageWithFallback
              src={campusImages.classroom}
              alt="Teacher guiding pupils inside a Success Academy classroom"
              className="h-full min-h-[22rem] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {trustHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-white">
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
        <div className="grid gap-4 lg:grid-cols-4">
          {facilities.map((facility) => {
            const Icon = facility.icon;
            return (
              <article
                key={facility.title}
                className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-surface-strong)] text-[var(--brand-ink)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{facility.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{facility.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-[1.8rem]">
              <ImageWithFallback
                src={campusImages.outdoors}
                alt="Students spending time outdoors at Success Academy"
                className="h-full min-h-[21rem] w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
                Community confidence
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Families trust us because care, communication, and learning quality stay visible.
              </h2>
              <div className="mt-6 space-y-4">
                {testimonials.map((testimonial) => (
                  <article key={testimonial.author} className="rounded-[1.5rem] bg-[var(--brand-surface)] p-5">
                    <p className="text-base leading-8 text-[var(--brand-ink)]">“{testimonial.quote}”</p>
                    <p className="mt-3 text-sm font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-[var(--brand-muted)]">{testimonial.role}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,var(--brand-ink),#204f73)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.12)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Visit the campus and meet our team.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">
                Tours, admissions support, and direct family enquiries are available throughout the school week.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Book a Visit
              </Link>
              <a
                href={contactDetails.phoneHref}
                className="inline-flex min-h-12 items-center rounded-full border border-white/18 px-5 text-sm font-semibold text-white"
              >
                Call School
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
