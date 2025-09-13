import React, { useEffect, useRef, useState } from 'react'

export default function Gallery({ images = [] }) {
  const [idx, setIdx] = useState(0)
  const len = images.length
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setInterval(() => {
      setIdx(i => (i + 1) % len)
    }, 3500)
    return () => clearInterval(timer.current)
  }, [len])

  if (len === 0) {
    return <p>Add some photos to make this magical! ✨</p>
  }

  const current = images[idx]

  return (
    <div className="gallery">
      <div className="frame">
        <img src={current.src} alt={current.caption || 'Memory'} />
      </div>
      {current.caption && <p className="caption">{current.caption}</p>}
      <div className="dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={'dot ' + (i === idx ? 'active' : '')}
            onClick={() => setIdx(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}