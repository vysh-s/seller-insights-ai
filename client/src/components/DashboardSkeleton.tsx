import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 h-32">
            <div className="flex gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-lg bg-slate-800" />
              <Skeleton className="w-24 h-4 rounded bg-slate-800 mt-3" />
            </div>
            <Skeleton className="w-16 h-8 rounded bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Insights Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 h-[600px]">
            <Skeleton className="w-48 h-8 bg-slate-800 mb-8" />
            <div className="space-y-4">
              <Skeleton className="w-full h-40 bg-slate-800 rounded-xl" />
              <Skeleton className="w-full h-40 bg-slate-800 rounded-xl" />
              <Skeleton className="w-full h-40 bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 h-[400px]">
            <Skeleton className="w-32 h-6 bg-slate-800 mb-6" />
            <Skeleton className="w-full h-24 bg-slate-800 rounded-lg mb-4" />
            <Skeleton className="w-full h-24 bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
