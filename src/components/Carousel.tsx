import { useState, useEffect, useRef } from 'react'

function ChevLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

interface CarouselProps {
  images: string[]
  name: string
  autoPlay?: boolean
  interval?: number
}

export default function Carousel({ images, name, autoPlay = false, interval = 3500 }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [restartKey, setRestartKey] = useState(0)
  const touchStart = useRef(0)

  const resetTimer = () => setRestartKey((k) => k + 1)

  const prev = () => { setCurrent((i) => (i - 1 + images.length) % images.length); resetTimer() }
  const next = () => { setCurrent((i) => (i + 1) % images.length); resetTimer() }
  const goTo = (i: number) => { setCurrent(i); resetTimer() }

  // Auto-advance
  useEffect(() => {
    if (!autoPlay || images.length <= 1 || paused) return
    const id = setInterval(() => setCurrent((i) => (i + 1) % images.length), interval)
    return () => clearInterval(id)
  }, [autoPlay, images.length, interval, paused, restartKey])

  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 48) diff > 0 ? next() : prev()
  }

  // Single image — no controls
  if (images.length === 1) {
    return (
      <div className="carousel">
        <div className="carousel-frame">
          <img src={`/assets/${images[0]}`} alt={name} loading="lazy" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="carousel-frame"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
          aria-live="polite"
        >
          {images.map((src, i) => (
            <div key={src} className="carousel-slide" aria-hidden={i !== current}>
              <img
                src={`/assets/${src}`}
                alt={`${name} — ${i + 1} / ${images.length}`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Progress bar — only when auto-playing and not paused */}
        {autoPlay && !paused && (
          <div
            key={`${current}-${restartKey}`}
            className="carousel-progress"
            style={{ animationDuration: `${interval}ms` }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="carousel-controls">
        <button className="carousel-btn" onClick={prev} aria-label="Imagen anterior">
          <ChevLeft />
        </button>

        <div className="carousel-dots" role="tablist">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              className={`carousel-dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Imagen ${i + 1}`}
              aria-selected={i === current}
            />
          ))}
        </div>

        <span className="carousel-counter" aria-live="polite" aria-atomic="true">
          {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>

        <button className="carousel-btn" onClick={next} aria-label="Siguiente imagen">
          <ChevRight />
        </button>
      </div>
    </div>
  )
}
