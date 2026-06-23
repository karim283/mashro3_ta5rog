import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  MapPin,
  MessageSquareText,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import img1 from "../../../assets/img1.svg";
import logo from "../../../assets/logo.png";
import { Button, cn } from "../../ui/kit";
import { loginUser } from "../../../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await loginUser({ email, password });
      const user = response.data.user;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

      navigate("/explore");
    } catch (err) {
      const message =
        err.response?.data?.error || "Login failed. Check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const fieldWrap =
    "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 transition focus-within:border-[#00BFA5] focus-within:ring-2 focus-within:ring-[#00BFA5]/20";

  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
      {/* ===================== Brand panel — desktop only ===================== */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#00BFA5] to-[#00897B] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="CarCareX" className="h-11 w-11 rounded-xl bg-white/15 p-1.5" />
          <span className="text-lg font-black tracking-tight">CarCareX</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black leading-tight">
            Car care made simple in Alexandria.
          </h2>
          <p className="mt-4 text-white/85">
            Diagnose issues, discover verified repair &amp; wash centers near you, and
            contact them directly.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <MapPin size={18} />
              </span>
              Find the nearest centers, sorted by distance
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <MessageSquareText size={18} />
              </span>
              Get a preliminary diagnosis from our AI assistant
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Star size={18} />
              </span>
              Read real reviews before you choose
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} CarCareX. All rights reserved.
        </p>
      </div>

      {/* ===================== Form — shared across all widths ===================== */}
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:min-h-0 lg:bg-white lg:p-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <img src={img1} alt="" className="mx-auto mb-6 w-32 sm:w-36" />

          <h1 className="text-center text-2xl font-black tracking-tight text-gray-900">
            Glad to meet you again!
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Sign in to access your account and saved centers.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">Email</span>
              <div className={fieldWrap}>
                <Mail size={18} className="shrink-0 text-gray-400" />
                <input
                  type="text"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 text-sm outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">Password</span>
              <div className={fieldWrap}>
                <Lock size={18} className="shrink-0 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 text-sm outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="shrink-0 rounded-md p-1 text-gray-400 transition hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Signing in…" : "Sign in"} <ArrowRight size={16} />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-grow bg-gray-200" />
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="h-px flex-grow bg-gray-200" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Google", "Apple", "Facebook"].map((p) => (
              <button
                key={p}
                type="button"
                className="rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
              >
                {p}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="font-bold text-[#00BFA5] hover:text-[#00897B]"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
