import React, { useEffect, useMemo, useRef, useState } from 'react'
import Countdown from './components/Countdown.jsx'
import Typewriter from './components/Typewriter.jsx'
import HeartTrail from './components/HeartTrail.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import Gallery from './components/Gallery.jsx'
import LoveCoupons from './components/LoveCoupons.jsx'

const BDAY_MONTH = 8 // 0-based: 8 = September
const BDAY_DAY = 17

function getRecipientName() {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('to') ?? ''
  const trimmed = raw.trim()
  const base = trimmed || 'Dain' // MẶC ĐỊNH là Dain nếu không truyền ?to=
  return base
    .split(' ')
    .filter(Boolean)
    .map(s => s[0]?.toUpperCase() + s.slice(1))
    .join(' ')
}

function useIsBirthday() {
  const now = new Date()
  const thisYear = now.getFullYear()
  const target = new Date(thisYear, BDAY_MONTH, BDAY_DAY, 0, 0, 0, 0)
  if (now > target) {
    const oneDay = 24 * 60 * 60 * 1000
    return now - target < oneDay
  }
  return now.toDateString() === target.toDateString()
}

function getNextBirthday() {
  const now = new Date()
  const year =
    now.getMonth() > BDAY_MONTH ||
    (now.getMonth() === BDAY_MONTH && now.getDate() > BDAY_DAY)
      ? now.getFullYear() + 1
      : now.getFullYear()
  return new Date(year, BDAY_MONTH, BDAY_DAY, 0, 0, 0, 0)
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const name = useMemo(getRecipientName, [])
  const isBirthday = useIsBirthday()
  const nextBirthday = useMemo(getNextBirthday, [])
  const [copied, setCopied] = useState(false)
  const fireworksTimer = useRef(null)

  useEffect(() => {
    if (!opened) return
    // nổ confetti lười tải để tránh lỗi package nếu chưa cài
    boomConfetti()
    if (isBirthday) {
      fireworksTimer.current = setInterval(boomConfetti, 1500)
    }
    return () => {
      if (fireworksTimer.current) clearInterval(fireworksTimer.current)
    }
  }, [opened, isBirthday])

  async function boomConfetti() {
    try {
      const mod = await import('canvas-confetti')
      const confetti = mod.default
      const count = 120
      const defaults = { origin: { y: 0.6 } }
      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }))
      }
      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2, { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 })
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1, { spread: 120, startVelocity: 45 })
    } catch {
      // nếu chưa cài canvas-confetti, bỏ qua để không vỡ trang
      if (import.meta.env.DEV) {
        console.warn('canvas-confetti is not installed yet. Run: npm i canvas-confetti')
      }
    }
  }

  function handleOpen() {
    setOpened(true)
  }

  function buildShareUrl() {
    const url = new URL(window.location.href)
    url.searchParams.set('to', name)
    return url.toString()
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(buildShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
      alert('Copy failed. You can still select and copy the link manually.')
    }
  }

 const images = [
  { src: "/src/assets/photos/1.png", caption: 'Kỷ niệm dễ thương của tụi mình 💕' },
  { src: "/src/assets/photos/2.png", caption: 'Nụ cười này là cả bầu trời 😊' },
  { src: "/src/assets/photos/3.png", caption: 'Mãi bên nhau em nhé 🌍' }
]

  const wishes = [
    `Hi ${name}!`,
    'Today is all about YOU 🎂',
    'Wishing you oceans of happiness, sparkles of laughter, and endless cuddles 💖',
    'You make my world brighter every single day ✨',
    'Happy Birthday, my favorite human! 🥳'
  ]

  const coupons = [
    { id: 'c1', title: 'One Big Warm Hug', desc: 'Redeemable anytime, anywhere 🤗' },
    { id: 'c2', title: 'Movie Night', desc: 'You pick the film (even the cheesy one) 🎬' },
    { id: 'c3', title: 'Breakfast in Bed', desc: 'Toast + coffee + kisses ☕🍞' },
    { id: 'c4', title: 'Massage', desc: '15-minute shoulder massage 💆‍♀️' },
    { id: 'c5', title: 'Surprise Date', desc: 'I plan. You smile. Deal? 💐' }
  ]

  return (
    <div className="app">
      <HeartTrail />
      <header className="header">
        <div className="title">Happy Birthday {name} 🎉</div>
        <MusicToggle />
      </header>

      {!opened ? (
        <main className="center">
          <div className="envelope" onClick={handleOpen} role="button" aria-label="Open the surprise">
            <div className="flap"></div>
            <div className="letter">Tap to open 🎁</div>
          </div>
          <p className="hint">I made this with love. Open me! 💌</p>
          <ShareBuilder name={name} copied={copied} onCopy={copyLink} />
        </main>
      ) : (
        <main className="content">
          <section className="hero">
            <Typewriter lines={wishes} showCaret={false} />
            {!isBirthday && (
              <div className="countdown-wrap">
                <h3>Counting down to your big day:</h3>
                <Countdown targetDate={nextBirthday} />
              </div>
            )}
            {isBirthday && (
              <button className="btn boom" onClick={boomConfetti}>
                More confetti! ✨
              </button>
            )}
          </section>

          <section className="gallery-section">
            <h2>Our Moments 📸</h2>
            <Gallery images={images} />
          </section>

          <section className="coupons-section">
            <h2>Love Coupons 🎟️</h2>
            <LoveCoupons coupons={coupons} />
          </section>

          <section className="footer-cta">
            <button className="btn" onClick={boomConfetti}>Celebrate Again 🥳</button>
            <ShareBuilder name={name} copied={copied} onCopy={copyLink} />
            <p className="made-with">Made with 💗 by {window.location.hostname.includes('localhost') ? 'you' : 'your person'}</p>
          </section>
        </main>
      )}
    </div>
  )
}

function ShareBuilder({ name, copied, onCopy }) {
  const [customName, setCustomName] = useState(name)
  const url = useMemo(() => {
    const u = new URL(window.location.href)
    u.searchParams.set('to', customName || 'Dain')
    return u.toString()
  }, [customName])

  return (
    <div className="share">
      <label className="share-label">Personalize name:</label>
      <input
        className="share-input"
        value={customName}
        onChange={e => setCustomName(e.target.value)}
        placeholder="e.g., Dain"
      />
      <div className="share-row">
        <input className="share-url" readOnly value={url} onFocus={e => e.target.select()} />
        <button className="btn" onClick={onCopy}>{copied ? 'Copied! ✅' : 'Copy Link 🔗'}</button>
      </div>
      <p className="share-hint">Send this link to her so it shows her name!</p>
    </div>
  )
}