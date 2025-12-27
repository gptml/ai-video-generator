export default function Switcher({ enabled, onChange, label }) {

  return (
    <label className="flex cursor-pointer items-center ">
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 rounded-full transition
          ${enabled ? "bg-green-500" : "bg-gray-300"}`}
      >
        <span
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition
            ${enabled ? "translate-x-5" : ""}`}
        />
      </button>

      <span className="text-sm  text-gray-700">
        {label}
      </span>
    </label>
  );
}
