import { describe, it, expect } from "vitest";

describe("Public Navbar Auth, Profile Avatar & Dropdown Logic", () => {
  function getInitials(name: string): string {
    return (
      name
        .split(" ")
        .map((n: string) => n[0])
        .filter(Boolean)
        .join("")
        .substring(0, 2)
        .toUpperCase() || "U"
    );
  }

  function resolveDashboardHref(role?: string): string {
    if (role === "admin" || role === "superadmin") return "/admin";
    if (role === "teacher") return "/teacher";
    if (role === "parent") return "/parent";
    if (role === "student") return "/student";
    return "/dashboard";
  }

  function parseCookies(cookieString: string): { demoRole: string | null; demoUser: string | null } {
    const demoRoleMatch = cookieString.match(/(?:^|;\s*)demo_role=([^;]+)/);
    const demoUserMatch = cookieString.match(/(?:^|;\s*)demo_user=([^;]+)/);
    return {
      demoRole: demoRoleMatch ? decodeURIComponent(demoRoleMatch[1]) : null,
      demoUser: demoUserMatch ? decodeURIComponent(demoUserMatch[1]) : null,
    };
  }

  it("computes initials accurately for various user names", () => {
    expect(getInitials("Areeb Iqbal")).toBe("AI");
    expect(getInitials("Isbah Arfin")).toBe("IA");
    expect(getInitials("Demo Teacher")).toBe("DT");
    expect(getInitials("Super Admin")).toBe("SA");
    expect(getInitials("SingleName")).toBe("S");
    expect(getInitials("")).toBe("U");
  });

  it("resolves the correct portal dashboard route based on user role", () => {
    expect(resolveDashboardHref("admin")).toBe("/admin");
    expect(resolveDashboardHref("teacher")).toBe("/teacher");
    expect(resolveDashboardHref("parent")).toBe("/parent");
    expect(resolveDashboardHref("student")).toBe("/student");
    expect(resolveDashboardHref(undefined)).toBe("/dashboard");
  });

  it("extracts authenticated demo credentials from cookie string correctly", () => {
    const cookie = "other=123; demo_role=teacher; demo_user=Ustadha%20Fatima; ga=456";
    const { demoRole, demoUser } = parseCookies(cookie);
    expect(demoRole).toBe("teacher");
    expect(demoUser).toBe("Ustadha Fatima");
  });

  it("handles missing auth cookies safely", () => {
    const cookie = "theme=dark; dismissed=true";
    const { demoRole, demoUser } = parseCookies(cookie);
    expect(demoRole).toBeNull();
    expect(demoUser).toBeNull();
  });
});
