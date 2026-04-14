import type { Lang } from '../translations'
import { t } from '../translations'

function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

interface NavProps {
  lang: Lang
  theme: 'dark' | 'light'
  onToggleLang: () => void
  onToggleTheme: () => void
}

export default function Nav({ lang, theme, onToggleLang, onToggleTheme }: NavProps) {
  const copy = t[lang].nav

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="nav" aria-label="Navegación principal">
      <div className="nav-container">
        <a href="#" className="nav-logo" aria-label="Inicio">CAMILA PIVARAL</a>

        <div className="nav-right">
          <div className="nav-links">
            <a href="#work"    className="nav-link" onClick={(e) => scrollTo(e, 'work')}>{copy.work}</a>
            <a href="#about"   className="nav-link" onClick={(e) => scrollTo(e, 'about')}>{copy.about}</a>
            <a href="#contact" className="nav-link" onClick={(e) => scrollTo(e, 'contact')}>{copy.contact}</a>
          </div>

          <button
            className="nav-btn"
            onClick={onToggleLang}
            aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          <button
            className="nav-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </div>
    </nav>
  )
}
