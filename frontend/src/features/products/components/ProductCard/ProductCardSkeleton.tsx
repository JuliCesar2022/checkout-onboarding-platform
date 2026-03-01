export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-300 shrink-0 w-full" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded-md w-3/4" />
        <div className="h-5 bg-gray-200 rounded-md w-1/2" />
        
        {/* Description */}
        <div className="mt-2 space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded-md w-full" />
          <div className="h-3 bg-gray-200 rounded-md w-full" />
          <div className="h-3 bg-gray-200 rounded-md w-4/5" />
        </div>
        
        {/* Price */}
        <div className="h-6 bg-gray-300 rounded-md w-1/3 mt-2" />
        
        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
          <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
