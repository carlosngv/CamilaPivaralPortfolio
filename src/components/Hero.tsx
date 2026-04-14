import { useEffect, useRef } from 'react'
import type { Lang } from '../translations'
import { t } from '../translations'

interface HeroProps {
  lang: Lang
}

export default function Hero({ lang }: HeroProps) {
  const copy = t[lang].hero

  const labelRef   = useRef<HTMLSpanElement>(null)
  const nameRef    = useRef<HTMLHeadingElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      labelRef.current?.classList.add('visible')
      nameRef.current?.classList.add('visible')
      rightRef.current?.classList.add('visible')
      scrollRef.current?.classList.add('visible')
    }, 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header className="hero">
      <div className="hero-content">
        <span ref={labelRef} className="hero-label">{copy.label}</span>

        <div className="hero-main">
          {/* Left — name */}
          <h1 ref={nameRef} className="hero-name">
            {copy.name.split('\n').map((line, i) => (
              <span key={i} className="hero-name-line">{line}</span>
            ))}
          </h1>

          {/* Right — statement + role + bio */}
          <div ref={rightRef} className="hero-right">
            <p className="hero-tagline">
              {copy.tagline1} <em>{copy.taglineAccent}</em><br />
              {copy.tagline2}
            </p>
            <p className="hero-role">{copy.role}</p>
            <p className="hero-bio">{copy.bio}</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="hero-scroll" aria-hidden="true">
        <div className="hero-scroll-line" />
        <span>{copy.scroll}</span>
      </div>
    </header>
  )
}
