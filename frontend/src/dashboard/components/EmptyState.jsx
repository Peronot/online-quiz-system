function EmptyState({ title = 'No data yet', description = 'There is nothing to show in this section.' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-base font-semibold text-[#1E3A8A]">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyState;
