import { useState, useEffect } from 'react'
import { Trash2, TrendingUp, LogOut, Cloud, CloudOff } from 'lucide-react'
import { schedule } from '../data/gymData'
import { useAuth } from '../context/AuthContext'
import { loadUserData, saveUserData } from '../firebase/firestore'

export default function Dashboard({ bookings, cart, member, onRemoveBooking, onRemoveCart, onClearAll, onLoginClick }) {
  const { user, logout, isFirebaseConfigured } = useAuth()
  const [weight, setWeight] = useState('')
  const [cloudSaved, setCloudSaved] = useState(false)
  const [logs, setLogs] = useState(() => {
    try {
      const uid = user?.uid ? `_${user.uid}` : ''
      return JSON.parse(localStorage.getItem(`ironflex_weights${uid}`) || localStorage.getItem('ironflex_weights') || '[]')
    } catch { return [] }
  })

  const bookedClasses = schedule.filter(s => bookings.includes(s.id))
  const total = cart.reduce((a, c) => a + c.price, 0)

  // Load cloud data once after login (merge, don't overwrite local)
  useEffect(() => {
    if (!user || user.isDemo || !isFirebaseConfigured) return
    loadUserData(user.uid).then((data) => {
      if (data?.weights?.length && logs.length === 0) setLogs(data.weights)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  // Auto-sync weights + bookings to Firestore (debounced by render)
  useEffect(() => {
    if (!user || user.isDemo || !isFirebaseConfigured) {
      setCloudSaved(false)
      return
    }
    const t = setTimeout(async () => {
      const ok = await saveUserData(user.uid, {
        weights: logs,
        bookings,
        cart: cart.map(c => ({ id: c.id, name: c.name, price: c.price })),
        profile: { name: user.name, email: user.email },
      })
      setCloudSaved(ok)
    }, 1200)
    return () => clearTimeout(t)
  }, [logs, bookings, cart, user, isFirebaseConfigured])

  const addWeight = () => {
    if (!weight) return
    const entry = { w: Number(weight), d: new Date().toLocaleDateString() }
    const next = [...logs, entry].slice(-10)
    setLogs(next)
    const uid = user?.uid ? `_${user.uid}` : ''
    localStorage.setItem(`ironflex_weights${uid}`, JSON.stringify(next))
    localStorage.setItem('ironflex_weights', JSON.stringify(next))
    setWeight('')
  }

  return (
    <section id="dashboard" className="py-20 bg-gym-dark border-t border-gym-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="text-gym-lime text-sm font-bold tracking-widest">📊 MY DASHBOARD</div>
            <h2 className="font-display text-4xl md:text-5xl mt-2">TRACK <span className="text-gym-lime">EVERYTHING</span></h2>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {user && isFirebaseConfigured && !user.isDemo ? (
              <span className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${cloudSaved ? 'bg-green-500/15 border-green-500/40 text-green-300' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                <Cloud size={14} /> {cloudSaved ? 'Synced to cloud' : 'Syncing...'}
              </span>
            ) : (
              <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 flex items-center gap-1.5">
                <CloudOff size={14} /> {user?.isDemo ? 'Demo mode — local only' : 'Login to cloud-sync'}
              </span>
            )}
          </div>
        </div>

        {/* Account card */}
        <div className="mt-6 rounded-3xl bg-gym-card border border-gym-border p-5 flex flex-wrap items-center gap-4">
          {user ? (
            <>
              <span className="w-12 h-12 rounded-full bg-gym-lime text-black font-black flex items-center justify-center text-lg overflow-hidden">
                {user.photo ? <img src={user.photo} alt="" className="w-12 h-12 object-cover" /> : (user.name || user.email)?.[0]?.toUpperCase()}
              </span>
              <div className="flex-1 min-w-[200px]">
                <div className="font-bold">{user.name || 'Member'} {user.isDemo && <span className="text-[10px] ml-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">DEMO</span>}</div>
                <div className="text-xs text-zinc-400">{user.email} • {user.provider}</div>
                {member?.plan && <div className="text-xs text-gym-lime font-bold mt-0.5">Plan: {member.plan} {member.phone ? `• ${member.phone}` : ''}</div>}
              </div>
              <button onClick={logout} className="px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm font-bold flex items-center gap-2 hover:bg-red-500 transition">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 min-w-[220px]">
                <div className="font-bold">You're browsing as guest 👀</div>
                <div className="text-xs text-zinc-400">Login to sync bookings, cart & weight across devices with Firebase.</div>
              </div>
              <button onClick={onLoginClick} className="px-6 py-2.5 rounded-full bg-gym-lime text-black text-sm font-bold hover:scale-105 transition">Login / Sign Up</button>
            </>
          )}
        </div>

        {member?.name && !user && (
          <div className="mt-4 inline-block px-5 py-2.5 rounded-full bg-gym-lime text-black text-sm font-bold">
            Welcome {member.name} • {member.plan} • {member.phone}
          </div>
        )}

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-gym-card border border-gym-border p-6">
            <h3 className="font-bold">📅 My Bookings ({bookedClasses.length})</h3>
            <div className="mt-4 space-y-3 max-h-64 overflow-auto">
              {bookedClasses.length === 0 && <div className="text-sm text-zinc-500">No bookings yet. Book a class above!</div>}
              {bookedClasses.map(b => (
                <div key={b.id} className="flex justify-between items-center bg-black/40 rounded-xl p-3 text-sm">
                  <div><div className="font-bold">{b.class}</div><div className="text-xs text-zinc-400">{b.day} • {b.time}</div></div>
                  <button onClick={() => onRemoveBooking(b.id)} className="text-red-400 hover:scale-110"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-gym-card border border-gym-border p-6">
            <h3 className="font-bold">🛒 My Cart • ₹{total.toLocaleString('en-IN')}</h3>
            <div className="mt-4 space-y-3 max-h-64 overflow-auto">
              {cart.length === 0 && <div className="text-sm text-zinc-500">Cart empty. Add supplements from shop!</div>}
              {cart.map((c, i) => (
                <div key={i} className="flex justify-between items-center bg-black/40 rounded-xl p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <img src={c.img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div><div className="font-bold">{c.name}</div><div className="text-xs text-gym-lime">₹{c.price}</div></div>
                  </div>
                  <button onClick={() => onRemoveCart(i)} className="text-red-400"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            {cart.length > 0 && <button className="mt-4 w-full py-2.5 rounded-full bg-gym-lime text-black font-bold text-sm">Checkout ₹{total.toLocaleString('en-IN')}</button>}
          </div>
          <div className="rounded-3xl bg-gym-card border border-gym-border p-6">
            <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-gym-lime" /> Weight Tracker</h3>
            <div className="mt-4 flex gap-2">
              <input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="kg" className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm outline-none focus:border-gym-lime" />
              <button onClick={addWeight} className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-gym-lime">Log</button>
            </div>
            <div className="mt-4 flex items-end gap-1.5 h-28">
              {logs.length === 0 && <div className="text-xs text-zinc-500">Log weight to see progress chart.</div>}
              {logs.map((l, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-gym-lime/40 to-gym-lime" style={{ height: `${Math.min(100, (l.w / 120) * 100)}px` }} />
                  <div className="text-[10px] text-zinc-500">{l.w}</div>
                </div>
              ))}
            </div>
            {logs.length > 0 && <div className="mt-2 text-xs text-zinc-400">Latest: {logs[logs.length - 1].w}kg on {logs[logs.length - 1].d}</div>}
          </div>
        </div>
        {(bookings.length > 0 || cart.length > 0) && (
          <button onClick={onClearAll} className="mt-6 text-xs text-zinc-500 underline">Clear all data</button>
        )}
      </div>
    </section>
  )
}
