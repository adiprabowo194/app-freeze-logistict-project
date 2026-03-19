"use client";

import dynamic from "next/dynamic";

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

type OptionType = {
  label: string;
  value: number;
};

type Props = {
  label: string;
  error?: boolean;
  value?: OptionType | null;
  onChange?: (value: OptionType | null) => void;
};

export default function SelectSearch({ label, error, value, onChange }: Props) {
  const loadOptions = async (inputValue: string): Promise<OptionType[]> => {
    try {
      const res = await fetch(`/api/coverage-areas?search=${inputValue}`);

      const data = await res.json();

      return data.map((item: any) => ({
        label: `${item.suburb}, ${item.state}`,
        value: `${item.suburb}, ${item.state}`,
      }));
    } catch (err) {
      console.error("Failed load suburb:", err);
      return [];
    }
  };

  return (
    <div className="w-full">
      {/* LABEL */}
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>

      {/* SELECT */}
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        value={value} // ✅ penting untuk control
        onChange={(val) => onChange?.(val as OptionType)} // ✅ kirim ke parent
        placeholder="Search suburb..."
        className="text-sm"
        isClearable
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: "8px",
            minHeight: "40px",
            paddingLeft: "12px",
            paddingRight: "12px",
            borderColor: error
              ? "#ef4444"
              : state.isFocused
                ? "#3b82f6"
                : "#9ca3af",
            boxShadow: state.isFocused
              ? error
                ? "0 0 0 2px #ef4444"
                : "0 0 0 2px #3b82f6"
              : "none",
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),

          valueContainer: (base) => ({
            ...base,
            padding: 0,
          }),

          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),

          placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
            fontSize: "14px",
          }),

          singleValue: (base) => ({
            ...base,
            fontSize: "14px",
            color: "#111827",
          }),

          menu: (base) => ({
            ...base,
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 50,
          }),

          option: (base, state) => ({
            ...base,
            fontSize: "14px",
            backgroundColor: state.isFocused ? "#eff6ff" : "white",
            color: "#111827",
            cursor: "pointer",
          }),
        }}
      />
    </div>
  );
}
