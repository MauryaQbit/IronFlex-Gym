import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './config'

export async function loadUserData(uid) {
  if (!isFirebaseConfigured || !db || !uid) return null
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  } catch (e) {
    console.warn('Firestore load failed:', e.message)
    return null
  }
}

export async function saveUserData(uid, data) {
  if (!isFirebaseConfigured || !db || !uid) return false
  try {
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
