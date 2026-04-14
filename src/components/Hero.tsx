import { useEffect, useRef } from 'react'
import type { Lang } from '../translations'
import { t } from '../translations'

interface HeroProps {
  lang: Lang
}

export default function Hero({ lang }: HeroProps) {
  const copy = t[lang].hero

  const labelRef  = useRef<HTMLSpanElement>(null)
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const roleRef   = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = [labelRef.current, titleRef.current, roleRef.current, scrollRef.current]
    // Small delay so the transition plays on mount
    const timer = setTimeout(() => {
      els.forEach((el) => el?.classList.add('visible'))
    }, 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header className="hero">
      <div className="hero-content">
        <span ref={labelRef} className="hero-label">{copy.label}</span>
        <h1 ref={titleRef} className="hero-title">
          {copy.title1}{' '}
          <em>{copy.titleAccent}</em>
          <br />
          {copy.title2}
        </h1>
        <p ref={roleRef} className="hero-role">{copy.role}</p>
      </div>

      <div ref={scrollRef} className="hero-scroll" aria-hidden="true">
        <div className="hero-scroll-line" />
        <span>{copy.scroll}</span>
      </div>
    </header>
  )
}
