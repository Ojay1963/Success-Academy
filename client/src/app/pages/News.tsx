import { Link } from "react-router";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { campusImages, newsItems } from "../content/site";

export default function News() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="News and Events"
        description="Read recent Success Academy news, family events, academic updates, and school community stories."
        image={campusImages.hero}
      />

      <PageHero
        eyebrow="News and Events"
        title="Recent stories, family events, and updates from across the school community."
        description="Keep up with admissions events, learner highlights, literacy programmes, and other school news at Success Academy."
        image={campusImages.hero}
        primaryAction={{ label: "Book a Visit", to: "/contact" }}
        secondaryAction={{ label: "View Admissions", to: "/admissions" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-[1.8rem] border border-[var(--brand-border)] bg-white shadow-[0_20px_50px_rgba(9,31,43,0.06)]"
            >
              <ImageWithFallback src={item.image} alt={item.title} className="h-64 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                  {item.category} • {item.date}
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{item.excerpt}</p>
                <Link
                  to={`/news/${item.slug}`}
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--brand-ink)] px-4 text-sm font-semibold text-white"
                >
                  Read article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
