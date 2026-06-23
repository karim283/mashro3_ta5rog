import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, SlidersHorizontal } from "lucide-react";

import AppShell, { Container } from "./ui/AppShell";
import { Button, Card, SectionHeading, StarRating } from "./ui/kit";

import KiaEV6 from "../assets/KIA-EV6-removebg-preview.png";
import BentlyEO1 from "../assets/BENTLY-EO1-removebg-preview.png";
import NissaEQZ1 from "../assets/NISSAN-EQ-Z1-removebg-preview.png";
import FerrariEVF1 from "../assets/FERRARI-EVF1-removebg-preview.png";
import hondaLogo from "../assets/honda-logo.png";
import bmwLogo from "../assets/bmw-logo.png";
import mercedesLogo from "../assets/mercedes-logo.png";
import audiLogo from "../assets/audi-logo.png";

const filters = ["Range", "Speed", "Luxury", "Utility"];

const cars = [
  { id: 1, name: "KIA EV6", stars: 4, img: KiaEV6 },
  { id: 2, name: "BENTLY EO1", stars: 4, img: BentlyEO1 },
  { id: 3, name: "NISSAN EQ Z1", stars: 4, img: NissaEQZ1 },
  { id: 4, name: "FERRARI EVF1", stars: 4, img: FerrariEVF1 },
];

const brands = [
  { name: "Honda", img: hondaLogo },
  { name: "BMW", img: bmwLogo },
  { name: "Mercedes", img: mercedesLogo },
  { name: "Audi", img: audiLogo },
];

function CarCard({ car, navigate }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card
      as="button"
      interactive
      onClick={() => navigate("/explore/repair/brand-search")}
      className="flex flex-col overflow-hidden p-0 text-left"
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:h-40 lg:h-44">
        <img
          src={car.img}
          alt={car.name}
          className="max-h-full max-w-full object-contain transition duration-300 hover:scale-110"
          onError={(e) => (e.currentTarget.style.opacity = 0.2)}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate text-sm font-bold tracking-wide text-gray-900">{car.name}</p>
        <div className="mt-auto flex items-center justify-between">
          <StarRating rating={car.stars} />
          <span
            role="button"
            tabIndex={0}
            aria-pressed={liked}
            aria-label={liked ? "Remove from favorites" : "Save to favorites"}
            onClick={(e) => {
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setLiked((v) => !v);
              }
            }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
              liked
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
            }`}
          >
            <Heart size={16} className={liked ? "fill-red-500" : ""} />
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function CarSearch() {
  const navigate = useNavigate();

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
            <h1 className="truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              Explore cars
            </h1>
            <p className="text-xs text-gray-500 sm:text-sm">
              Browse models and pick your car to find the right care
            </p>
          </div>
        </div>

        {/* ---- Filter chips ---- */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:border-[#00BFA5]/40 hover:text-[#00897B]"
            >
              {f}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-500">
            <SlidersHorizontal size={16} /> Filters
          </span>
        </div>

        {/* ---- Search results ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading title="Search results" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} navigate={navigate} />
            ))}
          </div>
        </section>

        {/* ---- Browse by brand ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading title="Browse by brand" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {brands.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => navigate("/explore/repair/brand-search")}
                className="group flex h-24 items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00BFA5]/30 hover:shadow-md sm:h-28"
              >
                <img
                  src={b.img}
                  alt={b.name}
                  className="max-h-full max-w-full object-contain transition group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "block";
                  }}
                />
                <span style={{ display: "none" }} className="text-sm font-bold text-gray-800">
                  {b.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      </Container>
    </AppShell>
  );
}
