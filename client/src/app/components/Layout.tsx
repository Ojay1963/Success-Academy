import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import BottomNav from "./BottomNav";
import FAB from "./FAB";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  const location = useLocation();
  const showFab = location.pathname !== "/";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f6f0_35%,#eef3f8_100%)] text-[var(--brand-ink)]">
      <Header />
      <main className="flex-1 pb-28 md:pb-0">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BottomNav />
      {showFab ? <FAB /> : null}
    </div>
  );
}
