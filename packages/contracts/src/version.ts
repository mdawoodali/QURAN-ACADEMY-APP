/**
 * Authoritative Application Versioning & Compatibility Contract
 * Enforces unified semantic versioning across Web, PWA, Android, and iOS.
 */

export const APP_VERSION = "1.1.0";
export const MIN_SUPPORTED_VERSION = "1.1.0";
export const BUILD_CHANNEL = "production";

export interface VersionManifest {
  version: string;
  minSupportedVersion: string;
  buildTime: string;
  channel: string;
  commitHash?: string;
  mandatoryUpdateUrl?: string;
}

/**
 * Compares two semantic version strings (e.g., "1.1.0" vs "1.0.9")
 * Returns:
 *   1 if v1 > v2
 *  -1 if v1 < v2
 *   0 if v1 == v2
 */
export function compareSemanticVersions(v1: string, v2: string): number {
  const cleanV1 = v1.replace(/^v/, "").split("-")[0]!;
  const cleanV2 = v2.replace(/^v/, "").split("-")[0]!;

  const parts1 = cleanV1.split(".").map((n) => parseInt(n, 10) || 0);
  const parts2 = cleanV2.split(".").map((n) => parseInt(n, 10) || 0);

  const maxLen = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] ?? 0;
    const num2 = parts2[i] ?? 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

/**
 * Checks whether client version is strictly behind the current server version.
 */
export function isVersionOutdated(clientVersion: string, serverVersion: string = APP_VERSION): boolean {
  if (!clientVersion) return true;
  return compareSemanticVersions(clientVersion, serverVersion) < 0;
}

/**
 * Checks whether client version is below the minimum supported version,
 * rendering the client completely unusable until updated.
 */
export function isVersionBlocked(clientVersion: string, minSupported: string = MIN_SUPPORTED_VERSION): boolean {
  if (!clientVersion) return true;
  return compareSemanticVersions(clientVersion, minSupported) < 0;
}
