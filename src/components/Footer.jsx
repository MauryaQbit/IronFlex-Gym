import { Dumbbell, Globe, Share2, AtSign, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gym-border bg-black">
      <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gym-lime flex items-center justify-center"><Dumbbell className="text-black" /></div>
            <div className="font-display text-xl">IRONFLEX 3D GYM</div>
          </div>
          <p className="text-sm text-zinc-400 mt-4">India's most interactive gym website. Real iron, real coaches, real 3D experience.</p>
          <div className="mt-4 flex gap-3">
            {[Globe, Share2, AtSign].map((Icon, i) => (
              <a key={i} href="#top" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gym-lime hover:text-black transition"><Icon size={18} /></a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold mb-4">Quick Links</div>
          <ul className="space-y-2 text-sm text-zinc-400">
            {['Programs:#programs', '3D Tour:#equipment', 'BMI Calculator:#bmi', 'Schedule:#schedule', 'Shop:#shop'].map(l => {
              const [t, h] = l.split(':')
              return <li key={t}><a href={h} className="hover:text-gym-lime">{t}</a></li>
            })}
          </ul>
        </div>
        <div>
          <div className="font-bold mb-4">Contact</div>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex gap-2"><MapPin size={16} /> Sector 21, Main Road, Your City</li>
            <li className="flex gap-2"><Phone size={16} /> +91 99999 99999</li>
            <li>⏰ 5 AM - 11 PM (All days)</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-4">Get Free Trial Pass</div>
          <p className="text-sm text-zinc-400">Drop your WhatsApp, we send 1-day pass in 5 mins.</p>
          <form onSubmit={e => { e.preventDefault(); alert('Trial pass sent on WhatsApp!') }} className="mt-3 flex gap-2">
            <input required placeholder="WhatsApp number" className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm outline-none focus:border-gym-lime" />
            <button className="px-5 py-2.5 rounded-full bg-gym-lime text-black text-sm font-bold">Send</button>
          </form>
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop" alt="gym real" className="mt-4 h-24 w-full object-cover rounded-2xl border border-white/10" />
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-zinc-500">
        © 2026 IronFlex 3D Gym • Built with React + Three.js • Real images from Unsplash • Made for lifters 💪
      </div>
    </footer>
  )
}
