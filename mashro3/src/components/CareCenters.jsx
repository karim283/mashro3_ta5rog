import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  LifeBuoy,
  ShieldCheck,
  Headphones,
  MessageSquareText,
  Construction,
  Star,
  Heart,
} from "lucide-react";

import { getCareCenters, addFavorite } from "../api";
import AppShell, { Container } from "./ui/AppShell";
import { Button, Card, SectionHeading, Badge } from "./ui/kit";

const supportAreas = [
  {
    Icon: ShieldCheck,
    title: "Insurance support",
    body: "Guidance on coverage and claims related to your repairs.",
  },
  {
    Icon: Headphones,
    title: "Customer service",
    body: "Help with using CarCareX and reaching service centers.",
  },
  {
    Icon: LifeBuoy,
    title: "Roadside assistance",
    body: "Find centers that offer pickup and emergency help.",
  },
];

function StarRating({ rating }) {
  const rounded = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={13}
          className={
            n <= rounded
              ? "fill-[#F5C842] text-[#F5C842]"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      {rating != null && (
        <span className="ml-1 text-xs text-gray-500">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default function CareCenters() {
  const navigate = useNavigate();

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await getCareCenters();
        setCenters(res.data);
      } catch (err) {
        console.error("Failed to fetch care centers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const handleAddFavorite = async (center) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please login to save favorites!");
      return;
    }

    setFavoriteLoading(center.id);
    try {
      await addFavorite({
        user_id: user.id,
        place_id: String(center.id),
        place_name: center.name,
        place_address: center.address,
        type: "center",
      });
      alert("Added to favorites!");
    } catch (err) {
      console.error("Add favorite error", err);
      alert(err.response?.data?.error || "Failed to add to favorites.");
    } finally {
      setFavoriteLoading(null);
    }
  };

  const goChat = () => navigate("/chat");

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
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              Care centers
            </h1>
            <p className="truncate text-sm text-gray-500">
              Support, insurance &amp; customer service
            </p>
          </div>
        </div>

        {/* ---- Hero ---- */}
        <section className="mt-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-lg shadow-[#00BFA5]/20">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-28 h-44 w-44 rounded-full bg-white/5" />

            <div className="relative z-10 max-w-2xl p-6 sm:p-8 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <LifeBuoy size={13} /> Help &amp; assistance
              </span>
              <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl lg:text-[40px]">
                Support for every step of your car care
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/85 lg:text-base">
                Insurance guidance, customer service and roadside assistance — all in one place.
                We're building partnerships across Alexandria to support you end to end.
              </p>
              <div className="mt-6">
                <Button variant="light" size="md" onClick={goChat}>
                  <MessageSquareText size={16} /> Ask the assistant
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Support areas ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading
            title="How we can help"
            subtitle="Support areas we're connecting you with"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {supportAreas.map(({ Icon, title, body }) => (
              <Card key={title} interactive className="flex flex-col gap-4 p-5 sm:p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5]">
                  <Icon size={24} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{body}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ---- Live care centers from API ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading
            title="Nearby care centers"
            subtitle="Live results from the CarCareX network"
          />

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="flex gap-4 p-4 animate-pulse">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Centers list */}
          {!loading && centers.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {centers.map((c) => (
                <Card key={c.id} className="flex gap-4 p-4">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-24 w-24 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-[#00897B]">
                        {c.name}
                      </h3>
                      {c.address && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">{c.address}</p>
                      )}
                      {c.rating != null && (
                        <div className="mt-1.5">
                          <StarRating rating={c.rating} />
                        </div>
                      )}
                      {c.services && c.services.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.services.slice(0, 3).map((s) => (
                            <Badge key={s} variant="teal">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddFavorite(c)}
                        disabled={favoriteLoading === c.id}
                      >
                        <Heart size={13} />
                        {favoriteLoading === c.id ? "Adding…" : "Favorite"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty / coming-soon state */}
          {!loading && centers.length === 0 && (
            <Card className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center sm:py-16">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5C842]/15 text-[#9a7400]">
                <Construction size={30} />
              </span>
              <Badge variant="yellow">Coming soon</Badge>
              <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl">
                Care centers are on the way
              </h2>
              <p className="max-w-md text-sm text-gray-500">
                We're connecting with insurance and support partners across Alexandria. In the
                meantime, our assistant can help you find the right repair center.
              </p>
              <Button size="md" onClick={goChat} className="mt-1">
                <MessageSquareText size={16} /> Ask the assistant
                <ArrowRight size={16} />
              </Button>
            </Card>
          )}
        </section>
      </Container>
    </AppShell>
  );
}
