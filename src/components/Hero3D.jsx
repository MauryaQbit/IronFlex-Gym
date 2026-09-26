import { Suspense, lazy, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, MapPin, Star, Hand, ZoomIn, ZoomOut, RefreshCw, Pause, MousePointerClick } from 'lucide-react'
import { IMGS } from '../data/gymData'
import { useInView, useLowPower } from '../hooks/usePerf'

// Three.js loads AFTER first paint — headline + CTAs render instantly.
const HeroCanvas = lazy(() => import('./HeroCanvas'))

function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#17171b] to-black">
      <div className="w-12 h-12 rounded-full border-2 border-white/15 border-t-gym-lime animate-spin" />
      <div className="text-xs font-bold text-zinc-400 tracking-widest">LOADING 3D…</div>
    </div>
  )
}

export default function Hero3D() {
  const accent = '#D4FF3F'
  const [autoSpin, setAutoSpin] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [spins, setSpins] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const controlsRef = useRef()
  const cameraRef = useRef()
  const [viewRef, inView] = useInView()
  const lowPower = useLowPower()

  const handleStart = useCallback(() => {
    setDragging(true)
    if (!interacted) setInteracted(true)
  }, [interacted])

  const handleEnd = useCallback(() => {
    setDragging(false)
    setSpins((s) => s + 1)
  }, [])

  const zoom = (dir) => {
    const cam = cameraRef.current || controlsRef.current?.object
    if (!cam) return
    cam.position.multiplyScalar(dir === 'in' ? 0.86 : 1.16)
    const len = cam.position.length()
    if (len < 3.6) cam.position.setLength(3.6)
    if (len > 10) cam.position.setLength(10)
  }

  const resetView = () => {
    setResetKey((k) => k + 1)
    setSpins(0)
    setInteracted(false)
  }

  return (
    <header id="top" className="relative min-h-screen flex items-center overflow-hidden">
      {/* real photo bg — graded like a movie still */}
      <div className="absolute inset-0">
        <img
          src={IMGS.hero} alt="Real gym"
          className="w-full h-full object-cover"
          fetchPriority="high"
          style={{ filter: 'contrast(1.12) saturate(1.15) brightness(0.92)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-transparent to-black/60" />
        {/* film grain */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />
        {/* cinematic vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-16 grid lg:grid-cols-2 gap-10 items-center w-full">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" /> LIVE • 2,400+ MEMBERS TRAINING
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            SCULPT YOUR<br />
            <span className="text-gym-lime">BEAST MODE</span><br />
            <span className="text-stroke">IN 3D POWER</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-zinc-300 max-w-md">
            Real equipment. Real trainers. Real results. Grab the 3D dumbbell — drag it, spin it — then book your free trial.
          </motion.p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <a href="#pricing" className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gym-lime text-black font-extrabold hover:scale-105 transition shadow-[0_0_30px_rgba(212,255,63,0.4)] text-sm sm:text-base min-h-[48px] flex items-center">START FREE TRIAL 💪</a>
            <a href="#equipment" className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full glass border border-white/20 font-bold flex items-center gap-2 hover:border-gym-lime text-sm sm:text-base min-h-[48px]"><Play size={18} /> 3D GYM TOUR</a>
          </div>
          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4">
            {[
              ['5000+', 'Sq Ft Area'], ['25+', 'Expert Coaches'], ['4.9', 'Google Rating'],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl p-3 sm:p-4 text-center border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
                <div className="font-display text-xl sm:text-2xl text-gym-lime">{n}</div>
                <div className="text-[10px] sm:text-xs text-zinc-400">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
            <MapPin size={14} /> Sector 21, Main Road • Open 5 AM - 11 PM
            <span className="flex items-center gap-1 ml-3 text-yellow-400"><Star size={12} fill="currentColor" /> 4.9 (2k reviews)</span>
          </div>
        </div>

        {/* PHOTOREAL 3D canvas — streams in after paint */}
        <motion.div ref={viewRef} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          onDoubleClick={() => setAutoSpin((s) => !s)}
          className="relative h-[320px] sm:h-[400px] md:h-[560px] rounded-3xl overflow-hidden border border-white/10 glass shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg z-20 pointer-events-none" style={{ borderColor: accent }} />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg z-20 pointer-events-none" style={{ borderColor: accent }} />
          <div className="absolute bottom-20 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg z-20 pointer-events-none" style={{ borderColor: accent }} />
          <div className="absolute bottom-20 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-lg z-20 pointer-events-none" style={{ borderColor: accent }} />

          <Suspense fallback={<CanvasFallback />}>
            <HeroCanvas
              accent={accent}
              autoSpin={autoSpin}
              dragging={dragging}
              inView={inView}
              lowPower={lowPower}
              controlsRef={controlsRef}
              cameraRef={cameraRef}
              resetKey={resetKey}
              onStart={handleStart}
              onEnd={handleEnd}
              onPointerMissed={() => setDragging(false)}
            />
          </Suspense>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-none">
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-black/70 border font-bold backdrop-blur flex items-center gap-1.5"
              style={{ borderColor: accent + '66', color: accent }}>
              <span className={`w-1.5 h-1.5 rounded-full ${dragging ? 'bg-orange-400 animate-ping' : 'bg-current animate-pulse'}`} />
              {dragging ? 'GRABBED — YOU CONTROL IT' : 'LIVE 3D • REAL-TIME'}
            </span>
            <span className="hidden sm:inline text-[11px] px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur font-bold">
              🌀 Spins: {spins}
            </span>
          </div>

          <img src={IMGS.hero2} alt="training" loading="lazy" decoding="async"
            className="absolute top-12 left-4 w-20 h-20 rounded-2xl object-cover border-2 shadow-xl animate-float z-20 pointer-events-none"
            style={{ borderColor: accent, filter: 'contrast(1.1) saturate(1.15)' }} />

          {!interacted && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/70 border backdrop-blur-md text-sm font-bold animate-bounce" style={{ borderColor: accent }}>
                <Hand size={18} style={{ color: accent }} />
                <span>Grab & drag to spin me!</span>
                <MousePointerClick size={16} className="text-zinc-400" />
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 z-20">
            <div className="rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 px-3 py-2.5 flex flex-wrap items-center gap-2">
              <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition ${interacted ? 'border-green-500/50 text-green-300' : 'border-white/15 text-zinc-200'}`}>
                <span className="text-sm">{interacted ? '✓' : '🖱️'}</span>
                {interacted ? 'Nice! Scroll = zoom' : 'Drag = rotate • Scroll = zoom'}
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <button onClick={() => zoom('in')} title="Zoom in" aria-label="Zoom in" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:border-gym-lime hover:text-gym-lime transition">
                  <ZoomIn size={16} />
                </button>
                <button onClick={() => zoom('out')} title="Zoom out" aria-label="Zoom out" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:border-gym-lime hover:text-gym-lime transition">
                  <ZoomOut size={16} />
                </button>
                <button onClick={() => setAutoSpin(!autoSpin)} title="Toggle idle spin" aria-label="Toggle spin"
                  className={`h-10 px-3 rounded-full text-[11px] font-black flex items-center gap-1.5 border transition ${autoSpin ? 'bg-gym-lime text-black border-gym-lime' : 'bg-white/10 border-white/10 hover:border-gym-lime'}`}>
                  {autoSpin ? <><Pause size={13} /> SPIN ON</> : <><Play size={13} /> SPIN OFF</>}
                </button>
                <button onClick={resetView} title="Reset view" aria-label="Reset view" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:rotate-180 hover:border-gym-lime transition-all duration-500">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            <div className="mt-1.5 flex justify-between items-center px-1">
              <span className="text-[10px] text-zinc-500">Touch: 1-finger drag • pinch to zoom • double-tap toggles spin</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gym-lime text-black font-black">REAL GYM • 3D VIEW</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gym-lime text-black py-3 overflow-hidden -rotate-1 scale-105">
        <div className="flex whitespace-nowrap animate-marquee font-display text-lg gap-8">
          {Array(2).fill('STRENGTH • CARDIO • CROSSFIT • YOGA • BOXING • PERSONAL TRAINING • ').map((t, i) => (
            <span key={i}>{t.repeat(3)}</span>
          ))}
        </div>
      </div>
    </header>
  )
}
