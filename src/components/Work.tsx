import { useEffect, useRef } from 'react'
import type { Lang } from '../translations'
import { t } from '../translations'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000',
    alt: 'Branding project',
  },
  {
    src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000',
    alt: 'Digital interface project',
  },
  {
    src: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2000',
    alt: 'Art direction project',
  },
]

interface WorkProps {
  lang: Lang
}

export default function Work({ lang }: WorkProps) {
  const copy = t[lang].work
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    // Reveal on scroll (image clip-path + text fade)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold: 0.08 }
    )

    grid.querySelectorAll('.work-item, .reveal').forEach((el) => observer.observe(el))

    // Parallax only on devices with hover
    if (!window.matchMedia('(hover: hover)').matches) {
      return () => observer.disconnect()
    }

    const items = grid.querySelectorAll<HTMLElement>('.work-item')
    const handlers: Array<(e: MouseEvent) => void> = []

    items.forEach((item) => {
      const img = item.querySelector<HTMLImageElement>('img')
      const handler = (e: MouseEvent) => {
        if (!img) return
        const x = (e.clientX - window.innerWidth / 2) * 0.015
        const y = (e.clientY - window.innerHeight / 2) * 0.015
        img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.08)`
      }
      const reset = () => {
        if (img) img.style.transform = 'scale(1.08)'
      }
      handlers.push(handler)
      item.addEventListener('mousemove', handler)
      item.addEventListener('mouseleave', reset)
    })

    return () => {
      observer.disconnect()
      items.forEach((item, i) => item.removeEventListener('mousemove', handlers[i]))
    }
  }, [])

  return (
    <section id="work" className="work">
      <p className="section-eyebrow reveal">{copy.eyebrow}</p>

      <div className="work-grid" ref={gridRef}>
        {copy.items.map((item, i) => (
          <article key={item.number} className="work-item">
            <div className="image-wrapper">
              <img
                src={images[i].src}
                alt={images[i].alt}
                className="parallax-img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="image-overlay" aria-hidden="true" />
            </div>
            <div className="work-details">
              <div className="work-meta">
                <span className="work-number-cat">{item.number} — {item.category}</span>
                <h2 className="work-title">{item.title}</h2>
              </div>
              <span className="work-arrow" aria-hidden="true">→</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
