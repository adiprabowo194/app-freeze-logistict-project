import React from "react";

type InputFieldProps = {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  error?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  min?: string | number; // ✅ Tambahkan min di sini (opsional)
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  type = "text",
  className = "",
  required = false,
  error,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  min, // ✅ Ambil dari props
}) => {
  // 🔥 cek controlled / uncontrolled
  const isControlled = value !== undefined;

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
        min={min} // ✅ Pasang di sini, jika undefined input HTML akan mengabaikannya
        {...(isControlled ? { value } : {})} // ✅ controlled
        {...(!isControlled ? { defaultValue: "" } : {})} // ✅ uncontrolled
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2
        ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        ${readOnly ? "bg-gray-50" : ""}
        ${className}`}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;
