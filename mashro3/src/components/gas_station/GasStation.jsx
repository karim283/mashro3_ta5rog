import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Fuel,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Navigation,
  AlertCircle,
  FuelIcon,
  Heart,
} from "lucide-react";
import { getGasStations, getGasStationsFromDB, addFavorite } from "../../api";
import AppShell, { Container } from "../ui/AppShell";
import { Card, Button, Skeleton, StarRating } from "../ui/kit";
import stationPhoto from "../../assets/center.png";

const FALLBACK_LOCATION = { lat: 30.0444, lng: 31.2357 };
const FALLBACK_STATIONS = [
  {
    id: "demo-1",
    name: "Default Gas Station",
    address: "1 Main Street",
    rating: 4,
    image: stationPhoto,
  },
  {
    id: "demo-2",
    name: "Fallback Fuel",
    address: "2 Main Street",
    rating: 3,
    image: stationPhoto,
  },
];

const GasStations = () => {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(null);
  const navigate = useNavigate();

  const fetchStations = async (lat, lng) => {
    try {
      // 1. Try to fetch from local database first
      const dbRes = await getGasStationsFromDB();
      let combinedStations = dbRes.data;

      // 2. Try to fetch from external API (live data)
      try {
        const liveRes = await getGasStations(lat, lng);
        if (liveRes.status === 200 && Array.isArray(liveRes.data)) {
          combinedStations = [...combinedStations, ...liveRes.data];
        }
      } catch (liveErr) {
        console.warn("External Gas Station API failed, using DB only", liveErr);
      }

      if (combinedStations.length > 0) {
        setStations(combinedStations);
        setError("");
      } else {
        setStations(FALLBACK_STATIONS);
        setError("No nearby stations found; showing fallback data.");
      }
    } catch (err) {
      console.error("Gas station fetching error", err);
      setError("Failed to fetch gas stations.");
      setStations(FALLBACK_STATIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (station) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please login to save favorites!");
      return;
    }

    setFavoriteLoading(station.id);
    try {
      await addFavorite({
        user_id: user.id,
        place_id: String(station.id),
        place_name: station.name,
        place_address: station.address,
        type: "gas",
      });
      alert("Added to favorites!");
    } catch (err) {
      console.error("Add favorite error", err);
      alert(err.response?.data?.error || "Failed to add to favorites.");
    } finally {
      setFavoriteLoading(null);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not available; using fallback location.");
      fetchStations(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lng);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchStations(pos.coords.latitude, pos.coords.longitude);
      },
      (geoErr) => {
        console.warn("Geolocation error:", geoErr);
        setError(
          "Location permission denied or unavailable; using fallback location.",
        );
        fetchStations(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lng);
      },
    );
  }, []);

  const goDetails = (s) => navigate("/gas-station-details", { state: { station: s } });

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Header ---- */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/explore")}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5A623] to-[#F5C842] text-white shadow-sm sm:h-12 sm:w-12">
            <Fuel size={22} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              Nearby gas stations
            </h1>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Fuel stations around your location
            </p>
          </div>
        </div>

        {/* ---- Error / fallback notice ---- */}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            <AlertCircle size={16} className="shrink-0" />
            <span className="min-w-0">{error}</span>
          </div>
        )}

        {/* ---- Stations (loading / empty / data) ---- */}
        <section className="mt-10 lg:mt-12">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-40 w-full rounded-xl" />
                  <Skeleton className="mt-4 h-4 w-2/3" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                  <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                </Card>
              ))}
            </div>
          ) : stations.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <FuelIcon size={26} />
              </span>
              <p className="text-base font-bold text-gray-800">No stations found nearby</p>
              <p className="max-w-sm text-sm text-gray-500">
                Try enabling location access to see fuel stations around you.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stations.map((s) => (
                <Card key={s.id} interactive className="flex flex-col overflow-hidden p-0">
                  <div className="h-40 w-full overflow-hidden bg-gray-100 sm:h-44">
                    <img
                      src={s.image || stationPhoto}
                      alt={s.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <h3 className="truncate text-[15px] font-bold text-gray-900">{s.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{s.address}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <StarRating rating={s.rating} />
                      <span className="text-xs font-semibold text-gray-700">{s.rating}</span>
                    </div>
                    <div className="mt-auto flex gap-2 pt-4">
                      <Button size="sm" onClick={() => goDetails(s)} className="flex-1">
                        Details <ArrowRight size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddFavorite(s)}
                        disabled={favoriteLoading === s.id}
                        aria-label={favoriteLoading === s.id ? "Adding..." : "Add to favorites"}
                      >
                        <Heart
                          size={14}
                          className={favoriteLoading === s.id ? "animate-pulse" : ""}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open("https://www.google.com/maps/search/gas+station+near+me")
                        }
                        aria-label="Open in maps"
                      >
                        <Navigation size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </Container>
    </AppShell>
  );
};

export default GasStations;
