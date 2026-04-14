import { useEffect, useRef } from 'react'
import type { Lang } from '../translations'
import { t } from '../translations'

interface AboutProps {
  lang: Lang
}

export default function About({ lang }: AboutProps) {
  const copy = t[lang].about
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active') }),
      { threshold: 0.05 }
    )
    section.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>

      {/* ── Eyebrow ── */}
      <p className="section-eyebrow reveal">{copy.eyebrow}</p>

      {/* ── Quote ── */}
      <div className="about-quote-block reveal">
        {copy.quote.split('\n').map((line, i) => (
          <span key={i} className="about-quote-line">{line}</span>
        ))}
      </div>

      {/* ── Experience ── */}
      <div className="about-chapter reveal">
        <p className="about-chapter-label">{copy.experience.label}</p>
        <div className="exp-entries">
          {copy.experience.items.map((job, i) => (
            <div key={job.company} className="exp-entry reveal">
              <div className="exp-entry-header">
                <div className="exp-entry-left">
                  <span className="exp-idx">{String(i + 1).padStart(2, '0')}</span>
                  <div className="exp-entry-title">
                    <p className="exp-company">{job.company}</p>
                    <p className="exp-role-label">{job.role}</p>
                  </div>
                </div>
                <span className="exp-period">{job.period}</span>
              </div>
              <ul className="exp-bullets">
                {job.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Education ── */}
      <div className="about-chapter reveal">
        <p className="about-chapter-label">{copy.education.label}</p>
        <div className="edu-cards">
          {copy.education.items.map((edu) => (
            <div key={edu.title} className="edu-card reveal">
              <span className="edu-year">{edu.year}</span>
              <p className="edu-title">{edu.title}</p>
              <p className="edu-place">{edu.place}</p>
              {edu.note && <span className="edu-badge">{edu.note}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom row: Skills · Courses · Languages ── */}
      <div className="about-chapter about-bottom reveal">
        <div className="about-bottom-col">
          <p className="about-chapter-label">{copy.skills.label}</p>
          <div className="skills-wrap">
            {copy.skills.items.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>

        <div className="about-bottom-col">
          <p className="about-chapter-label">{copy.courses.label}</p>
          <ul className="courses-list">
            {copy.courses.items.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>

        <div className="about-bottom-col">
          <p className="about-chapter-label">{copy.languages.label}</p>
          <div className="lang-rows">
            {copy.languages.items.map((l) => (
              <div key={l.lang} className="lang-row">
                <span className="lang-name">{l.lang}</span>
                <span className="lang-level">{l.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
