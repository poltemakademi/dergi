

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex h-32 flex-col justify-between rounded-xl border border-slate-200/80 p-4 shadow-sm animate-pulse">
          <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-2 mt-4">
            <div className="h-6 w-3/4 rounded bg-slate-200/80 dark:bg-slate-700/80"></div>
            <div className="h-3 w-1/3 rounded bg-slate-200/60 dark:bg-slate-700/60"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
