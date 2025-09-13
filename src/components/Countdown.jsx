import React, { useEffect, useState } from 'react'

// Đưa hàm tính ra ngoài để không dính cảnh báo deps của useEffect
function computeTimeLeft(targetDate) {
  const now = new Date()
  const diff = targetDate - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(targetDate))

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft(targetDate))
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="countdown">
      <TimeBox label="Days" value={timeLeft.days} />
      <TimeBox label="Hours" value={timeLeft.hours} />
      <TimeBox label="Minutes" value={timeLeft.minutes} />
      <TimeBox label="Seconds" value={timeLeft.seconds} />
    </div>
  )
}

function TimeBox({ label, value }) {
  return (
    <div className="timebox">
      <div className="timebox-value">{value.toString().padStart(2, '0')}</div>
      <div className="timebox-label">{label}</div>
    </div>
  )
}