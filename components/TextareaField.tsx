import React from "react";

type TextareaFieldProps = {
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
  rows?: number;
};

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  placeholder,
  className = "",
  required = false,
  error,
  rows = 4,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`px-4 py-3 border border-gray-400 rounded-xl bg-gray-50 
        focus:outline-none focus:ring-2 resize-y
        placeholder:text-gray-400 placeholder:text-sm
        ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}
        ${className}`}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default TextareaField;
