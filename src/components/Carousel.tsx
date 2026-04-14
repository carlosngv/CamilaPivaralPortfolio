import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

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

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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
  const [lightbox, setLightbox] = useState<number | null>(null)
  const touchStart = useRef(0)
  const lbTouchStart = useRef(0)

  const resetTimer = () => setRestartKey((k) => k + 1)

  const prev = () => { setCurrent((i) => (i - 1 + images.length) % images.length); resetTimer() }
  const next = () => { setCurrent((i) => (i + 1) % images.length); resetTimer() }
  const goTo = (i: number) => { setCurrent(i); resetTimer() }

  // Lightbox navigation
  const lbPrev = useCallback(() => setLightbox((i) => i === null ? null : (i - 1 + images.length) % images.length), [images.length])
  const lbNext = useCallback(() => setLightbox((i) => i === null ? null : (i + 1) % images.length), [images.length])
  const lbClose = useCallback(() => setLightbox(null), [])

  // Escape key closes lightbox
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') lbClose()
      if (e.key === 'ArrowLeft') lbPrev()
      if (e.key === 'ArrowRight') lbNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, lbClose, lbPrev, lbNext])

  // Body scroll lock when lightbox is open
  useEffect(() => {
    if (lightbox === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [lightbox])

  // Lightbox touch handlers
  const handleLbTouchStart = (e: React.TouchEvent) => { lbTouchStart.current = e.touches[0].clientX }
  const handleLbTouchEnd = (e: React.TouchEvent) => {
    const diff = lbTouchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 48) diff > 0 ? lbNext() : lbPrev()
  }

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

  // Lightbox portal
  const lightboxPortal = lightbox !== null && createPortal(
    <div
      className="lightbox-overlay"
      onClick={lbClose}
      onTouchStart={handleLbTouchStart}
      onTouchEnd={handleLbTouchEnd}
    >
      <img
        className="lightbox-img"
        src={`/assets/${images[lightbox]}`}
        alt={`${name} — ${lightbox + 1} / ${images.length}`}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      <button className="lightbox-close" onClick={lbClose} aria-label="Cerrar">
        <XIcon />
      </button>
      {images.length > 1 && (
        <>
          <button className="lightbox-nav lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); lbPrev() }} aria-label="Imagen anterior">
            <ChevLeft />
          </button>
          <button className="lightbox-nav lightbox-nav--next" onClick={(e) => { e.stopPropagation(); lbNext() }} aria-label="Siguiente imagen">
            <ChevRight />
          </button>
          <span className="lightbox-counter">
            {String(lightbox + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </>
      )}
    </div>,
    document.body,
  )

  // Single image — no controls
  if (images.length === 1) {
    return (
      <div className="carousel">
        <div className="carousel-frame">
          <img src={`/assets/${images[0]}`} alt={name} loading="lazy" onClick={() => setLightbox(0)} />
        </div>
        {lightboxPortal}
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
                onClick={() => setLightbox(i)}
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

      {lightboxPortal}
    </div>
  )
}
