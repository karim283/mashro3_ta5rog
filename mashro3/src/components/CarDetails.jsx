import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Play } from "lucide-react";
import AppShell, { Container } from "./ui/AppShell";
import { Card, Button, StarRating } from "./ui/kit";
import KiaRed from "../assets/kia-ev6-red.png";
import KiaWhite from "../assets/kia-ev9.png";
import Wheel from "../assets/wheel.png";
import Odometer from "../assets/odometer.png";
import Odometer2 from "../assets/odometer-1.png";
import KiaSlogan from "../assets/kia-slogan.png";

const specs = [
  { icon: "weight", value: "4,456lbs", label: "Weight" },
  { icon: "range", value: "418km", label: "Electric range" },
  { icon: "speed", value: "200mph", label: "Top Speed" },
  { icon: "accel", value: "1.99sec", label: "0-100mph" },
  { icon: "power", value: "408hp", label: "Power" },
];

const variants = [
  { name: "EV6 GT line", sub: "Automatic, Electric" },
  { name: "EV6 GT line AWD", sub: "Automatic, Electric" },
];

const colorSwatches = ["#6B7355", "#B00020", "#1A1A1A", "#F5C842"];

const thumbnails = [KiaWhite, Odometer2, Odometer, Wheel];

const SpecIcon = ({ type }) => {
  const props = {
    viewBox: "0 0 32 32",
    width: 28,
    height: 28,
    fill: "none",
    stroke: "#222",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "weight")
    return (
      <svg {...props}>
        <rect x="4" y="14" width="24" height="12" rx="2" />
        <path d="M10 14V10a6 6 0 0 1 12 0v4" />
        <line x1="4" y1="20" x2="28" y2="20" />
      </svg>
    );

  if (type === "range")
    return (
      <svg {...props}>
        <circle cx="16" cy="16" r="11" />
        <path d="M16 5v3M16 24v3M5 16h3M24 16h3" />
        <circle cx="16" cy="16" r="4" />
      </svg>
    );

  if (type === "speed")
    return (
      <svg {...props}>
        <path d="M6 22a11 11 0 1 1 20 0" />
        <path d="M16 22V12" />
        <circle cx="16" cy="22" r="1.5" fill="#222" />
      </svg>
    );

  if (type === "accel")
    return (
      <svg {...props}>
        <circle cx="16" cy="16" r="11" />
        <path d="M16 9v7l4 4" />
      </svg>
    );

  if (type === "power")
    return (
      <svg {...props}>
        <rect x="6" y="10" width="20" height="14" rx="2" />
        <path d="M11 10V7M21 10V7M13 17l3-4v8l3-4" />
      </svg>
    );

  return null;
};

export default function CarDetails() {
  const navigate = useNavigate();
  const [activeColor, setActiveColor] = useState(1);
  const [openVariant, setOpenVariant] = useState(null);

  const goToRepairShop = () => {
    navigate("/explore/repair/brand-search/car-details/select-repair-shop");
  };

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Page header: back button + brand ---- */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/explore/repair/brand-search")}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} />
          </button>
          <img
            src={KiaSlogan}
            alt="KIA"
            className="h-9 object-contain sm:h-10"
            onError={(e) => (e.currentTarget.style.opacity = 0.2)}
          />
        </div>

        {/* ---- Main: gallery + info ---- */}
        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-2 lg:gap-8">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden p-0">
              <div className="flex h-56 items-center justify-center bg-gray-50 sm:h-72 lg:h-80">
                <img
                  src={KiaRed}
                  alt="KIA EV6"
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.opacity = 0.15)}
                />
              </div>
            </Card>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {thumbnails.map((src, i) => (
                <div
                  key={i}
                  className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-900 sm:h-20 sm:w-28"
                >
                  <img
                    src={src}
                    alt={`thumb-${i}`}
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white">
                        <Play size={14} className="fill-white" />
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                  KIA EV6
                </h1>
                <p className="mt-0.5 text-sm font-semibold text-gray-500">
                  Model 2018
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex justify-end">
                  <StarRating rating={4} />
                </div>
                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Overall rating
                </p>
              </div>
            </div>

            {/* Colors */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Colors
              </p>
              <div className="mt-2 flex gap-3">
                {colorSwatches.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColor(i)}
                    aria-label={`Color ${i + 1}`}
                    className="h-9 w-9 rounded-full transition"
                    style={{
                      backgroundColor: c,
                      boxShadow:
                        activeColor === i
                          ? `0 0 0 2px #fff, 0 0 0 4px ${c}`
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm"
                >
                  <SpecIcon type={s.icon} />
                  <span className="text-sm font-bold text-gray-900">
                    {s.value}
                  </span>
                  <span className="text-[10px] leading-tight text-gray-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Variants */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Variants
              </p>
              <div className="mt-2 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setOpenVariant(openVariant === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {v.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">{v.sub}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-gray-400 transition ${
                        openVariant === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={goToRepairShop} size="lg" className="flex-1">
                Car care
              </Button>
              <Button
                onClick={goToRepairShop}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                Mechanic
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </AppShell>
  );
}
