import { components } from "react-select";

export default function CheckboxOption(props) {
  const { isSelected, label, data, innerProps } = props;
  const isSelectAll = data.value === "__ALL__";

  return (
    <components.Option {...props}>
      <div
        {...innerProps}
        className={`flex items-center gap-3 px-4 py-2 cursor-pointer
        ${
          isSelectAll
            ? "sticky top-0 bg-white z-10 border-b"
            : ""
        }
        ${
          isSelected
            ? "bg-indigo-50"
            : "hover:bg-gray-50"
        }`}
      >
        <span
          className={`h-4 w-4 flex items-center justify-center rounded border
          ${
            isSelected
              ? "bg-indigo-600 border-indigo-600"
              : "border-gray-300"
          }`}
        >
          {isSelected && (
            <span className="text-white text-xs">✓</span>
          )}
        </span>

        <span
          className={`text-sm ${
            isSelectAll
              ? "font-semibold text-gray-700"
              : "text-gray-800"
          }`}
        >
          {label}
        </span>
      </div>
    </components.Option>
  );
}
