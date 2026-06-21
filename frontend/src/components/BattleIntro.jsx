import { useState, useEffect } from 'react'
import { CharizardIcon } from './CharizardSvg'
import { sfxAppear, sfxAttack } from '../sounds'

const STOCK_COLORS = ['#4a9eff', '#a855f7', '#34d399']

function StockSprite({ color, size = 50 }) {
  return (
    <svg viewBox="0 0 48 48" style={{ width: size, height: size, imageRendering: 'pixelated' }}>
      <rect x="6" y="34" width="8" height="10" fill={color} />
      <rect x="16" y="24" width="8" height="20" fill={color} />
      <rect x="26" y="16" width="8" height="28" fill={color} />
      <rect x="36" y="8" width="8" height="36" fill={color} />
      <rect x="6" y="32" width="8" height="2" fill="#fff" opacity="0.3" />
      <rect x="16" y="22" width="8" height="2" fill="#fff" opacity="0.3" />
      <rect x="26" y="14" width="8" height="2" fill="#fff" opacity="0.3" />
      <rect x="36" y="6" width="8" height="2" fill="#fff" opacity="0.3" />
    </svg>
  )
}

function HitSparks({ x, y }) {
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      animation: 'fadeIn 0.1s steps(1)',
    }}>
      <svg viewBox="0 0 60 60" style={{ width: 60, height: 60, imageRendering: 'pixelated' }}>
        {/* Pixel explosion */}
        <rect x="28" y="10" width="4" height="8" fill="#f8e848" />
        <rect x="28" y="42" width="4" height="8" fill="#f8e848" />
        <rect x="10" y="28" width="8" height="4" fill="#f8e848" />
        <rect x="42" y="28" width="8" height="4" fill="#f8e848" />
        <rect x="14" y="14" width="6" height="6" fill="#f0a030" />
        <rect x="40" y="14" width="6" height="6" fill="#f0a030" />
        <rect x="14" y="40" width="6" height="6" fill="#f0a030" />
        <rect x="40" y="40" width="6" height="6" fill="#f0a030" />
        <rect x="26" y="26" width="8" height="8" fill="#fff" />
      </svg>
    </div>
  )
}

export default function BattleIntro({ tickers, onDone }) {
  const [step, setStep] = useState(0)
  const [shake, setShake] = useState(false)
  const [hitFlash, setHitFlash] = useState(false)
  const [charizardAttacking, setCharizardAttacking] = useState(false)
  const [opponentHit, setOpponentHit] = useState(false)
  const [showSparks, setShowSparks] = useState(false)
  const [opponentHp, setOpponentHp] = useState(100)

  useEffect(() => {
    const timers = [
      // "Wild X appeared!"
      setTimeout(() => { setStep(1); sfxAppear() }, 400),
      // "Go! CHARIZARD!" - charizard slides in
      setTimeout(() => { setStep(2); sfxAppear() }, 1400),
      // "CHARIZARD used BACKTEST!" - attack animation
      setTimeout(() => {
        setStep(3)
        setCharizardAttacking(true)
        sfxAttack()
      }, 2400),
      // Charizard lunges forward
      setTimeout(() => {
        setCharizardAttacking(false)
        setHitFlash(true)
        setShake(true)
        setShowSparks(true)
        setOpponentHit(true)
        sfxAttack()
      }, 2900),
      // Clear flash
      setTimeout(() => {
        setHitFlash(false)
        setShake(false)
      }, 3100),
      // Clear sparks, opponent flickers
      setTimeout(() => {
        setShowSparks(false)
      }, 3300),
      // HP drains
      setTimeout(() => {
        setOpponentHit(false)
        setOpponentHp(20)
      }, 3500),
      // "It's super effective!"
      setTimeout(() => {
        setStep(4)
        sfxAttack()
      }, 3800),
      // Second hit
      setTimeout(() => {
        setHitFlash(true)
        setShake(true)
        setShowSparks(true)
        sfxAttack()
      }, 4200),
      setTimeout(() => {
        setHitFlash(false)
        setShake(false)
        setShowSparks(false)
        setOpponentHp(0)
      }, 4500),
      // Done
      setTimeout(() => onDone(), 5200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div style={{
      ...styles.container,
      animation: shake ? 'screenShake 0.15s steps(2) infinite' : 'none',
    }}>
      {/* White flash */}
      {hitFlash && <div style={styles.flash} />}

      {/* Battle scene */}
      <div style={styles.battleScene}>
        {/* Top section - opponent */}
        <div style={styles.opponentSide}>
          {step >= 1 && (
            <div style={{ animation: 'slideInRight 0.4s steps(6)' }}>
              <div style={styles.opponentInfo}>
                {tickers.map((t, i) => (
                  <div key={t} style={{ ...styles.nameTag, borderColor: STOCK_COLORS[i] }}>
                    {t}
                  </div>
                ))}
                <div style={styles.hpBar}>
                  <div style={styles.hpLabel}>HP</div>
                  <div style={styles.hpTrack}>
                    <div style={{
                      ...styles.hpFill,
                      width: `${opponentHp}%`,
                      background: opponentHp > 50 ? '#50c878' : opponentHp > 20 ? '#f0c030' : '#e04040',
                      transition: 'width 0.5s steps(10), background 0.3s',
                    }} />
                  </div>
                </div>
              </div>
              <div style={{
                ...styles.opponentSprites,
                opacity: opponentHit ? 0.3 : 1,
                transition: 'opacity 0.1s steps(1)',
              }}>
                {tickers.map((t, i) => (
                  <StockSprite key={t} color={STOCK_COLORS[i]} size={45} />
                ))}
                {showSparks && <HitSparks x="20%" y="10%" />}
              </div>
            </div>
          )}
        </div>

        {/* Ground line */}
        <div style={styles.groundLine} />

        {/* Bottom section - Charizard */}
        <div style={styles.playerSide}>
          {step >= 2 && (
            <div style={{
              animation: 'slideInLeft 0.4s steps(6)',
              transform: charizardAttacking ? 'translateX(80px) translateY(-30px)' : 'none',
              transition: 'transform 0.2s steps(3)',
            }}>
              <CharizardIcon size={100} />
            </div>
          )}
          {step >= 2 && (
            <div style={styles.playerInfo}>
              <div style={{ ...styles.nameTag, borderColor: '#f0a030' }}>
                CHARIZARD
              </div>
              <div style={styles.hpBar}>
                <div style={styles.hpLabel}>HP</div>
                <div style={styles.hpTrack}>
                  <div style={{ ...styles.hpFill, background: '#50c878' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text box */}
      <div style={styles.textBox}>
        <span style={styles.text}>
          {step === 0 && '. . .'}
          {step === 1 && `Wild ${tickers.join(', ')} appeared!`}
          {step === 2 && 'Go! CHARIZARD!'}
          {step === 3 && 'CHARIZARD used BACKTEST!'}
          {step >= 4 && "It's super effective!"}
        </span>
        {step >= 3 && (
          <span style={styles.textCursor}>▼</span>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  flash: {
    position: 'fixed',
    inset: 0,
    background: '#fff',
    zIndex: 50,
    animation: 'battleFlash 0.15s steps(2) forwards',
  },
  battleScene: {
    background: '#1a1a2e',
    border: '4px solid #e8e8e8',
    padding: '20px',
    marginBottom: '0',
    position: 'relative',
    minHeight: '320px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'inset -4px -4px 0 0 #888, inset 4px 4px 0 0 #fff',
    overflow: 'hidden',
  },
  opponentSide: {
    display: 'flex',
    justifyContent: 'flex-end',
    minHeight: '100px',
  },
  opponentInfo: {
    marginBottom: '8px',
  },
  opponentSprites: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '4px',
    position: 'relative',
  },
  groundLine: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #444 20%, #444 80%, transparent 100%)',
    margin: '10px 0',
  },
  playerSide: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    minHeight: '100px',
    gap: '16px',
  },
  playerInfo: {
    marginTop: '6px',
  },
  nameTag: {
    fontSize: '9px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#e8e8e8',
    padding: '4px 8px',
    border: '2px solid',
    background: '#0a0a14',
    marginBottom: '4px',
    display: 'inline-block',
    marginRight: '4px',
  },
  hpBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px',
  },
  hpLabel: {
    fontSize: '7px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#f0a030',
  },
  hpTrack: {
    width: '80px',
    height: '6px',
    background: '#333',
    border: '1px solid #555',
  },
  hpFill: {
    height: '100%',
    width: '100%',
    background: '#50c878',
  },
  textBox: {
    background: '#1a1a2e',
    border: '4px solid #e8e8e8',
    borderTop: 'none',
    padding: '16px 20px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'inset -4px -4px 0 0 #888, inset 4px 4px 0 0 #fff',
  },
  text: {
    fontSize: '10px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#e8e8e8',
    lineHeight: '1.6',
  },
  textCursor: {
    fontSize: '10px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#e8e8e8',
    animation: 'blink 0.6s steps(1) infinite',
  },
}
