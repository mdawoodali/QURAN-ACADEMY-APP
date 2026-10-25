import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { sanitizeRedirectPath } from "@/lib/security/redirect";

describe("Challenger 2 — Empirical Route Casing & Boundary Challenge Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Requirement 1: Mandatory Mixed-Case Protected Routes Unauthenticated Access
  // =========================================================================
  describe("1. Mandatory Mixed-Case Routes (Unauthenticated Access)", () => {
    const mandatoryCases = [
      { path: "/Companion", expectedRedirectParam: "/Companion" },
      { path: "/COMPANION", expectedRedirectParam: "/COMPANION" },
      { path: "/Classroom/room-99", expectedRedirectParam: "/Classroom/room-99" },
      { path: "/Admin/settings", expectedRedirectParam: "/Admin/settings" },
      { path: "/Teacher/notes", expectedRedirectParam: "/Teacher/notes" },
    ];

    for (const { path, expectedRedirectParam } of mandatoryCases) {
      it(`intercepts unauthenticated access to '${path}' and bounces to /login with status 307`, async () => {
        const req = new NextRequest(`http://localhost:3000${path}`);
        const res = await middleware(req);

        // 1. Must redirect with status 307
        expect(res.status).toBe(307);

        // 2. Must contain location header pointing to /login
        const location = res.headers.get("location");
        expect(location).not.toBeNull();

        const redirectUrl = new URL(location!);
        expect(redirectUrl.pathname).toBe("/login");

        // 3. Must preserve redirect parameter with canonical path
        const redirectParam = redirectUrl.searchParams.get("redirect");
        expect(redirectParam).toBe(expectedRedirectParam);

        // 4. Must pass strict redirect sanitizer check
        const sanitized = sanitizeRedirectPath(redirectParam);
        expect(sanitized).toBe(expectedRedirectParam);
        expect(sanitized).not.toBeNull();
      });
    }
  });

  // =========================================================================
  // Requirement 2: Extended Adversarial Mixed-Case Route Variants
  // =========================================================================
  describe("2. Extended Mixed-Case Matrix (Student, Parent, Admin, Teacher, Classroom, Companion)", () => {
    const extendedCases = [
      { path: "/cOmPaNiOn", expectedParam: "/cOmPaNiOn" },
      { path: "/CLASSROOM/room-99", expectedParam: "/CLASSROOM/room-99" },
      { path: "/Classroom/Room-99-Alpha", expectedParam: "/Classroom/Room-99-Alpha" },
      { path: "/ADMIN/settings", expectedParam: "/ADMIN/settings" },
      { path: "/aDmIn/dashboard", expectedParam: "/aDmIn/dashboard" },
      { path: "/TEACHER/notes", expectedParam: "/TEACHER/notes" },
      { path: "/Teacher/Schedule", expectedParam: "/Teacher/Schedule" },
      { path: "/PARENT/billing", expectedParam: "/PARENT/billing" },
      { path: "/Parent/Children", expectedParam: "/Parent/Children" },
      { path: "/STUDENT/progress", expectedParam: "/STUDENT/progress" },
      { path: "/Student/Assignments", expectedParam: "/Student/Assignments" },
    ];

    for (const { path, expectedParam } of extendedCases) {
      it(`intercepts '${path}' -> status 307 -> /login?redirect=${encodeURIComponent(expectedParam)}`, async () => {
        const req = new NextRequest(`http://localhost:3000${path}`);
        const res = await middleware(req);

        expect(res.status).toBe(307);
        const location = res.headers.get("location");
        expect(location).not.toBeNull();

        const redirectUrl = new URL(location!);
        expect(redirectUrl.pathname).toBe("/login");
        expect(redirectUrl.searchParams.get("redirect")).toBe(expectedParam);

        const sanitized = sanitizeRedirectPath(redirectUrl.searchParams.get("redirect"));
        expect(sanitized).toBe(expectedParam);
      });
    }
  });

  // =========================================================================
  // Requirement 3: Query Parameter & Hash Integrity under Mixed-Case Routes
  // =========================================================================
  describe("3. Query Parameter Integrity on Mixed-Case Routes", () => {
    it("preserves query parameters on mixed-case /Classroom/room-99?cam=1&mic=0", async () => {
      const req = new NextRequest("http://localhost:3000/Classroom/room-99?cam=1&mic=0");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const url = new URL(res.headers.get("location")!);
      expect(url.pathname).toBe("/login");
      expect(url.searchParams.get("redirect")).toBe("/Classroom/room-99?cam=1&mic=0");
    });

    it("preserves query parameters on mixed-case /Companion?surah=18&ayah=10", async () => {
      const req = new NextRequest("http://localhost:3000/Companion?surah=18&ayah=10");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const url = new URL(res.headers.get("location")!);
      expect(url.pathname).toBe("/login");
      expect(url.searchParams.get("redirect")).toBe("/Companion?surah=18&ayah=10");
    });

    it("preserves search parameters with encoded values on /Admin/settings?section=audit%20logs", async () => {
      const req = new NextRequest("http://localhost:3000/Admin/settings?section=audit%20logs");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const url = new URL(res.headers.get("location")!);
      expect(url.pathname).toBe("/login");
      expect(url.searchParams.get("redirect")).toBe("/Admin/settings?section=audit%20logs");
      expect(sanitizeRedirectPath(url.searchParams.get("redirect"))).toBe("/Admin/settings?section=audit%20logs");
    });
  });

  // =========================================================================
  // Requirement 4: Public Marketing & Content Pages Accessibility with Mixed Casing
  // =========================================================================
  describe("4. Public Marketing Pages Accessibility with Mixed Casing", () => {
    const publicMixedCases = [
      // Root
      "/",
      // About
      "/about",
      "/About",
      "/ABOUT",
      "/aBoUt",
      // Courses
      "/courses",
      "/Courses",
      "/COURSES",
      "/cOuRsEs",
      // Pricing
      "/pricing",
      "/Pricing",
      "/PRICING",
      "/pRiCiNg",
      // Contact
      "/contact",
      "/Contact",
      "/CONTACT",
      "/cOnTaCt",
      // Additional public routes
      "/about-us",
      "/About-Us",
      "/ABOUT-US",
      "/login",
      "/Login",
      "/LOGIN",
      "/register",
      "/Register",
      "/REGISTER",
      "/trial",
      "/Trial",
      "/TRIAL",
    ];

    for (const route of publicMixedCases) {
      it(`serves public route '${route}' with HTTP 200 and NO redirection bounce`, async () => {
        const req = new NextRequest(`http://localhost:3000${route}`);
        const res = await middleware(req);

        // Status must be 200 OK (NextResponse.next)
        expect(res.status).toBe(200);

        // Location header must NOT be present
        expect(res.headers.get("location")).toBeNull();

        // Standard security headers must still be attached
        expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
        expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
        expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
        expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      });
    }
  });

  // =========================================================================
  // Requirement 5: Authenticated Cross-Portal Role Boundaries with Mixed Casing
  // =========================================================================
  describe("5. Authenticated Cross-Portal Boundaries with Mixed Casing", () => {
    it("redirects student away from mixed-case /Admin/settings to /student", async () => {
      const req = new NextRequest("http://localhost:3000/Admin/settings", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects student away from mixed-case /Teacher/notes to /student", async () => {
      const req = new NextRequest("http://localhost:3000/Teacher/notes", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects teacher away from mixed-case /Admin/settings to /teacher", async () => {
      const req = new NextRequest("http://localhost:3000/Admin/settings", {
        headers: { cookie: "demo_role=teacher" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/teacher");
    });

    it("redirects parent away from mixed-case /Teacher/notes to /parent", async () => {
      const req = new NextRequest("http://localhost:3000/Teacher/notes", {
        headers: { cookie: "demo_role=parent" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/parent");
    });

    it("permits admin access to mixed-case /Admin/settings and /Teacher/notes", async () => {
      for (const path of ["/Admin/settings", "/Teacher/notes", "/Student/progress"]) {
        const req = new NextRequest(`http://localhost:3000${path}`, {
          headers: { cookie: "demo_role=admin" },
        });
        const res = await middleware(req);
        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      }
    });

    it("permits superadmin access to mixed-case /Admin/settings and all portals", async () => {
      for (const path of ["/Admin/settings", "/Teacher/notes", "/Classroom/room-99", "/Companion"]) {
        const req = new NextRequest(`http://localhost:3000${path}`, {
          headers: { cookie: "demo_role=superadmin" },
        });
        const res = await middleware(req);
        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      }
    });

    it("permits student access to mixed-case /Companion and /Classroom/room-99", async () => {
      for (const path of ["/Companion", "/COMPANION", "/Classroom/room-99", "/CLASSROOM/room-99"]) {
        const req = new NextRequest(`http://localhost:3000${path}`, {
          headers: { cookie: "demo_role=student" },
        });
        const res = await middleware(req);
        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      }
    });
  });

  // =========================================================================
  // Requirement 6: Post-Login Redirection Handling for Mixed-Case Deep Links
  // =========================================================================
  describe("6. Post-Login Deep-Link Redirection Execution", () => {
    it("safely sanitizes and redirects to mixed-case internal deep link upon login", async () => {
      const safeTarget = sanitizeRedirectPath("/Classroom/room-99?camera=1");
      expect(safeTarget).toBe("/Classroom/room-99?camera=1");

      const resolved = new URL(safeTarget!, "http://localhost:3000");
      expect(resolved.origin).toBe("http://localhost:3000");
      expect(resolved.pathname).toBe("/Classroom/room-99");
      expect(resolved.searchParams.get("camera")).toBe("1");
    });

    it("rejects malicious open-redirect attempt masquerading under mixed case", async () => {
      const attackVectors = [
        "//COMPANION.evil.com",
        "//Companion/phishing",
        "/\\COMPANION.evil.com",
        "/%09COMPANION.evil.com",
        "/%2f%2fCOMPANION.evil.com",
        "/%5cCOMPANION.evil.com",
        "/COMPANION/%09/evil.com",
        "/Classroom/%0a/evil.com",
        "/Teacher/\\evil.com",
      ];

      for (const vector of attackVectors) {
        expect(sanitizeRedirectPath(vector)).toBeNull();
      }
    });
  });
});
