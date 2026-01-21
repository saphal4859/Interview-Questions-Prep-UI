import Select from "react-select";
import CheckboxOption from "./CheckboxOption";
import CompactValueContainer from "./CompactValueContainer";

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  isDisabled = false,
}) {
  const allOption = { label: "Select All", value: "__ALL__" };

  const handleChange = (selected) => {
    // Nothing selected
    if (!selected || selected.length === 0) {
      onChange([]);
      return;
    }

    const hasSelectAll = selected.some((o) => o.value === "__ALL__");

    if (hasSelectAll) {
      const allSelected = value.length === options.length;

      // Toggle behavior
      onChange(allSelected ? [] : options);
      return;
    }

    onChange(selected);
  };

  return (
    <Select
      isMulti
      isSearchable
      isDisabled={isDisabled}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      options={[allOption, ...options]}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      components={{
        Option: CheckboxOption,
        ValueContainer: CompactValueContainer,
        IndicatorSeparator: () => null,
      }}
      className="min-w-[220px] text-sm"
      classNamePrefix="beauty-select"
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "40px",
          borderRadius: "10px",
          borderColor: state.isFocused ? "#6366f1" : "#e5e7eb",
          boxShadow: state.isFocused
            ? "0 0 0 2px rgba(99,102,241,0.15)"
            : "none",
          cursor: "pointer",
        }),

        menu: (base) => ({
          ...base,
          marginTop: "8px",
          borderRadius: "12px",
          padding: "6px 0",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)",
        }),

        menuList: (base) => ({
          ...base,
          maxHeight: "260px",
          padding: "0",
        }),

        option: () => ({}), // handled in CheckboxOption

        valueContainer: (base) => ({
          ...base,
          padding: "0 12px",
          gap: "6px",
        }),

        placeholder: (base) => ({
          ...base,
          color: "#6b7280",
        }),

        multiValue: () => ({ display: "none" }),
        multiValueRemove: () => ({ display: "none" }),
      }}
    />
  );
}
