import { motion } from 'framer-motion'
import { Flame, ArrowUpRight } from 'lucide-react'
import { programs } from '../data/gymData'

export default function Programs() {
  return (
    <section id="programs" className="py-20 max-w-7xl mx-auto px-4">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-gym-lime text-sm font-bold tracking-widest">🔥 TRAIN YOUR WAY</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2">PROGRAMS WITH <span className="text-gym-lime">REAL RESULTS</span></h2>
        </div>
        <p className="text-zinc-400 max-w-sm text-sm">All programs include diet chart + progress tracking.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="card-3d group rounded-3xl overflow-hidden bg-gym-card border border-gym-border img-zoom">
            <div className="relative h-56 overflow-hidden">
              <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute top-3 left-3 text-[11px] px-3 py-1 rounded-full bg-gym-lime text-black font-bold">{p.level}</span>
              <span className="absolute top-3 right-3 text-[11px] px-3 py-1 rounded-full bg-black/70 border border-white/20 flex items-center gap-1"><Flame size={12} className="text-orange-500" /> {p.calories}</span>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl group-hover:text-gym-lime transition">{p.title}</h3>
              <p className="text-sm text-zinc-400 mt-2">{p.desc}</p>
              <a href="#schedule" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gym-lime">Book Free Demo <ArrowUpRight size={16} /></a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
