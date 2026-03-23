function ContentSection({ title, subtitle, actions, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#1E3A8A]">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

export default ContentSection;
