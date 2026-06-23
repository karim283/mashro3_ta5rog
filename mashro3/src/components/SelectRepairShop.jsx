import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Navigation, MapPin, ArrowRight, Car } from "lucide-react";

import AppShell, { Container } from "./ui/AppShell";
import { Card, Button, Badge, StarRating } from "./ui/kit";
import { nearbyCenters } from "../data/mockData";
import KiaRed from "../assets/kia-red-front.png";
import MapImage from "../assets/map.png";

export default function SelectRepairShop() {
  const navigate = useNavigate();

  const goBack = () =>
    navigate("/explore/repair/brand-search/car-details");

  const goCenter = () =>
    navigate(
      "/explore/repair/brand-search/car-details/select-repair-shop/repair-center",
    );

  const openDirections = (c) =>
    window.open(
      c?.coords
        ? `https://www.google.com/maps/dir/?api=1&destination=${c.coords.lat},${c.coords.lng}`
        : "https://www.google.com/maps/search/repair+center+near+me",
    );

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Page header ---- */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              Choose a repair center
            </h1>
            <p className="text-xs text-gray-500 sm:text-sm">
              Centers near you, sorted by distance
            </p>
          </div>
        </div>

        {/* ---- Selected vehicle ---- */}
        <Card className="mt-5 flex items-center gap-4 p-4 sm:p-5">
          <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-gray-50 sm:h-24 sm:w-32">
            <img
              src={KiaRed}
              alt="KIA EV6 GT line AWD"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.style.opacity = 0.12;
              }}
            />
          </div>
          <div className="min-w-0">
            <Badge variant="teal">
              <Car size={12} /> Selected vehicle
            </Badge>
            <p className="mt-1 truncate text-base font-black text-gray-900 sm:text-lg">
              KIA EV6 GT line AWD
            </p>
            <p className="text-xs text-gray-500">Automatic · Electric</p>
          </div>
        </Card>

        {/* ---- Repair shops + map ---- */}
        <section className="mt-10 lg:mt-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            {/* Shop list */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {nearbyCenters.map((c) => (
                <Card key={c.id} interactive className="flex flex-col gap-4 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-sm shadow-[#00BFA5]/30">
                      <MapPin size={22} />
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
                      {c.open ? "Open" : "Closed"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating rating={c.rating} />
                    <span className="text-xs font-semibold text-gray-700">
                      {c.rating}
                    </span>
                    <span className="text-xs text-gray-400">({c.reviews})</span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Navigation size={12} /> {c.distanceKm} km
                    </span>
                  </div>

                  {Array.isArray(c.services) && c.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.services.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => openDirections(c)}
                      className="flex-1"
                    >
                      <Navigation size={15} /> Directions
                    </Button>
                    <Button size="md" onClick={goCenter} className="flex-1">
                      View center <ArrowRight size={15} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Map preview */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <button
                type="button"
                onClick={() => openDirections(nearbyCenters[0])}
                className="group relative block w-full overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition hover:shadow-lg"
              >
                <img
                  src={MapImage}
                  alt="Map of nearby centers"
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-72 lg:h-[420px]"
                  onError={(e) => {
                    e.target.style.opacity = 0.15;
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101826]/85 to-transparent p-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur transition group-hover:bg-white/25">
                    <MapPin size={16} /> Open full map
                  </span>
                </div>
              </button>
            </div>
          </div>
        </section>
      </Container>
    </AppShell>
  );
}
