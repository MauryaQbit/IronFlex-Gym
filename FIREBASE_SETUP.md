# 🔥 IronFlex Firebase Setup (3 mins)

App works RIGHT NOW in Demo mode (login/signup stored in browser).
To enable REAL login + cloud sync:

## 1. Create Firebase project
1. Go to https://console.firebase.google.com
2. Add project `ironflex-gym` (disable Analytics OK)
3. Build > Authentication > Sign-in method:
   - Enable Email/Password
   - Enable Google
4. Build > Firestore Database > Create database > Start in **test mode** > Enable
5. Project Settings (gear) > General > Your apps > Add Web App `</>` > copy config

## 2. Add keys
```bash
cp .env.example .env
# edit .env with your values
npm run dev
```

## 3. Authorized domains (for Google login)
Authentication > Settings > Authorized domains > Add:
- localhost
- your Vercel domain (after deploy)

## 4. Firestore rules (secure per-user)
Firestore > Rules > paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Done! Login will show real user, Dashboard shows "Synced to cloud".
Demo accounts still work as Guest fallback.
