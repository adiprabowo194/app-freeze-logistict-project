"use client";

import dynamic from "next/dynamic";

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

type OptionType = {
  label: string;
  value: string;
  area_code: string;
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
        value: item.suburb,
        area_code: item.area_code,
      }));
    } catch (err) {
      console.error("Failed load suburb:", err);
      return [];
    }
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        value={value}
        onChange={(val) => onChange?.(val as OptionType)}
        placeholder="Search suburb..."
        className="text-sm"
        isClearable
      />
    </div>
  );
}
