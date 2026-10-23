// pHAT Levels service worker placeholder; intentionally does not cache the app UI.
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
