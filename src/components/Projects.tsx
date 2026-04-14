import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../translations'
import { t } from '../translations'
import Carousel from './Carousel'

// projectImages[projectIndex][sectionIndex] = image filenames
const projectImages: string[][][] = [
  // Yevo
  [
    ['yevo_0.jpeg', 'yevo_1.jpeg', 'yevo_4.jpeg', 'yevo_5.jpeg'],
  ],
  // Green and Fresh GT
  [
    ['green_2.jpeg', 'green_3.jpeg', 'green_4.jpeg', 'green_5.jpeg'],
  ],
  // Construcciones AC
  [
    ['constru_1.jpeg', 'constru_2.jpeg'],
  ],
  // Gestión de Redes Sociales
  [
    ['art_1.jpeg', 'green_1.jpeg', 'yevo_7.jpeg'],
  ],
]

const yevoSocialPosts = [
  { src: 'https://www.tiktok.com/embed/v2/7528160360130546949' },
  { src: 'https://www.tiktok.com/embed/v2/7426769886409411845' },
  { src: 'https://www.tiktok.com/embed/v2/7603827081457339669' },
  { src: 'https://www.instagram.com/p/DUEVWTEDu5D/embed/' },
]

interface ProjectsProps {
  lang: Lang
}

export default function Projects({ lang }: ProjectsProps) {
  const copy = t[lang].projects
  const sectionRef = useRef<HTMLElement>(null)
  const [tiktokIndex, setTiktokIndex] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active') }),
      { threshold: 0.06 }
    )
    section.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="work" className="projects" ref={sectionRef}>
      <p className="section-eyebrow reveal">{copy.eyebrow}</p>

      <div className="project-list">
        {copy.items.map((item, projIdx) => (
          <article key={item.name} className="project-item reveal">
            <div className="project-header">
              <div className="project-meta">
                <span className="project-num">{String(projIdx + 1).padStart(2, '0')}</span>
                <span className="project-sep" aria-hidden="true">—</span>
                <span className="project-cat">{item.category}</span>
              </div>
              <h2 className="project-name">{item.name}</h2>
            </div>

            <div className="project-sections">
              {item.sections.map((section, secIdx) => (
                <div key={secIdx} className="project-section">
                  {section.description && (
                    <p className="project-section-desc">{section.description}</p>
                  )}
                  <Carousel
                    images={projectImages[projIdx][secIdx]}
                    name={item.name}
                    autoPlay
                    interval={3500}
                  />
                </div>
              ))}

              {projIdx === 0 && (
                <div className="project-section">
                  <p className="project-section-title">Redes Sociales</p>
                  <div className="tiktok-carousel">
                    <iframe
                      key={tiktokIndex}
                      src={yevoSocialPosts[tiktokIndex].src}
                      className="tiktok-embed-frame"
                      allowFullScreen
                      allow="encrypted-media"
                      frameBorder="0"
                      title={`Yevo post ${tiktokIndex + 1}`}
                    />
                    <div className="carousel-controls tiktok-carousel-controls">
                      <button
                        className="carousel-btn"
                        onClick={() => setTiktokIndex((i) => (i - 1 + yevoSocialPosts.length) % yevoSocialPosts.length)}
                        aria-label="Post anterior"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>
                      <div className="carousel-dots">
                        {yevoSocialPosts.map((_, i) => (
                          <button
                            key={i}
                            className={`carousel-dot${i === tiktokIndex ? ' active' : ''}`}
                            onClick={() => setTiktokIndex(i)}
                            aria-label={`Post ${i + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        className="carousel-btn"
                        onClick={() => setTiktokIndex((i) => (i + 1) % yevoSocialPosts.length)}
                        aria-label="Post siguiente"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
