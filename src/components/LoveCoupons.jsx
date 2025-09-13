import React, { useEffect, useState } from 'react'

function usePersistedSet(key) {
  const [setVal, setSetVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return new Set(raw ? JSON.parse(raw) : [])
    } catch {
      return new Set()
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify([...setVal]))
    } catch (e) {
      // Tránh khối catch rỗng để qua ESLint
      if (import.meta.env.DEV) {
        console.warn('localStorage write failed:', e)
      }
    }
  }, [key, setVal])
  return [setVal, setSetVal]
}

export default function LoveCoupons({ coupons }) {
  const [redeemed, setRedeemed] = usePersistedSet('love-coupons-redeemed')

  function toggle(id) {
    setRedeemed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="coupons">
      {coupons.map(c => {
        const isRedeemed = redeemed.has(c.id)
        return (
          <div className={'coupon ' + (isRedeemed ? 'redeemed' : '')} key={c.id} onClick={() => toggle(c.id)}>
            <div className="coupon-inner">
              <div className="coupon-front">
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
                <span className="tap">Tap to flip</span>
              </div>
              <div className="coupon-back">
                {isRedeemed ? (
                  <p>Redeemed ✔️</p>
                ) : (
                  <p>Valid Anytime 💝</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}