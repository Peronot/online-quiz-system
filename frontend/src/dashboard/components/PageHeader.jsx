import { iconMap } from './iconMap.js';

const { Plus } = iconMap;

function PageHeader({ title, subtitle, actionLabel, onActionClick }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A8A]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actionLabel ? (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1F8A4C]"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default PageHeader;
