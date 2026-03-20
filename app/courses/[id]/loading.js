export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-[#f3f4f5] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="skeleton h-4 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Header skeleton */}
            <div className="bg-white p-8 rounded-xl space-y-4">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-9 w-64" />
              <div className="skeleton h-4 w-40" />
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-6 w-full" />)}
              </div>
            </div>
            {/* Chart skeleton */}
            <div className="bg-white p-8 rounded-xl">
              <div className="skeleton h-6 w-40 mb-6" />
              <div className="flex items-end gap-2 h-48">
                {[60, 85, 45, 30, 15, 8, 5].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className="skeleton w-full rounded-t" style={{ height: `${h}%` }} />
                    <div className="skeleton h-4 w-6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="hidden lg:block lg:col-span-4">
            <div className="bg-white p-6 rounded-xl space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-4 w-full" />)}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
