export default function InsightsLoading() {
  return (
    <div className="max-w-4xl space-y-6 animate-pulse">
      <div className="h-8 w-40 bg-[#2a2a3a] rounded-lg" />
      <div className="flex justify-end">
        <div className="h-9 w-36 bg-[#2a2a3a] rounded-lg" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
