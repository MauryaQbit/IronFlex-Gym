import { useEffect, useRef, useState } from 'react'

// True while the attached element is in (or near) the viewport.
// Use to pause 3D render loops when a canvas is scrolled away.
export function useInView(rootMargin = '300px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(true) // assume visible until observer says otherwise
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const ob = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    ob.observe(el)
    return () => ob.disconnect()
  }, [rootMargin])
  return [ref, inView]
}

// True on phones / weak CPUs / data-saver: 3D drops bloom + mirror floor.
export function useLowPower() {
  const [low, setLow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    const calc = () => {
      const save = navigator.connection?.saveData === true
      const cores = navigator.hardwareConcurrency || 8
      setLow(mq.matches || save || cores <= 4)
    }
    calc()
    mq.addEventListener?.('change', calc)
    return () => mq.removeEventListener?.('change', calc)
  }, [])
  return low
}
