import { useState, useEffect } from 'react'
import { PokemonWin, PokemonLoss, getPokemonColor } from './CharizardSvg'
import MonteCarloChart from './MonteCarloChart'
import { sfxVictory, sfxDefeat } from '../sounds'

const STOCK_COLORS = ['#4a9eff', '#a855f7', '#34d399']

function formatMoney(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`
  return `$${val.toFixed(2)}`
}

function MetricRow({ label, value }) {
  return (
    <div style={metricStyles.row}>
      <span style={metricStyles.label}>{label}</span>
      <span style={metricStyles.value}>{value}</span>
    </div>
  )
}

const metricStyles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: '1px dashed #333',
  },
  label: { fontSize: '7px', color: '#888', fontFamily: "'Press Start 2P', monospace" },
  value: { fontSize: '7px', color: '#ccc', fontFamily: "'Press Start 2P', monospace" },
}

function AssetCard({ asset, color, isWinner, index, inflationData }) {
  const m = asset.metrics
  const showInflation = inflationData != null
  return (
    <div style={{
      ...cardStyles.card,
      borderColor: isWinner ? color : '#444',
      animation: `fadeIn 0.3s steps(4) ${0.3 + index * 0.2}s both`,
    }}>
      <div style={{ ...cardStyles.dot, background: color }} />
      <div style={cardStyles.name}>{asset.label}</div>
      <div style={cardStyles.value}>{formatMoney(asset.final_value)}</div>
      {showInflation && (
        <div style={cardStyles.inflationVal}>
          {formatMoney(inflationData.final_value)} real
        </div>
      )}
      <div style={{
        ...cardStyles.returnPct,
        color: asset.return_pct >= 0 ? '#50c878' : '#e04040',
      }}>
        {asset.return_pct >= 0 ? '+' : ''}{asset.return_pct.toFixed(1)}%
        {showInflation && (
          <span style={{ color: '#888', fontSize: '7px' }}>
            {' '}({inflationData.return_pct >= 0 ? '+' : ''}{inflationData.return_pct.toFixed(1)}% real)
          </span>
        )}
      </div>
      <div style={cardStyles.metrics}>
        <MetricRow label="SHARPE" value={m.sharpe} />
        <MetricRow label="MAX DD" value={`${m.max_drawdown}%`} />
        <MetricRow label="VOL" value={`${m.volatility}%`} />
        <MetricRow label="BEST MO" value={`+${m.best_month}%`} />
        <MetricRow label="WORST MO" value={`${m.worst_month}%`} />
      </div>
    </div>
  )
}

const cardStyles = {
  card: {
    background: '#0a0a14',
    border: '3px solid',
    padding: '12px',
    flex: 1,
    minWidth: 0,
  },
  dot: {
    width: '8px',
    height: '8px',
    marginBottom: '8px',
  },
  name: {
    fontSize: '8px',
    color: '#888',
    fontFamily: "'Press Start 2P', monospace",
    marginBottom: '6px',
  },
  value: {
    fontSize: '14px',
    color: '#e8e8e8',
    fontFamily: "'Press Start 2P', monospace",
  },
  inflationVal: {
    fontSize: '7px',
    color: '#a080d0',
    fontFamily: "'Press Start 2P', monospace",
    marginTop: '2px',
  },
  returnPct: {
    fontSize: '9px',
    fontFamily: "'Press Start 2P', monospace",
    marginTop: '2px',
    marginBottom: '10px',
  },
  metrics: {
    borderTop: '2px solid #333',
    paddingTop: '6px',
  },
}

export default function ResultsScreen({ result, onReplay, onReset }) {
  const { assets, winner, tickers, amount, total_invested, dca, inflation_assets, monte_carlo, pokemon, pokemon_name } = result
  const pokemonWins = winner === 'pokemon'
  const pokemonColor = getPokemonColor(pokemon)
  const [showContent, setShowContent] = useState(false)
  const [showInflation, setShowInflation] = useState(false)
  const [showMonteCarlo, setShowMonteCarlo] = useState(false)

  useEffect(() => {
    if (pokemonWins) sfxVictory()
    else sfxDefeat()
    const t = setTimeout(() => setShowContent(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Victory / defeat banner */}
        <div style={styles.victoryBox}>
          {pokemonWins ? (
            <>
              <div style={{ animation: 'victoryBounce 0.6s steps(4) infinite' }}>
                <PokemonWin pokemon={pokemon} size={140} />
              </div>
              <div style={{ ...styles.victoryText, color: pokemonColor }}>
                ★ {pokemon_name.toUpperCase()} WINS! ★
              </div>
              <div style={styles.expText}>
                {pokemon_name.toUpperCase()} gained {Math.round(assets.pokemon.return_pct)} EXP. Points!
              </div>
            </>
          ) : (
            <>
              <PokemonLoss pokemon={pokemon} size={100} />
              <div style={{ ...styles.victoryText, color: '#4a9eff' }}>
                {winner} WINS!
              </div>
              <div style={styles.expText}>
                {pokemon_name.toUpperCase()} fainted!
              </div>
            </>
          )}
        </div>

        {showContent && (
          <div style={{ animation: 'fadeIn 0.4s steps(6)' }}>
            <div style={styles.investedInfo}>
              {formatMoney(amount)} initial{dca > 0 ? ` + ${formatMoney(dca)}/mo` : ''}
              {dca > 0 ? ` = ${formatMoney(total_invested)} total` : ''}
            </div>

            {/* Toggle buttons */}
            <div style={styles.toggleRow}>
              <button
                onClick={() => setShowInflation(!showInflation)}
                style={{
                  ...styles.toggleBtn,
                  borderColor: showInflation ? '#a080d0' : '#444',
                  color: showInflation ? '#a080d0' : '#666',
                }}
              >
                {showInflation ? '◆' : '◇'} INFLATION ADJ
              </button>
              <button
                onClick={() => setShowMonteCarlo(!showMonteCarlo)}
                style={{
                  ...styles.toggleBtn,
                  borderColor: showMonteCarlo ? '#f0a030' : '#444',
                  color: showMonteCarlo ? '#f0a030' : '#666',
                }}
              >
                {showMonteCarlo ? '◆' : '◇'} MONTE CARLO
              </button>
            </div>

            <div style={styles.cards}>
              <AssetCard
                asset={assets.pokemon}
                color={pokemonColor}
                isWinner={pokemonWins}
                index={0}
                inflationData={showInflation ? inflation_assets?.pokemon : null}
              />
              {tickers.map((t, i) => (
                <AssetCard
                  key={t}
                  asset={assets[t]}
                  color={STOCK_COLORS[i]}
                  isWinner={winner === t}
                  index={i + 1}
                  inflationData={showInflation ? inflation_assets?.[t] : null}
                />
              ))}
            </div>

            {showMonteCarlo && monte_carlo && (
              <div style={{ animation: 'fadeIn 0.3s steps(4)' }}>
                <MonteCarloChart
                  monteCarlo={monte_carlo}
                  tickers={tickers}
                  pokemon={pokemon}
                />
              </div>
            )}

            <div style={styles.buttons}>
              <button onClick={onReplay} style={styles.btn}>REPLAY</button>
              <button onClick={onReset} style={{ ...styles.btn, borderColor: '#f0a030', color: '#f0a030' }}>
                NEW BATTLE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  content: {
    maxWidth: '680px',
    width: '100%',
  },
  victoryBox: {
    textAlign: 'center',
    padding: '24px',
    background: '#1a1a2e',
    border: '4px solid #e8e8e8',
    marginBottom: '12px',
    boxShadow: 'inset -4px -4px 0 0 #888, inset 4px 4px 0 0 #fff',
  },
  victoryText: {
    fontSize: '16px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#f0a030',
    textShadow: '3px 3px 0 #604010',
    marginTop: '12px',
    animation: 'blink 1s steps(1) 3',
  },
  expText: {
    fontSize: '8px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#888',
    marginTop: '8px',
  },
  investedInfo: {
    fontSize: '7px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#666',
    textAlign: 'center',
    marginBottom: '8px',
  },
  toggleRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  toggleBtn: {
    background: '#0a0a14',
    border: '2px solid',
    fontSize: '7px',
    fontFamily: "'Press Start 2P', monospace",
    padding: '6px 10px',
    cursor: 'pointer',
    transition: 'all 0.1s',
  },
  cards: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  buttons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  btn: {
    padding: '10px 20px',
    background: '#0a0a14',
    border: '3px solid #444',
    color: '#888',
    fontSize: '8px',
    fontFamily: "'Press Start 2P', monospace",
    cursor: 'pointer',
  },
}
