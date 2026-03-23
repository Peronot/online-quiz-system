function DonutSummaryChart({ title, centerValue, segments = [] }) {
  const validSegments = segments.filter((segment) => segment.value > 0);
  const total = validSegments.reduce((sum, segment) => sum + segment.value, 0);

  const radius = 44;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const rings = validSegments.map((segment) => {
    const fraction = total > 0 ? segment.value / total : 0;
    const length = fraction * circumference;
    const ring = {
      ...segment,
      dasharray: `${length} ${circumference - length}`,
      dashoffset: -offset
    };
    offset += length;
    return ring;
  });

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-400">Live</span>
      </header>

      <div className="flex items-center justify-center">
        <div className="relative h-44 w-44">
          <svg className="h-44 w-44 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#eef2ff" strokeWidth="14" />
            {rings.map((segment) => (
              <circle
                key={segment.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={segment.dasharray}
                strokeDashoffset={segment.dashoffset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-slate-900">{centerValue}%</p>
            <p className="text-xs text-slate-500">Summary</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-slate-600">{segment.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default DonutSummaryChart;
