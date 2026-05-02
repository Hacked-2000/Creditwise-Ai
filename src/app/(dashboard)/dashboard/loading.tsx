// shows while the dashboard data is loading
export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-6xl animate-pulse">
      <div className="h-8 w-48 bg-[#2a2a3a] rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl" />
        <div className="h-64 bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl" />
        ))}
      </div>

      <div className="h-48 bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl" />
    </div>
  );
}
