import React, { useEffect } from 'react'

export default function HeartTrail() {
  useEffect(() => {
    const hearts = []
    let rafId

    function spawnHeart(x, y) {
      const el = document.createElement('div')
      el.className = 'heart'
      el.style.left = x + 'px'
      el.style.top = y + 'px'
      el.style.transform = `translate(-50%, -50%) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 60 - 30}deg)`
      document.body.appendChild(el)
      const life = 800 + Math.random() * 600
      const start = performance.now()
      function animate(t) {
        const elapsed = t - start
        const p = elapsed / life
        if (p >= 1) {
          el.remove()
          return
        }
        el.style.opacity = (1 - p).toString()
        el.style.top = y - p * 40 + 'px'
        rafId = requestAnimationFrame(animate)
      }
      rafId = requestAnimationFrame(animate)
      hearts.push(el)
      if (hearts.length > 60) {
        const h = hearts.shift()
        h && h.remove()
      }
    }

    function onMove(e) {
      const x = e.clientX
      const y = e.clientY
      spawnHeart(x, y)
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      hearts.forEach(h => h.remove())
    }
  }, [])

  return null
}