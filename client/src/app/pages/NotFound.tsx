import { Link } from "react-router";
import SEO from "../components/SEO";
import { campusImages } from "../content/site";

export default function NotFound() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title="Page not found"
        description="The page you requested could not be found on the Success Academy website."
        image={campusImages.hero}
      />
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-center shadow-[0_20px_60px_rgba(9,31,43,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
          The page may have moved or the link may be outdated. Use the buttons below to get back to the main school pages.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white"
          >
            Go Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-12 items-center rounded-full border border-[var(--brand-border)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
          >
            Contact School
          </Link>
        </div>
      </div>
    </div>
  );
}
