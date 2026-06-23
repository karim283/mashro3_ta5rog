import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Navigation,
  Heart,
  MessageSquareText,
  MapPin,
  Clock,
  Wrench,
  Star,
} from "lucide-react";
import AppShell, { Container } from "./ui/AppShell";
import { Card, Button, Badge, StarRating } from "./ui/kit";
import Center from "../assets/center.png";
import KiaRed from "../assets/kia-red-front.png";
import User1 from "../assets/madian.png";
import User2 from "../assets/adham.png";

const reviews = [
  { name: "Abdallah Madian", date: "May 23, 2025", rating: 4, comment: "They Washed My car very good", avatar: User1 },
  { name: "Adham abbas", date: "April 12, 2024", rating: 4.5, comment: "They were very helpful with me!", avatar: User2 },
];

const SHOP = {
  name: "Mark EV Motors",
  area: "5th El-Nasr, Smouha, Alexandria, Egypt",
  rating: 4,
  reviews: 320,
  hours: "Open · 9 AM – 11 PM",
  services: ["Mechanical", "Electrical", "Battery", "Car Wash"],
  phone: "+20 100 123 4567",
  description:
    "We are a mobile workshop that travels to you. Instead of wasting your day at a repair shop, our certified technicians arrive at your location fully equipped to handle maintenance, repairs, and cleaning — saving you time, money, and hassle.",
};

export default function RepairCenter() {
  const navigate = useNavigate();
  const [showReviews, setShowReviews] = useState(false);
  const [fav, setFav] = useState(false);

  const backTo = () =>
    navigate("/explore/repair/brand-search/car-details/select-repair-shop");

  const goBack = () => {
    if (showReviews) setShowReviews(false);
    else backTo();
  };

  const callShop = () => window.open(`tel:${SHOP.phone.replace(/\s/g, "")}`);
  const findOnMap = () => window.open("https://www.google.com/maps/search/Mark+EV+Motors+Smouha+Alexandria");

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Page header: back button + title ---- */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="min-w-0 truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
            {showReviews ? "Reviews & ratings" : "Center profile"}
          </h1>
        </div>

        {/* ---- Cover / hero ---- */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative h-56 w-full sm:h-64 lg:h-80">
            <img
              src={Center}
              alt={SHOP.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101826]/85 via-[#101826]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8">
              <div className="min-w-0 text-white">
                <Badge variant="green" className="mb-2">{SHOP.hours}</Badge>
                <h2 className="truncate text-xl font-black sm:text-2xl lg:text-3xl">{SHOP.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{SHOP.area}</span>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StarRating rating={SHOP.rating} />
                  <span className="text-sm font-semibold">{SHOP.rating}</span>
                  <span className="text-sm text-white/70">({SHOP.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Body: details (left) + contact actions (right) ---- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          {/* Left column */}
          <div className="min-w-0 space-y-6">
            {/* About / description + services */}
            <Card className="p-5 sm:p-6">
              <h3 className="text-lg font-extrabold text-gray-900">About this center</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{SHOP.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SHOP.services.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 rounded-full bg-[#00BFA5]/10 px-3 py-1 text-xs font-semibold text-[#00897B]"
                  >
                    <Wrench size={12} /> {s}
                  </span>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="min-w-0 truncate text-lg font-extrabold text-gray-900">Reviews &amp; ratings</h3>
                <div className="flex shrink-0 items-center gap-2">
                  <StarRating rating={SHOP.rating} />
                  <span className="text-sm font-semibold text-gray-700">{SHOP.rating}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="h-11 w-11 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.date}</p>
                        </div>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-gray-700">
                        <Star size={14} className="fill-[#F5C842] text-[#F5C842]" /> {r.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column: contact card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5 sm:p-6">
              <div className="flex h-32 items-center justify-center rounded-2xl bg-gray-50 sm:h-36">
                <img src={KiaRed} alt="" className="max-h-full max-w-full object-contain" />
              </div>

              <div className="mt-5 space-y-2.5">
                <Button size="md" onClick={callShop} className="w-full">
                  <Phone size={16} /> Call center
                </Button>
                <Button variant="outline" size="md" onClick={findOnMap} className="w-full">
                  <Navigation size={16} /> Find on map
                </Button>
                <Button variant="outline" size="md" className="w-full">
                  <MessageSquareText size={16} /> Request callback
                </Button>
                <button
                  type="button"
                  onClick={() => setFav((v) => !v)}
                  aria-pressed={fav}
                  className={`flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-bold transition ${
                    fav
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={16} className={fav ? "fill-red-500" : ""} />
                  {fav ? "Saved" : "Save to favorites"}
                </button>
              </div>

              <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Clock size={15} className="shrink-0 text-[#00BFA5]" /> {SHOP.hours}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={15} className="shrink-0 text-[#00BFA5]" /> {SHOP.phone}
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </Container>
    </AppShell>
  );
}
