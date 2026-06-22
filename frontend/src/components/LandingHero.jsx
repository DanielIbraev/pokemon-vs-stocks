import { PokemonIcon } from './CharizardSvg'

export default function LandingHero() {
  return (
    <div style={styles.hero}>
      <div style={styles.titleBox}>
        <div style={styles.stars}>* * * * *</div>
        <h1 style={styles.title}>POKEMON</h1>
        <h2 style={styles.subtitle}>vs THE ECONOMY</h2>
        <div style={styles.stars}>* * * * *</div>
      </div>

      <div style={styles.battlePreview}>
        <div style={styles.side}>
          <PokemonIcon pokemon="charizard" size={80} />
          <div style={styles.label}>POKEMON</div>
        </div>
        <div style={styles.vsBox}>
          <span style={styles.vsText}>VS</span>
        </div>
        <div style={styles.side}>
          <div style={styles.stockSprite}>
            <svg viewBox="0 0 48 48" style={{ width: 60, height: 60, imageRendering: 'pixelated' }}>
              <rect x="8" y="36" width="6" height="8" fill="#4a9eff" />
              <rect x="16" y="28" width="6" height="16" fill="#4a9eff" />
              <rect x="24" y="20" width="6" height="24" fill="#4a9eff" />
              <rect x="32" y="12" width="6" height="32" fill="#4a9eff" />
              <rect x="8" y="34" width="6" height="2" fill="#80c0ff" />
              <rect x="16" y="26" width="6" height="2" fill="#80c0ff" />
              <rect x="24" y="18" width="6" height="2" fill="#80c0ff" />
              <rect x="32" y="10" width="6" height="2" fill="#80c0ff" />
            </svg>
          </div>
          <div style={styles.label}>STOCKS</div>
        </div>
      </div>

      <p style={styles.desc}>
        What if you invested in a 1st Edition Charizard card instead?
      </p>

      <div style={styles.pressStart}>
        <span style={{ animation: 'blink 1.2s steps(1) infinite' }}>
          ▼ CHOOSE YOUR BATTLE ▼
        </span>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    padding: '40px 24px 20px',
    textAlign: 'center',
  },
  titleBox: {
    marginBottom: '28px',
  },
  stars: {
    fontSize: '8px',
    color: '#f0a030',
    letterSpacing: '4px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 400,
    color: '#f0a030',
    fontFamily: "'Press Start 2P', monospace",
    textShadow: '3px 3px 0 #804010',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#e8e8e8',
    fontFamily: "'Press Start 2P', monospace",
    textShadow: '2px 2px 0 #333',
    marginBottom: '8px',
  },
  battlePreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  side: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  label: {
    fontSize: '7px',
    color: '#888',
    letterSpacing: '1px',
    fontFamily: "'Press Start 2P', monospace",
  },
  vsBox: {
    padding: '8px 12px',
    border: '3px solid #f0a030',
    background: '#1a1010',
  },
  vsText: {
    fontSize: '14px',
    color: '#f0a030',
    fontFamily: "'Press Start 2P', monospace",
  },
  stockSprite: {
    width: 60,
    height: 60,
  },
  desc: {
    fontSize: '8px',
    color: '#888',
    lineHeight: '1.8',
    maxWidth: '380px',
    margin: '0 auto 20px',
    fontFamily: "'Press Start 2P', monospace",
  },
  pressStart: {
    fontSize: '8px',
    color: '#f0a030',
    fontFamily: "'Press Start 2P', monospace",
  },
}
