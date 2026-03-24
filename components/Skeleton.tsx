import Skeleton from "react-loading-skeleton";

export function TableSkeleton() {
  return Array(5)
    .fill(0)
    .map((_, i) => <Skeleton key={i} height={30} className="mb-2" />);
}
