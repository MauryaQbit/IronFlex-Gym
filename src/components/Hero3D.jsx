import { Suspense, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Float, Stars, Sparkles, ContactShadows, Grid, OrbitControls,
  Environment, Lightformer, MeshReflectorMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import { motion } from 'framer-motion'
import { Play, MapPin, Star, Hand, ZoomIn, ZoomOut, RefreshCw, Pause, MousePointerClick } from 'lucide-react'
import { IMGS } from '../data/gymData'
import { useInView, useLowPower } from '../hooks/usePerf'

/* Photoreal dumbbell: chrome bar, knurled rubber grip, powder-coated plates
   with clearcoat + env reflections + real cast shadows */
function InteractiveDumbbell({ accent, autoSpin, dragging }) {
  const ref = useRef()
  const glowRef = useRef()
  const { pointer } = useThree()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (autoSpin && !dragging) {
      ref.current.rotation.y += delta * 0.55
    }
    if (!dragging) {
      ref.current.rotation.x += ((pointer.y * 0.32) - ref.current.rotation.x) * 0.055
      ref.current.rotation.z += ((pointer.x * 0.22) - ref.current.rotation.z) * 0.055
    }
    ref.current.position.y = Math.sin(t * 1.2) * 0.16
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.14
    }
  })

  return (
    <group ref={ref}>
      {/* chrome bar */}
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.085, 0.085, 3.25, 32]} />
        <meshPhysicalMaterial color="#e8e8ec" metalness={1} roughness={0.12} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.4} />
      </mesh>
      {/* knurled rubber grip */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.115, 0.115, 0.72, 32]} />
        <meshStandardMaterial color="#101013" metalness={0.15} roughness={0.92} envMapIntensity={0.35} />
      </mesh>
      {/* grip rings */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.115, 0.012, 10, 32]} />
          <meshStandardMaterial color={accent} metalness={0.7} roughness={0.3} emissive={accent} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* powder-coated plates */}
      {[-1.34, -1.07, 1.07, 1.34].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[i % 2 === 0 ? 0.74 : 0.57, i % 2 === 0 ? 0.74 : 0.57, 0.21, 48]} />
            <meshPhysicalMaterial
              color={i % 2 === 0 ? '#17171a' : '#26262b'}
              metalness={0.55} roughness={0.42}
              clearcoat={0.6} clearcoatRoughness={0.35}
              envMapIntensity={0.9}
            />
          </mesh>
          {/* machined rim light */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[i % 2 === 0 ? 0.74 : 0.57, 0.02, 10, 64]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.85} toneMapped={false} />
          </mesh>
          {/* hub cap */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[i < 2 ? -0.11 : 0.11, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
            <meshPhysicalMaterial color="#0c0c0e" metalness={0.8} roughness={0.3} clearcoat={1} />
          </mesh>
        </group>
      ))}
      {/* collars */}
      {[-0.62, 0.62].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.13, 28]} />
          <meshPhysicalMaterial color={accent} metalness={0.9} roughness={0.22} clearcoat={0.8} envMapIntensity={1.2} />
        </mesh>
      ))}
      {/* glow torus */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.28, 0.03, 16, 128]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.62, 0.01, 8, 128]} />
        <meshBasicMaterial color={accent} transparent opacity={0.2} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* Cinematic stage: studio HDRI (local, no network), key+rim lights with
   shadows, mirror gym floor, fog depth, dust sparkles.
   lowPower (phones/weak CPUs): plain floor, fewer particles, no sparkles. */
function Rig({ accent, autoSpin, dragging, lowPower }) {
  return (
    <>
      <fog attach="fog" args={['#070708', 11, 22]} />
      <ambientLight intensity={0.32} />
      {/* key light with real shadows */}
      <directionalLight
        position={[5, 7, 5]} intensity={2.1}
        castShadow shadow-mapSize={lowPower ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-6} shadow-camera-right={6}
        shadow-camera-top={6} shadow-camera-bottom={-6}
        shadow-bias={-0.0002}
      />
      <spotLight position={[-6, 5, 2]} intensity={90} angle={0.55} penumbra={0.85} color={accent} castShadow={!lowPower} />
      <spotLight position={[6, 3.5, -4]} intensity={55} angle={0.6} penumbra={1} color="#FF5A1F" />
      <pointLight position={[0, -0.6, 4.5]} intensity={6} color="#ffffff" />
      <directionalLight position={[-3, 2, -6]} intensity={0.9} color="#9db8ff" />
      <Stars radius={34} depth={24} count={lowPower ? 700 : 1400} factor={3.4} saturation={0.4} fade speed={1} />
      {!lowPower && (
        <Sparkles count={60} scale={[9, 5, 6]} size={2.4} speed={0.5} opacity={0.5} color={accent} position={[0, 1, 0]} />
      )}

      {/* Local studio reflections — no HDR download, renders from these strips */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="circle" intensity={5} position={[0, 5, -9]} scale={3.5} />
          <Lightformer intensity={2.2} position={[-5, 2, -1]} scale={[22, 1.2]} />
          <Lightformer intensity={2.2} position={[5, 2, -1]} scale={[22, 1.2]} />
          <Lightformer color={accent} intensity={1.6} position={[0, 3, 5]} scale={[8, 2]} />
          <Lightformer color="#ffffff" intensity={0.7} position={[0, -3, 0]} scale={[10, 2]} />
        </group>
      </Environment>

      <Float speed={1.8} rotationIntensity={0.22} floatIntensity={0.65}>
        <InteractiveDumbbell accent={accent} autoSpin={autoSpin} dragging={dragging} />
      </Float>

      {/* Gym floor: mirror on desktop, cheap matte on low-power */}
      {lowPower ? (
        <mesh receiveShadow position={[0, -2.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0b0b0d" metalness={0.35} roughness={0.85} />
        </mesh>
      ) : (
        <mesh receiveShadow position={[0, -2.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={18}
            roughness={0.82}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0a0a0c"
            metalness={0.6}
            mirror={0.55}
          />
        </mesh>
      )}
      <ContactShadows position={[0, -2.08, 0]} opacity={0.72} scale={13} blur={2.4} far={5} color="#000000" />
      <Grid
        position={[0, -2.07, 0]}
        args={[16, 16]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#1d1d22"
        sectionSize={2.4}
        sectionThickness={1.1}
        sectionColor={accent}
        fadeDistance={19}
        fadeStrength={2.2}
        infiniteGrid
      />
      <mesh position={[0, -2.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.27, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.65} toneMapped={false} />
      </mesh>
    </>
  )
}

function ControlsBridge({ controlsRef, cameraRef, onStart, onEnd }) {
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.9}
      minDistance={3.6}
      maxDistance={10}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 1.7}
      autoRotate={false}
      onStart={(e) => {
        if (e?.target?.object) cameraRef.current = e.target.object
        onStart?.()
      }}
      onEnd={onEnd}
    />
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
            className="font-display text-5xl md:text-7xl leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            SCULPT YOUR<br />
            <span className="text-gym-lime">BEAST MODE</span><br />
            <span className="text-stroke">IN 3D POWER</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-zinc-300 max-w-md">
            Real equipment. Real trainers. Real results. Grab the 3D dumbbell — drag it, spin it, repaint it — then book your free trial.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#pricing" className="px-8 py-4 rounded-full bg-gym-lime text-black font-extrabold hover:scale-105 transition shadow-[0_0_30px_rgba(212,255,63,0.4)]">START FREE TRIAL 💪</a>
            <a href="#equipment" className="px-8 py-4 rounded-full glass border border-white/20 font-bold flex items-center gap-2 hover:border-gym-lime"><Play size={18} /> 3D GYM TOUR</a>
          </div>
          <div className="mt-10 grid grid-cols-3 max-w-md gap-4">
            {[
              ['5000+', 'Sq Ft Area'], ['25+', 'Expert Coaches'], ['4.9', 'Google Rating'],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl p-4 text-center border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
                <div className="font-display text-2xl text-gym-lime">{n}</div>
                <div className="text-xs text-zinc-400">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
            <MapPin size={14} /> Sector 21, Main Road • Open 5 AM - 11 PM
            <span className="flex items-center gap-1 ml-3 text-yellow-400"><Star size={12} fill="currentColor" /> 4.9 (2k reviews)</span>
          </div>
        </div>

        {/* PHOTOREAL 3D canvas */}
        <motion.div ref={viewRef} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          onDoubleClick={() => setAutoSpin((s) => !s)}
          className="relative h-[480px] md:h-[560px] rounded-3xl overflow-hidden border border-white/10 glass shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg z-20 pointer-events-none" style={{ borderColor: accent }} />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg z-20 pointer-events-none" style={{ borderColor: accent }} />
          <div className="absolute bottom-20 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg z-20 pointer-events-none" style={{ borderColor: accent }} />
          <div className="absolute bottom-20 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-lg z-20 pointer-events-none" style={{ borderColor: accent }} />

          <Canvas
            shadows
            dpr={[1, 1.5]}
            frameloop={inView ? 'always' : 'never'}
            camera={{ position: [0, 0.4, 6.4], fov: 48 }}
            gl={{ antialias: true, toneMappingExposure: 1.12 }}
            onCreated={({ camera, gl }) => {
              cameraRef.current = camera
              gl.shadowMap.enabled = true
              gl.shadowMap.type = gl.PCFSoftShadowMap
            }}
            onPointerMissed={() => setDragging(false)}
          >
            <Suspense fallback={null}>
              <Rig accent={accent} autoSpin={autoSpin && inView} dragging={dragging} lowPower={lowPower} />
              <ControlsBridge key={resetKey} controlsRef={controlsRef} cameraRef={cameraRef} onStart={handleStart} onEnd={handleEnd} />
              {/* cinematic grade — desktop only */}
              {!lowPower && (
                <EffectComposer multisampling={0}>
                  <SMAA />
                  <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.2} mipmapBlur radius={0.7} />
                  <Vignette eskil={false} offset={0.22} darkness={0.78} />
                </EffectComposer>
              )}
            </Suspense>
          </Canvas>

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

          <img src={IMGS.hero2} alt="training"
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
                <button onClick={() => zoom('in')} title="Zoom in" className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:border-gym-lime hover:text-gym-lime transition">
                  <ZoomIn size={15} />
                </button>
                <button onClick={() => zoom('out')} title="Zoom out" className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:border-gym-lime hover:text-gym-lime transition">
                  <ZoomOut size={15} />
                </button>
                <button onClick={() => setAutoSpin(!autoSpin)} title="Toggle idle spin"
                  className={`h-8 px-3 rounded-full text-[11px] font-black flex items-center gap-1.5 border transition ${autoSpin ? 'bg-gym-lime text-black border-gym-lime' : 'bg-white/10 border-white/10 hover:border-gym-lime'}`}>
                  {autoSpin ? <><Pause size={13} /> SPIN ON</> : <><Play size={13} /> SPIN OFF</>}
                </button>
                <button onClick={resetView} title="Reset view" className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:rotate-180 hover:border-gym-lime transition-all duration-500">
                  <RefreshCw size={15} />
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
