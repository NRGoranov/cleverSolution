import { SkeletonProductDetail } from "@/components/skeletons";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 flex gap-2">
        <div className="skeleton-shimmer h-4 w-16 rounded" />
        <div className="skeleton-shimmer h-4 w-4 rounded" />
        <div className="skeleton-shimmer h-4 w-20 rounded" />
      </div>
      <SkeletonProductDetail />
    </div>
  );
}
