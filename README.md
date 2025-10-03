# MoodMuse-MobileApp

---

![Expo](https://img.shields.io/badge/Expo-48.0.0-blue?logo=expo&logoColor=white) ![React Native](https://img.shields.io/badge/React_Native-0.72.0-blue?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-DD5800?logo=firebase&logoColor=white)

MoodMuse is a cross-platform mobile application (iOS, Android, Web) built using **React Native** and **Expo**. The app helps users track moods, manage tasks, and maintain personal insights with real-time updates via **Firebase**.

---

👉 [Download APK](https://drive.google.com/file/d/1xz0rabA-8ERLLlhV45TxXEjwk9FW8lV7/view?usp=drive_link)

---

## Installation Guide
1. Download the APK file from the link above.
2. Open the file on your Android device.
3. If prompted, allow installation from unknown sources.
4. Install and start using the app 🚀.

## 🎥 Demo Video

<a href="https://youtu.be/ywXbIS75Nf8?si=0FFaOntjDNYbP2bz" target="_blank">
  <img src="https://i.pinimg.com/736x/cb/6b/21/cb6b217399c078c063c1a200f05d6658.jpg" width="200" />
</a>

*(Click the image above to watch the full demo on YouTube)*


## Features

- **Authentication**
  - Email/password login & registration
  - Facebook login
  - Forgot password functionality
- **Profile Management**
  - Upload and save profile picture
  - Update username and preferences
- **Mood & Task Management**
  - Add mood entries and assign tasks
  - Real-time updates with Firestore
- **Settings**
  - Switch between English and Sinhala
  - Dark mode toggle
  - View Terms & Conditions
  - Logout functionality
- **UI & Animations**
  - Smooth login screen animations
  - Pulsing buttons and background effects
  - Fully responsive design for mobile and web

---

## Tech Stack

- **Frontend:** React Native, Expo, TypeScript
- **Backend/Database:** Firebase Auth, Firestore
- **Storage:** Firebase Storage / Expo FileSystem
- **Routing:** Expo Router
- **UI/Icons:** Lucide React Native, LinearGradient
- **State Management:** React Hooks

---

## Project Structure

```
/app
  /login
  /register
  /home
  /settings
/services
  authService.ts
/firebase.ts
/localization
/components
  TermsModal.tsx
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode for simulators (optional)
- Firebase project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nimashashehani123/MoodMuse-MobileApp.git
cd MoodMuse
```

2. Install dependencies:

```bash
npm install
```

3. Configure Firebase:

- Enable Authentication (Email/Password & Facebook)
- Create Firestore database
- Replace `firebase.ts` with your project credentials

4. Create `.env` file with your Firebase and Facebook config:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FACEBOOK_APP_ID=your_facebook_app_id
```

### Running the App

```bash
npx expo start
```

Open the app on:
- Expo Go (iOS/Android)
- Android Emulator
- iOS Simulator
- Web Browser

---

## Usage

- **Login/Register:** Use email/password or Facebook login
- **Mood Entries:** Add moods in the Home screen
- **Tasks:** Assign tasks to moods
- **Settings:** Change language, toggle dark mode, update profile
- **Profile Pic:** Upload from gallery

---

## Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Lucide React Native Icons](https://lucide.dev/)

---

## License

This project is open-source and free to use.


