import { useEffect, useRef } from 'react'
import type { Lang } from '../translations'
import { t } from '../translations'

function IconMail() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  )
}

interface FooterProps {
  lang: Lang
}

export default function Footer({ lang }: FooterProps) {
  const copy = t[lang].footer
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            footer.querySelectorAll('.reveal').forEach((el) => el.classList.add('active'))
          }
        })
      },
      { threshold: 0.05 }
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <footer id="contact" className="footer" ref={footerRef}>
      <div className="footer-top">
        <div>
          <p className="footer-eyebrow reveal">{copy.eyebrow}</p>
          <h2 className="footer-cta reveal">{copy.cta}</h2>
          <p className="footer-sub reveal">{copy.sub}</p>
        </div>

        <div className="footer-links">
          <a
            href="mailto:camilapd22@gmail.com"
            className="footer-link reveal"
            aria-label="Enviar correo a Camila Pivaral"
          >
            <IconMail />
            camilapd22@gmail.com
            <IconArrow />
          </a>
          <a
            href="https://www.linkedin.com/in/camilapivaral/"
            className="footer-link reveal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Camila Pivaral"
          >
            <IconLinkedIn />
            LinkedIn
            <IconArrow />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">{copy.copy}</span>
        <span className="footer-made">
          Diseñado con <span>♥</span>
        </span>
      </div>
    </footer>
  )
}
