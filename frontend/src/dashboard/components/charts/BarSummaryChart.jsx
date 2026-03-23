function BarSummaryChart({ title, items = [] }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-400">Real Data</span>
      </header>

      <div className="space-y-2">
        {[100, 75, 50, 25].map((line) => (
          <div key={line} className="h-px w-full bg-slate-100" />
        ))}
      </div>

      <div className="mt-3 flex h-44 items-end justify-between gap-2">
        {items.map((item) => {
          const height = Math.max(8, Math.round((item.value / maxValue) * 100));

          return (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="text-[11px] font-semibold text-slate-500">{item.value}</div>
              <div className="relative flex h-28 w-full items-end justify-center rounded-md bg-slate-50">
                <div
                  className="w-4/5 rounded-t-md"
                  style={{ height: `${height}%`, backgroundColor: item.color }}
                />
              </div>
              <div className="text-[11px] font-medium text-slate-500">{item.label}</div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default BarSummaryChart;
