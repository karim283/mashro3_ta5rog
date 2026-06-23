import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wrench, Heart, Fuel, Scale } from "lucide-react";

import AppShell, { Container } from "./ui/AppShell";
import { getCategories, getCarCareImages } from "../api";
import { carCareImages as mockCarCareImages, getRandomItems } from "../data/mockData";

import gps from "../assets/gps.png";
import car1 from "../assets/car1.png";

/* Icon map: maps category names (from the API) to Lucide icon components.
   Falls back to Wrench when there is no match. */
const ICON_MAP = {
  "repair shop": Wrench,
  "favorite":    Heart,
  "gas station": Fuel,
  "care centers": Scale,
};

function resolveIcon(name = "") {
  return ICON_MAP[name.toLowerCase()] ?? Wrench;
}

/* Fallback static categories used when the API returns nothing or fails. */
const FALLBACK_CATEGORIES = [
  { name: "Repair shop", path: "/explore/repair" },
  { name: "Favorite",    path: "/favorite" },
  { name: "Gas station", path: "/explore/gas" },
  { name: "Care centers", path: "/explore/care" },
];

export default function Explore() {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories]   = useState([]);
  const [randomImages, setRandomImages] = useState([]);
  const [loading, setLoading]         = useState(true);

  // Fetch live data; fall back gracefully on error or empty API response
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, imgRes] = await Promise.all([
          getCategories(),
          getCarCareImages(),
        ]);

        // API categories: each item has at least { name, path }
        setCategories(Array.isArray(catRes.data) && catRes.data.length > 0
          ? catRes.data
          : FALLBACK_CATEGORIES,
        );

        // API images: each item has { image_url }
        if (Array.isArray(imgRes.data) && imgRes.data.length > 0) {
          const shuffled = [...imgRes.data].sort(() => 0.5 - Math.random());
          setRandomImages(shuffled.slice(0, 4));
        } else {
          // Fall back to mock image strings when the API returns nothing
          setRandomImages(
            getRandomItems(mockCarCareImages, 4).map((url) => ({ image_url: url })),
          );
        }
      } catch (err) {
        console.error("Failed to fetch explore data", err);
        // Full fallback: use static data so the page never crashes
        setCategories(FALLBACK_CATEGORIES);
        setRandomImages(
          getRandomItems(mockCarCareImages, 4).map((url) => ({ image_url: url })),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Resolved categories — guaranteed to always have something to render
  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  // Open Google Maps with user location (original behavior preserved)
  const openMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        window.open(
          `https://www.google.com/maps/search/gas+station/@${latitude},${longitude},15z`,
        );
      });
    } else {
      window.open("https://www.google.com/maps/search/gas+station+near+me");
    }
  };

  return (
    <AppShell>
      {/* Hero photo */}
      <div className="h-48 w-full bg-gray-200 sm:h-60 lg:h-72">
        <img src={car1} alt="" className="h-full w-full object-cover" />
      </div>

      <Container className="pb-6">
        {/* EXPLORE */}
        <h2 className="mb-4 mt-5 text-xs font-semibold tracking-[0.2em] text-gray-700 sm:text-sm lg:mt-8">
          EXPLORE
        </h2>

        {/* Categories */}
        {loading ? (
          <div className="mx-auto grid max-w-xl grid-cols-4 gap-3 text-center sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 animate-pulse rounded-full bg-gray-200 sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
                <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto grid max-w-xl grid-cols-4 gap-3 text-center sm:gap-6">
            {displayCategories.map((cat) => {
              const isActive = location.pathname === cat.path;
              const Icon = resolveIcon(cat.name);
              return (
                <button
                  key={cat.path ?? cat.name}
                  onClick={() => navigate(cat.path)}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex flex-col items-center rounded-lg p-1 transition hover:-translate-y-0.5"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md transition sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${
                      isActive
                        ? "bg-[#00897B] ring-2 ring-[#00BFA5]/40"
                        : "bg-[#00BFA5] group-hover:bg-[#00A892]"
                    }`}
                  >
                    <Icon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={2} />
                  </span>
                  <p className="mt-2 text-[11px] font-medium text-gray-700 sm:text-xs lg:text-sm">
                    {cat.name}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Map section */}
        <button
          type="button"
          onClick={openMap}
          className="mt-7 block w-full overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg lg:mt-9"
        >
          <div className="relative">
            <img src={gps} alt="" className="h-40 w-full object-cover sm:h-52 lg:h-64" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 px-4 text-center text-white">
              <p className="text-sm font-semibold sm:text-base lg:text-lg">
                There are gas stations nearby
              </p>
              <p className="mt-0.5 text-xs opacity-90 sm:text-sm">Tap to open the map</p>
            </div>
          </div>
        </button>

        {/* Car care centers */}
        <h2 className="mb-4 mt-7 text-xs font-semibold tracking-[0.2em] text-gray-700 sm:text-sm lg:mt-9">
          EXPLORE CARCARE CENTERS
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl bg-gray-200 sm:h-36 lg:h-44"
              />
            ))}
          </div>
        ) : randomImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {randomImages.map((img, i) => (
              <img
                key={i}
                src={img.image_url}
                alt=""
                className="h-28 w-full rounded-xl object-cover shadow-sm transition hover:scale-[1.03] sm:h-36 lg:h-44"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No car care images available.</p>
        )}
      </Container>
    </AppShell>
  );
}
