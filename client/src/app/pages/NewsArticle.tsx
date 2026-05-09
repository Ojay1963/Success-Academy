import { Link, useParams } from "react-router";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { campusImages, getNewsItem } from "../content/site";

export default function NewsArticle() {
  const { slug } = useParams();
  const item = slug ? getNewsItem(slug) : undefined;

  if (!item) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <SEO
          title="Article not found"
          description="The requested Success Academy news article could not be found."
          image={campusImages.hero}
        />
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-center shadow-[0_20px_60px_rgba(9,31,43,0.08)]">
          <h1 className="text-3xl font-semibold">Article not found</h1>
          <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
            The news item you tried to open is unavailable. You can return to the news page to explore current updates.
          </p>
          <Link
            to="/news"
            className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO title={item.title} description={item.excerpt} image={item.image} />

      <section className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-[var(--brand-ink)] shadow-[0_25px_80px_rgba(9,31,43,0.22)]">
          <div className="relative min-h-[26rem]">
            <ImageWithFallback src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,31,43,0.16),rgba(9,31,43,0.82))]" />
            <div className="relative flex min-h-[26rem] items-end p-6 md:p-10">
              <div className="max-w-4xl text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
                  {item.category} • {item.date}
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                  {item.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
          <p className="text-lg leading-8 text-[var(--brand-muted)]">{item.excerpt}</p>
          <div className="mt-8 space-y-5">
            {item.content.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-[var(--brand-ink)]">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/news"
              className="inline-flex min-h-12 items-center rounded-full bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white"
            >
              Back to News
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center rounded-full border border-[var(--brand-border)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Contact School
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
