/**
 * CarCareX shared UI kit
 * -----------------------
 * Lightweight, dependency-free presentational primitives so every page shares
 * one consistent design language (brand teal #00BFA5 → #00897B, yellow #F5C842).
 *
 * These are desktop/tablet-oriented building blocks; existing mobile layouts are
 * intentionally left untouched. Import what you need:
 *   import { Button, Card, SectionHeading, Badge, StarRating, Skeleton } from "./ui/kit";
 */
import React from "react";
import { ChevronRight, Star } from "lucide-react";

/* Brand tokens (kept here so they live in one place) */
export const BRAND = {
  teal: "#00BFA5",
  tealDark: "#00897B",
  yellow: "#F5C842",
};

// Tiny dependency-free className joiner (handles strings, falsy values, nested arrays).
export const cn = (...args) => args.flat(Infinity).filter(Boolean).join(" ");

/* ----------------------------- Button ----------------------------- */
const BTN_VARIANTS = {
  primary:
    "bg-gradient-to-r from-[#00BFA5] to-[#00897B] text-white shadow-sm shadow-[#00BFA5]/30 hover:shadow-md hover:shadow-[#00BFA5]/40 hover:brightness-[1.03]",
  solid: "bg-[#00BFA5] text-white hover:bg-[#00897B]",
  outline:
    "border border-gray-200 bg-white text-gray-700 hover:border-[#00BFA5]/40 hover:bg-[#00BFA5]/5 hover:text-[#00897B]",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  dark: "bg-[#101826] text-white hover:bg-[#1b2740]",
  light: "bg-white text-[#00897B] shadow-sm hover:shadow-md",
};

const BTN_SIZES = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm md:text-base",
  icon: "h-10 w-10",
};

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        BTN_VARIANTS[variant],
        BTN_SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------ Card ------------------------------ */
export function Card({ as: Tag = "div", interactive = false, className, children, ...props }) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-gray-100 bg-white shadow-sm",
        interactive &&
          "transition duration-200 hover:-translate-y-1 hover:border-[#00BFA5]/30 hover:shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* -------------------------- SectionHeading ------------------------ */
export function SectionHeading({ title, subtitle, actionLabel, onAction, className }) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-gray-900 lg:text-xl">
          <span className="h-5 w-1.5 rounded-full bg-[#00BFA5]" />
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 pl-4 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="group flex shrink-0 items-center gap-0.5 text-sm font-semibold text-[#00BFA5] transition hover:text-[#00897B]"
        >
          {actionLabel}
          <ChevronRight size={16} className="transition group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------ Badge ----------------------------- */
const BADGE_VARIANTS = {
  neutral: "bg-gray-100 text-gray-600",
  teal: "bg-[#00BFA5]/10 text-[#00897B]",
  yellow: "bg-[#F5C842]/15 text-[#9a7400]",
  green: "bg-green-50 text-green-600",
  gray: "bg-gray-100 text-gray-500",
};

export function Badge({ variant = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        BADGE_VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------- IconTile ----------------------------- */
export function IconTile({ Icon, className, size = 22 }) {
  return (
    <span
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
        className || "bg-[#00BFA5]/10 text-[#00BFA5]",
      )}
    >
      <Icon size={size} />
    </span>
  );
}

/* --------------------------- StarRating --------------------------- */
export function StarRating({ rating = 0, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "fill-[#F5C842] text-[#F5C842]"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </span>
  );
}

/* ---------------------------- Skeleton ---------------------------- */
export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200/80", className)} />;
}
