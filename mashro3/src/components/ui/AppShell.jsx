/**
 * AppShell — the single responsive frame shared by every page.
 * -----------------------------------------------------------
 * One source of truth for navigation across breakpoints:
 *   • Tablet / desktop (>= md): sticky TopNav
 *   • Phones (< md): modern bottom tab bar
 *   • Chat FAB: floats clear of the bottom bar on phones, bottom-right on desktop
 *
 * Pages render their content as children — no per-page nav duplication.
 *   <AppShell>
 *     <Container>…page…</Container>
 *   </AppShell>
 */
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Wrench, Bot, User } from "lucide-react";
import { cn } from "./kit";
import logo from "../../assets/logo.png";

/* Shared primary destinations — used by both nav variants so they never drift. */
const NAV_LINKS = [
  { label: "Home", to: "/explore", Icon: Home, match: (p) => p === "/explore" },
  {
    label: "Repair",
    to: "/explore/repair",
    Icon: Wrench,
    match: (p) => p.startsWith("/explore/repair"),
  },
  { label: "Assistant", to: "/chat", Icon: Bot, match: (p) => p === "/chat" },
  { label: "Profile", to: "/profile", Icon: User, match: (p) => p === "/profile" },
];

/* ----------------------------- TopNav (>= md) ----------------------------- */
function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-gray-100 bg-white/85 backdrop-blur-md md:block">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6 lg:h-[68px] lg:max-w-7xl lg:px-10"
      >
        <button
          type="button"
          onClick={() => navigate("/explore")}
          aria-label="CarCareX home"
          className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] focus-visible:ring-offset-2"
        >
          <img src={logo} alt="" className="h-10 w-10 object-contain lg:h-11 lg:w-11" />
          <span className="text-lg font-black tracking-tight text-gray-900">
            CarCare<span className="text-[#00BFA5]">X</span>
          </span>
        </button>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, to, Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => navigate(to)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] focus-visible:ring-offset-2 lg:px-4",
                    active
                      ? "bg-[#00BFA5]/10 text-[#00897B]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon size={18} />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

/* --------------------------- BottomNav (< md) ---------------------------
 * Yellow circular tab bar matching the reference design (Home · Assistant ·
 * Profile). Lives on phones only; desktop uses TopNav. */
const MOBILE_NAV = [
  { label: "Home", to: "/explore", Icon: Home, match: (p) => p === "/explore" },
  { label: "Assistant", to: "/chat", Icon: Bot, match: (p) => p === "/chat" },
  { label: "Profile", to: "/profile", Icon: User, match: (p) => p === "/profile" },
];

function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around rounded-t-[28px] border-t border-gray-100 bg-white px-8 pb-4 pt-3 shadow-[0_-6px_24px_rgba(0,0,0,0.07)]">
        {MOBILE_NAV.map(({ label, to, Icon, match }) => {
          const active = match(pathname);
          return (
            <button
              key={label}
              type="button"
              onClick={() => navigate(to)}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full text-gray-800 shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00897B] focus-visible:ring-offset-2",
                active ? "bg-[#F5C842] ring-2 ring-[#00BFA5]" : "bg-[#F5C842]",
              )}
            >
              <Icon size={24} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------- AppShell ------------------------------- */
/* The chat FAB stays global in App.tsx so every route keeps it during the
   page-by-page migration; AppShell only owns the nav frame. */
export default function AppShell({ children, className }) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-gray-50", className)}>
      <TopNav />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>
      <BottomNav />
    </div>
  );
}

/* ------------------------------- Container ------------------------------ */
/** Shared page container — one width + padding rhythm for every page. */
export function Container({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:max-w-7xl lg:px-10",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
