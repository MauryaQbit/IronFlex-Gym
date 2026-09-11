// Sync env check — no SDK loaded. getFirebase() loads the SDK on demand
// AFTER first paint, so firebase never blocks initial load.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)

let cached = null

export function getFirebase() {
  if (!isFirebaseConfigured) return Promise.resolve(null)
  if (!cached) {
    cached = (async () => {
      const [{ initializeApp, getApps }, { getAuth, GoogleAuthProvider }, { getFirestore }] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ])
      const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
      return {
        app,
        auth: getAuth(app),
        db: getFirestore(app),
        googleProvider: new GoogleAuthProvider(),
      }
    })()
  }
  return cached
}

if (!isFirebaseConfigured) {
  console.warn(
    '[IronFlex] Firebase keys missing — running in DEMO auth mode (localStorage). Add VITE_FIREBASE_* to .env to enable real Firebase.'
  )
}
