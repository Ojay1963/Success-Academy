import { AlertCircle, LoaderCircle, LogOut, Menu, School } from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router";
import { portalNavigation, portalRoleMeta, type PortalRole } from "../content/portal";
import { usePortalAuth } from "./AuthContext";

export function PortalLoadingScreen({ label = "Loading portal" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white px-6 py-8 text-center shadow-[0_20px_50px_rgba(9,31,43,0.06)]">
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[var(--brand-accent)]" />
        <p className="mt-4 text-sm font-medium text-[var(--brand-muted)]">{label}</p>
      </div>
    </div>
  );
}

export function PortalStateCard({
  title,
  message,
  tone = "neutral",
}: {
  title: string;
  message: string;
  tone?: "neutral" | "error";
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        tone === "error"
          ? "border-rose-200 bg-rose-50 text-rose-900"
          : "border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-ink)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-7">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function PortalCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-5 shadow-[0_16px_45px_rgba(9,31,43,0.05)] md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">{title}</h2>
          {description && <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function PortalStatGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.5rem] border border-[var(--brand-border)] bg-[var(--brand-ink)] p-5 text-white shadow-[0_14px_35px_rgba(9,31,43,0.12)]"
        >
          <p className="text-3xl font-semibold text-[var(--brand-gold-soft)]">{item.value}</p>
          <p className="mt-2 text-sm text-white/74">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function PortalTable({
  columns,
  rows,
  emptyMessage,
}: {
  columns: string[];
  rows: string[][];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <PortalStateCard title="Nothing here yet" message={emptyMessage || "Content will appear here when available."} />;
  }

  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-[var(--brand-border)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] bg-[var(--brand-surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--brand-ink)]">
        {columns.map((column) => (
          <div key={column}>{column}</div>
        ))}
      </div>
      {rows.map((row, index) => (
        <div
          key={`${row.join("-")}-${index}`}
          className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-3 border-t border-[var(--brand-border)] px-4 py-3 text-sm text-[var(--brand-muted)]"
        >
          {row.map((cell) => (
            <div key={cell}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function PortalPageShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-5 shadow-[0_16px_45px_rgba(9,31,43,0.05)] md:flex-row md:items-end md:justify-between md:p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--brand-ink)] sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--brand-muted)]">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function PortalRoleLayout({ role }: { role: PortalRole }) {
  const { logout, user } = usePortalAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = portalNavigation[role];
  const roleMeta = portalRoleMeta[role];
  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f8fb_0%,#eef3f8_100%)] pb-24 md:pb-0">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 md:block">
          <div className="sticky top-24 space-y-4 rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-ink)] p-5 text-white shadow-[0_18px_50px_rgba(9,31,43,0.12)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-[var(--brand-ink)]">
                <School className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-white/68">Success Academy</p>
                <p className="text-lg font-semibold">{roleMeta.label} Portal</p>
              </div>
            </div>
            <div className="rounded-[1.4rem] bg-white/8 p-4">
              <p className="text-sm text-white/65">Signed in as</p>
              <p className="mt-1 text-sm font-semibold">{user?.name}</p>
              <p className="mt-1 text-sm text-white/70">{user?.email}</p>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === portalRoleMeta[role].defaultPath}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center gap-3 rounded-[1.1rem] px-4 text-sm font-medium transition ${
                        isActive ? "bg-white text-[var(--brand-ink)]" : "text-white/74 hover:bg-white/10"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold text-white"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between rounded-[1.8rem] border border-[var(--brand-border)] bg-white px-4 py-4 shadow-[0_12px_35px_rgba(9,31,43,0.05)] md:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-ink)] text-white">
                <RoleIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--brand-ink)]">{roleMeta.label} Portal</p>
                <p className="text-xs text-[var(--brand-muted)]">Success Academy</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--brand-border)] text-[var(--brand-ink)]"
              aria-label="Toggle portal menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {isMenuOpen && (
            <div className="mb-5 rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-4 shadow-[0_12px_35px_rgba(9,31,43,0.05)] md:hidden">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === portalRoleMeta[role].defaultPath}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-[1.1rem] px-4 py-3 text-sm font-medium ${
                        isActive ? "bg-[var(--brand-ink)] text-white" : "bg-[var(--brand-surface)] text-[var(--brand-ink)]"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-[1.1rem] border border-[var(--brand-border)] px-4 py-3 text-sm font-semibold text-[var(--brand-ink)]"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}

          <Outlet />
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 z-50 w-full md:hidden">
        <div className="mx-auto grid max-w-[32rem] grid-cols-4 rounded-t-[1.6rem] border border-b-0 border-white/70 bg-[rgba(255,255,255,0.96)] p-2 shadow-[0_22px_70px_rgba(9,31,43,0.18)] backdrop-blur-xl">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === portalRoleMeta[role].defaultPath}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 text-[11px] font-medium ${
                    isActive ? "bg-[var(--brand-ink)] text-white" : "text-[var(--brand-muted)]"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="mt-1">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
