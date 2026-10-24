import { APP_VERSION, MIN_SUPPORTED_VERSION, compareSemanticVersions } from "@quran/contracts";
import { createClient } from "@/utils/supabase/client";

export const CURRENT_APP_VERSION = APP_VERSION;
export const DEFAULT_MIN_VERSION = MIN_SUPPORTED_VERSION;

export interface RemoteVersionInfo {
  latestVersion: string;
  minRequiredVersion: string;
  source: "endpoint" | "database" | "local_fallback";
}

/**
 * Checks if the given client version is older than the required minimum version.
 * Returns true if clientVersion < minRequiredVersion.
 */
export function isVersionOutdated(
  clientVersion: string = CURRENT_APP_VERSION,
  minRequiredVersion: string = DEFAULT_MIN_VERSION
): boolean {
  if (!minRequiredVersion) return false;
  return compareSemanticVersions(clientVersion, minRequiredVersion) < 0;
}

/**
 * Fetches the latest published version and minimum required version
 * from BOTH the public /version.json endpoint and the Supabase settings table.
 */
export async function fetchRemoteVersionInfo(): Promise<RemoteVersionInfo> {
  let highestRequiredVersion = DEFAULT_MIN_VERSION;
  let highestLatestVersion = CURRENT_APP_VERSION;
  let resolvedSource: RemoteVersionInfo["source"] = "local_fallback";

  // 1. Fetch from deployed static /version.json endpoint (bypasses any browser cache)
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.version) {
        if (compareSemanticVersions(data.version, highestLatestVersion) > 0) {
          highestLatestVersion = data.version;
        }
        resolvedSource = "endpoint";
      }
      if (data?.minSupportedVersion || data?.minRequiredVersion) {
        const minVer = data.minSupportedVersion || data.minRequiredVersion;
        if (compareSemanticVersions(minVer, highestRequiredVersion) > 0) {
          highestRequiredVersion = minVer;
        }
        resolvedSource = "endpoint";
      }
    }
  } catch (err) {
    console.warn("[VersionEnforcer] Could not reach /version.json endpoint:", err);
  }

  // 2. Query Supabase settings table (for instant remote cloud version gates)
  try {
    const supabase = createClient();
    const { data: settingsRows, error } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["min_required_version", "app_latest_version"]);

    if (!error && settingsRows && settingsRows.length > 0) {
      for (const row of settingsRows) {
        if (row.key === "min_required_version" && row.value) {
          if (compareSemanticVersions(row.value, highestRequiredVersion) > 0) {
            highestRequiredVersion = row.value;
          }
          resolvedSource = "database";
        }
        if (row.key === "app_latest_version" && row.value) {
          if (compareSemanticVersions(row.value, highestLatestVersion) > 0) {
            highestLatestVersion = row.value;
          }
          resolvedSource = "database";
        }
      }
    }
  } catch (err) {
    console.warn("[VersionEnforcer] Could not query Supabase settings version:", err);
  }

  // Cache latest known required version locally
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("quran_min_required_version", highestRequiredVersion);
      localStorage.setItem("quran_app_latest_version", highestLatestVersion);
    } catch {}
  }

  return {
    latestVersion: highestLatestVersion,
    minRequiredVersion: highestRequiredVersion,
    source: resolvedSource,
  };
}

/**
 * Hard purge all Service Worker caches, CacheStorage, and trigger clean hard reload
 */
export async function purgeCachesAndHardReload(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // 1. Purge all CacheStorage caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    // 2. Notify and unregister service workers
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        reg.active?.postMessage("PURGE_CACHES");
        await reg.unregister();
      }
    }

    // Clear session reload trackers
    sessionStorage.clear();
  } catch (e) {
    console.warn("[VersionEnforcer] Error during cache purge:", e);
  } finally {
    // Force browser bypass cache reload
    window.location.reload();
  }
}
