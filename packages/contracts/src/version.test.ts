import { describe, it, expect } from "vitest";
import {
  APP_VERSION,
  MIN_SUPPORTED_VERSION,
  compareSemanticVersions,
  isVersionOutdated,
  isVersionBlocked,
} from "./version";

describe("Semantic Versioning & Client Invalidation Suite", () => {
  it("exports valid semantic version identifiers", () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(MIN_SUPPORTED_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("correctly compares semantic versions", () => {
    expect(compareSemanticVersions("1.1.0", "1.1.0")).toBe(0);
    expect(compareSemanticVersions("1.1.1", "1.1.0")).toBe(1);
    expect(compareSemanticVersions("1.2.0", "1.1.9")).toBe(1);
    expect(compareSemanticVersions("2.0.0", "1.9.9")).toBe(1);
    expect(compareSemanticVersions("1.0.9", "1.1.0")).toBe(-1);
    expect(compareSemanticVersions("0.9.5", "1.0.0")).toBe(-1);
  });

  it("handles 'v' prefix and build tags safely", () => {
    expect(compareSemanticVersions("v1.1.0", "1.1.0")).toBe(0);
    expect(compareSemanticVersions("v1.2.0-beta", "1.1.0")).toBe(1);
  });

  it("detects when a client version is outdated", () => {
    expect(isVersionOutdated("1.0.0", "1.1.0")).toBe(true);
    expect(isVersionOutdated("1.0.9", "1.1.0")).toBe(true);
    expect(isVersionOutdated("1.1.0", "1.1.0")).toBe(false);
    expect(isVersionOutdated("1.2.0", "1.1.0")).toBe(false);
  });

  it("identifies blocked / unusable legacy client versions", () => {
    // If min supported is 1.1.0, 1.0.5 is blocked
    expect(isVersionBlocked("1.0.5", "1.1.0")).toBe(true);
    expect(isVersionBlocked("1.0.9", "1.1.0")).toBe(true);
    expect(isVersionBlocked("1.1.0", "1.1.0")).toBe(false);
    expect(isVersionBlocked("1.1.1", "1.1.0")).toBe(false);
  });
});
