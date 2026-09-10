import { useState } from 'react'
import { X, Mail, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ open, onClose, onSuccess }) {
  const { signup, login, loginGoogle, loginDemoGuest, isFirebaseConfigured } = useAuth()
  const [mode, setMode] = useState('login') // login | signup
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const friendlyError = (e) => {
    const m = e?.message || 'Something went wrong'
    if (m.includes('auth/email-already-in-use')) return 'Email already registered. Try Login.'
    if (m.includes('auth/invalid-credential') || m.includes('auth/wrong-password')) return 'Wrong email or password.'
    if (m.includes('auth/weak-password')) return 'Password must be 6+ characters.'
    if (m.includes('auth/popup-closed')) return 'Google popup closed. Try again.'
    if (m.includes('auth/unauthorized-domain')) return 'Add localhost to Firebase Authorized domains.'
    return m
  }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Enter your name')
        await signup(name.trim(), email.trim(), password)
      } else {
        await login(email.trim(), password)
      }
      onSuccess?.()
      onClose()
    } catch (e2) {
      setErr(friendlyError(e2))
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    setErr('')
    setBusy(true)
    try {
      await loginGoogle()
      onSuccess?.()
      onClose()
    } catch (e) {
      setErr(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  const guest = async () => {
    setBusy(true)
    try {
      await loginDemoGuest()
      onSuccess?.()
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-gym-card border border-gym-border overflow-hidden">
        <div className="h-36 relative">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" alt="gym" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1E] to-black/30" />
          <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black"><X size={18} /></button>
          <div className="absolute bottom-3 left-6">
            <div className="font-display text-2xl">{mode === 'login' ? 'WELCOME BACK, BEAST' : 'JOIN IRONFLEX'}</div>
            <div className="text-xs text-zinc-300">{isFirebaseConfigured ? '🔥 Secured by Firebase' : '🧪 Demo mode — add Firebase keys for real auth'}</div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-black/50 border border-white/10 mb-5">
            {['login', 'signup'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setErr('') }}
                className={`py-2 rounded-full text-sm font-bold capitalize transition ${mode === m ? 'bg-gym-lime text-black' : 'text-zinc-400'}`}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === 'signup' && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus-within:border-gym-lime">
                <UserIcon size={16} className="text-zinc-500" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-transparent outline-none text-sm flex-1" />
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus-within:border-gym-lime">
              <Mail size={16} className="text-zinc-500" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" className="bg-transparent outline-none text-sm flex-1" />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus-within:border-gym-lime">
              <Lock size={16} className="text-zinc-500" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} placeholder="Password (6+ chars)" className="bg-transparent outline-none text-sm flex-1" />
            </div>

            {err && <div className="text-xs bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl">⚠️ {err}</div>}

            <button disabled={busy} className="w-full py-3 rounded-full bg-gym-lime text-black font-bold hover:scale-[1.02] transition disabled:opacity-60">
              {busy ? 'Please wait...' : mode === 'login' ? 'Login 💪' : 'Create Account 🔥'}
            </button>
          </form>

          <div className="my-4 text-center text-xs text-zinc-500">OR</div>

          <button onClick={google} disabled={busy} className="w-full py-3 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 text-white text-xs font-black flex items-center justify-center">G</span> Continue with Google
          </button>
          <button onClick={guest} disabled={busy} className="mt-2 w-full py-2.5 rounded-full bg-white/10 border border-white/10 text-sm hover:border-gym-lime transition">
            Continue as Guest
          </button>

          {!isFirebaseConfigured && (
            <div className="mt-4 text-[11px] leading-relaxed text-zinc-500 bg-black/40 border border-white/10 rounded-xl p-3">
              <b className="text-zinc-300">Enable real Firebase in 3 mins:</b><br />
              1. console.firebase.google.com → New project<br />
              2. Authentication → Enable Email + Google<br />
              3. Firestore → Create DB (test mode)<br />
              4. Copy keys to <code>.env</code> (see .env.example) → restart
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
