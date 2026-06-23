import { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../ui/kit";
import { registerUser } from "../../../api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleRegister = async () => {
    // Validation
    if (!name || !mobile || !email || !password) {
      setError("Please fill all fields");
      setStatus("");
      return;
    }

    if (!accepted) {
      setError("You must accept the terms");
      setStatus("");
      return;
    }

    try {
      const userData = { name, mobile, email, password };
      await registerUser(userData);
      setError("");
      setStatus("Registration saved successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Register API error:", err.response?.data || err.message || err);
      const message =
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Try again.";
      setError(message);
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
      {/* ===================== Brand panel (desktop only) ===================== */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#00BFA5] to-[#00897B] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="CarCareX" className="h-11 w-11 rounded-xl bg-white/15 p-1.5" />
          <span className="text-lg font-black tracking-tight">CarCareX</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-black leading-tight">
            Join thousands of car owners in Alexandria.
          </h2>
          <p className="mt-4 text-white/85">
            Create an account to save your favorite centers, write reviews, and keep your
            service history in one place.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Star size={18} />
              </span>
              Save favorites and leave reviews
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <MapPin size={18} />
              </span>
              Personalized, location-based results
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <ShieldCheck size={18} />
              </span>
              Your data stays private and secure
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} CarCareX. All rights reserved.
        </p>
      </div>

      {/* ===================== Form (all widths) ===================== */}
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:min-h-0 lg:bg-white lg:p-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <img src={logo} alt="CarCareX" className="mx-auto mb-4 w-14" />
          <h1 className="text-center text-2xl font-black tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            It only takes a minute to get started.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {status && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            className="mt-6 space-y-4"
          >
            <Field
              label="Full name"
              Icon={User}
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={setName}
            />
            <Field
              label="Mobile number"
              Icon={Phone}
              type="text"
              placeholder="+20 1xx xxx xxxx"
              value={mobile}
              onChange={setMobile}
            />
            <Field
              label="Email"
              Icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <Field
              label="Password"
              Icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 transition hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <label className="flex items-start gap-2.5 text-sm text-gray-600">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-[#00BFA5]"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
              />
              <span>I accept all the requirements and terms provided.</span>
            </label>

            <Button type="submit" size="lg" className="w-full">
              Create account <ArrowRight size={16} />
            </Button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/explore")}
            className="mt-3 w-full text-center text-sm font-semibold text-gray-500 transition hover:text-gray-700"
          >
            Skip for now &raquo;
          </button>

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
            Already registered?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-[#00BFA5] hover:text-[#00897B]"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, Icon, type, placeholder, value, onChange, trailing }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 transition focus-within:border-[#00BFA5] focus-within:ring-2 focus-within:ring-[#00BFA5]/20">
        <Icon size={18} className="text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {trailing}
      </div>
    </label>
  );
}
