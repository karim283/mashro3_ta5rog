import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

import AppShell, { Container } from "./ui/AppShell";
import { Card } from "./ui/kit";

import KiaEV6 from "../assets/kia-ev6-car.png";
import KiaSeltos from "../assets/kia-seltos-car.png";
import KiaSeltos2 from "../assets/kia-seltos-2-car.png";
import KiaSlogan from "../assets/kia-slogan.png";

const cars = [
  {
    id: 1,
    name: "KIA EV6",
    img: KiaEV6,
  },
  {
    id: 2,
    name: "KIA SELTOS",
    img: KiaSeltos,
  },
  {
    id: 3,
    name: "KIA SELTOS",
    img: KiaSeltos2,
  },
];

export default function BrandSearch() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Page header: back + title ---- */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/explore/repair/car-search")}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              Choose your model
            </h1>
            <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
              Select a model to view details and find care
            </p>
          </div>
          <img
            src={KiaSlogan}
            alt="KIA"
            className="ml-auto hidden h-12 shrink-0 object-contain lg:block"
            onError={(e) => (e.currentTarget.style.opacity = 0.2)}
          />
        </div>

        {/* ---- Model grid ---- */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3">
          {cars.map((car) => (
            <Card
              key={car.id}
              as="button"
              interactive
              onClick={() => navigate("/explore/repair/brand-search/car-details")}
              className="group flex flex-col overflow-hidden p-0 text-left"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-5 sm:h-48">
                <img
                  src={car.img}
                  alt={car.name}
                  className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.style.opacity = 0.15)}
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-gray-900">{car.name}</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                    View variants
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00BFA5]/10 text-[#00897B]">
                  <ChevronRight size={18} />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </AppShell>
  );
}
