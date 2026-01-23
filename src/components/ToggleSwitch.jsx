export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
}) {
  return (
    <label
      className={`flex items-center gap-2 text-sm select-none
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      {label && <span className="text-gray-600">{label}</span>}

      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        aria-pressed={checked}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200
          ${checked ? "bg-green-500" : "bg-gray-300"}
          ${disabled ? "" : "hover:brightness-110"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow
            transition-transform duration-200
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </label>
  );
}
