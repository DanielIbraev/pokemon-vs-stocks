import { useState, useEffect, useRef } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const DURATION_MS = 8000
const STOCK_COLORS = ['#4a9eff', '#a855f7', '#34d399']

function smooth(data, keys, windowSize = 5) {
  if (data.length < windowSize) return data
  return data.map((point, i) => {
    const start = Math.max(0, i - Math.floor(windowSize / 2))
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2))
    const slice = data.slice(start, end)
    const smoothed = { ...point }
    keys.forEach(k => {
      smoothed[k] = slice.reduce((s, p) => s + (p[k] || 0), 0) / slice.length
    })
    return smoothed
  })
}

export default function AnimatedChart({ data, tickers, pokemonName, pokemonColor, onAnimationEnd }) {
  const [visibleCount, setVisibleCount] = useState(1)
  const callbackRef = useRef(onAnimationEnd)
  callbackRef.current = onAnimationEnd
  const calledRef = useRef(false)

  const allKeys = ['pokemon', ...tickers]
  const smoothedData = useRef(smooth(data, allKeys)).current

  useEffect(() => {
    calledRef.current = false
    const startTime = performance.now()
    let rafId

    function tick() {
      const elapsed = performance.now() - startTime
      const t = Math.min(elapsed / DURATION_MS, 1)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const count = Math.max(1, Math.round(eased * smoothedData.length))
      setVisibleCount(count)

      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else if (!calledRef.current) {
        calledRef.current = true
        callbackRef.current?.()
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [smoothedData])

  const visibleData = smoothedData.slice(0, visibleCount)

  const formatDollar = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
    return `$${val.toFixed(0)}`
  }

  const formatDate = (dateStr) => new Date(dateStr).getFullYear().toString()

  return (
    <div style={{
      width: '100%',
      height: '65vh',
      minHeight: 380,
      background: '#1a1a2e',
      border: '4px solid #e8e8e8',
      padding: '12px 8px 8px 0',
      boxShadow: 'inset -4px -4px 0 0 #888, inset 4px 4px 0 0 #fff',
    }}>
      <ResponsiveContainer>
        <AreaChart data={visibleData} margin={{ top: 10, right: 16, left: 8, bottom: 6 }}>
          <defs>
            <linearGradient id="gradPokemon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={pokemonColor || '#f0a030'} stopOpacity={0.3} />
              <stop offset="100%" stopColor={pokemonColor || '#f0a030'} stopOpacity={0} />
            </linearGradient>
            {tickers.map((t, i) => (
              <linearGradient key={t} id={`gradStock${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={STOCK_COLORS[i]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={STOCK_COLORS[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#2a2a40" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#444"
            tick={{ fontSize: 9, fill: '#666', fontFamily: "'Press Start 2P'" }}
            axisLine={{ stroke: '#444' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatDollar}
            stroke="#444"
            tick={{ fontSize: 8, fill: '#666', fontFamily: "'Press Start 2P'" }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a14',
              border: '3px solid #e8e8e8',
              fontSize: '8px',
              fontFamily: "'Press Start 2P'",
              boxShadow: 'inset -2px -2px 0 0 #888, inset 2px 2px 0 0 #fff',
            }}
            labelFormatter={formatDate}
            formatter={(val, name) => [formatDollar(val), name]}
          />
          <Area
            type="natural"
            dataKey="pokemon"
            name={pokemonName || 'POKEMON'}
            stroke={pokemonColor || '#f0a030'}
            strokeWidth={2}
            fill="url(#gradPokemon)"
            isAnimationActive={false}
          />
          {tickers.map((t, i) => (
            <Area
              key={t}
              type="natural"
              dataKey={t}
              name={t}
              stroke={STOCK_COLORS[i]}
              strokeWidth={2}
              fill={`url(#gradStock${i})`}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
