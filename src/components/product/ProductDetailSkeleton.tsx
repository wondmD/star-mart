export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 w-40 rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="h-96 rounded-lg bg-gray-200 md:h-125" />
        <div className="space-y-4">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="h-10 w-3/4 rounded bg-gray-200" />
          <div className="h-8 w-1/2 rounded bg-gray-200" />
          <div className="h-20 w-full rounded bg-gray-200" />
          <div className="h-36 w-full rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
