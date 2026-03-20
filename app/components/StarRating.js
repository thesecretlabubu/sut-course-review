// Static star display component
// rating: 0-5 (supports 0.5 increments)
export default function StarRating({ rating = 0, size = 'md' }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  const sz = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base'

  return (
    <div className={`flex text-yellow-400 ${sz}`}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {half === 1 && (
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
      ))}
    </div>
  )
}
