# Firebase Setup — Cross-Device Sync

By default the app stores your rune sequence, dictionary, and spoiler preference in browser `localStorage`. If you configure Firebase, a **Sign in to sync** button appears in the header — signing in with a Google account will sync your data across all devices via Firestore.

---

## 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/) and click **Add project**.
2. Give it any name (e.g. `tunic-runes`).
3. Disable Google Analytics — it isn't needed.
4. Click **Create project**.

---

## 2. Enable Google Authentication

1. In the left sidebar: **Build → Authentication → Get started**.
2. Open the **Sign-in method** tab.
3. Click **Google** → toggle **Enable** → set a support email → **Save**.

---

## 3. Create a Firestore Database

1. In the left sidebar: **Build → Firestore Database → Create database**.
2. Select **Start in production mode** (you'll set the rules in the next step).
3. Choose a region close to you → **Done**.

---

## 4. Set Security Rules

1. In Firestore, open the **Rules** tab.
2. Replace the default rules with the following and click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

This ensures each signed-in user can only read and write their own data.

---

## 5. Register a Web App

1. Click the **Project Overview** home icon at the top of the left sidebar.
2. Click **Add app** → choose the **Web** (`</>`) icon.
3. Enter a nickname (e.g. `tunic-runes-web`) → **Register app**. No Firebase Hosting needed.
4. Copy the `firebaseConfig` object that appears — you'll need its values in step 7.

---

## 6. (Recommended) Restrict the API Key

The Firebase API key is safe to ship in client-side code — it only identifies your project, not grants admin access. Restricting it to your domain prevents others from running up your quota.

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/) → **APIs & Services → Credentials**.
2. Find the key named **Browser key (auto created by Firebase)** and click it.
3. Under **Application restrictions** → select **Websites** → add your domains:
   - `http://localhost:5173/*` (local dev)
   - `https://yourdomain.com/*` (production)
4. Click **Save**.

---

## 7. Configure the Local Environment

Copy the example env file and fill in the values from the `firebaseConfig` object you copied in step 5:

```bash
cp .env.example .env.local
```

| `.env.local` variable | `firebaseConfig` field |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

`.env.local` is gitignored — never commit it.

---

## 8. Start the App

```bash
pnpm dev
```

The **Sign in to sync** button will appear in the top-right corner of the header. On first sign-in your current local data is pushed to Firestore; on subsequent sign-ins on other devices your data is pulled down automatically.
