export default function AccountsLoading() {
  return (
    <div className="max-w-4xl space-y-6 animate-pulse">
      <div className="h-8 w-56 bg-[#2a2a3a] rounded-lg" />
      <div className="flex justify-end">
        <div className="h-9 w-32 bg-[#2a2a3a] rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-52 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
