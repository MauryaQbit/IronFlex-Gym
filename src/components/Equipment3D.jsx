import { useState, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls, Float, ContactShadows, Grid, Sparkles,
  Environment, Lightformer, MeshReflectorMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import { useInView, useLowPower } from '../hooks/usePerf'

// ---------- MODELS (detailed, performant primitives) ----------

function DumbbellModel({ accent = '#D4FF3F' }) {
  const ref = useRef()
  useFrame((s) => { ref.current.rotation.y = s.clock.elapsedTime * 0.5 })
  return (
    <group ref={ref}>
      {/* knurled bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 2.7, 24]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.25} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.7, 24]} />
        <meshStandardMaterial color="#18181b" metalness={0.6} roughness={0.6} />
      </mesh>
      {[-1.25, -1.0, -0.78, 0.78, 1.0, 1.25].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.72 - Math.abs(x) * 0.08, 0.72 - Math.abs(x) * 0.08, 0.2, 32]} />
            <meshStandardMaterial color={i % 2 ? '#27272a' : '#131316'} metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
            <torusGeometry args={[0.72 - Math.abs(x) * 0.08, 0.02, 8, 40]} />
            <meshStandardMaterial color={accent} metalness={0.8} roughness={0.2} emissive={accent} emissiveIntensity={0.35} />
          </mesh>
        </group>
      ))}
      {/* collars */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 20]} />
          <meshStandardMaterial color={accent} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function BarbellModel({ accent = '#D4FF3F' }) {
  const ref = useRef()
  useFrame((s) => { ref.current.rotation.y = s.clock.elapsedTime * 0.35 })
  return (
    <group ref={ref} scale={0.85}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 5.6, 20]} />
        <meshStandardMaterial color="#e4e4e7" metalness={1} roughness={0.15} />
      </mesh>
      {/* sleeves */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.9, 20]} />
          <meshStandardMaterial color="#71717a" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}
      {[-2.35, -2.1, -1.88, 1.88, 2.1, 2.35].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.85 - Math.abs(i - 2.5) * 0.07, 0.85 - Math.abs(i - 2.5) * 0.07, 0.18, 32]} />
          <meshStandardMaterial color={i < 3 ? '#FF5A1F' : accent} metalness={0.65} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function KettlebellModel({ accent = '#D4FF3F' }) {
  const ref = useRef()
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.6
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 1.4) * 0.12
  })
  return (
    <group ref={ref}>
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.85, 40, 40]} />
        <meshStandardMaterial color="#1c1c1f" metalness={0.88} roughness={0.28} />
      </mesh>
      {/* weight emboss ring */}
      <mesh position={[0, -0.25, 0.82]}>
        <torusGeometry args={[0.32, 0.035, 12, 40]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.52, 0.13, 18, 44]} />
        <meshStandardMaterial color="#2e2e33" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.52, 0.035, 10, 44]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
      </mesh>
      {/* base shadow disc */}
      <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function BenchModel({ accent = '#D4FF3F' }) {
  const ref = useRef()
  useFrame((s) => { ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.4 })
  return (
    <group ref={ref} position={[0, -0.6, 0]}>
      {/* pad */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2.8, 0.22, 0.85]} />
        <meshStandardMaterial color="#131316" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.87, 0]}>
        <boxGeometry args={[2.82, 0.03, 0.87]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      {/* legs */}
      {[-1.1, 1.1].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[0.14, 0.65, 0.14]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.7, 0.08, 0.9]} />
            <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* barbell on rack */}
      <mesh position={[0, 1.35, -0.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3.4, 16]} />
        <meshStandardMaterial color="#e4e4e7" metalness={1} roughness={0.15} />
      </mesh>
      {[-1.45, 1.45].map((x, i) => (
        <mesh key={i} position={[x, 1.35, -0.55]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.14, 28]} />
          <meshStandardMaterial color={accent} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 0.85, -0.55]}>
          <boxGeometry args={[0.1, 1.0, 0.1]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function PlateTreeModel({ accent = '#D4FF3F' }) {
  const ref = useRef()
  useFrame((s) => { ref.current.rotation.y = s.clock.elapsedTime * 0.4 })
  return (
    <group ref={ref}>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.5, 0.65, 0.25, 24]} />
        <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 2.2, 16]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.2} />
      </mesh>
      {[0.45, 0.05, -0.35].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.45, 0, 0]}>
            <cylinderGeometry args={[0.55 - i * 0.1, 0.55 - i * 0.1, 0.32, 32]} />
            <meshStandardMaterial color={i === 1 ? accent : '#1c1c1f'} metalness={0.8} roughness={0.3} emissive={i === 1 ? accent : '#000'} emissiveIntensity={i === 1 ? 0.25 : 0} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.45, 0, 0]}>
            <cylinderGeometry args={[0.55 - i * 0.1, 0.55 - i * 0.1, 0.32, 32]} />
            <meshStandardMaterial color={i === 1 ? accent : '#1c1c1f'} metalness={0.8} roughness={0.3} emissive={i === 1 ? accent : '#000'} emissiveIntensity={i === 1 ? 0.25 : 0} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.45, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.1, 12]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.45, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.1, 12]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function RackModel({ accent = '#D4FF3F' }) {
  const ref = useRef()
  useFrame((s) => { ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.25) * 0.5 })
  const posts = [[-1.2, -0.8], [1.2, -0.8], [-1.2, 0.8], [1.2, 0.8]]
  return (
    <group ref={ref} position={[0, -1, 0]}>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 1.1, z]}>
          <boxGeometry args={[0.14, 2.2, 0.14]} />
          <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
      {/* top frame */}
      {[-0.8, 0.8].map((z, i) => (
        <mesh key={i} position={[0, 2.2, z]}>
          <boxGeometry args={[2.55, 0.12, 0.12]} />
          <meshStandardMaterial color={accent} metalness={0.8} roughness={0.25} emissive={accent} emissiveIntensity={0.3} />
        </mesh>
      ))}
      {[ -1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 2.2, 0]}>
          <boxGeometry args={[0.12, 0.12, 1.72]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
      {/* pull-up bar */}
      <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 14]} />
        <meshStandardMaterial color="#e4e4e7" metalness={1} roughness={0.2} />
      </mesh>
      {/* barbell resting */}
      <mesh position={[0, 1.5, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 2.9, 14]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.2} />
      </mesh>
      {[-1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 1.5, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.16, 26]} />
          <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
      {/* base */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[2.8, 0.06, 2.0]} />
        <meshStandardMaterial color="#131316" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Stage({ children, accent = '#D4FF3F', lowPower = false }) {
  return (
    <>
      <fog attach="fog" args={['#0b0b0d', 12, 24]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 4]} intensity={2.0}
        castShadow shadow-mapSize={lowPower ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-6} shadow-camera-right={6}
        shadow-camera-top={6} shadow-camera-bottom={-6}
        shadow-bias={-0.0002}
      />
      <spotLight position={[-5, 6, 1]} intensity={80} angle={0.55} penumbra={0.85} color={accent} castShadow={!lowPower} />
      <spotLight position={[6, 4, -4]} intensity={45} angle={0.6} penumbra={1} color="#FF5A1F" />
      <pointLight position={[0, -0.5, 4.5]} intensity={5} color="#ffffff" />
      {!lowPower && (
        <Sparkles count={50} scale={[9, 4.5, 6]} size={2.4} speed={0.5} opacity={0.5} color={accent} position={[0, 1.5, 0]} />
      )}

      {/* Local studio reflections — no network HDR needed */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="circle" intensity={5} position={[0, 5, -9]} scale={3.5} />
          <Lightformer intensity={2} position={[-5, 2, -1]} scale={[22, 1.2]} />
          <Lightformer intensity={2} position={[5, 2, -1]} scale={[22, 1.2]} />
          <Lightformer color={accent} intensity={1.5} position={[0, 3, 5]} scale={[8, 2]} />
        </group>
      </Environment>

      <Float speed={1.6} rotationIntensity={0.22} floatIntensity={0.55}>
        {children}
      </Float>

      {/* Gym floor: mirror on desktop, cheap matte on low-power */}
      {lowPower ? (
        <mesh receiveShadow position={[0, -1.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[22, 22]} />
          <meshStandardMaterial color="#0a0a0c" metalness={0.35} roughness={0.85} />
        </mesh>
      ) : (
        <mesh receiveShadow position={[0, -1.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[22, 22]} />
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={16}
            roughness={0.84}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0a0a0c"
            metalness={0.55}
            mirror={0.5}
          />
        </mesh>
      )}
      <ContactShadows position={[0, -1.62, 0]} opacity={0.62} scale={12} blur={2.2} far={4} color="#000000" />
      <Grid
        position={[0, -1.61, 0]}
        args={[14, 14]}
        cellSize={0.55}
        cellThickness={0.6}
        cellColor="#232329"
        sectionSize={2.2}
        sectionThickness={1.1}
        sectionColor={accent}
        fadeDistance={17}
        fadeStrength={2.4}
        infiniteGrid
      />
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.22, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.7, 2.73, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.16} toneMapped={false} />
      </mesh>
    </>
  )
}

const EQUIPMENT = [
  {
    id: 'dumbbell', name: 'Hex Dumbbell 20kg', short: 'Dumbbell',
    desc: 'Rubber hex heads, knurled steel grip. Go-to for curls, presses & rows.',
    img: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=400&auto=format&fit=crop',
    weight: '2.5 – 40 kg', material: 'Rubber + Steel', muscles: ['Biceps', 'Chest', 'Shoulders'],
    colors: ['#D4FF3F', '#FF5A1F', '#38bdf8'],
  },
  {
    id: 'barbell', name: 'Olympic Barbell 20kg', short: 'Barbell',
    desc: '220cm Olympic bar, 28mm grip, 300kg rated. For squat, bench & deadlift.',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop',
    weight: '20 kg bar', material: 'Chrome Steel', muscles: ['Legs', 'Back', 'Full Body'],
    colors: ['#D4FF3F', '#FF5A1F', '#e4e4e7'],
  },
  {
    id: 'kettlebell', name: 'Kettlebell 16kg', short: 'Kettlebell',
    desc: 'Cast-iron bell with powder-coat grip. Swings, snatches, Turkish get-ups.',
    img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=400&auto=format&fit=crop',
    weight: '8 – 32 kg', material: 'Cast Iron', muscles: ['Glutes', 'Core', 'Cardio'],
    colors: ['#D4FF3F', '#FF5A1F', '#a78bfa'],
  },
  {
    id: 'bench', name: 'Flat + Incline Bench', short: 'Bench',
    desc: 'Adjustable 7-position bench with barbell rack. Chest day essential.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
    weight: '300kg capacity', material: 'Leather + Steel', muscles: ['Chest', 'Triceps', 'Shoulders'],
    colors: ['#D4FF3F', '#FF5A1F', '#f472b6'],
  },
  {
    id: 'plates', name: 'Bumper Plate Tree', short: 'Plates',
    desc: 'Color-coded Olympic bumpers 5–25kg on a 6-peg storage tree.',
    img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=400&auto=format&fit=crop',
    weight: '5 – 25 kg', material: 'Rubber', muscles: ['Strength', 'Power', 'Olympic'],
    colors: ['#D4FF3F', '#FF5A1F', '#38bdf8'],
  },
  {
    id: 'rack', name: 'Power Rack + Pull-up', short: 'Power Rack',
    desc: 'Full cage with safety arms, pull-up bar & plate storage. Squat safely.',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e38?q=80&w=400&auto=format&fit=crop',
    weight: '400kg rated', material: 'Heavy Steel', muscles: ['Squat', 'Pull-up', 'Press'],
    colors: ['#D4FF3F', '#FF5A1F', '#22c55e'],
  },
]

export default function Equipment3D() {
  const [tab, setTab] = useState('dumbbell')
  const accent = '#D4FF3F'
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewRef, inView] = useInView()
  const lowPower = useLowPower()
  const active = EQUIPMENT.find(t => t.id === tab)

  const renderModel = () => {
    switch (tab) {
      case 'dumbbell': return <DumbbellModel accent={accent} />
      case 'barbell': return <BarbellModel accent={accent} />
      case 'kettlebell': return <KettlebellModel accent={accent} />
      case 'bench': return <BenchModel accent={accent} />
      case 'plates': return <PlateTreeModel accent={accent} />
      case 'rack': return <RackModel accent={accent} />
      default: return <DumbbellModel accent={accent} />
    }
  }

  return (
    <section id="equipment" className="py-20 bg-gym-dark border-y border-gym-border relative overflow-hidden">
      {/* bg glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gym-lime/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-gym-lime/10 border border-gym-lime/30 text-gym-lime tracking-widest">
            <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" /> LIVE WEBGL • 6 MACHINES • TRUE 3D
          </div>
          <h2 className="font-display text-4xl md:text-6xl mt-4">STEP INSIDE<br />THE <span className="text-gym-lime">IRON ZONE</span></h2>
          <p className="text-zinc-400 mt-4 text-sm">Not photos — live 3D models. Pick a machine, drag to rotate, scroll to zoom. Same iron you'll lift in our gym.</p>
        </div>

        {/* equipment selector */}
        <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-3">
          {EQUIPMENT.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`group rounded-2xl overflow-hidden border text-left transition-all hover:-translate-y-1 ${tab === t.id ? 'border-gym-lime shadow-[0_0_25px_rgba(212,255,63,0.25)]' : 'border-white/10 hover:border-white/30'}`}>
              <div className="h-20 md:h-24 overflow-hidden relative">
                <img src={t.img} alt={t.short} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                {tab === t.id && <div className="absolute inset-0 bg-gym-lime/20" />}
              </div>
              <div className={`text-[11px] md:text-xs font-bold px-2 py-2 text-center ${tab === t.id ? 'bg-gym-lime text-black' : 'bg-gym-card'}`}>{t.short}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-[1fr_420px] gap-6 items-stretch">
          {/* 3D viewport — pauses when scrolled away */}
          <div ref={viewRef} className="min-h-[440px] md:h-[540px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#17171b] via-black to-black border border-white/10 relative">
            <Canvas
              shadows
              dpr={[1, 1.5]}
              frameloop={inView ? 'always' : 'never'}
              camera={{ position: [0, 0.8, 6.2], fov: 42 }}
              gl={{ antialias: true, toneMappingExposure: 1.12 }}
              onCreated={({ gl }) => {
                gl.shadowMap.enabled = true
                gl.shadowMap.type = gl.PCFSoftShadowMap
              }}
            >
              <Suspense fallback={null}>
                <Stage accent={accent} lowPower={lowPower}>{renderModel()}</Stage>
                <OrbitControls enableZoom enableDamping dampingFactor={0.08} enablePan={false} autoRotate={autoRotate && inView} autoRotateSpeed={1.4} minDistance={3.2} maxDistance={10} maxPolarAngle={Math.PI / 2 + 0.15} />
                {!lowPower && (
                  <EffectComposer multisampling={0}>
                    <SMAA />
                    <Bloom intensity={0.5} luminanceThreshold={0.72} luminanceSmoothing={0.2} mipmapBlur radius={0.7} />
                    <Vignette eskil={false} offset={0.22} darkness={0.76} />
                  </EffectComposer>
                )}
              </Suspense>
            </Canvas>

            {/* overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-[11px] px-3 py-1.5 rounded-full bg-black/70 border border-gym-lime/40 text-gym-lime font-bold backdrop-blur">● LIVE 3D</span>
              <span className="text-[11px] px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur font-bold">{active.name}</span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => setAutoRotate(!autoRotate)}
                className={`text-[11px] px-3 py-1.5 rounded-full font-bold border backdrop-blur transition ${autoRotate ? 'bg-gym-lime text-black border-gym-lime' : 'bg-black/60 border-white/15 hover:border-gym-lime'}`}>
                {autoRotate ? '⏸ Pause spin' : '▶ Auto-spin'}
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 whitespace-nowrap">
              🖱️ Drag to rotate • Scroll to zoom • Right-drag disabled
            </div>
          </div>

          {/* detail panel */}
          <div className="rounded-3xl bg-gym-card border border-gym-border p-6 flex flex-col">
            <div className="relative h-44 rounded-2xl overflow-hidden">
              <img src={active.img} alt={active.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="text-[11px] font-bold text-gym-lime tracking-widest">NOW VIEWING</div>
                  <div className="font-display text-2xl leading-none">{active.name}</div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-black" style={{ background: accent }}>3D</div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mt-4">{active.desc}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                <div className="text-[11px] text-zinc-500 font-bold">WEIGHT RANGE</div>
                <div className="font-bold mt-0.5">{active.weight}</div>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                <div className="text-[11px] text-zinc-500 font-bold">MATERIAL</div>
                <div className="font-bold mt-0.5">{active.material}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-[11px] text-zinc-500 font-bold mb-2">MUSCLES WORKED</div>
              <div className="flex flex-wrap gap-2">
                {active.muscles.map(m => (
                  <span key={m} className="text-xs px-3 py-1.5 rounded-full font-bold border" style={{ borderColor: accent + '66', background: accent + '14' }}>{m}</span>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ['50+', 'Machines'],
                ['360°', 'View'],
                ['PRO', 'Grade'],
              ].map(([n, l]) => (
                <div key={l} className="rounded-xl bg-black/40 border border-white/10 p-2.5">
                  <div className="font-display text-lg" style={{ color: accent }}>{n}</div>
                  <div className="text-[11px] text-zinc-500">{l}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-5 grid grid-cols-2 gap-3">
              <a href="#schedule" className="text-center py-3 rounded-full font-bold text-sm text-black hover:scale-[1.03] transition" style={{ background: accent }}>
                Try in Gym 💪
              </a>
              <a href="#trainers" className="text-center py-3 rounded-full font-bold text-sm bg-white/10 border border-white/15 hover:border-white/40 transition">
                Ask Coach
              </a>
            </div>
          </div>
        </div>

        {/* bottom strip */}
        <div className="mt-6 rounded-2xl border border-gym-lime/25 bg-gym-lime/5 px-5 py-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="font-display text-lg">5000 SQ FT • 25+ COACHES • OPEN 5AM–11PM</span>
          <span className="text-zinc-400 text-xs">Come touch the real iron — first trial free. This 3D tour is 1:1 with our floor.</span>
          <a href="#pricing" className="ml-auto px-5 py-2 rounded-full bg-gym-lime text-black text-xs font-black hover:scale-105 transition">BOOK FREE TRIAL →</a>
        </div>
      </div>
    </section>
  )
}
