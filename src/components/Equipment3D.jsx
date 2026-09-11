import { useState, Suspense, lazy } from 'react'

// Three.js viewport streams in after paint — selector + specs render instantly.
const EquipmentViewport = lazy(() => import('./EquipmentViewport'))

function ViewportFallback() {
  return (
    <div className="min-h-[440px] md:h-[540px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#17171b] to-black border border-white/10 flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full border-2 border-white/15 border-t-gym-lime animate-spin" />
      <div className="text-xs font-bold text-zinc-400 tracking-widest">LOADING 3D…</div>
    </div>
  )
}

const EQUIPMENT = [
  {
    id: 'dumbbell', name: 'Hex Dumbbell 20kg', short: 'Dumbbell',
    desc: 'Rubber hex heads, knurled steel grip. Go-to for curls, presses & rows.',
    img: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=400&auto=format&fit=crop',
    weight: '2.5 – 40 kg', material: 'Rubber + Steel', muscles: ['Biceps', 'Chest', 'Shoulders'],
  },
  {
    id: 'barbell', name: 'Olympic Barbell 20kg', short: 'Barbell',
    desc: '220cm Olympic bar, 28mm grip, 300kg rated. For squat, bench & deadlift.',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop',
    weight: '20 kg bar', material: 'Chrome Steel', muscles: ['Legs', 'Back', 'Full Body'],
  },
  {
    id: 'kettlebell', name: 'Kettlebell 16kg', short: 'Kettlebell',
    desc: 'Cast-iron bell with powder-coat grip. Swings, snatches, Turkish get-ups.',
    img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=400&auto=format&fit=crop',
    weight: '8 – 32 kg', material: 'Cast Iron', muscles: ['Glutes', 'Core', 'Cardio'],
  },
  {
    id: 'bench', name: 'Flat + Incline Bench', short: 'Bench',
    desc: 'Adjustable 7-position bench with barbell rack. Chest day essential.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
    weight: '300kg capacity', material: 'Leather + Steel', muscles: ['Chest', 'Triceps', 'Shoulders'],
  },
  {
    id: 'plates', name: 'Bumper Plate Tree', short: 'Plates',
    desc: 'Color-coded Olympic bumpers 5–25kg on a 6-peg storage tree.',
    img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=400&auto=format&fit=crop',
    weight: '5 – 25 kg', material: 'Rubber', muscles: ['Strength', 'Power', 'Olympic'],
  },
  {
    id: 'rack', name: 'Power Rack + Pull-up', short: 'Power Rack',
    desc: 'Full cage with safety arms, pull-up bar & plate storage. Squat safely.',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e38?q=80&w=400&auto=format&fit=crop',
    weight: '400kg rated', material: 'Heavy Steel', muscles: ['Squat', 'Pull-up', 'Press'],
  },
]

export default function Equipment3D() {
  const [tab, setTab] = useState('dumbbell')
  const accent = '#D4FF3F'
  const active = EQUIPMENT.find(t => t.id === tab)

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
                <img src={t.img} alt={t.short} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                {tab === t.id && <div className="absolute inset-0 bg-gym-lime/20" />}
              </div>
              <div className={`text-[11px] md:text-xs font-bold px-2 py-2 text-center ${tab === t.id ? 'bg-gym-lime text-black' : 'bg-gym-card'}`}>{t.short}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-[1fr_420px] gap-6 items-stretch">
          {/* 3D viewport streams in after paint */}
          <Suspense fallback={<ViewportFallback />}>
            <EquipmentViewport tab={tab} accent={accent} activeName={active.name} />
          </Suspense>

          {/* detail panel */}
          <div className="rounded-3xl bg-gym-card border border-gym-border p-6 flex flex-col">
            <div className="relative h-44 rounded-2xl overflow-hidden">
              <img src={active.img} alt={active.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
