function Pixel({ x, y, color, s = 1 }) {
  return <rect x={x * 6 * s} y={y * 6 * s} width={6 * s} height={6 * s} fill={color} />
}

const O = '#d87830' // orange body
const D = '#b05818' // dark orange
const B = '#f0d080' // belly
const W = '#38a098' // wing teal
const Wd = '#287870' // wing dark
const F = '#f0a030' // flame
const Fb = '#f05020' // flame base
const Fy = '#f8e848' // flame yellow
const E = '#1a1a2e' // eye
const C = '#f0e0a0' // claw
const T = '#e8e8f0' // teeth

const CHARIZARD_PIXELS = [
  // Horns
  { x: 5, y: 0, c: D }, { x: 12, y: 0, c: D },
  { x: 5, y: 1, c: D }, { x: 6, y: 1, c: D }, { x: 11, y: 1, c: D }, { x: 12, y: 1, c: D },

  // Head
  { x: 6, y: 2, c: O }, { x: 7, y: 2, c: O }, { x: 8, y: 2, c: O }, { x: 9, y: 2, c: O }, { x: 10, y: 2, c: O }, { x: 11, y: 2, c: O },
  { x: 5, y: 3, c: O }, { x: 6, y: 3, c: O }, { x: 7, y: 3, c: E }, { x: 8, y: 3, c: O }, { x: 9, y: 3, c: O }, { x: 10, y: 3, c: E }, { x: 11, y: 3, c: O }, { x: 12, y: 3, c: O },
  { x: 5, y: 4, c: O }, { x: 6, y: 4, c: O }, { x: 7, y: 4, c: O }, { x: 8, y: 4, c: O }, { x: 9, y: 4, c: O }, { x: 10, y: 4, c: O }, { x: 11, y: 4, c: O }, { x: 12, y: 4, c: O },
  // Mouth open
  { x: 13, y: 3, c: O }, { x: 14, y: 3, c: O },
  { x: 13, y: 4, c: '#801510' }, { x: 14, y: 4, c: '#801510' }, { x: 15, y: 4, c: T },
  { x: 13, y: 5, c: O }, { x: 14, y: 5, c: O },
  // Fire breath
  { x: 15, y: 3, c: Fy }, { x: 16, y: 3, c: F }, { x: 17, y: 3, c: Fb },
  { x: 16, y: 2, c: Fy }, { x: 17, y: 2, c: F },
  { x: 16, y: 4, c: F }, { x: 17, y: 4, c: Fb },

  // Neck
  { x: 7, y: 5, c: O }, { x: 8, y: 5, c: O }, { x: 9, y: 5, c: O }, { x: 10, y: 5, c: O },

  // Wings - left
  { x: 0, y: 3, c: W }, { x: 1, y: 3, c: W },
  { x: 0, y: 4, c: Wd }, { x: 1, y: 4, c: W }, { x: 2, y: 4, c: W },
  { x: 1, y: 5, c: Wd }, { x: 2, y: 5, c: W }, { x: 3, y: 5, c: W },
  { x: 2, y: 6, c: Wd }, { x: 3, y: 6, c: W }, { x: 4, y: 6, c: W }, { x: 5, y: 6, c: W },
  { x: 3, y: 7, c: Wd }, { x: 4, y: 7, c: W }, { x: 5, y: 7, c: W },

  // Body
  { x: 6, y: 6, c: O }, { x: 7, y: 6, c: O }, { x: 8, y: 6, c: B }, { x: 9, y: 6, c: B }, { x: 10, y: 6, c: O }, { x: 11, y: 6, c: O },
  { x: 6, y: 7, c: O }, { x: 7, y: 7, c: B }, { x: 8, y: 7, c: B }, { x: 9, y: 7, c: B }, { x: 10, y: 7, c: B }, { x: 11, y: 7, c: O },
  { x: 6, y: 8, c: O }, { x: 7, y: 8, c: O }, { x: 8, y: 8, c: B }, { x: 9, y: 8, c: B }, { x: 10, y: 8, c: O }, { x: 11, y: 8, c: O },
  { x: 7, y: 9, c: O }, { x: 8, y: 9, c: O }, { x: 9, y: 9, c: O }, { x: 10, y: 9, c: O },

  // Wings - right (mirrored)
  { x: 16, y: 3, c: W }, { x: 17, y: 3, c: W },
  // (fire overlaps - right wing behind fire is fine)
  { x: 14, y: 6, c: W }, { x: 15, y: 6, c: W }, { x: 16, y: 6, c: Wd },
  { x: 13, y: 7, c: W }, { x: 14, y: 7, c: W }, { x: 15, y: 7, c: Wd },
  { x: 12, y: 6, c: W }, { x: 13, y: 6, c: W },
  { x: 12, y: 7, c: W },

  // Arms with claws
  { x: 4, y: 7, c: O }, { x: 3, y: 8, c: C }, { x: 4, y: 8, c: O },
  { x: 13, y: 8, c: O }, { x: 14, y: 8, c: C },

  // Legs
  { x: 6, y: 10, c: O }, { x: 7, y: 10, c: O }, { x: 10, y: 10, c: O }, { x: 11, y: 10, c: O },
  { x: 5, y: 11, c: C }, { x: 6, y: 11, c: O }, { x: 7, y: 11, c: C },
  { x: 10, y: 11, c: C }, { x: 11, y: 11, c: O }, { x: 12, y: 11, c: C },

  // Tail
  { x: 3, y: 9, c: O }, { x: 4, y: 9, c: O },
  { x: 2, y: 10, c: O }, { x: 3, y: 10, c: O },
  { x: 1, y: 11, c: O }, { x: 2, y: 11, c: O },
  // Tail flame
  { x: 0, y: 10, c: F }, { x: 0, y: 11, c: Fb },
  { x: 1, y: 10, c: Fy }, { x: 0, y: 9, c: Fy },
]

export function CharizardIcon({ size = 100, glow = false }) {
  const scale = size / 110
  return (
    <svg
      viewBox="0 0 110 75"
      style={{
        width: size,
        height: size * 0.68,
        imageRendering: 'pixelated',
        filter: glow ? 'drop-shadow(0 0 20px rgba(230,120,30,0.4))' : 'none',
      }}
    >
      {CHARIZARD_PIXELS.map((p, i) => (
        <rect key={i} x={p.x * 6} y={p.y * 6} width={6} height={6} fill={p.c} />
      ))}
    </svg>
  )
}

export function CharizardWin({ size = 180 }) {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        position: 'absolute',
        width: size * 1.2, height: size * 1.2,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(230,120,30,0.18) 0%, rgba(230,120,30,0.04) 50%, transparent 70%)',
        animation: 'pulseGlow 2s ease-in-out infinite',
      }} />
      <CharizardIcon size={size} glow />
    </div>
  )
}

export function CharizardLoss({ size = 140 }) {
  return (
    <div style={{ opacity: 0.35, filter: 'saturate(0.2) brightness(0.6)' }}>
      <CharizardIcon size={size} />
    </div>
  )
}
