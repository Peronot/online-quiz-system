import { useState } from "react";
import logo from "../../assets/quize.png";
import { registerUser } from "../../services/api.js";
import { formatValidationErrors, showError, showSuccess } from "../../utils/alerts.js";

function Register({ onNavigate }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "teacher",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await registerUser(form);
      await showSuccess("Success", "Registration completed successfully.");
      setTimeout(() => onNavigate("/login"), 900);
    } catch (error) {
      const apiErrors = error?.data?.errors ?? {};
      setErrors(apiErrors);
      const validationText = formatValidationErrors(apiErrors);

      if (validationText) {
        await showError("Registration Validation Failed", validationText);
      } else if (error?.code === "NETWORK_ERROR") {
        await showError(
          "Network Error",
          "Cannot reach server. Please verify backend is running and CORS is configured."
        );
      } else if ((error?.status ?? 0) >= 500) {
        await showError(
          "Server Error",
          error?.data?.message || "Server error occurred during registration."
        );
      } else {
        await showError(
          "Registration Failed",
          error?.data?.message || "Please check your information and try again."
        );
      }
      console.error("Register error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition-all duration-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100";

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white via-blue-50/40 to-emerald-50/30 px-4 pt-6">
      <div className="mb-3 flex justify-center sm:mb-4">
        <img
          src={logo}
          alt="Jamhuriya University Logo"
          className="w-[500px] sm:w-[500px] md:w-[511px] object-contain"
        />
      </div>
      <section className="-mt-24 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:-mt-28 sm:p-8">
        <h1 className="mb-4 text-center text-2xl font-semibold text-[#1E3A8A]">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={onChange}
              placeholder="Full name"
              className={inputClass}
              required
            />
            {errors.full_name?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name[0]}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              className={inputClass}
              required
            />
            {errors.email?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={onChange}
              placeholder="Phone (optional)"
              className={inputClass}
            />
            {errors.phone?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value="Teacher account"
              className={`${inputClass} bg-gray-50 text-gray-600`}
              readOnly
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              className={inputClass}
              required
            />
            {errors.password?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
            )}
          </div>

          <div>
            <input
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={onChange}
              placeholder="Confirm password"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#1E3A8A] px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#172d6d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("/login")}
              className="font-medium text-[#1E3A8A] hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
