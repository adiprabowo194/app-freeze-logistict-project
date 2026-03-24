interface Props {
  title: string;
  value: number | string;
  icon?: string; // 🔹 dynamic icon (remix icon class)
  color?: string; // 🔹 warna utama (bg + text)
}

export default function SummaryCard({
  title,
  value,
  icon = "ri-file-text-line",
  color = "blue",
}: Props) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5 flex justify-between items-center">
      {/* TEXT */}
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
      </div>

      {/* ICON */}
      <div
        className={`p-3 rounded-xl flex items-center justify-center ${
          colorMap[color] || colorMap.blue
        }`}
      >
        <i className={`${icon} text-2xl`} />
      </div>
    </div>
  );
}
