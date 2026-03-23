function LoadingState({ text = 'Loading dashboard data...' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E3A8A]" />
      <p className="mt-3 text-sm text-slate-500">{text}</p>
    </div>
  );
}

export default LoadingState;
