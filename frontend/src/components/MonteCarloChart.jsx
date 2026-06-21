import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const STOCK_COLORS = ['#4a9eff', '#a855f7', '#34d399']
const CHARIZARD_COLOR = '#f0a030'

export default function MonteCarloChart({ monteCarlo, tickers }) {
  if (!monteCarlo) return null

  const { dates, percentiles } = monteCarlo
  const allKeys = ['charizard', ...tickers]

  const data = dates.map((date, i) => {
    const point = { date }
    allKeys.forEach(key => {
      const p = percentiles[key]
      point[`${key}_p5`] = p.p5[i]
      point[`${key}_p25`] = p.p25[i]
      point[`${key}_p50`] = p.p50[i]
      point[`${key}_p75`] = p.p75[i]
      point[`${key}_p95`] = p.p95[i]
    })
    return point
  })

  const formatDollar = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
    return `$${val.toFixed(0)}`
  }

  const formatDate = (dateStr) => new Date(dateStr).getFullYear().toString()

  const getColor = (key) => {
    if (key === 'charizard') return CHARIZARD_COLOR
    const idx = tickers.indexOf(key)
    return STOCK_COLORS[idx] || '#888'
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>MONTE CARLO</div>
        <div style={styles.subtitle}>500 simulations per asset</div>
      </div>
      <div style={styles.legend}>
        <span style={styles.legendItem}><span style={{ ...styles.legendDash, borderColor: '#666' }}>---</span> 5-95th %</span>
        <span style={styles.legendItem}><span style={{ ...styles.legendBlock, opacity: 0.3 }} /> 25-75th %</span>
        <span style={styles.legendItem}><span style={styles.legendLine} /> Median</span>
      </div>
      <div style={styles.chart}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 6 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#2a2a40" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#444"
              tick={{ fontSize: 8, fill: '#666', fontFamily: "'Press Start 2P'" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatDollar}
              stroke="#444"
              tick={{ fontSize: 7, fill: '#666', fontFamily: "'Press Start 2P'" }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              contentStyle={{
                background: '#0a0a14',
                border: '3px solid #e8e8e8',
                fontSize: '7px',
                fontFamily: "'Press Start 2P'",
              }}
              labelFormatter={formatDate}
              formatter={(val, name) => [formatDollar(val), name.replace('_p50', ' median').replace('_p5', ' 5th').replace('_p95', ' 95th')]}
            />

            {allKeys.map(key => {
              const color = getColor(key)
              return (
                <Area
                  key={`${key}_band`}
                  type="natural"
                  dataKey={`${key}_p95`}
                  stroke="none"
                  fill={color}
                  fillOpacity={0.08}
                  isAnimationActive={false}
                />
              )
            })}

            {allKeys.map(key => {
              const color = getColor(key)
              return (
                <Area
                  key={`${key}_iqr`}
                  type="natural"
                  dataKey={`${key}_p75`}
                  stroke="none"
                  fill={color}
                  fillOpacity={0.15}
                  isAnimationActive={false}
                />
              )
            })}

            {allKeys.map(key => {
              const color = getColor(key)
              return (
                <Area
                  key={`${key}_median`}
                  type="natural"
                  dataKey={`${key}_p50`}
                  name={key === 'charizard' ? 'CHARIZARD' : key}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  fill="none"
                  isAnimationActive={false}
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={styles.explanation}>
        Shaded bands show the range of possible outcomes
        if monthly returns were randomly shuffled.
        Wider band = more uncertainty.
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: '12px',
  },
  header: {
    marginBottom: '8px',
  },
  title: {
    fontSize: '10px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#f0a030',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '7px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#666',
  },
  legend: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  legendItem: {
    fontSize: '6px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  legendDash: {
    display: 'inline-block',
    width: '12px',
    borderTop: '1px dashed',
  },
  legendBlock: {
    display: 'inline-block',
    width: '10px',
    height: '8px',
    background: '#f0a030',
  },
  legendLine: {
    display: 'inline-block',
    width: '12px',
    borderTop: '2px dashed #f0a030',
  },
  chart: {
    width: '100%',
    height: 280,
    background: '#1a1a2e',
    border: '3px solid #e8e8e8',
    padding: '8px 4px 4px 0',
    boxShadow: 'inset -3px -3px 0 0 #888, inset 3px 3px 0 0 #fff',
  },
  explanation: {
    fontSize: '6px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#555',
    lineHeight: '1.8',
    marginTop: '6px',
    textAlign: 'center',
  },
}
