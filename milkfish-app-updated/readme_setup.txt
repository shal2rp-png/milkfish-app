Milkfish Hatcheries Water Monitor — merged Netlify project

WHAT WAS MERGED
- Preserved the richer original pHAT Levels dashboard (home, history, alerts, settings, ranges, demo mode).
- Changed app title to "Milkfish Hatcheries Water Monitor".
- Changed Device Information label/name to "Hatchery 1".
- Migrates a saved local "Pond 1" setting to "Hatchery 1".
- Firebase live-read path: hatcheries/hatchery1/latest.
- Added Firebase email/password sign-in controls in Settings.
- Added a Netlify Function for ESP32 device writes.

IMPORTANT SECURITY SETUP
1. In Firebase Authentication, enable Email/Password and create the authorized user.
2. In Firebase Realtime Database rules, keep the database private. Permit read access only to the intended authenticated user(s); do not set .read or .write to true for everyone.
3. In Netlify site environment variables, add:
   DEVICE_API_KEY = a long random secret
   FIREBASE_SERVICE_ACCOUNT = the complete service-account JSON string for a Firebase service account with the required database write permissions
4. Never put the service-account JSON or DEVICE_API_KEY in the website HTML, Git repository, or screenshots.
5. Redeploy using a connected Git repository or Netlify CLI/build so the Netlify Function and firebase-admin dependency are built. A simple static drag-and-drop deploy may not build/run functions.
6. Set the ESP32 SERVER_URL to:
   https://YOUR-SITE.netlify.app/.netlify/functions/reading
   and send the same DEVICE_API_KEY in the x-device-key header.

FIREBASE WEB CONFIG
The Firebase web config in index.html is a client identifier, not a service-account credential. The database remains protected by Authentication and Database Rules.

ARDUINO → ESP32 SERIAL FORMAT
The ESP32 sketch discussed in chat expects one newline-terminated CSV line from Arduino:
7.20,28.50,0.020
Order: pH, temperature °C, ammonia mg/L.

VALIDITY
The server function sets valid=true only after checking that all three supplied values are finite and within basic bounds. These checks are not a substitute for sensor calibration or domain-specific validation. Do not use simulated values to update the Firebase actual-reading path.

FILES
- index.html: merged interface and Firebase read/sign-in
- netlify/functions/reading.js: secure server-side device write endpoint
- package.json: firebase-admin dependency
- netlify.toml: Netlify function/build settings
- sw.js: non-caching service worker to avoid stale UI
- firebase-messaging-sw.js: starter only; push notifications require additional FCM token setup and trusted sender configuration
