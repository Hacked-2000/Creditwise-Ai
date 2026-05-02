export default function GoalsLoading() {
  return (
    <div className="max-w-4xl space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[#2a2a3a] rounded-lg" />
      <div className="flex justify-end">
        <div className="h-9 w-28 bg-[#2a2a3a] rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
