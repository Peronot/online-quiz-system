import { useState } from "react";
import logo from "../../assets/quize.png";
import { setStudentData, studentAccess } from "../../services/api.js";
import { formatValidationErrors, showError, showSuccess } from "../../utils/alerts.js";

function StudentAccess({ onNavigate }) {
  const [form, setForm] = useState({
    student_id: "",
    student_name: ""
  });
  const [studentIdFocused, setStudentIdFocused] = useState(false);
  const [studentNameFocused, setStudentNameFocused] = useState(false);
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
      const response = await studentAccess(form);
      setStudentData(response.student);
      await showSuccess("Access Granted", "Student access successful.");
      onNavigate("/student/dashboard");
    } catch (error) {
      const apiErrors = error?.data?.errors ?? {};
      setErrors(apiErrors);
      const validationText = formatValidationErrors(apiErrors);

      if (validationText) {
        await showError("Student Access Failed", validationText);
      } else if (error?.code === "NETWORK_ERROR") {
        await showError(
          "Network Error",
          "Cannot reach server. Please verify backend is running and CORS is configured."
        );
      } else {
        await showError(
          "Student Access Failed",
          error?.data?.message || "Unable to grant student access."
        );
      }
      console.error("Student access error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#edf4fb] via-[#f5f9ff] to-[#eef7f0] px-4 py-10">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#1E3A8A]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#0ea5e9]/10 blur-3xl" />

      <section className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-25px_rgba(30,58,138,0.35)] backdrop-blur sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1E3A8A] via-[#2563eb] to-[#0ea5e9]" />

        <div className="mb-6 flex justify-center">
          <img
            src={logo}
            alt="Jamhuriya University Logo"
            className="w-[360px] max-w-full object-contain"
          />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">Student Access</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your student details to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm space-y-5">
          <div className="relative">
            <input
              id="student_id"
              name="student_id"
              type="text"
              value={form.student_id}
              onChange={onChange}
              onFocus={() => setStudentIdFocused(true)}
              onBlur={() => setStudentIdFocused(false)}
              placeholder=" "
              className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-5 pb-3 pt-6 text-gray-800 outline-none transition-all duration-300 hover:border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-4 focus:ring-blue-100/80"
              required
            />
            <label
              htmlFor="student_id"
              className={`pointer-events-none absolute left-4 px-1 transition-all duration-200 ${
                studentIdFocused || form.student_id
                  ? "top-0 -translate-y-1/2 rounded bg-white text-sm text-[#1E3A8A]"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-500"
              }`}
            >
              Student ID
            </label>
            {errors.student_id?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.student_id[0]}</p>
            )}
          </div>
          <div className="relative">
            <input
              id="student_name"
              name="student_name"
              type="text"
              value={form.student_name}
              onChange={onChange}
              onFocus={() => setStudentNameFocused(true)}
              onBlur={() => setStudentNameFocused(false)}
              placeholder=" "
              className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-5 pb-3 pt-6 text-gray-800 outline-none transition-all duration-300 hover:border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-4 focus:ring-blue-100/80"
              required
            />
            <label
              htmlFor="student_name"
              className={`pointer-events-none absolute left-4 px-1 transition-all duration-200 ${
                studentNameFocused || form.student_name
                  ? "top-0 -translate-y-1/2 rounded bg-white text-sm text-[#1E3A8A]"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-500"
              }`}
            >
              Student Name
            </label>
            {errors.student_name?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.student_name[0]}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563eb] px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#1b347d] hover:to-[#1d4fd8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Continue"}
          </button>
          <p className="text-center text-sm text-gray-600">
            Staff account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("/login")}
              className="font-medium text-[#1E3A8A] transition-colors hover:text-[#0f2a75] hover:underline"
            >
              Go to Login
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default StudentAccess;
