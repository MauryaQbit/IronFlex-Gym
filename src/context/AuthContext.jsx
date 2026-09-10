import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'
import { loadUserData, saveProfile } from '../firebase/firestore'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const DEMO_KEY = 'ironflex_demo_user'

function getDemoUser() {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY)) } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Init: Firebase listener OR demo localStorage
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const extra = await loadUserData(fbUser.uid)
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || extra?.profile?.name || fbUser.email?.split('@')[0],
            photo: fbUser.photoURL || null,
            provider: fbUser.providerData?.[0]?.providerId || 'password',
            isDemo: false,
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      })
      return unsub
    } else {
      setUser(getDemoUser())
      setLoading(false)
    }
  }, [])

  const signup = async (name, email, password) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name) await updateProfile(cred.user, { displayName: name })
      await saveProfile(cred.user.uid, { name, email, createdAt: new Date().toISOString() })
      return true
    } else {
      // DEMO mode
      if (getDemoUser()?.email === email) throw new Error('Demo user already exists. Try Login.')
      const demo = { uid: 'demo-' + Date.now(), email, name: name || email.split('@')[0], provider: 'demo', isDemo: true }
      localStorage.setItem(DEMO_KEY, JSON.stringify(demo))
      // store password hashed-ish for demo check (NOT secure, demo only)
      localStorage.setItem(DEMO_KEY + '_pw', password)
      setUser(demo)
      return true
    }
  }

  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } else {
      const demo = getDemoUser()
      const pw = localStorage.getItem(DEMO_KEY + '_pw')
      if (!demo || demo.email !== email) throw new Error('No demo account found. Please Sign Up first (Demo mode).')
      if (pw !== password) throw new Error('Wrong password (Demo mode).')
      setUser(demo)
      return true
    }
  }

  const loginGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      const cred = await signInWithPopup(auth, googleProvider)
      await saveProfile(cred.user.uid, {
        name: cred.user.displayName,
        email: cred.user.email,
        photo: cred.user.photoURL,
      })
      return true
    } else {
      // Demo Google = one-click instant account
      const demo = {
        uid: 'demo-google-' + Date.now(),
        email: 'demo.lifter@gmail.com',
        name: 'Demo Lifter',
        photo: null,
        provider: 'demo-google',
        isDemo: true,
      }
      localStorage.setItem(DEMO_KEY, JSON.stringify(demo))
      setUser(demo)
      return true
    }
  }

  const loginDemoGuest = async () => {
    const guest = {
      uid: 'demo-guest-' + Date.now(),
      email: 'guest@ironflex.demo',
      name: 'Guest Lifter',
      provider: 'demo-guest',
      isDemo: true,
    }
    if (isFirebaseConfigured && auth) {
      // Still allow guest locally even with firebase (no anon pollution)
      localStorage.setItem(DEMO_KEY, JSON.stringify(guest))
      setUser(guest)
    } else {
      localStorage.setItem(DEMO_KEY, JSON.stringify(guest))
      setUser(guest)
    }
    return true
  }

  const logout = async () => {
    if (isFirebaseConfigured && auth && user && !user.isDemo) {
      await signOut(auth)
    }
    localStorage.removeItem(DEMO_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseConfigured, isDemo: !isFirebaseConfigured || user?.isDemo, signup, login, loginGoogle, loginDemoGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
