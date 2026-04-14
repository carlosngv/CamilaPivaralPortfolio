import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Don't track on touch-only devices
    if (!window.matchMedia('(hover: hover)').matches) return

    const dot = dotRef.current
    const follower = followerRef.current
    if (!dot || !follower) return

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`
      dot.style.top = `${e.clientY}px`
      follower.style.left = `${e.clientX}px`
      follower.style.top = `${e.clientY}px`
    }

    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor" aria-hidden="true" />
      <div ref={followerRef} className="cursor-follower" aria-hidden="true" />
    </>
  )
}
