import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { portalLandingCards, portalRoleMeta } from "../content/portal";
import { campusImages } from "../content/site";

export default function PortalLanding() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Portal"
        description="Access the Success Academy student, parent, teacher, and admin portal with secure role-based dashboards."
        image={campusImages.stem}
      />

      <section className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="grid gap-6 overflow-hidden rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.14)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">School platform</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              A modern portal experience for students, parents, teachers, and school administrators.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
              The portal is now connected to a backend-ready API structure with role-based access, responsive dashboards,
              and first-time student and parent activation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/portal/activate/student"
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Activate Student Account
              </Link>
              <Link
                to="/portal/activate/parent"
                className="inline-flex min-h-12 items-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Activate Parent Account
              </Link>
              <Link
                to="/portal/login/student"
                className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white"
              >
                Login to Portal
              </Link>
              <Link
                to="/result-checker"
                className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white"
              >
                Check Results
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.8rem] bg-white/8">
            <ImageWithFallback
              src={campusImages.stem}
              alt="Students using a modern school platform at Success Academy"
              className="h-full min-h-[20rem] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {portalLandingCards.map((card) => {
            const Icon = portalRoleMeta[card.role].icon;
            return (
              <article
                key={card.role}
                className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_45px_rgba(9,31,43,0.05)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-surface-strong)] text-[var(--brand-ink)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{card.description}</p>
                <Link
                  to={`/portal/login/${card.role}`}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--brand-ink)]"
                >
                  Open portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_45px_rgba(9,31,43,0.05)]">
            <GraduationCap className="h-6 w-6 text-[var(--brand-accent)]" />
            <h2 className="mt-4 text-xl font-semibold">Protected routes</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              Each portal area now uses role-specific route protection and redirect handling, ready for real authentication.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_45px_rgba(9,31,43,0.05)]">
            <ShieldCheck className="h-6 w-6 text-[var(--brand-accent)]" />
            <h2 className="mt-4 text-xl font-semibold">Mock-first backend shape</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              Login, dashboards, tables, and actions now call protected APIs backed by a clean in-memory persistence layer
              that can be swapped for a real database.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_16px_45px_rgba(9,31,43,0.05)]">
            <ArrowRight className="h-6 w-6 text-[var(--brand-accent)]" />
            <h2 className="mt-4 text-xl font-semibold">Mobile-first portal UX</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              Dashboard pages include app-style mobile navigation, stacked cards, and touch-friendly layouts for phones and tablets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
