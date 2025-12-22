export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        <div className="bg-gray-100 p-4 flex gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>)}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="border-t p-4 flex gap-4">
            {[1, 2, 3, 4].map(j => <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}
