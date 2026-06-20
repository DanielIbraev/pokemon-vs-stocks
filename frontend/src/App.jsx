import { useState, useCallback } from 'react'
import LandingHero from './components/LandingHero'
import InputForm from './components/InputForm'
import BattleIntro from './components/BattleIntro'
import AnimatedChart from './components/AnimatedChart'
import ResultsScreen from './components/ResultsScreen'
import { runBacktest } from './api'
import './styles.css'

const STOCK_COLORS = ['#4a9eff', '#a855f7', '#34d399']

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('input')
  const [pendingTickers, setPendingTickers] = useState([])

  const handleSubmit = async (params) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await runBacktest(params)
      setResult(data)
      setPendingTickers(params.tickers)
      setPhase('battle-intro')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Check ticker and try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleBattleIntroDone = useCallback(() => {
    setPhase('chart')
  }, [])

  const handleAnimationEnd = useCallback(() => {
    setTimeout(() => {
      setPhase('chart-fade')
      setTimeout(() => setPhase('results'), 800)
    }, 1500)
  }, [])

  const handleReplay = useCallback(() => {
    setPhase('battle-intro')
  }, [])

  const handleReset = useCallback(() => {
    setResult(null)
    setPhase('input')
    setError('')
  }, [])

  return (
    <div className="app">
      {/* Scanline overlay */}
      <div className="scanlines" />

      {phase === 'input' && (
        <div className="fade-in">
          <LandingHero />
          <div className="form-container">
            <InputForm onSubmit={handleSubmit} loading={loading} />
            {error && <div className="error-msg">{error}</div>}
          </div>
        </div>
      )}

      {phase === 'battle-intro' && result && (
        <BattleIntro
          tickers={result.tickers}
          onDone={handleBattleIntroDone}
        />
      )}

      {(phase === 'chart' || phase === 'chart-fade') && result && (
        <div className={phase === 'chart-fade' ? 'slow-fade-out' : 'fade-in'}>
          <div className="chart-view">
            <h2 className="chart-title">
              <span className="gold">CHARIZARD</span>
              <span className="vs-small">VS</span>
              {result.tickers.map((t, i) => (
                <span key={t}>
                  {i > 0 && <span className="vs-small" style={{ margin: '0 2px' }}>/</span>}
                  <span style={{ color: STOCK_COLORS[i] }}>{t}</span>
                </span>
              ))}
            </h2>
            {result.dca > 0 && (
              <p style={{
                textAlign: 'center', color: '#666', fontSize: '7px', margin: '-4px 0 8px',
                fontFamily: "'Press Start 2P', monospace",
              }}>
                DCA: ${result.dca}/MO
              </p>
            )}
            <AnimatedChart
              key={result.tickers.join(',') + result.start}
              data={result.series}
              tickers={result.tickers}
              onAnimationEnd={phase === 'chart' ? handleAnimationEnd : undefined}
            />
          </div>
        </div>
      )}

      {phase === 'results' && result && (
        <div className="slow-fade-in">
          <ResultsScreen
            result={result}
            onReplay={handleReplay}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  )
}
