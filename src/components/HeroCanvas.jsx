import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Float, Stars, Sparkles, ContactShadows, Grid, OrbitControls,
  Environment, Lightformer, MeshReflectorMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'

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

function ControlsBridge({ controlsRef, cameraRef, onStart, onEnd, resetKey }) {
  return (
    <OrbitControls
      key={resetKey}
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

// Lazy-loaded viewport: keeps three.js out of the first-paint bundle.
export default function HeroCanvas({
  accent, autoSpin, dragging, inView, lowPower,
  controlsRef, cameraRef, resetKey, onStart, onEnd, onPointerMissed,
}) {
  return (
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
      onPointerMissed={onPointerMissed}
    >
      <Suspense fallback={null}>
        <Rig accent={accent} autoSpin={autoSpin && inView} dragging={dragging} lowPower={lowPower} />
        <ControlsBridge controlsRef={controlsRef} cameraRef={cameraRef} onStart={onStart} onEnd={onEnd} resetKey={resetKey} />
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
  )
}
