import { describe, it, expect } from "vitest";
import { isVersionOutdated, CURRENT_APP_VERSION } from "../lib/versionEnforcer";

describe("Shaheen-Level Version Enforcer Suite", () => {
  it("detects when a client is running an outdated version", () => {
    expect(isVersionOutdated("1.0.0", "1.1.0")).toBe(true);
    expect(isVersionOutdated("0.9.8", "1.0.0")).toBe(true);
    expect(isVersionOutdated("1.1.0", "1.1.1")).toBe(true);
  });

  it("permits clients running on or above required version", () => {
    expect(isVersionOutdated("1.1.0", "1.1.0")).toBe(false);
    expect(isVersionOutdated("1.2.0", "1.1.0")).toBe(false);
    expect(isVersionOutdated("2.0.0", "1.1.0")).toBe(false);
  });

  it("handles null or undefined minRequiredVersion gracefully", () => {
    expect(isVersionOutdated(CURRENT_APP_VERSION, undefined as any)).toBe(false);
    expect(isVersionOutdated(CURRENT_APP_VERSION, "" as any)).toBe(false);
  });
});
