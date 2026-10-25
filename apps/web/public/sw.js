/**
 * Quran Learn Academy — Production PWA Service Worker (v1.1.2)
 * Hardened Cache Invalidation & Private Route Isolation.
 *
 * Excludes private portals (/student, /parent, /teacher, /admin, /classroom, /companion, /dashboard, /auth),
 * Next.js RSC flight data, APIs, WebSockets, and cross-origin requests from cache storage to eliminate ghost states.
 */

const CACHE_NAME = "quran-academy-v1.1.2";

// Pre-cache strictly immutable brand assets (never "/" or dynamic pages)
const STATIC_ASSETS = [
  "/manifest.json",
  "/favicon.ico",
  "/icon.png",
  "/logo_quran_learn_academy.png",
];

// Install: Pre-cache strictly immutable assets and immediately skip waiting
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Purge obsolete caches immediately and take control of all active clients
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

// Fetch: Pure static asset caching; strictly bypass private routes & RSC flight data
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Strict origin isolation: bypass all cross-origin requests (Supabase, LiveKit, CDNs, APIs)
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Strict bypass for non-GET requests
  if (request.method !== "GET") {
    return;
  }

  const lowerPath = url.pathname.toLowerCase();

  // 3. Strict bypass for APIs, WebSockets, dev endpoints, and Next.js RSC flight requests
  const isRscRequest =
    url.searchParams.has("_rsc") ||
    request.headers.get("RSC") === "1" ||
    request.headers.has("Next-Router-State-Tree");

  if (
    lowerPath.startsWith("/api/") ||
    lowerPath.startsWith("/ws/") ||
    lowerPath.startsWith("/dev/") ||
    isRscRequest
  ) {
    return;
  }

  // 4. Strict bypass for all private user portals, classroom sessions & auth flows
  // Supports case-insensitive matching and subroute prefixes
  const privatePrefixes = [
    "/student",
    "/parent",
    "/teacher",
    "/admin",
    "/companion",
    "/classroom",
    "/dashboard",
    "/auth",
  ];

  const isPrivateRoute = privatePrefixes.some(
    (prefix) => lowerPath === prefix || lowerPath.startsWith(prefix + "/")
  );

  if (isPrivateRoute) {
    return;
  }

  // 5. Static assets (fonts, images, audio, Next.js static bundles): Cache-first with network fallback
  const isStaticAsset =
    lowerPath.startsWith("/_next/static/") ||
    lowerPath.endsWith(".png") ||
    lowerPath.endsWith(".jpg") ||
    lowerPath.endsWith(".jpeg") ||
    lowerPath.endsWith(".webp") ||
    lowerPath.endsWith(".svg") ||
    lowerPath.endsWith(".ico") ||
    lowerPath.endsWith(".woff") ||
    lowerPath.endsWith(".woff2") ||
    lowerPath.endsWith(".ttf") ||
    lowerPath.endsWith(".mp3") ||
    lowerPath.endsWith(".wav") ||
    lowerPath.endsWith(".mp4");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            return new Response("Asset temporarily unavailable offline", {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
      })
    );
    return;
  }

  // 6. Navigation and dynamic marketing pages: Bypass Service Worker completely
  // Native browser HTTP cache handles ETags/304 without service worker lock-in or stale auth UI.
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

// Message Listener: Force update & instant cache wipe (string or structured object)
self.addEventListener("message", (event) => {
  const isSkipWaiting =
    event.data === "SKIP_WAITING" ||
    event.data?.type === "SKIP_WAITING" ||
    event.data?.action === "SKIP_WAITING";

  if (isSkipWaiting) {
    self.skipWaiting();
    return;
  }

  const isPurgeCaches =
    event.data === "PURGE_CACHES" ||
    event.data?.type === "PURGE_CACHES" ||
    event.data?.action === "PURGE_CACHES";

  if (isPurgeCaches) {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => {
          if (event.source && "postMessage" in event.source) {
            event.source.postMessage({ type: "CACHES_PURGED", success: true });
          }
        })
    );
  }
});
