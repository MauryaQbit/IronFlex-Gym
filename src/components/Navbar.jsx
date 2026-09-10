import { useState, useEffect } from 'react'
import { Dumbbell, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ cartCount, bookingsCount, onLoginClick }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    ['Programs', '#programs'], ['3D Tour', '#equipment'],
    ['Trainers', '#trainers'], ['Schedule', '#schedule'],
    ['Pricing', '#pricing'], ['Shop', '#shop'], ['Dashboard', '#dashboard'],
  ]

  const initial = (user?.name || user?.email || 'G')?.[0]?.toUpperCase()

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'glass border-b border-gym-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gym-lime flex items-center justify-center">
            <Dumbbell className="text-black" size={24} />
          </div>
          <div>
            <div className="font-display text-xl leading-none">IRONFLEX</div>
            <div className="text-[11px] tracking-[0.3em] text-gym-lime">3D GYM</div>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="hover:text-gym-lime transition">{l}</a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <a href="#dashboard" className="text-xs px-3 py-2 rounded-full bg-white/10 border border-white/10">
            📅 {bookingsCount} Booked | 🛒 {cartCount}
          </a>
          {user ? (
            <div className="flex items-center gap-2">
              <a href="#dashboard" title={user.email} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/10 border border-white/10 hover:border-gym-lime transition">
                <span className="w-8 h-8 rounded-full bg-gym-lime text-black font-black flex items-center justify-center text-sm">
                  {user.photo ? <img src={user.photo} alt="" className="w-8 h-8 rounded-full object-cover" /> : initial}
                </span>
                <span className="text-xs font-bold max-w-[100px] truncate">{user.name || user.email}</span>
                {user.isDemo && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">DEMO</span>}
              </a>
              <button onClick={logout} title="Logout" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <button onClick={onLoginClick} className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 font-bold text-sm hover:border-gym-lime transition">Login</button>
              <a href="#pricing" className="px-5 py-2.5 rounded-full bg-gym-lime text-black font-bold text-sm hover:scale-105 transition">JOIN NOW</a>
            </>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="lg:hidden glass border-t border-gym-border px-4 py-4 flex flex-col gap-3">
          {links.map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} className="py-2 border-b border-white/5">{l}</a>
          ))}
          {user ? (
            <div className="flex items-center justify-between mt-2 px-4 py-3 rounded-2xl bg-white/10">
              <span className="text-sm font-bold truncate">👤 {user.name || user.email}</span>
              <button onClick={() => { logout(); setOpen(false) }} className="text-xs px-3 py-1.5 rounded-full bg-red-500 font-bold">Logout</button>
            </div>
          ) : (
            <button onClick={() => { onLoginClick(); setOpen(false) }} className="mt-2 text-center px-5 py-3 rounded-full bg-white text-black font-bold">Login / Sign Up</button>
          )}
          <a href="#pricing" onClick={() => setOpen(false)} className="text-center px-5 py-3 rounded-full bg-gym-lime text-black font-bold">JOIN NOW</a>
        </div>
      )}
    </nav>
  )
}
