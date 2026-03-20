export default function CoursesLoading() {
  return (
    <div className="flex min-h-screen bg-[#f3f4f5]">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col gap-3 w-64 shrink-0 p-6 bg-white border-r border-[#e1e3e4]">
        <div className="skeleton h-6 w-32 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-10 w-full" />
        ))}
      </aside>

      {/* Main skeleton */}
      <main className="flex-1 p-8">
        <div className="skeleton h-14 w-full mb-6 rounded-xl" />
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 space-y-3">
              <div className="flex justify-between">
                <div className="skeleton h-6 w-24" />
                <div className="skeleton h-6 w-12" />
              </div>
              <div className="skeleton h-7 w-24" />
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
