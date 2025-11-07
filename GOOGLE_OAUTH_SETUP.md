# Google OAuth Setup - Complete Guide

## ✅ Current Configuration

**Google Client ID (example):**
```
YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

**Environment Variable (set in `.env.local`):**
- File: `.env.local`
- Variable: `VITE_GOOGLE_CLIENT_ID`
- Value: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`

## 📝 Important Notes

### Client Secret
You do NOT need the Client Secret for this frontend-only flow.

- Never commit a real Client Secret to the repository.
- If you implement server-side OAuth later, store secrets in server-side env vars only.

### Required Setup in Google Cloud Console

#### Step 1: Change OAuth Consent Screen Application Name

**This is where you change "careerflow" to "healthcare-hospital":**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Navigate to:** APIs & Services → **OAuth consent screen**
3. **Update Application Name:**
   - Under **App information**, find the **App name** field
   - Currently it shows: **"careerflow"** (this is what you see in the Google login popup)
   - Change it to: **"healthcare-hospital"** or **"Surya Nursing Home"**
   - Click **Save and Continue**
   - Complete any remaining steps if prompted
4. **Wait 5-10 minutes** for changes to propagate
5. **Clear browser cache** or use incognito mode to see the change

#### Step 2: Configure OAuth Credentials

1. **Navigate to:** APIs & Services → **Credentials**
2. **Find your OAuth 2.0 Client ID:** `YOUR_GOOGLE_CLIENT_ID`
3. **Click on the Client ID** to edit it
4. **Add Authorized JavaScript origins:**
   - Click **+ ADD URI**
   - Add: `http://localhost:5173` (for development)
   - Add: `https://yourdomain.com` (for production - replace with your actual domain)
   - Click **Save**
5. **Add Authorized redirect URIs (if needed):**
   - Under **Authorized redirect URIs**, click **+ ADD URI**
   - Add: `http://localhost:5173` (for development)
   - Add: `https://yourdomain.com` (for production)
   - Click **Save**

**📝 See [CHANGE_GOOGLE_APP_NAME.md](./CHANGE_GOOGLE_APP_NAME.md) for detailed step-by-step instructions with screenshots.**

## 🚀 How to Use

1. **Restart your dev server** (if it's running):
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. **Test Google Login:**
   - Go to `/login` or `/register` page
   - Click the "Sign in with Google" button
   - Select your Google account
   - You should be redirected to your dashboard

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:** Make sure you've added `http://localhost:5173` to Authorized JavaScript origins in Google Cloud Console

### Error: "popup_blocked"
**Solution:** Allow popups in your browser settings

### Button not showing
**Solution:** 
1. Check browser console for errors
2. Verify `.env.local` file exists and has the correct Client ID
3. Restart the dev server after creating/updating `.env.local`

### Login works but user not created
**Solution:** Check Convex dashboard for errors in the `socialLogin` mutation

## 📋 Current Implementation

- **Component:** `src/components/GoogleLoginButton.jsx`
- **Backend:** `convex/auth.js` → `socialLogin` mutation
- **Context:** `src/contexts/AuthContext.jsx` → `socialLogin` function
- **Pages:** `src/pages/LoginPage.jsx` and `src/pages/RegisterPage.jsx`

## ✅ Verification Checklist

- [x] Client ID updated in `GoogleLoginButton.jsx`
- [x] `.env.local` file created with Client ID
- [x] Fallback Client ID set in component
- [x] Backend `socialLogin` mutation implemented
- [x] Frontend `socialLogin` function in AuthContext
- [ ] Authorized JavaScript origins added in Google Cloud Console
- [ ] Dev server restarted after `.env.local` creation

## 🎯 Next Steps

1. **Add Authorized Origins in Google Cloud Console** (if not done)
2. **Restart your dev server** to load the environment variable
3. **Test Google login** on the login/register pages
4. **Check browser console** for any errors

---

**Note:** The Client Secret is stored securely and should never be exposed in frontend code. It's only needed if you implement server-side OAuth token exchange, which is not required for this frontend-only implementation.

