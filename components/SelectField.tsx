// components/SelectField.tsx
import React from "react";

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label?: string;
  name: string;
  options: Option[];
  className?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  className = "",
  required = false,
  error,
  placeholder = "Select option",
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={name} className="text-xs font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`w-full px-4 py-2 border border-gray-400 rounded-xl bg-gray-50 
            focus:outline-none focus:ring-2 appearance-none pr-10
            ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}
            ${className}`}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          ▼
        </span>
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default SelectField;
