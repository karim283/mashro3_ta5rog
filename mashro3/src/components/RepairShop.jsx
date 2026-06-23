import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Droplet,
  Disc3,
  BatteryCharging,
  Snowflake,
  SprayCan,
  Disc,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
  Truck,
  MapPin,
  Phone,
  Navigation,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import AppShell, { Container } from "./ui/AppShell";
import { Button, Card, SectionHeading, Badge, StarRating } from "./ui/kit";

import mglogo from "../assets/mg-logo.png";
import kiaLogo from "../assets/Kia-Logo.png";
import mahindraLogo from "../assets/mahindra-logo.png";
import tataLogo from "../assets/tata-ev-logo.png";

const carTypes = [
  { label: "Sedan", active: false },
  { label: "Hatchback", active: true },
  { label: "SUV", active: true },
  { label: "MUV", active: true },
];

const brands = [
  { name: "MG", src: mglogo },
  { name: "KIA", src: kiaLogo },
  { name: "Mahindra Electric", src: mahindraLogo },
  { name: "Tata EV", src: tataLogo },
];

const services = [
  { label: "Periodic Service", Icon: Wrench },
  { label: "Oil Change", Icon: Droplet },
  { label: "Brakes", Icon: Disc3 },
  { label: "Battery", Icon: BatteryCharging },
  { label: "AC Service", Icon: Snowflake },
  { label: "Denting & Paint", Icon: SprayCan },
  { label: "Tyres", Icon: Disc },
  { label: "Car Wash", Icon: Sparkles },
];

const centers = [
  {
    name: "Mark EV Motors",
    area: "Smouha, Alexandria",
    rating: 4.8,
    reviews: 320,
    distance: "1.2 km",
    hours: "Open now",
    open: true,
    tags: ["EV Certified", "Genuine Parts"],
  },
  {
    name: "AutoCare Pro",
    area: "Sidi Gaber, Alexandria",
    rating: 4.6,
    reviews: 210,
    distance: "2.5 km",
    hours: "Open now",
    open: true,
    tags: ["Quick Service", "Warranty"],
  },
  {
    name: "SpeedFix Garage",
    area: "Miami, Alexandria",
    rating: 4.5,
    reviews: 156,
    distance: "3.8 km",
    hours: "Opens 9 AM",
    open: false,
    tags: ["Denting & Paint", "Free Pickup"],
  },
];

const trust = [
  { Icon: BadgeCheck, title: "Verified Centers", sub: "Every workshop is vetted" },
  { Icon: ShieldCheck, title: "Service Warranty", sub: "Up to 1,000 km / 1 month" },
  { Icon: Wrench, title: "Genuine Parts", sub: "OEM-grade components" },
  { Icon: Truck, title: "Free Pickup & Drop", sub: "At your doorstep" },
];

const CAR_PATHS = {
  Sedan: "M8 14 Q10 10 14 10 L22 10 Q26 10 28 12 L30 14 Z M6 14 L32 14 L32 17 Q32 19 30 19 L8 19 Q6 19 6 17 Z M10 19 A2.5 2.5 0 1 0 15 19 A2.5 2.5 0 1 0 10 19 Z M23 19 A2.5 2.5 0 1 0 28 19 A2.5 2.5 0 1 0 23 19 Z",
  Hatchback: "M10 14 Q11 10 15 10 L23 10 Q26 10 28 12 L30 14 Z M6 14 L30 14 L30 17 Q30 19 28 19 L8 19 Q6 19 6 17 Z M10 19 A2.5 2.5 0 1 0 15 19 A2.5 2.5 0 1 0 10 19 Z M22 19 A2.5 2.5 0 1 0 27 19 A2.5 2.5 0 1 0 22 19 Z",
  SUV: "M8 13 Q9 9 14 9 L24 9 Q28 9 30 12 L32 14 L32 18 Q32 19 30 19 L8 19 Q6 19 6 18 L6 14 Z M10 19 A2.5 2.5 0 1 0 15 19 A2.5 2.5 0 1 0 10 19 Z M23 19 A2.5 2.5 0 1 0 28 19 A2.5 2.5 0 1 0 23 19 Z",
  MUV: "M7 12 L7 19 L31 19 L31 12 Q31 10 29 10 L9 10 Q7 10 7 12 Z M10 19 A2.5 2.5 0 1 0 15 19 A2.5 2.5 0 1 0 10 19 Z M23 19 A2.5 2.5 0 1 0 28 19 A2.5 2.5 0 1 0 23 19 Z M14 10 L14 14 M20 10 L20 14",
};

const CarIcon = ({ type }) => (
  <svg
    viewBox="0 0 38 28"
    className="h-7 w-10 sm:h-9 sm:w-12 lg:h-11 lg:w-16"
    fill="none"
  >
    <path
      d={CAR_PATHS[type]}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrandLogo = ({ brand, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex h-16 w-full items-center justify-center rounded-2xl border border-gray-100 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] sm:h-20 lg:h-24 lg:p-3"
  >
    <img
      src={brand.src}
      alt={brand.name}
      onError={(e) => {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "flex";
      }}
      className="max-h-full max-w-full object-contain transition group-hover:scale-105"
    />
    <span
      style={{ display: "none" }}
      className="whitespace-pre-line text-center text-[11px] font-bold leading-tight text-gray-900 sm:text-sm"
    >
      {brand.name}
    </span>
  </button>
);

export default function RepairShop() {
  const navigate = useNavigate();

  const goCarSearch = () => navigate("/explore/repair/car-search");
  const goBrandSearch = () => navigate("/explore/repair/brand-search");
  const goSelectShop = () =>
    navigate("/explore/repair/brand-search/car-details/select-repair-shop");

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Page header ---- */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 sm:text-sm">
              Repair &amp; service
            </p>
            <h1 className="truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              Find a repair shop
            </h1>
          </div>
        </div>

        {/* ---- Hero ---- */}
        <section className="mt-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-lg shadow-[#00BFA5]/20">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/5" />
            <div className="relative z-10 max-w-xl p-6 sm:p-8 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Sparkles size={13} /> Trusted EV &amp; car care
              </span>
              <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl lg:text-[40px]">
                Book your next service in seconds
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/85 lg:text-base">
                Verified centers, genuine parts, and free pickup &amp; drop at your doorstep.
              </p>
              <div className="mt-6">
                <Button variant="light" size="lg" onClick={goSelectShop}>
                  Book a service <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Selections + promo ---- */}
        <div className="mt-10 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start lg:gap-10">
          <div>
            {/* I DRIVE */}
            <section>
              <SectionHeading title="I drive" />
              <div className="grid max-w-2xl grid-cols-4 gap-3 sm:gap-5">
                {carTypes.map((car) => (
                  <button
                    key={car.label}
                    type="button"
                    onClick={goCarSearch}
                    className="group flex cursor-pointer flex-col items-center gap-2 focus:outline-none"
                  >
                    <span
                      className={`flex aspect-square w-full max-w-[112px] items-center justify-center rounded-full transition group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-offset-2 ${
                        car.active
                          ? "bg-[#00BFA5] text-white group-focus-visible:ring-[#00BFA5]"
                          : "bg-[#F5C842] text-[#7a5e00] group-focus-visible:ring-[#F5C842]"
                      }`}
                    >
                      <CarIcon type={car.label} />
                    </span>
                    <span className="text-xs font-medium text-gray-800 sm:text-sm">
                      {car.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* BRAND */}
            <section className="mt-10 lg:mt-12">
              <SectionHeading title="Brand" />
              <div className="grid max-w-2xl grid-cols-4 gap-3 sm:gap-4">
                {brands.map((brand) => (
                  <BrandLogo
                    key={brand.name}
                    brand={brand}
                    onClick={goBrandSearch}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Promo / sponsored */}
          <aside className="mt-10 lg:mt-1 lg:self-stretch">
            <div className="relative flex min-h-[200px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#111] p-6 lg:min-h-[420px]">
              <span className="absolute right-3 top-3 rounded bg-[#333] px-2 py-0.5 text-[10px] font-semibold text-white">
                AD ›
              </span>
              <span
                className="text-3xl font-black tracking-[0.4em] text-[#e00] sm:text-4xl lg:text-5xl"
                style={{
                  textShadow: "0 0 20px rgba(220,0,0,0.6)",
                  fontFamily: "Georgia, serif",
                }}
              >
                HONDA
              </span>
              <div className="h-0.5 w-28 rounded bg-white/30 sm:w-36" />
              <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                Sponsored
              </span>
            </div>
          </aside>
        </div>

        {/* ---- Popular services (static, non-interactive) ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading title="Popular services" />
          <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:grid-cols-8">
            {services.map(({ label, Icon }) => (
              <div key={label} className="group flex flex-col items-center gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#00BFA5] shadow-sm ring-1 ring-gray-100 transition duration-200 group-hover:-translate-y-1 group-hover:bg-gradient-to-br group-hover:from-[#00BFA5] group-hover:to-[#00897B] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#00BFA5]/25 sm:h-16 sm:w-16">
                  <Icon size={24} />
                </span>
                <span className="text-center text-[11px] font-semibold leading-tight text-gray-700 transition group-hover:text-gray-900 sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Top centers near you ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading
            title="Top centers near you"
            subtitle="Verified centers sorted by distance and rating"
            actionLabel="View all"
            onAction={goSelectShop}
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {centers.map((c) => (
              <Card key={c.name} interactive className="flex flex-col gap-4 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-sm shadow-[#00BFA5]/30">
                    <Wrench size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-bold text-gray-900">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{c.area}</span>
                    </p>
                  </div>
                  <Badge variant={c.open ? "green" : "gray"} className="shrink-0">
                    {c.hours}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StarRating rating={c.rating} />
                  <span className="text-xs font-semibold text-gray-700">
                    {c.rating}
                  </span>
                  <span className="text-xs text-gray-400">({c.reviews})</span>
                  <span className="ml-auto flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Navigation size={12} /> {c.distance}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={goSelectShop}
                    className="flex-1"
                  >
                    Book slot
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Call ${c.name}`}
                  >
                    <Phone size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ---- Why choose us ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading title="Why choose us" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {trust.map(({ Icon, title, sub }) => (
              <Card
                key={title}
                interactive
                className="group flex items-center gap-3 bg-gray-50/60 p-3 sm:p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#00BFA5] shadow-sm transition group-hover:bg-gradient-to-br group-hover:from-[#00BFA5] group-hover:to-[#00897B] group-hover:text-white">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 sm:text-sm">
                    {title}
                  </p>
                  <p className="truncate text-[11px] text-gray-500">{sub}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </AppShell>
  );
}
