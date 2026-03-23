import { MoreHorizontal } from "lucide-react";

const accentStyles = {
  blue: {
    iconBg: "bg-blue-50",
    iconColor: "text-[#1E3A8A]",
    ring: "#1E3A8A"
  },
  green: {
    iconBg: "bg-emerald-50",
    iconColor: "text-[#1F8A4C]",
    ring: "#1F8A4C"
  },
  gold: {
    iconBg: "bg-amber-50",
    iconColor: "text-[#B38700]",
    ring: "#F2C200"
  },
  red: {
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    ring: "#dc2626"
  }
};

function RingProgress({ progress, color }) {
  const normalized = Math.max(0, Math.min(100, Math.round(progress ?? 0)));
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-600">
        {normalized}%
      </span>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, accent = "blue", progress = 0 }) {
  const theme = accentStyles[accent] ?? accentStyles.blue;

  return (
    <article className="min-h-[145px] rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-1.5 ${theme.iconBg} ${theme.iconColor}`}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <button
          type="button"
          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Card actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-3xl font-bold leading-none text-slate-900">{value}</h3>
          <p className="mt-1.5 truncate text-xl font-medium text-slate-500">{title}</p>
        </div>
        <RingProgress progress={progress} color={theme.ring} />
      </div>
    </article>
  );
}

export default StatCard;
