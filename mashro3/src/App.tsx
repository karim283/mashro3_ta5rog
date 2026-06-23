import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Register from "./components/login/register/Register";
import Login from "./components/login/register/Login";
import Explore from "./components/Explore";
import RepairShop from "./components/RepairShop";
import CarSearch from "./components/CarSearch";
import BrandSearch from "./components/BrandSearch";
import CarDetails from "./components/CarDetails";
import SelectRepairShop from "./components/SelectRepairShop";
import RepairCenter from "./components/RepairCenter";
import Profile from "./components/Profile";
import GasStation from "./components/gas_station/GasStation";
import GasStationPage from "./components/gas_station/GasStationPage";
import CareCenters from "./components/CareCenters";
import Favorite from "./components/Favorite";
import ChatPage from "./components/chatbot/ChatPage";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Routes where the global chat FAB should be hidden (the chat page itself,
  // and the auth screens which have their own full-bleed layout).
  const hideChatFab =
    location.pathname === "/chat" ||
    location.pathname === "/" ||
    location.pathname === "/login";

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/repair" element={<RepairShop />} />
        <Route path="/explore/repair/car-search" element={<CarSearch />} />
        <Route path="/explore/repair/brand-search" element={<BrandSearch />} />
        <Route
          path="/explore/repair/brand-search/car-details"
          element={<CarDetails />}
        />
        <Route
          path="/explore/repair/brand-search/car-details/select-repair-shop"
          element={<SelectRepairShop />}
        />
        <Route
          path="/explore/repair/brand-search/car-details/select-repair-shop/repair-center"
          element={<RepairCenter />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore/gas" element={<GasStation />} />
        <Route path="/gas-station-details" element={<GasStationPage />} />
        <Route path="/explore/care" element={<CareCenters />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>

      {!hideChatFab && (
        <button
          onClick={() => navigate("/chat")}
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-lg shadow-teal-900/20 transition-transform hover:scale-105 active:scale-95"
          aria-label="Open Chat"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
