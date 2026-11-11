# Shanahan Student Mobile Portal (`shanahan-student-mobile`)

Cross-platform native mobile application for **Shanahan University Management Information System (UMIS)** built with **React Native** and **Expo SDK 51**.

---

## 📱 Application Overview
- **App Name:** Shanahan Student Portal
- **Android Package:** `com.shanahan.studentportal`
- **EAS Project ID:** `f0e957dc-9209-402a-99de-07051ca22785`
- **Target OS:** Android 8.0+ & iOS 14.0+
- **Production Backend:** `https://myportal.shanahanuni.edu.ng/api/v1`

---

## 🚀 Quickstart & Local Development

### 1. Install Dependencies
```bash
cd MobileApp
npm install
```

### 2. Start the Expo Dev Server
```bash
npx expo start
```
- Press `a` to run on a connected Android device or emulator.
- Press `i` to run on an iOS simulator (macOS required).
- Scan the terminal QR code using **Expo Go** on your physical phone.

---

## 🏗️ Building for Production (Expo Application Services - EAS)

Install the EAS CLI if you haven't already:
```bash
npm install -g eas-cli
eas login
```

### 📦 1. Generate Standalone Android APK (Direct Install)
To produce an installable `.apk` file for testing without uploading to Google Play:
```bash
eas build --platform android --profile preview
```

### 🚀 2. Compile Android App Bundle (AAB for Google Play Store)
```bash
eas build --platform android --profile production
```

### 🍎 3. Compile iOS Build (for Apple TestFlight / App Store)
```bash
eas build --platform ios --profile production
```

---

## 📂 Architecture & Directory Structure

```
MobileApp/
├── App.tsx                     # Root App entry initializing AuthProvider & Navigators
├── app.json                    # Expo configuration & app metadata
├── eas.json                    # EAS build profiles (preview APK, production AAB/IPA)
├── src/
│   ├── api/
│   │   └── client.ts           # Axios client with JWT auto-injection & 401 interceptor
│   ├── components/             # Reusable UI component library (Button, Card, Badge, Input, Icons)
│   ├── context/
│   │   └── AuthContext.tsx     # Global authentication provider (token, login, logout)
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Stack and Bottom-Tab routing guards
│   ├── screens/
│   │   ├── auth/               # LoginScreen, ClaimAccountScreen, ResetPasswordScreen
│   │   └── main/               # DashboardScreen, CoursesScreen, ResultsScreen,
│   │                           # PaymentsScreen, HostelsScreen, ProfileScreen
│   └── theme/
│       └── colors.ts           # Institutional burgundy & dark surface palette
```

---

## 🔑 Key Features
- **Account Claiming:** First-time verification via Matriculation Number + Date of Birth.
- **Course Registration:** Dynamic selection, prerequisite barrier enforcement, and credit unit limits.
- **Financial Center:** Real-time fee breakdowns, Paystack integration, and installment payment support.
- **Academic Results:** Semester Continuous Assessment (CA) and Exam score cards with 5.0 scale CGPA ledger.
- **Hostel Allocation:** Bed space browsing, allocation requests, and off-campus clearance letter submission.

For full stakeholder and enterprise technical documentation, refer to:  
[`../Handover_Documents/12_Mobile_App_Documentation.md`](../Handover_Documents/12_Mobile_App_Documentation.md)

