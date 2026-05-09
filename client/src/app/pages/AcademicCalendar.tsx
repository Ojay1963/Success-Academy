import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { campusImages } from "../content/site";
import { AcademicCalendarSection } from "../portal/PortalPages";

export default function AcademicCalendar() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Academic Calendar"
        description="View important Success Academy academic calendar dates including assessments, events, and report distribution."
        image={campusImages.library}
      />

      <PageHero
        eyebrow="Academic Calendar"
        title="Important dates for assessments, events, family visits, and term milestones."
        description="Families can use this calendar section to stay aware of key school moments and term checkpoints."
        image={campusImages.library}
        primaryAction={{ label: "Apply Now", to: "/admissions" }}
        secondaryAction={{ label: "Contact School", to: "/contact" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <AcademicCalendarSection />
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,var(--brand-ink),#204f73)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.12)] lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Need a broader view of school life?</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">
                Explore news, admissions updates, or portal announcements to stay connected to the full Success Academy experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/news"
                className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                View News
              </Link>
              <Link
                to="/portal"
                className="inline-flex min-h-12 items-center rounded-full border border-white/18 px-5 text-sm font-semibold text-white"
              >
                Login to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
