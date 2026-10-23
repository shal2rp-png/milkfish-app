// pHAT Levels Firebase Messaging service worker starter.
// Push notifications are not enabled until FCM setup and a trusted sender are configured.
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAz51UrAdgLonSlPN74A_KDi3oiy6ypAR4",
  authDomain: "milkfish-chanos-chanos-5cf0e.firebaseapp.com",
  databaseURL: "https://milkfish-chanos-chanos-5cf0e-default-rtdb.firebaseio.com",
  projectId: "milkfish-chanos-chanos-5cf0e",
  storageBucket: "milkfish-chanos-chanos-5cf0e.firebasestorage.app",
  messagingSenderId: "299472482872",
  appId: "1:299472482872:web:389af34379fb467872eccd",
  measurementId: "G-R1V0826NG8"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  const title = payload?.notification?.title || "pHAT Levels alert";
  const options = {
    body: payload?.notification?.body || "Check your hatchery water-quality dashboard.",
    icon: "/favicon.ico"
  };
  self.registration.showNotification(title, options);
});
