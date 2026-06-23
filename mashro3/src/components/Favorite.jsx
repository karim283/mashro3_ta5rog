import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, MapPin, Tag } from "lucide-react";

import { getFavorites, removeFavorite } from "../api";
import AppShell, { Container } from "./ui/AppShell";
import { Button, Card, SectionHeading, Badge } from "./ui/kit";

export default function Favorite() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchFavorites = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setLoading(false);
      setError("Please login to see your favorites.");
      return;
    }

    try {
      const response = await getFavorites(user.id);
      setFavorites(response.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
      setError("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleDeleteFavorite = async (id) => {
    setRemovingId(id);
    try {
      await removeFavorite(id);
      fetchFavorites();
    } catch (err) {
      console.error("Failed to remove favorite", err);
      alert("Failed to remove favorite");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Header ---- */}
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
              My Favorites
            </h1>
            <p className="truncate text-sm text-gray-500">
              Your saved locations and services
            </p>
          </div>
        </div>

        {/* ---- Hero ---- */}
        <section className="mt-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-lg shadow-[#00BFA5]/20">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/5" />
            <div className="relative z-10 max-w-2xl p-6 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Heart size={13} /> Saved places
              </span>
              <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                Your favorite care spots
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/85 lg:text-base">
                Quickly revisit the repair shops, gas stations, and care centers you've bookmarked.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Favorites list ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading
            title="Saved places"
            subtitle="Tap the remove button to unpin a location"
          />

          {/* Error state */}
          {error && (
            <Card className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                <Heart size={26} />
              </span>
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </Card>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="flex gap-4 p-4 animate-pulse">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Favorites grid */}
          {!loading && !error && favorites.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((fav) => (
                <Card key={fav.id} className="flex gap-4 p-4">
                  {/* Icon badge */}
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5]">
                    <Heart size={24} />
                  </span>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-[#00897B]">
                        {fav.place_name}
                      </h3>
                      {fav.place_address && (
                        <p className="mt-0.5 flex items-start gap-1 text-xs text-gray-500">
                          <MapPin size={11} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{fav.place_address}</span>
                        </p>
                      )}
                      {fav.type && (
                        <div className="mt-2">
                          <Badge variant="teal">
                            <Tag size={10} className="mr-0.5" />
                            {fav.type}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteFavorite(fav.id)}
                        disabled={removingId === fav.id}
                        className="border-red-100 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                        {removingId === fav.id ? "Removing…" : "Remove"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && favorites.length === 0 && (
            <Card className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center sm:py-16">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5]">
                <Heart size={30} />
              </span>
              <Badge variant="teal">No favorites yet</Badge>
              <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                You haven't saved any places
              </h2>
              <p className="max-w-md text-sm text-gray-500">
                Browse repair shops, gas stations, or care centers and tap the heart icon to save them here for quick access.
              </p>
              <Button size="md" onClick={() => navigate("/explore")} className="mt-1">
                Explore places
                <ArrowLeft size={16} className="rotate-180" />
              </Button>
            </Card>
          )}
        </section>
      </Container>
    </AppShell>
  );
}
