import { useEffect, useState } from "react";
import { X } from "lucide-react";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { campusImages, galleryImages } from "../content/site";

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Gallery"
        description="View classroom, campus, and student life images from Success Academy across nursery, primary, and secondary sections."
        image={campusImages.outdoors}
      />

      <PageHero
        eyebrow="Gallery"
        title="A quick look at the spaces, routines, and moments that shape school life."
        description="Explore selected images from classrooms, reading spaces, STEM activities, outdoor learning, and the wider Success Academy environment."
        image={campusImages.outdoors}
        primaryAction={{ label: "Book a Visit", to: "/contact" }}
        secondaryAction={{ label: "Apply Now", to: "/admissions" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group overflow-hidden rounded-[1.8rem] border border-[var(--brand-border)] bg-white text-left shadow-[0_20px_50px_rgba(9,31,43,0.06)] transition hover:-translate-y-0.5"
            >
              <div className="overflow-hidden">
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                  {image.category}
                </p>
                <p className="mt-3 text-base leading-7 text-[var(--brand-muted)]">{image.alt}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(9,31,43,0.92)] p-4"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={galleryImages[selectedIndex].category}
        >
          <div
            className="relative w-full max-w-5xl rounded-[2rem] bg-white p-4 shadow-[0_28px_80px_rgba(0,0,0,0.25)] md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-ink)] text-white"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>
            <ImageWithFallback
              src={galleryImages[selectedIndex].url}
              alt={galleryImages[selectedIndex].alt}
              className="max-h-[75vh] w-full rounded-[1.5rem] object-cover"
            />
            <div className="px-2 pb-2 pt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                {galleryImages[selectedIndex].category}
              </p>
              <p className="mt-2 text-base leading-7 text-[var(--brand-muted)]">
                {galleryImages[selectedIndex].alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
