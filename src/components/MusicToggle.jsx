import React, { useEffect, useRef, useState } from 'react'
import track from '../assets/music.mp3' // thêm dòng này

export default function MusicToggle() {
  const [on, setOn] = useState(false)
  const [error, setError] = useState('')
  const audioRef = useRef(null)

  useEffect(() => {
    if (!on) { audioRef.current?.pause(); return }
    const a = audioRef.current
    if (!a) return
    a.volume = 0.5
    a.loop = true
    a.play().catch(err => {
      setError('Tap the play button to allow audio 🎵')
      setOn(false)
      console.warn(err)
    })
  }, [on])

  return (
    <div className="music">
      <audio ref={audioRef} src={track} preload="none"></audio> {/* đổi src thành track */}
      <button className="btn small" onClick={() => setOn(v => !v)}>
        {on ? 'Pause Music ⏸️' : 'Play Music 🎶'}
      </button>
      {error && <span className="music-hint">{error}</span>}
    </div>
  )
}