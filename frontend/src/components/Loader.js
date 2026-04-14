export function BikeCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex gap-3">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
        <div className="w-10 h-10 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin absolute top-3 left-3" />
      </div>
    </div>
  );
}
