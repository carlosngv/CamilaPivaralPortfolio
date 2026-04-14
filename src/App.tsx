import { useState, useEffect } from 'react'
import type { Lang } from './translations'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Footer from './components/Footer'
import './App.css'

type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getInitialLang(): Lang {
  const saved = localStorage.getItem('lang') as Lang | null
  return saved === 'en' ? 'en' : 'es'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [lang, setLang] = useState<Lang>(getInitialLang)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const toggleLang = () => setLang((l) => (l === 'es' ? 'en' : 'es'))

  return (
    <>
      <Cursor />
      <Nav lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />
      <main>
        <Hero lang={lang} />
        <Work lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
