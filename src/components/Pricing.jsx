import { useState } from 'react'
import { Check, BadgeCheck } from 'lucide-react'
import { pricing } from '../data/gymData'

export default function Pricing({ onJoin }) {
  const [form, setForm] = useState({ name: '', phone: '', plan: 'Pro Beast' })
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return alert('Enter name + phone')
    onJoin(form)
    setDone(true)
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <section id="pricing" className="py-20 bg-gym-dark border-y border-gym-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="text-gym-lime text-sm font-bold tracking-widest">💳 MEMBERSHIP</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2">PICK YOUR <span className="text-gym-lime">POWER PLAN</span></h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {pricing.map(p => (
            <div key={p.id} className={`rounded-3xl p-5 sm:p-8 border relative ${p.highlight ? 'bg-gym-lime text-black border-gym-lime shadow-[0_0_40px_rgba(212,255,63,0.3)]' : 'bg-gym-card border-gym-border'}`}>
              {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-full bg-black text-gym-lime flex items-center gap-1"><BadgeCheck size={14} /> MOST POPULAR</div>}
              <div className="font-display text-2xl">{p.name}</div>
              <div className="mt-2"><span className="font-display text-5xl">₹{p.price.toLocaleString('en-IN')}</span><span className="text-sm opacity-70">{p.period}</span></div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2"><span className={`w-5 h-5 rounded-full flex items-center justify-center ${p.highlight ? 'bg-black text-gym-lime' : 'bg-gym-lime/20 text-gym-lime'}`}><Check size={12} /></span>{f}</li>
                ))}
              </ul>
              <button onClick={() => setForm({ ...form, plan: p.name })} className={`mt-5 sm:mt-6 w-full py-3.5 rounded-full font-bold min-h-[48px] ${p.highlight ? 'bg-black text-white hover:scale-105' : 'bg-white text-black hover:bg-gym-lime'} transition`}>
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-8 sm:mt-10 max-w-3xl mx-auto rounded-3xl bg-gym-card border border-gym-border p-4 sm:p-6 md:p-8 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoComplete="name" className="px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-gym-lime text-sm min-h-[48px]" />
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone / WhatsApp" inputMode="tel" autoComplete="tel" className="px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-gym-lime text-sm min-h-[48px]" />
          <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-sm min-h-[48px]">
            {pricing.map(p => <option key={p.id}>{p.name}</option>)}
          </select>
          <button className="px-4 py-3.5 rounded-xl bg-gym-lime text-black font-bold hover:scale-105 transition min-h-[48px]">Join Now</button>
          {done && <div className="sm:col-span-2 md:col-span-4 text-center text-sm text-gym-lime font-bold">✅ Welcome {form.name}! We will WhatsApp you on {form.phone} for {form.plan} trial. Check Dashboard!</div>}
        </form>
      </div>
    </section>
  )
}
