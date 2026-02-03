import { Skeleton } from './ui/skeleton';

interface BookCardSkeletonProps {
  variant?: 'default' | 'compact' | 'library' | 'discover';
}

const BookCardSkeleton = ({ variant = 'default' }: BookCardSkeletonProps) => {
  if (variant === 'compact' || variant === 'library') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="aspect-[3/4] w-full relative">
           <Skeleton className="h-full w-full" />
        </div>
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          {variant === 'library' && (
             <div className="flex justify-between pt-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
             </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'discover') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex space-x-3">
          <Skeleton className="w-16 h-20 rounded-lg flex-shrink-0" />
          <div className="flex-1 w-full space-y-2 py-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant (Horizontal but larger)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex space-x-4">
        <Skeleton className="w-20 h-28 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 py-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center pt-2 gap-2">
             <Skeleton className="h-4 w-8" />
             <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
