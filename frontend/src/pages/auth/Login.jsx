import { useState } from "react";
import logo from "../../assets/quize.png";
import { clearAuthData, loginUser, setAuthData } from "../../services/api.js";
import { showError, showWarning } from "../../utils/alerts.js";

function Login({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });
      setAuthData(response.token, response.user);

      const roleName = response.user?.role?.name;
      if (roleName === "student") {
        clearAuthData();
        await showWarning(
          "Student Access Required",
          "Students must use the student access page with student ID and name."
        );
        onNavigate("/student/access");
        return;
      }

      if (roleName === "admin") onNavigate("/admin/dashboard");
      else if (roleName === "teacher" || roleName === "instructor") onNavigate("/teacher/dashboard");
      else {
        clearAuthData();
        await showWarning("Unauthorized Role", "Your account role is not allowed on this portal.");
      }
    } catch (error) {
      if (error?.code === "NETWORK_ERROR") {
        await showError(
          "Network Error",
          "Cannot reach server. Please verify backend server and CORS settings."
        );
      } else if (error?.status === 403) {
        await showWarning("Account Inactive", "Your account is inactive.");
      } else if (error?.status === 422) {
        await showError("Invalid Credentials", error?.data?.message || "Email or password is incorrect.");
      } else if ((error?.status ?? 0) >= 500) {
        await showError(
          "Server Error",
          error?.data?.message || "Server error occurred during login."
        );
      } else {
        await showError("Login Failed", error?.data?.message || "Unexpected error happened.");
      }
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf2f7] px-4 py-8">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-2 h-1 w-full rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#2563eb]" />

        <div className="mb-5 flex justify-center">
          <img
            src={logo}
            alt="Jamhuriya University Logo"
            className="w-[520px] max-w-full object-contain sm:w-[560px]"
          />
        </div>

        <div className="mb-5 text-center">
          <p className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-[#1E3A8A]">
            Staff Portal
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#1E293B]">Sign In</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your account details</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full space-y-5 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5"
        >
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder=" "
              className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-5 pb-3 pt-6 text-gray-800 outline-none transition-colors duration-150 focus:border-[#1E3A8A] focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
            />
            <label
              htmlFor="email"
              className={`pointer-events-none absolute left-4 px-1 transition-all duration-200 ${
                emailFocused || email
                  ? "top-0 -translate-y-1/2 rounded bg-white text-sm text-[#1E3A8A]"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-500"
              }`}
            >
              Email
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder=" "
              className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-5 pb-3 pt-6 text-gray-800 outline-none transition-colors duration-150 focus:border-[#1E3A8A] focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
            />
            <label
              htmlFor="password"
              className={`pointer-events-none absolute left-4 px-1 transition-all duration-200 ${
                passwordFocused || password
                  ? "top-0 -translate-y-1/2 rounded bg-white text-sm text-[#1E3A8A]"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-500"
              }`}
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563eb] px-4 py-3.5 font-semibold text-white shadow-md transition-colors duration-150 hover:from-[#1b347d] hover:to-[#1d4fd8] focus:outline-none focus:ring-2 focus:ring-[#F2C200] focus:ring-offset-2 disabled:opacity-80"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
export default Login;
