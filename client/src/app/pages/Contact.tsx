import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { campusImages, contactDetails } from "../content/site";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactCards = [
  {
    title: "Call School",
    value: contactDetails.phone,
    href: contactDetails.phoneHref,
    icon: Phone,
  },
  {
    title: "Email",
    value: contactDetails.email,
    href: contactDetails.emailHref,
    icon: Mail,
  },
  {
    title: "WhatsApp",
    value: "Chat with admissions",
    href: contactDetails.whatsappHref,
    icon: MessageCircle,
    external: true,
  },
  {
    title: "Visit",
    value: contactDetails.address,
    href: contactDetails.mapHref,
    icon: MapPin,
    external: true,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>(initialForm);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "We could not send your message right now.");
      }

      setStatus({
        type: "success",
        message: data.message || "Message sent successfully. Our team will respond shortly.",
      });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while sending your message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <SEO
        title="Contact"
        description="Contact Success Academy by phone, email, WhatsApp, map directions, or enquiry form for admissions, visits, and school information."
        image={campusImages.classroom}
      />

      <PageHero
        eyebrow="Contact"
        title="Reach the school quickly through active phone, email, WhatsApp, map, and enquiry channels."
        description="Whether you want to apply, book a visit, or ask about placement, our contact options below are linked and ready to use."
        image={campusImages.classroom}
        primaryAction={{ label: "Book a Visit", to: "/contact" }}
        secondaryAction={{ label: "View Admissions", to: "/admissions" }}
      />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={card.href}
                {...(card.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_50px_rgba(9,31,43,0.06)] transition hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-surface-strong)] text-[var(--brand-ink)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                  {card.title}
                </p>
                <p className="mt-3 text-base leading-7 text-[var(--brand-ink)]">{card.value}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6 rounded-[2rem] bg-[var(--brand-ink)] p-6 text-white shadow-[0_20px_60px_rgba(9,31,43,0.12)] lg:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
                Visit the campus
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Families are welcome to schedule a guided visit.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/76">
                Meet the admissions team, see classrooms, and get practical guidance on entry, placement, and next steps.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/8 p-5 text-sm leading-7 text-white/76">
              <p className="font-semibold text-white">School address</p>
              <p className="mt-2">{contactDetails.address}</p>
              <p className="mt-4 font-semibold text-white">Office hours</p>
              <p className="mt-2">{contactDetails.hours}</p>
            </div>

            <iframe
              title="Success Academy map"
              src="https://www.google.com/maps?q=26%20Excellence%20Road%20Victoria%20Island%20Lagos%20Nigeria&z=14&output=embed"
              className="h-72 w-full rounded-[1.5rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_60px_rgba(9,31,43,0.08)] lg:p-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
                Send an enquiry
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Message the school</h2>
              <p className="text-sm leading-7 text-[var(--brand-muted)]">
                Use the form below for admissions questions, visit requests, or general enquiries.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-[var(--brand-ink)]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                  className="w-full rounded-[1rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 text-sm outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
                  placeholder="Tell us what you need."
                  required
                />
              </div>

              {status.type !== "idle" && (
                <div
                  role="status"
                  className={`rounded-[1rem] px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-rose-50 text-rose-800"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-[1.2rem] bg-[var(--brand-ink)] px-5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
