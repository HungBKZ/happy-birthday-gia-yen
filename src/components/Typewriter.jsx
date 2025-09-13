import React, { useEffect, useRef, useState } from 'react'

export default function Typewriter({
  lines = [],
  speed = 30,     // ms mỗi ký tự
  pause = 1000,   // ms giữa các dòng
  showCaret = false // TẮT caret để test cho chắc
}) {
  const [display, setDisplay] = useState('')
  const [lineIndex, setLineIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (lineIndex >= lines.length) return

    const full = String(lines[lineIndex] ?? '')
    const chars = Array.from(full) // an toàn emoji/Unicode
    let i = 0

    // clear trước
    setDisplay('')

    function tick() {
      // hiển thị từ đầu đến i (không phụ thuộc prev)
      setDisplay(chars.slice(0, i + 1).join(''))
      i++
      if (i < chars.length) {
        timerRef.current = setTimeout(tick, speed)
      } else {
        timerRef.current = setTimeout(() => setLineIndex(li => li + 1), pause)
      }
    }

    timerRef.current = setTimeout(tick, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [lineIndex, lines, speed, pause])

  return (
    <div className="typewriter">
      <p className={'typewriter-line' + (showCaret ? ' with-caret' : '')}>
        {display}
      </p>
    </div>
  )
}