import { useState } from 'react'
import { gallery } from '../data/gymData'

export default function Transformations() {
  const [slider, setSlider] = useState(50)
  return (
    <section id="results" className="py-20 max-w-7xl mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-gym-lime text-sm font-bold tracking-widest">🔄 REAL TRANSFORMATIONS</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2">DRAG TO SEE<br /><span className="text-gym-lime">BEFORE / AFTER</span></h2>
          <p className="text-zinc-400 text-sm mt-4 max-w-md">Rahul lost 22kg in 6 months with Strength + HIIT + diet. Interactive slider - drag the handle.</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[['22kg', 'Fat Lost'], ['6 mo', 'Duration'], ['96%', 'Success']].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-gym-card border border-gym-border p-4">
                <div className="font-display text-2xl text-gym-lime">{n}</div>
                <div className="text-xs text-zinc-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="relative h-[420px] rounded-3xl overflow-hidden border border-white/10 select-none">
            <img src="https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=1000&auto=format&fit=crop" alt="after" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${slider}%` }}>
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop"
                alt="before" className="absolute inset-0 h-full object-cover grayscale" style={{ width: '100vw', maxWidth: '640px' }} />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="absolute top-0 bottom-0 bg-gym-lime w-1" style={{ left: `${slider}%` }}>
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gym-lime text-black font-black flex items-center justify-center shadow-xl">↔</div>
            </div>
            <input type="range" min={0} max={100} value={slider} onChange={e => setSlider(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-ew-resize" />
            <div className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-black/70">BEFORE</div>
            <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-gym-lime text-black font-bold">AFTER</div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-2">
            {gallery.slice(0, 8).map((g, i) => (
              <img key={i} src={g} loading="lazy" alt="gym gallery" className="h-14 sm:h-20 w-full object-cover rounded-xl border border-white/10 hover:border-gym-lime hover:scale-105 transition" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
