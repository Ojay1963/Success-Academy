import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type HeroAction = {
  label: string;
  to: string;
  secondary?: boolean;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
};

function HeroLink({ action }: { action: HeroAction }) {
  return (
    <Link
      to={action.to}
      className={
        action.secondary
          ? "inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white/10"
          : "inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-semibold text-[var(--brand-ink)] shadow-[0_16px_40px_rgba(211,170,63,0.35)] transition hover:-translate-y-0.5"
      }
    >
      {action.label}
      {!action.secondary && <ArrowRight className="ml-2 h-4 w-4" />}
    </Link>
  );
}

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
}: PageHeroProps) {
  return (
    <section className="px-4 pt-5 md:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[var(--brand-ink)] shadow-[0_25px_80px_rgba(9,31,43,0.22)]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,31,43,0.9)_10%,rgba(9,31,43,0.72)_45%,rgba(9,31,43,0.3)_100%)]" />
        </div>
        <div className="relative grid min-h-[25rem] items-end px-6 py-10 sm:px-8 md:min-h-[30rem] md:px-10 md:py-12 lg:min-h-[34rem] lg:max-w-[60rem]">
          <div className="animate-fade-up max-w-3xl">
            {eyebrow && (
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 sm:text-lg">
              {description}
            </p>
            {(primaryAction || secondaryAction) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryAction && <HeroLink action={primaryAction} />}
                {secondaryAction && <HeroLink action={{ ...secondaryAction, secondary: true }} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
