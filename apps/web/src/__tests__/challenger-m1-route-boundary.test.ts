import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { getDashboardHref } from "@/components/PublicNavbar";
import { getSafeRedirectPath } from "@/app/(public)/login/actions";

describe("Challenger 2 — Adversarial Middleware & Route Boundary Verification", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Scope 1: Unauthenticated Requests Bouncing to /login?redirect=...
  // =========================================================================
  describe("1. Unauthenticated Requests Bouncing to /login?redirect=...", () => {
    const protectedTestCases = [
      { path: "/companion", expectedRedirect: "/companion" },
      { path: "/classroom/room-123", expectedRedirect: "/classroom/room-123" },
      { path: "/student/dashboard", expectedRedirect: "/student/dashboard" },
      { path: "/teacher/schedule", expectedRedirect: "/teacher/schedule" },
      { path: "/admin/users", expectedRedirect: "/admin/users" },
      { path: "/parent/billing", expectedRedirect: "/parent/billing" },
    ];

    for (const { path, expectedRedirect } of protectedTestCases) {
      it(`bounces unauthenticated request to '${path}' with status 307 to /login?redirect=...`, async () => {
        const req = new NextRequest(`http://localhost:3000${path}`);
        const res = await middleware(req);

        expect(res.status).toBe(307);
        const location = res.headers.get("location");
        expect(location).not.toBeNull();
        const targetUrl = new URL(location!);
        expect(targetUrl.pathname).toBe("/login");
        expect(targetUrl.searchParams.get("redirect")).toBe(expectedRedirect);
      });
    }

    it("preserves query parameters on unauthenticated bounce for classroom", async () => {
      const req = new NextRequest("http://localhost:3000/classroom/room-123?video=true&audio=true");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const targetUrl = new URL(res.headers.get("location")!);
      expect(targetUrl.pathname).toBe("/login");
      expect(targetUrl.searchParams.get("redirect")).toBe("/classroom/room-123?video=true&audio=true");
    });

    it("preserves query parameters on unauthenticated bounce for student portal", async () => {
      const req = new NextRequest("http://localhost:3000/student/dashboard?tab=quran&surah=18&ayah=10");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const targetUrl = new URL(res.headers.get("location")!);
      expect(targetUrl.pathname).toBe("/login");
      expect(targetUrl.searchParams.get("redirect")).toBe("/student/dashboard?tab=quran&surah=18&ayah=10");
    });

    it("preserves query parameters on unauthenticated bounce for teacher schedule", async () => {
      const req = new NextRequest("http://localhost:3000/teacher/schedule?date=2026-11-01&view=week");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const targetUrl = new URL(res.headers.get("location")!);
      expect(targetUrl.pathname).toBe("/login");
      expect(targetUrl.searchParams.get("redirect")).toBe("/teacher/schedule?date=2026-11-01&view=week");
    });

    it("preserves query parameters on unauthenticated bounce for parent billing", async () => {
      const req = new NextRequest("http://localhost:3000/parent/billing?currency=GBP&invoiceId=INV-9901");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const targetUrl = new URL(res.headers.get("location")!);
      expect(targetUrl.pathname).toBe("/login");
      expect(targetUrl.searchParams.get("redirect")).toBe("/parent/billing?currency=GBP&invoiceId=INV-9901");
    });

    it("bounces unauthenticated requests to mixed-case routes (/COMPANION, /Classroom/123)", async () => {
      const mixedCases = [
        { path: "/COMPANION", expectedQuery: "/COMPANION" },
        { path: "/Classroom/room-99", expectedQuery: "/Classroom/room-99" },
        { path: "/STUDENT/dashboard", expectedQuery: "/STUDENT/dashboard" },
        { path: "/Teacher/schedule", expectedQuery: "/Teacher/schedule" },
      ];

      for (const { path, expectedQuery } of mixedCases) {
        const req = new NextRequest(`http://localhost:3000${path}`);
        const res = await middleware(req);

        expect(res.status).toBe(307);
        const targetUrl = new URL(res.headers.get("location")!);
        expect(targetUrl.pathname).toBe("/login");
        expect(targetUrl.searchParams.get("redirect")).toBe(expectedQuery);
      }
    });
  });

  // =========================================================================
  // Scope 2: Public Routes Remain 100% Accessible Without Redirect Bounces
  // =========================================================================
  describe("2. Public Routes 100% Accessible (No Redirect Bounces)", () => {
    const requiredPublicRoutes = [
      "/",
      "/about",
      "/courses",
      "/pricing",
      "/contact",
      "/login",
      "/register",
    ];

    for (const route of requiredPublicRoutes) {
      it(`serves public route '${route}' with status 200 without redirecting unauthenticated visitor`, async () => {
        const req = new NextRequest(`http://localhost:3000${route}`);
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      });
    }

    const additionalPublicRoutes = [
      "/about-us",
      "/programmes",
      "/packages",
      "/payments",
      "/teach-with-us",
      "/blog",
      "/trial",
    ];

    for (const route of additionalPublicRoutes) {
      it(`serves additional marketing route '${route}' with status 200 without redirecting`, async () => {
        const req = new NextRequest(`http://localhost:3000${route}`);
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      });
    }

    it("ensures public routes receive OWASP security headers", async () => {
      const req = new NextRequest("http://localhost:3000/");
      const res = await middleware(req);

      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
      expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
      expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    });
  });

  // =========================================================================
  // Scope 3: getDashboardHref Navbar Link Resolution Across All Roles
  // =========================================================================
  describe("3. getDashboardHref Navbar Link Resolution Across All Roles", () => {
    it("resolves student role to '/student'", () => {
      expect(getDashboardHref("student")).toBe("/student");
    });

    it("resolves parent role to '/parent'", () => {
      expect(getDashboardHref("parent")).toBe("/parent");
    });

    it("resolves teacher role to '/teacher'", () => {
      expect(getDashboardHref("teacher")).toBe("/teacher");
    });

    it("resolves admin role to '/admin'", () => {
      expect(getDashboardHref("admin")).toBe("/admin");
    });

    it("resolves superadmin role to '/admin' (STRICT: NEVER '/superadmin')", () => {
      const resolved = getDashboardHref("superadmin");
      expect(resolved).toBe("/admin");
      expect(resolved).not.toBe("/superadmin");
    });

    it("handles null role gracefully by falling back to '/dashboard'", () => {
      expect(getDashboardHref(null)).toBe("/dashboard");
    });

    it("handles undefined role gracefully by falling back to '/dashboard'", () => {
      expect(getDashboardHref(undefined)).toBe("/dashboard");
    });

    it("handles empty string gracefully by falling back to '/dashboard'", () => {
      expect(getDashboardHref("")).toBe("/dashboard");
    });

    it("handles non-existent role gracefully by falling back to '/dashboard'", () => {
      expect(getDashboardHref("guest")).toBe("/dashboard");
      expect(getDashboardHref("moderator")).toBe("/dashboard");
    });
  });

  // =========================================================================
  // Scope 4: Cross-Portal Authorization Boundaries & Role Guarding
  // =========================================================================
  describe("4. Role Boundaries & Cross-Portal Access Control", () => {
    it("redirects student away from /admin/users to /student", async () => {
      const req = new NextRequest("http://localhost:3000/admin/users", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects student away from /teacher/schedule to /student", async () => {
      const req = new NextRequest("http://localhost:3000/teacher/schedule", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects teacher away from /admin/users to /teacher", async () => {
      const req = new NextRequest("http://localhost:3000/admin/users", {
        headers: { cookie: "demo_role=teacher" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/teacher");
    });

    it("redirects teacher away from /parent/billing to /teacher", async () => {
      const req = new NextRequest("http://localhost:3000/parent/billing", {
        headers: { cookie: "demo_role=teacher" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/teacher");
    });

    it("redirects parent away from /admin/users to /parent", async () => {
      const req = new NextRequest("http://localhost:3000/admin/users", {
        headers: { cookie: "demo_role=parent" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/parent");
    });

    it("redirects parent away from /teacher/schedule to /parent", async () => {
      const req = new NextRequest("http://localhost:3000/teacher/schedule", {
        headers: { cookie: "demo_role=parent" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/parent");
    });

    it("permits admin access to /admin/users", async () => {
      const req = new NextRequest("http://localhost:3000/admin/users", {
        headers: { cookie: "demo_role=admin" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("permits superadmin access to all portals without redirection", async () => {
      const portals = [
        "/admin/users",
        "/teacher/schedule",
        "/student/dashboard",
        "/parent/billing",
        "/companion",
        "/classroom/room-123",
      ];
      for (const portal of portals) {
        const req = new NextRequest(`http://localhost:3000${portal}`, {
          headers: { cookie: "demo_role=superadmin" },
        });
        const res = await middleware(req);
        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      }
    });

    it("permits students and teachers access to /companion and /classroom", async () => {
      for (const role of ["student", "teacher"]) {
        const reqCompanion = new NextRequest("http://localhost:3000/companion", {
          headers: { cookie: `demo_role=${role}` },
        });
        const resCompanion = await middleware(reqCompanion);
        expect(resCompanion.status).toBe(200);

        const reqClassroom = new NextRequest("http://localhost:3000/classroom/room-123", {
          headers: { cookie: `demo_role=${role}` },
        });
        const resClassroom = await middleware(reqClassroom);
        expect(resClassroom.status).toBe(200);
      }
    });
  });

  // =========================================================================
  // Scope 5: Adversarial Open Redirect Defense Verification
  // =========================================================================
  describe("5. Adversarial Open Redirect Defense", () => {
    it("accepts legitimate internal paths", async () => {
      expect(await getSafeRedirectPath("/companion")).toBe("/companion");
      expect(await getSafeRedirectPath("/classroom/room-123")).toBe("/classroom/room-123");
      expect(await getSafeRedirectPath("/student/dashboard?lang=ur")).toBe("/student/dashboard?lang=ur");
      expect(await getSafeRedirectPath("/teacher/schedule")).toBe("/teacher/schedule");
      expect(await getSafeRedirectPath("/admin/users")).toBe("/admin/users");
      expect(await getSafeRedirectPath("/parent/billing")).toBe("/parent/billing");
    });

    it("rejects external scheme-prefixed redirect attacks", async () => {
      expect(await getSafeRedirectPath("https://attacker.com")).toBeNull();
      expect(await getSafeRedirectPath("http://evil.org/phish")).toBeNull();
      expect(await getSafeRedirectPath("ftp://malicious.net")).toBeNull();
      expect(await getSafeRedirectPath("javascript:alert(document.cookie)")).toBeNull();
      expect(await getSafeRedirectPath("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==")).toBeNull();
    });

    it("rejects protocol-relative redirect attacks (//attacker.com)", async () => {
      expect(await getSafeRedirectPath("//attacker.com")).toBeNull();
      expect(await getSafeRedirectPath("//evil.org/steal")).toBeNull();
      expect(await getSafeRedirectPath("///triple-slash.com")).toBeNull();
    });

    it("rejects backslash evasion redirect attacks (/\\attacker.com)", async () => {
      expect(await getSafeRedirectPath("/\\attacker.com")).toBeNull();
      expect(await getSafeRedirectPath("/\\evil.com/path")).toBeNull();
    });

    it("rejects empty or whitespace inputs", async () => {
      expect(await getSafeRedirectPath(null)).toBeNull();
      expect(await getSafeRedirectPath(undefined)).toBeNull();
      expect(await getSafeRedirectPath("")).toBeNull();
      expect(await getSafeRedirectPath("    ")).toBeNull();
    });

    it("rejects control-character and encoded protocol-relative evasion vectors", async () => {
      const evasions = [
        "/%09/evil.com",
        "/%0a/evil.com",
        "/%0d/evil.com",
        "/%00/evil.com",
        "/\t/evil.com",
        "/\n/evil.com",
        "/\r/evil.com",
        "/\0/evil.com",
      ];

      for (const evasion of evasions) {
        expect(await getSafeRedirectPath(evasion)).toBeNull();
      }
    });

    it("accepts complex legitimate deep links with encoded spaces (%20) and query parameters", async () => {
      const validComplexLinks = [
        "/student/dashboard?search=Ahmad%20Khan&tab=tajweed",
        "/classroom/room-123?video=true&audio=true&quality=1080p#active",
        "/parent/billing?currency=GBP&invoiceId=INV-9901&date=2026-10-25",
        "/companion?surah=18&ayah=10&translation=en.sahih",
      ];

      for (const link of validComplexLinks) {
        expect(await getSafeRedirectPath(link)).toBe(link);
      }
    });
  });
});
