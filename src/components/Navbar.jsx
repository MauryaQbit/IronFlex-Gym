import { useState, useEffect, useRef } from 'react'
import { Dumbbell, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ cartCount, bookingsCount, onLoginClick }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const links = [
    ['Programs', '#programs'], ['3D Tour', '#equipment'],
    ['Trainers', '#trainers'], ['Schedule', '#schedule'],
    ['Pricing', '#pricing'], ['Shop', '#shop'], ['Dashboard', '#dashboard'],
  ]

  const initial = (user?.name || user?.email || 'G')?.[0]?.toUpperCase()

  return (
    <nav ref={menuRef} className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'glass border-b border-gym-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gym-lime flex items-center justify-center">
            <Dumbbell className="text-black" size={22} />
          </div>
          <div>
            <div className="font-display text-lg sm:text-xl leading-none">IRONFLEX</div>
            <div className="text-[10px] sm:text-[11px] tracking-[0.3em] text-gym-lime">3D GYM</div>
          </div>
        </a>
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-zinc-300">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="hover:text-gym-lime transition py-2">{l}</a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <a href="#dashboard" className="text-xs px-3 py-2 rounded-full bg-white/10 border border-white/10">
            📅 {bookingsCount} | 🛒 {cartCount}
          </a>
          {user ? (
            <div className="flex items-center gap-2">
              <a href="#dashboard" title={user.email} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/10 border border-white/10 hover:border-gym-lime transition">
                <span className="w-8 h-8 rounded-full bg-gym-lime text-black font-black flex items-center justify-center text-sm overflow-hidden">
                  {user.photo ? <img src={user.photo} alt="" className="w-8 h-8 rounded-full object-cover" /> : initial}
                </span>
                <span className="text-xs font-bold max-w-[90px] truncate">{user.name || user.email}</span>
                {user.isDemo && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">DEMO</span>}
              </a>
              <button onClick={logout} title="Logout" aria-label="Logout" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <button onClick={onLoginClick} className="px-4 sm:px-5 py-2.5 rounded-full bg-white/10 border border-white/20 font-bold text-sm hover:border-gym-lime transition min-h-[44px]">Login</button>
              <a href="#pricing" className="px-4 sm:px-5 py-2.5 rounded-full bg-gym-lime text-black font-bold text-sm hover:scale-105 transition min-h-[44px] inline-flex items-center">JOIN NOW</a>
            </>
          )}
        </div>
        <button className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 border border-white/10" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden glass border-t border-gym-border px-4 py-4 flex flex-col">
          {links.map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} className="py-3.5 border-b border-white/5 text-base font-medium min-h-[44px] flex items-center">{l}</a>
          ))}
          <div className="flex items-center justify-between mt-3 px-1 text-sm text-zinc-400">
            <span>📅 {bookingsCount} booked · 🛒 {cartCount} items</span>
          </div>
          {user ? (
            <div className="flex items-center justify-between mt-3 px-4 py-3 rounded-2xl bg-white/10">
              <span className="text-sm font-bold truncate">👤 {user.name || user.email}</span>
              <button onClick={() => { logout(); setOpen(false) }} className="text-xs px-4 py-2 rounded-full bg-red-500 font-bold min-h-[44px]">Logout</button>
            </div>
          ) : (
            <button onClick={() => { onLoginClick(); setOpen(false) }} className="mt-3 text-center px-5 py-3.5 rounded-full bg-white text-black font-bold min-h-[44px]">Login / Sign Up</button>
          )}
          <a href="#pricing" onClick={() => setOpen(false)} className="mt-2 text-center px-5 py-3.5 rounded-full bg-gym-lime text-black font-bold min-h-[44px]">JOIN NOW</a>
        </div>
      )}
    </nav>
  )
}
