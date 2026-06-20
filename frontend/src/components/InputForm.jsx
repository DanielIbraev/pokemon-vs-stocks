import { useState } from 'react'

export default function InputForm({ onSubmit, loading }) {
  const [tickers, setTickers] = useState([''])
  const [amount, setAmount] = useState('1000')
  const [start, setStart] = useState('2005-01-01')
  const [end, setEnd] = useState('2025-01-01')
  const [dcaEnabled, setDcaEnabled] = useState(false)
  const [dca, setDca] = useState('100')

  const handleSubmit = (e) => {
    e.preventDefault()
    const validTickers = tickers.map(t => t.trim().toUpperCase()).filter(Boolean)
    if (!validTickers.length) return
    onSubmit({
      tickers: validTickers,
      amount: parseFloat(amount),
      start,
      end,
      dca: dcaEnabled ? parseFloat(dca) : 0,
    })
  }

  const addTicker = () => {
    if (tickers.length < 3) setTickers([...tickers, ''])
  }

  const removeTicker = (i) => {
    setTickers(tickers.filter((_, idx) => idx !== i))
  }

  const updateTicker = (i, val) => {
    const next = [...tickers]
    next[i] = val
    setTickers(next)
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.box}>
        <div style={styles.sectionHeader}>
          <label style={styles.label}>OPPONENT</label>
          {tickers.length < 3 && (
            <button type="button" onClick={addTicker} style={styles.addBtn}>+ ADD</button>
          )}
        </div>
        {tickers.map((t, i) => (
          <div key={i} style={styles.tickerRow}>
            <input
              style={styles.input}
              type="text"
              value={t}
              onChange={(e) => updateTicker(i, e.target.value)}
              placeholder={['AAPL', 'TSLA', 'SPY'][i]}
              required={i === 0}
            />
            {tickers.length > 1 && (
              <button type="button" onClick={() => removeTicker(i)} style={styles.xBtn}>X</button>
            )}
          </div>
        ))}
      </div>

      <div style={styles.row}>
        <div style={styles.box}>
          <label style={styles.label}>INVEST $</label>
          <input style={styles.input} type="number" min="1" step="any" value={amount}
            onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div style={styles.box}>
          <label style={styles.label}>DCA/MO</label>
          <div style={styles.dcaRow}>
            <button type="button" onClick={() => setDcaEnabled(!dcaEnabled)}
              style={{ ...styles.toggleBtn, color: dcaEnabled ? '#50c878' : '#e04040' }}>
              {dcaEnabled ? 'ON' : 'OFF'}
            </button>
            {dcaEnabled && (
              <input style={{ ...styles.input, flex: 1 }} type="number" min="1" step="any"
                value={dca} onChange={(e) => setDca(e.target.value)} />
            )}
          </div>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.box}>
          <label style={styles.label}>FROM</label>
          <input style={styles.input} type="date" value={start}
            onChange={(e) => setStart(e.target.value)} min="1999-01-01" required />
        </div>
        <div style={styles.box}>
          <label style={styles.label}>TO</label>
          <input style={styles.input} type="date" value={end}
            onChange={(e) => setEnd(e.target.value)} required />
        </div>
      </div>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'LOADING...' : '▶ BATTLE!'}
      </button>
    </form>
  )
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  box: {
    background: '#1a1a2e',
    border: '3px solid #333',
    padding: '12px',
    flex: 1,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  label: {
    fontSize: '8px',
    color: '#f0a030',
    fontFamily: "'Press Start 2P', monospace",
    marginBottom: '6px',
    display: 'block',
  },
  tickerRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '8px',
    background: '#0a0a14',
    border: '2px solid #444',
    color: '#e8e8e8',
    fontSize: '10px',
    fontFamily: "'Press Start 2P', monospace",
    outline: 'none',
  },
  addBtn: {
    background: 'none',
    border: '2px solid #444',
    color: '#888',
    fontSize: '7px',
    fontFamily: "'Press Start 2P', monospace",
    padding: '4px 8px',
    cursor: 'pointer',
  },
  xBtn: {
    background: '#2a0808',
    border: '2px solid #e04040',
    color: '#e04040',
    fontSize: '8px',
    fontFamily: "'Press Start 2P', monospace",
    padding: '4px 8px',
    cursor: 'pointer',
  },
  dcaRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  toggleBtn: {
    background: '#0a0a14',
    border: '2px solid #444',
    fontSize: '8px',
    fontFamily: "'Press Start 2P', monospace",
    padding: '6px 10px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  button: {
    padding: '14px',
    background: '#1a1a2e',
    border: '3px solid #f0a030',
    color: '#f0a030',
    fontSize: '12px',
    fontFamily: "'Press Start 2P', monospace",
    cursor: 'pointer',
    textShadow: '2px 2px 0 #604010',
    marginTop: '4px',
  },
}
