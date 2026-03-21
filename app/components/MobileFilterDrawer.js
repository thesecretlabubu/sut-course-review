'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function MobileFilterDrawer({ lang, t, CATEGORIES, initialQ, initialCategory, initialSort }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [tempCategory, setTempCategory] = useState(initialCategory)
  const [tempSort, setTempSort] = useState(initialSort)
  const [q, setQ] = useState(initialQ)

  // Sync state if props change (e.g., from browser back/forward)
  useEffect(() => {
    setTempCategory(initialCategory)
    setTempSort(initialSort)
    setQ(initialQ)
  }, [initialCategory, initialSort, initialQ])

  const handleApply = () => {
    const p = new URLSearchParams()
    if (tempCategory) p.set('category', tempCategory)
    if (tempSort) p.set('sort', tempSort)
    if (q) p.set('q', q)
    router.push(`${pathname}?${p.toString()}`)
    setIsOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleApply()
  }

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div className="md:hidden mb-6">
      {/* Search & Filter Row */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 bg-white rounded-xl flex items-center px-4 py-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#006b2c]/20 border border-[#e1e3e4]">
          <span className="material-symbols-outlined text-[#6e7b6c] mr-2">search</span>
          <input 
            value={q}
            onChange={e => setQ(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-[#191c1d] w-full font-medium text-sm outline-none placeholder:text-[#6e7b6c]" 
            placeholder={t.searchPlaceholder} 
            type="text"
          />
        </form>
        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#006b2c] text-white rounded-xl shadow-md shadow-[#006b2c]/20 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>

      {/* Filter Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl p-6 md:p-8 transform transition-transform animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto relative z-10">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-extrabold text-2xl text-[#191c1d]" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
                 {lang === 'th' ? 'กรองวิชา' : lang === 'zh' ? '按类别筛选' : 'Filter by'}
              </h3>
              <button 
                onClick={() => { setTempCategory(''); setTempSort('rating'); }}
                className="text-[#006b2c] font-bold text-sm"
              >
                {lang === 'th' ? 'รีเซ็ต' : lang === 'zh' ? '重置' : 'Reset'}
              </button>
            </div>

            <div className="space-y-8">
              {/* Categories */}
              <div>
                <p className="font-bold text-xs uppercase tracking-widest text-[#6e7b6c] mb-4">{t.category}</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setTempCategory('')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${!tempCategory ? 'bg-[#006b2c] text-white shadow-md shadow-[#006b2c]/20' : 'bg-[#f3f4f5] text-[#3e4a3d] hover:bg-[#e7e8e9]'}`}
                  >
                    {t.all}
                  </button>
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.th}
                      onClick={() => setTempCategory(cat.th)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${tempCategory === cat.th ? 'bg-[#006b2c] text-white shadow-md shadow-[#006b2c]/20' : 'bg-[#f3f4f5] text-[#3e4a3d] hover:bg-[#e7e8e9]'}`}
                    >
                      {cat[lang] || cat.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <p className="font-bold text-xs uppercase tracking-widest text-[#6e7b6c] mb-4">{t.sortBy}</p>
                <div className="grid grid-cols-3 gap-3">
                  {t.sortOptions.map(opt => {
                    let icon = 'sort'
                    if (opt.value === 'rating') icon = 'star'
                    else if (opt.value === 'reviews') icon = 'reviews'
                    else if (opt.value === 'name') icon = 'sort_by_alpha'
                    
                    const isSelected = tempSort === opt.value

                    return (
                      <button 
                        key={opt.value}
                        onClick={() => setTempSort(opt.value)}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all border ${isSelected ? 'bg-green-50 text-[#006b2c] border-[#006b2c]/20 shadow-sm' : 'bg-[#f3f4f5] text-[#191c1d] border-transparent active:border-[#006b2c]/30 hover:bg-green-50 hover:text-green-700'}`}
                      >
                        <span className="material-symbols-outlined text-xl" style={isSelected || opt.value === 'rating' ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
                        <span className="text-[10px] font-bold text-center leading-tight">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleApply}
                className="w-full mt-4 py-4 bg-[#006b2c] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#006b2c]/30 active:scale-[0.98] transition-transform"
                style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}
              >
                {lang === 'th' ? 'นำไปใช้' : lang === 'zh' ? '应用过滤器' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
