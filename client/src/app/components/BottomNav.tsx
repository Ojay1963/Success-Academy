import { BookOpen, Home, Newspaper, Phone, UserPlus } from "lucide-react";
import { NavLink } from "react-router";
import { bottomNavItems } from "../content/site";

const navIcons = {
  "/": Home,
  "/academics": BookOpen,
  "/admissions": UserPlus,
  "/news": Newspaper,
  "/contact": Phone,
};

export default function BottomNav() {
  return (
    <nav className="mobile-bottom-nav fixed bottom-3 left-1/2 z-50 w-[calc(100%-1.25rem)] -translate-x-1/2 md:hidden">
      <div className="mx-auto grid max-w-[30rem] grid-cols-5 rounded-[1.6rem] border border-white/70 bg-[rgba(255,255,255,0.95)] p-2 shadow-[0_24px_70px_rgba(9,31,43,0.2)] backdrop-blur-xl">
        {bottomNavItems.map((item) => {
          const Icon = navIcons[item.path as keyof typeof navIcons];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 text-[11px] font-medium transition ${
                  isActive
                    ? "bg-[var(--brand-ink)] text-white"
                    : "text-[var(--brand-muted)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="mt-1">{item.shortLabel}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
