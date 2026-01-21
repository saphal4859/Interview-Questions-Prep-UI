import { components } from "react-select";

export default function CompactValueContainer({ children, ...props }) {
  const count = props.getValue().length;
  const placeholder = props.selectProps.placeholder;

  return (
    <components.ValueContainer {...props}>
      {count > 0 && (
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {placeholder} ({count})
        </span>
      )}
      {children}
    </components.ValueContainer>
  );
}
