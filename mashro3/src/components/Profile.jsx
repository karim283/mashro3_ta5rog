import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateUserProfile,
  getCars,
  addCar,
  removeCar,
  getAddresses,
  addAddress,
} from "../api";
import {
  Heart,
  Headphones,
  User,
  MapPin,
  Languages,
  Bell,
  Info,
  Share2,
  LogOut,
  MessageCircle,
  Camera,
  Car,
  Plus,
  Trash2,
  X,
  Copy,
  Check,
} from "lucide-react";

import AppShell, { Container } from "./ui/AppShell";
import { Card, Button, Badge, SectionHeading } from "./ui/kit";
import defaultAvatar from "../assets/madian.png";

const API_BASE = "http://localhost:5000/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({ brand: "", model: "", year: "", plate_number: "" });
  const fileInputRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [notifications, setNotifications] = useState({ sms: false, email: true, whatsapp: true });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: "Home", address: "", city: "Alexandria" });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralCopied, setReferralCopied] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!savedUser || !isLoggedIn) {
      navigate("/login");
      return;
    }
    setUser(savedUser);
    fetchCars(savedUser.id);
  }, [navigate]);

  const fetchCars = async (userId) => {
    try {
      const r = await getCars(userId);
      setCars(r.data || []);
    } catch (e) {
      console.error(e);
      setCars([]);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const r = await fetch(`${API_BASE}/notifications/${userId}`, { headers: authHeaders });
      const data = await r.json();
      setNotifications({ sms: data.sms, email: data.email, whatsapp: data.whatsapp });
    } catch (e) {
      console.error(e);
    }
  };

  const saveNotifications = async () => {
    try {
      await fetch(`${API_BASE}/notifications/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(notifications),
      });
      alert("Notification preferences saved!");
      setActiveModal(null);
    } catch (e) {
      alert("Failed to save preferences");
    }
  };

  const fetchAddresses = async (userId) => {
    try {
      const r = await getAddresses(userId);
      setAddresses(r.data || []);
    } catch (e) {
      console.error(e);
      setAddresses([]);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.address) {
      alert("Please enter an address");
      return;
    }
    try {
      await addAddress({ ...newAddress, user_id: user.id });
      setNewAddress({ label: "Home", address: "", city: "Alexandria" });
      setShowAddAddress(false);
      fetchAddresses(user.id);
      alert("Address added!");
    } catch (e) {
      alert("Failed to add address");
    }
  };

  const generateReferral = async () => {
    try {
      const r = await fetch(`${API_BASE}/referral/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
      });
      const data = await r.json();
      setReferralCode(data.code);
    } catch (e) {
      alert("Failed to generate referral code");
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const openModal = (modal) => {
    setActiveModal(modal);
    if (modal === "notifications") fetchNotifications(user.id);
    if (modal === "addresses") fetchAddresses(user.id);
    if (modal === "referral") generateReferral();
  };

  const handleAddCar = async () => {
    if (!newCar.brand || !newCar.model) {
      alert("Brand and Model are required!");
      return;
    }
    try {
      await addCar({ ...newCar, user_id: user.id });
      setNewCar({ brand: "", model: "", year: "", plate_number: "" });
      setShowAddCar(false);
      fetchCars(user.id);
    } catch (e) {
      alert("Failed to add car.");
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Remove this car?")) return;
    try {
      await removeCar(carId);
      fetchCars(user.id);
    } catch (e) {
      alert("Failed to delete car.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result;
      setLoading(true);
      try {
        await updateUserProfile(user.id, { name: user.name, mobile: user.mobile, image: imageData });
        const updatedUser = { ...user, image: imageData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (e) {
        alert("Failed to update profile image");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    if (loading) return;
    fileInputRef.current?.click();
  };

  const saveLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    alert(`Language set to ${lang === "en" ? "English" : "Arabic"}`);
    setActiveModal(null);
  };

  if (!user) return null;

  return (
    <AppShell>
      <Container className="pb-4 pt-6 lg:pt-8">
        {/* ---- Identity card (cover + avatar + actions) ---- */}
        <Card className="overflow-hidden p-0">
          <div className="relative h-28 bg-gradient-to-r from-[#00BFA5] to-[#00897B] sm:h-32">
            <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-16 left-20 h-36 w-36 rounded-full bg-white/5" />
          </div>

          <div className="flex flex-col items-center gap-4 px-5 pb-6 text-center sm:flex-row sm:items-end sm:gap-6 sm:px-8 sm:pb-8 sm:text-left">
            <div className="relative -mt-14 shrink-0 sm:-mt-16">
              <img
                src={user.image || defaultAvatar}
                alt="profile"
                className={`h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32 ${loading ? "opacity-50" : ""}`}
              />
              <button
                onClick={openFilePicker}
                disabled={loading}
                aria-label={user.image ? "Change photo" : "Upload photo"}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#00BFA5] text-white shadow-md transition hover:bg-[#00897B] disabled:opacity-60"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="min-w-0 flex-1 sm:pb-2">
              <h1 className="truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
                {user.name || "User"}
              </h1>
              <p className="truncate text-sm text-gray-500">
                {user.email || "No email available"}
              </p>
              {user.mobile && (
                <Badge variant="teal" className="mt-2">
                  {user.mobile}
                </Badge>
              )}
              {loading && (
                <p className="mt-1 text-xs font-semibold text-[#00897B]">Uploading...</p>
              )}
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              className="w-full shrink-0 sm:w-auto"
            >
              <LogOut size={16} /> Log out
            </Button>
          </div>
        </Card>

        {/* ---- Quick tiles ---- */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Card
            as="button"
            interactive
            onClick={() => navigate("/favorite")}
            className="flex items-center gap-3 p-4 text-left sm:p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5]">
              <Heart size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-gray-900">Favorite</p>
              <p className="truncate text-xs text-gray-500">Saved centers</p>
            </div>
          </Card>

          <Card
            as="button"
            interactive
            onClick={() => navigate("/chat")}
            className="flex items-center gap-3 p-4 text-left sm:p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00BFA5]/10 text-[#00BFA5]">
              <Headphones size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-gray-900">Support</p>
              <p className="truncate text-xs text-gray-500">Chat with assistant</p>
            </div>
          </Card>
        </div>

        {/* ---- Your Cars ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading
            title="Your Cars"
            actionLabel={showAddCar ? "Close" : "Add Car"}
            onAction={() => setShowAddCar(!showAddCar)}
          />
          <Card className="p-5 sm:p-6">
            {showAddCar && (
              <div className="mb-4 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <input
                  type="text"
                  placeholder="Brand (e.g. Toyota)"
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none"
                  value={newCar.brand}
                  onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Model (e.g. Corolla)"
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none"
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Year"
                    className="w-1/2 rounded-lg border border-gray-300 p-2 text-sm outline-none"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Plate No."
                    className="w-1/2 rounded-lg border border-gray-300 p-2 text-sm outline-none"
                    value={newCar.plate_number}
                    onChange={(e) => setNewCar({ ...newCar, plate_number: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCar}
                    className="flex-1 rounded-lg bg-[#00BFA5] py-2 text-sm font-semibold text-white transition hover:bg-[#00897B]"
                  >
                    Save Car
                  </button>
                  <button
                    onClick={() => setShowAddCar(false)}
                    className="flex-1 rounded-lg bg-gray-200 py-2 text-sm font-semibold text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {cars.length === 0 ? (
                <p className="text-sm italic text-gray-400">No cars added yet.</p>
              ) : (
                cars.map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                  >
                    <div className="rounded-lg bg-[#00BFA5]/10 p-2 text-[#00897B]">
                      <Car size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-gray-900">
                        {car.brand} {car.model}
                      </h4>
                      <p className="truncate text-[10px] text-gray-500">
                        {car.year} • {car.plate_number}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="text-gray-400 transition hover:text-red-500"
                      aria-label="Remove car"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        {/* ---- Settings ---- */}
        <section className="mt-10 lg:mt-12">
          <SectionHeading title="Settings" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Your information
              </p>
              <div className="mt-3 divide-y divide-gray-100">
                <MenuItem
                  icon={<User size={18} />}
                  text="Profile"
                  onClick={() =>
                    alert(`Name: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}`)
                  }
                />
                <MenuItem
                  icon={<MapPin size={18} />}
                  text="Address Book"
                  onClick={() => openModal("addresses")}
                />
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Other information
              </p>
              <div className="mt-3 divide-y divide-gray-100">
                <MenuItem
                  icon={<Languages size={18} />}
                  text="Language Selection"
                  onClick={() => openModal("language")}
                />
                <MenuItem
                  icon={<Bell size={18} />}
                  text="Notification Preferences"
                  onClick={() => openModal("notifications")}
                />
                <MenuItem
                  icon={<Info size={18} />}
                  text="About Us"
                  onClick={() => openModal("about")}
                />
                <MenuItem
                  icon={<Share2 size={18} />}
                  text="Referral"
                  onClick={() => openModal("referral")}
                />
                <MenuItem
                  icon={<MessageCircle size={18} />}
                  text="Chat with Assistant"
                  onClick={() => navigate("/chat")}
                />
                <MenuItem icon={<LogOut size={18} />} text="Log out" onClick={handleLogout} />
              </div>
            </Card>
          </div>
        </section>
      </Container>

      {activeModal === "notifications" && (
        <Modal title="Notification Preferences" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            {[
              { key: "sms", label: "SMS updates about coupons and offers", icon: "💬" },
              { key: "email", label: "Email updates about coupons and offers", icon: "✉️" },
              { key: "whatsapp", label: "WhatsApp updates about coupons and offers", icon: "📱" },
            ].map(({ key, label, icon }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications[key] ? "bg-teal-500" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mx-0.5 ${notifications[key] ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
            <button onClick={saveNotifications} className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold mt-2">
              Save Preferences
            </button>
          </div>
        </Modal>
      )}

      {activeModal === "addresses" && (
        <Modal title="Address Book" onClose={() => setActiveModal(null)}>
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center">No addresses saved yet.</p>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-teal-600">{addr.label}</p>
                  <p className="text-sm text-gray-700">{addr.address}</p>
                  <p className="text-xs text-gray-400">{addr.city}</p>
                </div>
              ))
            )}
            {showAddAddress ? (
              <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <select
                  className="w-full p-2 text-sm rounded-lg border border-gray-300 outline-none"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                >
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Full address"
                  className="w-full p-2 text-sm rounded-lg border border-gray-300 outline-none"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="City"
                  className="w-full p-2 text-sm rounded-lg border border-gray-300 outline-none"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <div className="flex gap-2">
                  <button onClick={handleAddAddress} className="flex-1 bg-teal-500 text-white py-2 rounded-lg text-sm font-semibold">Save</button>
                  <button onClick={() => setShowAddAddress(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddAddress(true)} className="w-full border border-teal-500 text-teal-500 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                <Plus size={16} /> Add New Address
              </button>
            )}
          </div>
        </Modal>
      )}

      {activeModal === "language" && (
        <Modal title="Language Selection" onClose={() => setActiveModal(null)}>
          <div className="space-y-3">
            {[
              { code: "en", label: "English", flag: "🇬🇧" },
              { code: "ar", label: "العربية", flag: "🇪🇬" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => saveLanguage(lang.code)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${language === lang.code ? "border-teal-500 bg-teal-50" : "border-gray-200"}`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-sm font-semibold">{lang.label}</span>
                {language === lang.code && <Check size={16} className="text-teal-500 ml-auto" />}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {activeModal === "referral" && (
        <Modal title="Referral" onClose={() => setActiveModal(null)}>
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Share your referral code with friends and earn rewards!</p>
            {referralCode ? (
              <>
                <div className="bg-teal-50 border-2 border-teal-200 border-dashed rounded-xl p-4">
                  <p className="text-2xl font-bold text-teal-600 tracking-widest">{referralCode}</p>
                </div>
                <button onClick={copyReferral} className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  {referralCopied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Code</>}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-400">Generating your code...</p>
            )}
          </div>
        </Modal>
      )}

      {activeModal === "about" && (
        <Modal title="About CarCareX" onClose={() => setActiveModal(null)}>
          <div className="text-center space-y-3">
            <p className="text-4xl">🚗</p>
            <h3 className="font-bold text-lg text-teal-600">CarCareX</h3>
            <p className="text-sm text-gray-600">Your complete car care companion in Alexandria, Egypt.</p>
            <p className="text-sm text-gray-600">Find nearby gas stations, repair shops, care centers, and EV charging stations — all in one app.</p>
            <p className="text-xs text-gray-400 mt-4">Version 1.0.0 · Built with ❤️ in Alexandria</p>
          </div>
        </Modal>
      )}
    </AppShell>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const MenuItem = ({ icon, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-4 py-3 text-left transition hover:text-[#00897B]"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
      {icon}
    </span>
    <span className="min-w-0 truncate text-sm font-semibold text-gray-800">{text}</span>
  </button>
);

export default Profile;
