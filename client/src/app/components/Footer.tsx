import { Link } from "react-router";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contactDetails, navItems, schoolName, schoolTagline } from "../content/site";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--brand-border)] bg-[var(--brand-ink)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-lg font-bold text-[var(--brand-ink)]">
              SA
            </div>
            <p className="mt-5 text-2xl font-semibold">{schoolName}</p>
            <p className="mt-2 max-w-md text-sm leading-7 text-white/74">
              {schoolTagline}. A trusted learning community focused on character, confidence, and academic excellence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/admissions"
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)]"
              >
                Apply Now
              </Link>
              <Link
                to="/portal"
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-white hover:bg-white/8"
              >
                Login to Portal
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-white hover:bg-white/8"
              >
                Book a Visit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
              Explore
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="text-white/78 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link to="/calendar" className="text-white/78 transition hover:text-white">
                Academic Calendar
              </Link>
              <Link to="/result-checker" className="text-white/78 transition hover:text-white">
                Check Results
              </Link>
              <Link to="/portal" className="text-white/78 transition hover:text-white">
                Portal
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-gold-soft)]">
              Contact
            </p>
            <div className="mt-5 space-y-4 text-sm text-white/80">
              <a href={contactDetails.phoneHref} className="flex items-start gap-3 hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{contactDetails.phone}</span>
              </a>
              <a href={contactDetails.emailHref} className="flex items-start gap-3 hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{contactDetails.email}</span>
              </a>
              <a
                href={contactDetails.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 hover:text-white"
              >
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={contactDetails.mapHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{contactDetails.address}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/12 pt-6 text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Success Academy. All rights reserved.</p>
          <p>{contactDetails.hours}</p>
        </div>
      </div>
    </footer>
  );
}
