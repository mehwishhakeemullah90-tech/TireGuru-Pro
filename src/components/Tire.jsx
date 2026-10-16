// Pure SVG tire render — no external images needed
export default function Tire({ tread = 'sport', size = 160, spin = false, accent = '#fe6356' }) {
  const lugs = tread === 'offroad' ? 22 : tread === 'suv' ? 30 : tread === 'eco' ? 40 : 34
  const lugW = tread === 'offroad' ? 9 : tread === 'suv' ? 6 : 4
  const id = `g${tread}${size}`
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={spin ? 'tire spin' : 'tire'} aria-hidden="true">
      <defs>
        <radialGradient id={id + 'r'} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#3a3a44" />
          <stop offset="70%" stopColor="#141419" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
        <linearGradient id={id + 'm'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2f2f5" />
          <stop offset="50%" stopColor="#8b8b95" />
          <stop offset="100%" stopColor="#d6d6dc" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#${id}r)`} />
      {Array.from({ length: lugs }).map((_, i) => (
        <rect key={i} x={100 - lugW / 2} y="5" width={lugW} height={tread === 'offroad' ? 16 : 11} rx="1.5"
          fill="#0a0a0d" transform={`rotate(${(360 / lugs) * i} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="72" fill="#0d0d11" stroke="#222229" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill={`url(#${id}m)`} />
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={i} d="M100 46 L108 88 L92 88 Z" fill="#1a1a20" transform={`rotate(${72 * i} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="60" fill="none" stroke={accent} strokeWidth="2" opacity=".85" />
      <circle cx="100" cy="100" r="15" fill="#1a1a20" stroke={accent} strokeWidth="3" />
      <circle cx="100" cy="100" r="5" fill={accent} />
    </svg>
  )
}
