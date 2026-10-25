/**
 * apps/web/src/lib/security/redirect.ts
 *
 * Hardened Open-Redirect Defense & Safe Path Sanitizer
 * Rejects external origins, protocol-relative bypasses, control-character evasions,
 * backslash confusion, and nested percent-encoded attacks.
 *
 * Safely preserves legitimate deep links with query parameters, hash fragments,
 * and percent-encoded values (e.g., %20 space in search queries, Arabic characters).
 */

const DUMMY_ORIGIN = "http://localhost";

// ASCII control characters: 0x00 to 0x1F and 0x7F (DEL)
const CONTROL_CHAR_REGEX = /[\x00-\x1F\x7F]/;

// Unencoded whitespace characters
const WHITESPACE_REGEX = /\s/;

/**
 * Validates and returns a safe internal application path for redirection.
 * Returns null if the path is invalid, external, or malicious.
 */
export function sanitizeRedirectPath(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 1. Structural check: Must start with a single slash, not // or /\
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return null;
  }

  // 2. Raw string check: Reject unencoded whitespace or control characters
  if (WHITESPACE_REGEX.test(trimmed) || CONTROL_CHAR_REGEX.test(trimmed)) {
    return null;
  }

  // 3. Iterative decoding: Unmask nested encodings (e.g. %2509, %252f, %255c)
  let decoded = trimmed;
  try {
    for (let i = 0; i < 3; i++) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    // Malformed URI sequence (e.g. invalid % sequences)
    return null;
  }

  // 4. Decoded representation check: Reject decoded control characters (\t, \n, \r, \0)
  if (CONTROL_CHAR_REGEX.test(decoded)) {
    return null;
  }

  // 5. Decoded representation check: Reject decoded protocol-relative or backslash bypasses
  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.startsWith("/\\") ||
    decoded.startsWith("\\\\") ||
    decoded.startsWith("\\/") ||
    decoded.includes("\\")
  ) {
    return null;
  }

  // 6. WHATWG URL Parser Origin Containment Check
  try {
    // Validate raw trimmed string against dummy origin
    const parsedRaw = new URL(trimmed, DUMMY_ORIGIN);
    if (parsedRaw.origin !== DUMMY_ORIGIN) return null;
    if (!parsedRaw.pathname.startsWith("/") || parsedRaw.pathname.startsWith("//")) return null;

    // Validate fully decoded string against dummy origin
    const parsedDecoded = new URL(decoded, DUMMY_ORIGIN);
    if (parsedDecoded.origin !== DUMMY_ORIGIN) return null;
    if (!parsedDecoded.pathname.startsWith("/") || parsedDecoded.pathname.startsWith("//")) return null;

    return trimmed;
  } catch {
    return null;
  }
}

/**
 * Type guard returning true if redirect path is safe.
 */
export function isSafeRedirectPath(path?: string | null): path is string {
  return sanitizeRedirectPath(path) !== null;
}
