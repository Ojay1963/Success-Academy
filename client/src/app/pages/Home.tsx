import { ArrowRight, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AcademicCalendarSection } from "../portal/PortalPages";
import {
  achievementCards,
  admissionsSteps,
  campusImages,
  contactDetails,
  facilities,
  homepageStats,
  newsItems,
  programmes,
  testimonials,
  trustHighlights,
} from "../content/site";

export default function Home() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Home"
        description="Success Academy is a trusted nursery, primary, and secondary school with strong academics, warm pastoral care, and clear admissions support."
        image={campusImages.hero}
      />

      <PageHero
        eyebrow="Welcome to Success Academy"
        title="A modern school community where children grow with confidence, care, and ambition."
        description="From nursery foundations to secondary readiness, Success Academy combines strong teaching, warm pastoral support, and a structured environment families can trust."
        image={campusImages.hero}
        primaryAction={{ label: "Apply Now", to: "/admissions" }}
        secondaryAction={{ label: "Book a Visit", to: "/contact" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              Why families choose us
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-[var(--brand-ink)] sm:text-4xl">
              High standards, caring relationships, and a learning journey that feels purposeful at every stage.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {trustHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-[1.5rem] bg-[var(--brand-surface)] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {homepageStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-ink)] p-6 text-white shadow-[0_22px_60px_rgba(9,31,43,0.12)]"
              >
                <p className="text-4xl font-semibold text-[var(--brand-gold-soft)]">{item.value}</p>
                <p className="mt-3 text-sm leading-7 text-white/78">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div className="overflow-hidden rounded-[1.6rem]">
            <ImageWithFallback
              src={campusImages.learners}
              alt="Success Academy students learning together"
              className="h-full min-h-[18rem] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              Learning pathways
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Purpose-built sections for nursery, primary, and secondary learners.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--brand-muted)]">
              Every section has its own pace, routines, and expectations, while staying connected through shared values of excellence, kindness, and discipline.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {Object.values(programmes).map((programme) => (
                <article key={programme.path} className="rounded-[1.5rem] bg-[var(--brand-surface)] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                    {programme.ageRange}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{programme.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{programme.description}</p>
                  <Link
                    to={programme.path}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--brand-ink)]"
                  >
                    Explore {programme.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.12)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
                Admissions process
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Clear, supportive, and designed to help families move forward with confidence.
              </h2>
            </div>
            <Link
              to="/admissions"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--brand-ink)]"
            >
              View Admissions
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {admissionsSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-[1.5rem] bg-white/8 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-[var(--brand-ink)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-white/58">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          {achievementCards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-[var(--brand-ink)]">
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
        <div className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:grid-cols-[1fr_1fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              Testimonials
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Trusted by families who want both care and academic progress.
            </h2>
            <div className="mt-8 space-y-4">
              {testimonials.map((testimonial) => (
                <article key={testimonial.author} className="rounded-[1.5rem] bg-[var(--brand-surface)] p-5">
                  <p className="text-base leading-8 text-[var(--brand-ink)]">"{testimonial.quote}"</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--brand-ink)]">{testimonial.author}</p>
                  <p className="text-sm text-[var(--brand-muted)]">{testimonial.role}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.8rem] bg-[var(--brand-surface)]">
            <ImageWithFallback
              src={campusImages.portrait}
              alt="Smiling student from Success Academy"
              className="h-full min-h-[24rem] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-[1.8rem] border border-[var(--brand-border)] bg-white shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
            >
              <ImageWithFallback src={item.image} alt={item.title} className="h-56 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                  {item.category} • {item.date}
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{item.excerpt}</p>
                <Link
                  to={`/news/${item.slug}`}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--brand-ink)]"
                >
                  Read story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <AcademicCalendarSection />
          <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_45px_rgba(9,31,43,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
              School Portal
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              More than a brochure site: a school platform families can actually use.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              The new portal experience includes student, parent, teacher, and admin dashboards with mock data, protected routes, and mobile-first navigation.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                to="/portal"
                className="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white"
              >
                Login to Portal
              </Link>
              <Link
                to="/result-checker"
                className="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border border-[var(--brand-border)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Check Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,var(--brand-ink),#194766)] p-6 text-white shadow-[0_22px_70px_rgba(9,31,43,0.12)] lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
                Ready to talk?
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Let's help you choose the right starting point for your child.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">
                Speak with admissions, request a tour, or send us your questions. Every contact path below is active and connected.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={contactDetails.phoneHref}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[1.3rem] bg-white text-sm font-semibold text-[var(--brand-ink)]"
              >
                <Phone className="h-4 w-4" />
                Contact School
              </a>
              <a
                href={contactDetails.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[1.3rem] border border-white/20 bg-white/8 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <Link
                to="/admissions"
                className="inline-flex min-h-14 items-center justify-center rounded-[1.3rem] bg-[var(--brand-gold)] text-sm font-semibold text-[var(--brand-ink)]"
              >
                Apply Now
              </Link>
              <Link
                to="/portal"
                className="inline-flex min-h-14 items-center justify-center rounded-[1.3rem] bg-white/8 text-sm font-semibold text-white"
              >
                Login to Portal
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[1.3rem] border border-white/20 bg-white/8 text-sm font-semibold text-white sm:col-span-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Book a Visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
