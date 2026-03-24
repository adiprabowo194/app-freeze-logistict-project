// components/StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 text-xs rounded-full font-medium";

  if (status === "Delivered") {
    return (
      <span className={`${base} bg-green-100 text-green-600`}>Delivered</span>
    );
  }

  if (status === "Transit") {
    return <span className={`${base} bg-blue-100 text-blue-600`}>Transit</span>;
  }

  return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
}
