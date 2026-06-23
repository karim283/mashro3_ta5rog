export const categories = [
  { name: "Repair shop", icon: "🚗" },
  { name: "Favorite", icon: "💚" },
  { name: "Gas station", icon: "⛽" },
  { name: "Care centers", icon: "⚖️" },
];

export const carCareImages = [
  "/car2.png",
  "/car3.png",
  "/car4.png",
  "/car5.jpg",
];

// Randomizer
export const getRandomItems = (arr, count = 3) => {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
};

/* ------------------------------------------------------------------ *
 * Mock data layer for the redesigned (desktop/tablet) UI.
 *
 * The backend, DB and integrations are still under development, so the
 * UI reads from these mock helpers. They mimic async REST calls so the
 * components already handle loading / empty / error states. When the API
 * is ready, swap the bodies of the get* functions for real fetch/axios
 * calls — the returned shapes are intentionally close to the documented
 * "Repair Centers" schema (name, coordinates, services, hours, rating…).
 * ------------------------------------------------------------------ */

// Nearest repair / car-care centers (Alexandria). Shape mirrors the
// documented Service Provider Profile entity.
export const nearbyCenters = [
  {
    id: "mark-ev-motors",
    name: "Mark EV Motors",
    area: "Smouha, Alexandria",
    rating: 4.8,
    reviews: 320,
    distanceKm: 1.2,
    open: true,
    hours: "Open · closes 10 PM",
    phone: "+20 100 123 4567",
    services: ["Mechanical", "Electrical", "Battery"],
    coords: { lat: 31.2156, lng: 29.9553 },
  },
  {
    id: "autocare-pro",
    name: "AutoCare Pro",
    area: "Sidi Gaber, Alexandria",
    rating: 4.6,
    reviews: 210,
    distanceKm: 2.5,
    open: true,
    hours: "Open · closes 9 PM",
    phone: "+20 100 765 4321",
    services: ["Periodic Service", "Oil Change", "Car Wash"],
    coords: { lat: 31.2204, lng: 29.9412 },
  },
  {
    id: "speedfix-garage",
    name: "SpeedFix Garage",
    area: "Miami, Alexandria",
    rating: 4.5,
    reviews: 156,
    distanceKm: 3.8,
    open: false,
    hours: "Closed · opens 9 AM",
    phone: "+20 111 222 3344",
    services: ["Body Repair", "Denting & Paint"],
    coords: { lat: 31.2733, lng: 30.0107 },
  },
  {
    id: "alex-tyre-house",
    name: "Alex Tyre House",
    area: "Roushdy, Alexandria",
    rating: 4.7,
    reviews: 189,
    distanceKm: 4.4,
    open: true,
    hours: "Open · closes 11 PM",
    phone: "+20 122 998 7766",
    services: ["Tyres", "Wheel Alignment", "Brakes"],
    coords: { lat: 31.2247, lng: 29.9489 },
  },
];

/**
 * Simulates "GET /api/centers/nearest". Returns a sorted-by-distance list.
 * Replace the body with a real API call when the backend is ready.
 */
export const getNearbyCenters = ({ delay = 900 } = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...nearbyCenters].sort((a, b) => a.distanceKm - b.distanceKm);
      resolve(sorted);
    }, delay);
  });
