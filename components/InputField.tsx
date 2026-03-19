import React from "react";

type InputFieldProps = {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  error?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  type = "text",
  className = "",
  required = false,
  error,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={name} className="text-xs font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
        } ${className}`}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;
