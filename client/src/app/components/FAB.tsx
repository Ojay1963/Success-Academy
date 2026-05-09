import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";

export default function FAB() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/contact")}
      className="fixed bottom-24 right-4 z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-[var(--brand-gold)] px-4 text-sm font-semibold text-[var(--brand-ink)] shadow-[0_18px_45px_rgba(211,170,63,0.4)] transition active:scale-98 md:hidden"
      aria-label="Book a visit"
    >
      <CalendarDays className="h-5 w-5" />
      Visit
    </button>
  );
}
