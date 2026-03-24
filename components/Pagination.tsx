// components/Pagination.tsx
interface Props {
  page: number;
  totalPages: number;
  setPage: (v: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: Props) {
  return (
    <div className="flex justify-end items-center gap-3 mt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded-lg disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-gray-500">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
