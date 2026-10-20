import { useEffect, useState } from 'react'

const THRESHOLD = 300

export default function ScrollTop() {
  const [visible, setVisible] = useState(false)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })

  return (
    <button
      className={`scroll-top ${visible ? 'show' : ''}`}
      onClick={goTop}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="19 12 12 5 5 12" />
      </svg>
    </button>
  )
}
