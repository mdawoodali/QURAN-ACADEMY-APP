/**
 * Quran Learn Academy — Production PWA Service Worker (v1.1.2)
 * Hardened Cache Invalidation & Private Route Isolation.
 *
 * Excludes private portals (/student, /parent, /teacher, /admin, /classroom, /companion),
 * Next.js RSC flight data, APIs, and WebSockets from cache storage to eliminate ghost states.
 */

const CACHE_NAME = "quran-academy-v1.1.2";
const STATIC_ASSETS = [
  "/manifest.json",
  "/favicon.ico",
  "/logo_quran_learn_academy.png",
];

// Install: Pre-cache strictly immutable brand assets (never "/" or dynamic pages)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Purge obsolete caches immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Pure static asset caching; strictly bypass private routes & RSC data
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Strict bypass for non-GET, APIs, WebSockets, and RSC flight data
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/ws/") ||
    url.searchParams.has("_rsc")
  ) {
    return;
  }

  // 2. Strict bypass for all private user portals & classroom sessions
  if (
    url.pathname.startsWith("/student") ||
    url.pathname.startsWith("/parent") ||
    url.pathname.startsWith("/teacher") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/companion") ||
    url.pathname.startsWith("/classroom")
  ) {
    return;
  }

  // 3. Static assets (fonts, images, audio, Next.js static bundles): Cache-first with network fallback
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".mp3");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 4. Public navigation pages: Network-first, NEVER store in cache to prevent stale auth UI
  // Browser standard HTTP cache handles ETags/304 without service worker lock-in
});

// Push Event: Deliver 15-minute class reminder notifications
self.addEventListener("push", (event) => {
  let data = {
    title: "Quran Class Starting Soon",
    body: "Your 1-on-1 Tajweed & Recitation session begins in 15 minutes.",
    url: "/classroom/demo",
    icon: "/logo_quran_learn_academy.png",
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/logo_quran_learn_academy.png",
    badge: "/favicon.ico",
    vibrate: [200, 100, 200],
    data: { url: data.url },
    actions: [
      { action: "enter", title: "Join Class Now" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click: Open classroom or focus existing tab
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

// Message Listener: Force update & instant cache wipe
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data === "PURGE_CACHES") {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((k) => caches.delete(k)));
      })
    );
  }
});
