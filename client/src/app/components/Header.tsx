import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { contactDetails, navItems, schoolName } from "../content/site";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-[rgba(248,250,252,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" end className="flex min-w-0 shrink-0 items-center gap-3 xl:mr-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(9,31,43,0.22)]">
            SA
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[var(--brand-ink)]">{schoolName}</p>
            <p className="hidden text-sm text-[var(--brand-muted)] 2xl:block">Nursery, Primary and Secondary</p>
          </div>
        </NavLink>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {navItems.slice(0, 8).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium transition 2xl:px-4 ${
                  isActive
                    ? "bg-[var(--brand-surface-strong)] text-[var(--brand-ink)]"
                    : "text-[var(--brand-muted)] hover:bg-white hover:text-[var(--brand-ink)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <NavLink
            to="/contact"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-[var(--brand-border)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)]"
          >
            Contact
          </NavLink>
          <NavLink
            to="/admissions"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-ink)] shadow-[0_16px_40px_rgba(211,170,63,0.32)]"
          >
            Apply Now
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--brand-border)] bg-white text-[var(--brand-ink)] xl:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-[var(--brand-border)] bg-[var(--brand-surface)] xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--brand-surface-strong)] text-[var(--brand-ink)]"
                      : "bg-white text-[var(--brand-muted)]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <a
                href={contactDetails.phoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-white px-4 text-sm font-medium text-[var(--brand-ink)]"
              >
                <Phone className="h-4 w-4" />
                Contact School
              </a>
              <NavLink
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--brand-ink)] px-4 text-sm font-semibold text-white"
              >
                Book a Visit
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
