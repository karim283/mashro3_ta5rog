import { Wifi, Navigation, MapPin, Fuel, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell, { Container } from "../ui/AppShell";
import { Card, Button, Badge, StarRating } from "../ui/kit";
import stationPhoto from "../../assets/center.png";

const FUEL_PRICES = [
  { type: "80", price: "20.75 EG" },
  { type: "92", price: "22.25 EG" },
  { type: "95", price: "24 EG" },
];

export default function GasStationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const station = location.state?.station;

  // --- Not-found / empty state guard (preserves current target behavior) ---
  if (!station) {
    return (
      <AppShell>
        <Container className="flex min-h-[60vh] items-center justify-center pb-4 pt-6 lg:pt-8">
          <Card className="flex w-full max-w-md flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Fuel size={26} />
            </span>
            <p className="text-base font-bold text-gray-800">No station selected</p>
            <p className="max-w-sm text-sm text-gray-500">
              Pick a station from the list to view its details and fuel prices.
            </p>
            <Button size="md" onClick={() => navigate("/explore/gas")} className="mt-1">
              Browse gas stations
            </Button>
          </Card>
        </Container>
      </AppShell>
    );
  }

  const fallbackImg = stationPhoto;

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Back button ---- */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11"
        >
          <ArrowLeft size={18} />
        </button>

        {/* ---- Single responsive layout: media/summary + fuel prices ---- */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          {/* Left: photo + summary */}
          <div className="min-w-0 space-y-6">
            <Card className="overflow-hidden p-0">
              <div className="h-48 w-full overflow-hidden bg-gray-100 sm:h-64 lg:h-72">
                <img
                  src={station.image || fallbackImg}
                  alt={station.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Badge variant="yellow" className="mb-1.5">
                      <Fuel size={12} /> Gas station
                    </Badge>
                    <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                      {station.name}
                    </h1>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={14} className="shrink-0" />
                      <span className="min-w-0 truncate">{station.address}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <StarRating rating={station.rating || 3} />
                      <span className="text-sm font-semibold text-gray-700">
                        {station.rating || 3}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center justify-end gap-1 text-sm font-semibold text-[#00897B]">
                      <Navigation size={13} /> 10 km away
                    </p>
                  </div>
                </div>

                {/* Station amenity icons (Wifi + Navigation) — preserved from current target */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    <Navigation size={13} /> Navigation
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    <Wifi size={13} /> Free Wi-Fi
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: fuel prices + directions */}
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-gray-900">Fuel prices</h2>
              <p className="text-xs text-gray-400">Updated today</p>
              <div className="mt-4 space-y-3">
                {FUEL_PRICES.map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5C842]/15 text-sm font-black text-[#9a7400]">
                        {item.type}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          Benzine {item.type}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          Per liter · Parking 10 EG
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-extrabold text-gray-900">{item.price}</p>
                  </div>
                ))}
              </div>
              <Button
                size="md"
                onClick={() =>
                  window.open("https://www.google.com/maps/search/gas+station+near+me")
                }
                className="mt-5 w-full"
              >
                <Navigation size={16} /> Get directions
              </Button>
            </Card>
          </aside>
        </div>
      </Container>
    </AppShell>
  );
}
