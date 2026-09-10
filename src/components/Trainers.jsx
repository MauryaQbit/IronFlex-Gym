import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { trainers } from '../data/gymData'

export default function Trainers({ onBookTrainer }) {
  return (
    <section id="trainers" className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center">
        <div className="text-gym-lime text-sm font-bold tracking-widest">💪 REAL COACHES</div>
        <h2 className="font-display text-4xl md:text-5xl mt-2">MEET YOUR <span className="text-gym-lime">TRAINERS</span></h2>
        <p className="text-zinc-400 text-sm mt-2">Certified, real humans. Hover for 3D flip effect.</p>
      </div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trainers.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="card-3d rounded-3xl overflow-hidden bg-gym-card border border-gym-border group">
            <div className="relative h-80 overflow-hidden img-zoom">
              <img src={t.img} alt={t.name} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-black/70 border border-white/20 flex items-center gap-1">
                <Star size={12} className="text-yellow-400" fill="currentColor" /> {t.rating}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-display text-2xl">{t.name}</div>
                <div className="text-xs text-gym-lime font-bold">{t.role} • {t.exp}</div>
              </div>
            </div>
            <div className="p-4">
              <button onClick={() => onBookTrainer(t)} className="w-full py-2.5 rounded-full bg-white/10 border border-white/10 text-sm font-bold hover:bg-gym-lime hover:text-black transition">
                Book PT Session
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
