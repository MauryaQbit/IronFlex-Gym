import { getFirebase } from './config'

async function getDb() {
  const fb = await getFirebase()
  return fb?.db || null
}

export async function loadUserData(uid) {
  const db = await getDb()
  if (!db || !uid) return null
  try {
    const { doc, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  } catch (e) {
    console.warn('Firestore load failed:', e.message)
    return null
  }
}

export async function saveUserData(uid, data) {
  const db = await getDb()
  if (!db || !uid) return false
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
    await setDoc(
      doc(db, 'users', uid),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    )
    return true
  } catch (e) {
    console.warn('Firestore save failed:', e.message)
    return false
  }
}

export async function saveProfile(uid, profile) {
  return saveUserData(uid, { profile })
}
