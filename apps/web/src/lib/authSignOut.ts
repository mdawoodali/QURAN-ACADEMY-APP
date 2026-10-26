import { createClient } from "@/utils/supabase/client";

/**
 * Hardened complete cache, storage, cookie, and session invalidation utility.
 * Fulfills Milestone 2 Feature F7 & F9 contracts:
 * - Dual-channel Service Worker PURGE_CACHES broadcast
 * - Fully awaited CacheStorage deletion
 * - Cookie invalidation (demo_role, demo_user, sb-*-auth-token)
 * - LocalStorage / SessionStorage clearing (preserving UI preferences qa_language & user_sect)
 * - Supabase Auth signOut with graceful offline fallback
 */
export async function executeSignOut(): Promise<void> {
  // 0. Server-side cookie & session invalidation (destroys HttpOnly cookies)
  if (typeof window !== "undefined" && typeof fetch === "function" && process.env.NODE_ENV !== "test") {
    try {
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 1000) : null;
      await fetch("/api/auth/signout", {
        method: "POST",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
        signal: controller?.signal,
      }).catch(() => {});
      if (timeoutId) clearTimeout(timeoutId);
    } catch {
      // Graceful offline fallback
    }
  }

  // 1. Purge cookies (demo credentials and Supabase client tokens)
  if (typeof document !== "undefined") {
    try {
      const expiredTokens = [
        "demo_role",
        "demo_user",
        "selected_ward",
        "selected_wards",
        "pending_oauth_role",
        "pending_oauth_wards",
        "auth_redirect",
      ];
      for (const token of expiredTokens) {
        document.cookie = `${token}=; path=/; max-age=0`;
        document.cookie = `${token}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }

      const cookieList = document.cookie.split(";");
      for (const cookie of cookieList) {
        const parts = cookie.split("=");
        const name = parts[0]?.trim();
        if (name && (name.startsWith("sb-") && name.includes("auth-token"))) {
          document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      }
    } catch (cookieErr) {
      console.warn("[executeSignOut] Cookie cleanup notice:", cookieErr);
    }
  }

  // 2. Purge client storage (localStorage, sessionStorage)
  if (typeof window !== "undefined") {
    try {
      // Preserve device user preferences (Language and Sect)
      const savedLang = localStorage.getItem("qa_language");
      const savedSect = localStorage.getItem("user_sect");

      localStorage.clear();

      if (savedLang) localStorage.setItem("qa_language", savedLang);
      if (savedSect) localStorage.setItem("user_sect", savedSect);
    } catch (lsErr) {
      console.warn("[executeSignOut] localStorage purge notice:", lsErr);
    }

    try {
      sessionStorage.clear();
    } catch (ssErr) {
      console.warn("[executeSignOut] sessionStorage purge notice:", ssErr);
    }

    // 3. Purge CacheStorage (await all deletions to prevent navigation race conditions)
    if ("caches" in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (cacheErr) {
        console.warn("[executeSignOut] CacheStorage purge notice:", cacheErr);
      }
    }

    // 4. Dual-channel Service Worker PURGE_CACHES broadcast
    if ("serviceWorker" in navigator) {
      try {
        // Channel A: Active controller
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage("PURGE_CACHES");
        }
        // Channel B: All registered active service workers (for uncontrolled/hard-reloaded pages)
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          reg.active?.postMessage("PURGE_CACHES");
        }
      } catch (swErr) {
        console.warn("[executeSignOut] Service worker purge notice:", swErr);
      }
    }
  }

  // 5. Supabase Auth signOut (gracefully handled even if offline)
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (authErr) {
    console.warn("[executeSignOut] Supabase signOut notice:", authErr);
  }
}
