export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-64 bg-gray-300 dark:bg-gray-700"></div>
      
      <div className="p-4">
        {/* Brand skeleton */}
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        
        {/* Title skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        
        {/* Rating skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        
        {/* Price and stock skeleton */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
}
