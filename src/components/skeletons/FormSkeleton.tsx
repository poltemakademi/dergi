

interface FormSkeletonProps {
  fields?: number;
}

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <div className="w-full animate-pulse space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-10 w-full rounded-md bg-slate-200/60 dark:bg-slate-700/60"></div>
        </div>
      ))}
      <div className="h-10 w-32 rounded-md bg-slate-200 dark:bg-slate-700 mt-8"></div>
    </div>
  );
}
