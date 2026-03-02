export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 w-full" />
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-3">
        <div className="h-4 bg-gray-200 rounded-md w-3/4" />
        <div className="h-4 bg-gray-200 rounded-md w-1/2" />
        <div className="h-3 bg-gray-100 rounded-md w-full" />
        <div className="h-3 bg-gray-100 rounded-md w-4/5" />
        <div className="h-5 bg-gray-200 rounded-md w-1/3 mt-1" />
        <div className="flex gap-2 mt-1">
          <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
          <div className="flex-1 h-9 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
