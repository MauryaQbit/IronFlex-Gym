import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import Programs from './components/Programs'
import Equipment3D from './components/Equipment3D'
import BMICalculator from './components/BMICalculator'
import Schedule from './components/Schedule'
import Trainers from './components/Trainers'
import Transformations from './components/Transformations'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import Shop from './components/Shop'
import Dashboard from './components/Dashboard'
import CoachChat from './components/CoachChat'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import { AuthProvider, useAuth } from './context/AuthContext'

// Per-user localStorage: bookings/cart/member follow the logged-in user
function usePerUserLocal(baseKey, initial, uid) {
  const key = `${baseKey}${uid ? `_${uid}` : '_guest'}`
  const [val, setVal] = useState(() => {
    try {
      // Migrate old global key on first run
      const own = localStorage.getItem(key)
      if (own !== null) return JSON.parse(own)
      const legacy = localStorage.getItem(baseKey)
      if (legacy !== null) return JSON.parse(legacy)
      return initial
    } catch { return initial }
  })

  // Reload when user switches
  useEffect(() => {
    try {
      const own = localStorage.getItem(key)
      if (own !== null) setVal(JSON.parse(own))
      else {
        const legacy = localStorage.getItem(baseKey)
        setVal(legacy !== null ? JSON.parse(legacy) : initial)
      }
    } catch { setVal(initial) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => { localStorage.setItem(key, JSON.stringify(val)) }, [key, val])
  return [val, setVal]
}

function Site() {
  const { user } = useAuth()
  const uid = user?.uid || null
  const [bookings, setBookings] = usePerUserLocal('ironflex_bookings', [], uid)
  const [cart, setCart] = usePerUserLocal('ironflex_cart', [], uid)
  const [member, setMember] = usePerUserLocal('ironflex_member', null, uid)
  const [toast, setToast] = useState('')
  const [authOpen, setAuthOpen] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }

  const requireLogin = () => {
    setAuthOpen(true)
    showToast('🔐 Login to continue')
    return false
  }

  const handleBook = (id) => {
    if (!user) return requireLogin()
    if (!bookings.includes(id)) {
      setBookings([...bookings, id])
      showToast('✅ Class booked! Check Dashboard')
    }
  }

  const handleAddCart = (p) => {
    if (!user) return requireLogin()
    setCart([...cart, p])
    showToast(`🛒 ${p.name} added`)
  }

  const handleTrainer = (t) => {
    if (!user) return requireLogin()
    showToast(`💪 PT request sent to ${t.name}!`)
  }

  const handleJoin = (f) => {
    if (!user) {
      setMember({ ...f, email: f.email || '' })
      requireLogin()
      return
    }
    setMember({ ...f, email: user.email, uid: user.uid })
    showToast(`Welcome ${f.name || user.name}!`)
  }

  return (
    <div className="min-h-screen bg-gym-black text-white">
      <Navbar cartCount={cart.length} bookingsCount={bookings.length} onLoginClick={() => setAuthOpen(true)} />
      <Hero3D />
      <Programs />
      <Equipment3D />
      <BMICalculator />
      <Schedule bookings={bookings} onBook={handleBook} />
      <Trainers onBookTrainer={handleTrainer} />
      <Transformations />
      <Pricing onJoin={handleJoin} />
      <Testimonials />
      <Shop cart={cart} onAdd={handleAddCart} />
      <Dashboard
        bookings={bookings}
        cart={cart}
        member={member}
        onRemoveBooking={(id) => setBookings(bookings.filter(b => b !== id))}
        onRemoveCart={(i) => setCart(cart.filter((_, idx) => idx !== i))}
        onClearAll={() => { setBookings([]); setCart([]); localStorage.removeItem('ironflex_weights'); localStorage.removeItem(`ironflex_weights_${uid}`); }}
        onLoginClick={() => setAuthOpen(true)}
      />
      <Footer />
      <CoachChat />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={() => showToast('🔥 Logged in! Bookings & cart now sync to you')} />

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full bg-gym-lime text-black text-sm font-bold shadow-2xl animate-bounce whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis">
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Site />
    </AuthProvider>
  )
}
