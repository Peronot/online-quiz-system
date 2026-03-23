import { iconMap } from './iconMap.js';

const { X } = iconMap;

function ModalForm({ title, fields = [], onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1E3A8A]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <form className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-700 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1F8A4C]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalForm;
