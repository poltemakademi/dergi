

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full animate-pulse space-y-4">
      <div className="h-10 w-full rounded-md bg-slate-200 dark:bg-slate-700"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-8 w-full rounded bg-slate-200/60 dark:bg-slate-700/60"></div>
          ))}
        </div>
      ))}
    </div>
  );
}
