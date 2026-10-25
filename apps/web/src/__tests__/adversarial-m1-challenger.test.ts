import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { getDashboardHref } from "@/components/PublicNavbar";
import { getSafeRedirectPath, login } from "@/app/(public)/login/actions";

// Mock next/headers
const mockSetCookie = vi.fn();
const mockCookiesStore = {
  get: vi.fn(),
  set: mockSetCookie,
  getAll: vi.fn().mockReturnValue([]),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockImplementation(async () => mockCookiesStore),
  headers: vi.fn().mockImplementation(async () => new Headers()),
}));

// Mock Supabase server client
const mockSignInWithPassword = vi.fn();
let mockProfileRole: string | null = null;

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(async () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockImplementation(async () => ({
            data: mockProfileRole ? { role: mockProfileRole, first_name: "Test", last_name: "User" } : null,
          })),
        }),
      }),
    }),
  })),
}));

// Mock next/navigation redirect
const redirectCalls: string[] = [];
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    redirectCalls.push(url);
    const err = new Error(`NEXT_REDIRECT;replace;${url};307;;`);
    (err as { digest?: string }).digest = `NEXT_REDIRECT;replace;${url};307;;`;
    throw err;
  }),
}));

describe("Adversarial Challenger Suite: Redirection & Role Journeys", () => {
  beforeEach(() => {
    redirectCalls.length = 0;
    mockSetCookie.mockClear();
    mockSignInWithPassword.mockReset();
    mockProfileRole = null;
  });

  // =========================================================================
  // Challenge 1: getSafeRedirectPath Hostile Attack Vectors & Edge Cases
  // =========================================================================
  describe("Challenge 1: getSafeRedirectPath Hostile Attack Vectors", () => {
    const maliciousVectors = [
      // Protocol-relative variations
      "//attacker.com",
      "//attacker.com/steal-session",
      "//attacker.com:443",
      "//attacker.com?token=xyz",
      "///attacker.com",
      "////attacker.com",
      "/////attacker.com",
      "//localhost:8080@attacker.com",

      // Schemes
      "https://evil.com",
      "http://evil.com",
      "ftp://evil.com",
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
      "mailto:attacker@evil.com",
      "file:///etc/passwd",
      "blob:https://evil.com/uuid",

      // Backslash and mixed slashes
      "/\\evil.com", // literal /\evil.com
      "/\\\\evil.com", // literal /\\evil.com
      "/\\/evil.com",
      "//\\evil.com",
      "\\evil.com",
      "\\\\evil.com",
      "\\/evil.com",
      "\\/\\evil.com",

      // Whitespace and control character padded
      "  //evil.com",
      "\t//evil.com",
      "\r\n//evil.com",
      "/\\evil.com   ",

      // Null and empty
      "",
      "   ",
      "\t\n",
    ];

    for (const vector of maliciousVectors) {
      it(`rejects attack vector: ${JSON.stringify(vector)}`, async () => {
        const result = await getSafeRedirectPath(vector);
        expect(result).toBeNull();
      });
    }

    it("rejects null and undefined gracefully", async () => {
      expect(await getSafeRedirectPath(null)).toBeNull();
      expect(await getSafeRedirectPath(undefined)).toBeNull();
    });

    // Oracle Test: For any accepted path, when parsed against base origin, it MUST stay on origin
    const validAndEdgeCandidates = [
      "/student/progress?tab=history&filter=active",
      "/classroom/room-101?camera=true&mic=false&token=abc#whiteboard",
      "/student/assignments?surah=2&page=25",
      "/companion",
      "/admin/users",
      "/parent/billing?invoice=INV-2026-001",
      "/teacher/classes?sort=asc&view=grid",
      "/courses/tajweed-foundations",
      "/pricing",
      "/about-us",
      "/",
      "/a",
      "/foo/bar/baz?query=1&param=2",
      "/%2f%2fevil.com", // URI encoded slash - if accepted, MUST resolve within origin
      "/%5c%5cevil.com", // URI encoded backslash - if accepted, MUST resolve within origin
    ];

    for (const candidate of validAndEdgeCandidates) {
      it(`guarantees safe origin containment for candidate: ${candidate}`, async () => {
        const result = await getSafeRedirectPath(candidate);
        if (result !== null) {
          // Verify it is strictly relative
          expect(result.startsWith("/")).toBe(true);
          expect(result.startsWith("//")).toBe(false);
          expect(result.startsWith("/\\")).toBe(false);

          // Verify URL resolution against base origin
          const resolved = new URL(result, "http://localhost:3000");
          expect(resolved.origin).toBe("http://localhost:3000");
          expect(resolved.protocol).toBe("http:");
          expect(resolved.host).toBe("localhost:3000");
        }
      });
    }
  });

  // =========================================================================
  // Challenge 2: CRLF Injection & Header Poisoning Defense
  // =========================================================================
  describe("Challenge 2: CRLF Injection & Header Poisoning Defense", () => {
    const crlfVectors = [
      "/student\r\nSet-Cookie: evil_session=pwned",
      "/student\r\nLocation: https://evil.com",
      "/student\nLocation: https://evil.com",
      "/student\rLocation: https://evil.com",
      "/classroom\r\nX-Forwarded-Host: evil.com",
    ];

    for (const vector of crlfVectors) {
      it(`strictly rejects CRLF injection vector: ${JSON.stringify(vector)}`, async () => {
        const result = await getSafeRedirectPath(vector);
        expect(result).toBeNull();
      });
    }
  });

  // =========================================================================
  // Challenge 3: Deep-Link Preservation on Unauthenticated Bounces
  // =========================================================================
  describe("Challenge 3: Deep-Link Preservation & Query Param Integrity", () => {
    it("preserves complex deep link '?redirect=/student/progress?tab=history&filter=active'", async () => {
      const target = "http://localhost:3000/student/progress?tab=history&filter=active";
      const req = new NextRequest(target);
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe(
        "http://localhost:3000/login?redirect=%2Fstudent%2Fprogress%3Ftab%3Dhistory%26filter%3Dactive"
      );

      // Verify decode restores exact original target
      const url = new URL(location!);
      const redirectParam = url.searchParams.get("redirect");
      expect(redirectParam).toBe("/student/progress?tab=history&filter=active");

      // Verify getSafeRedirectPath accepts the preserved redirectParam
      const safePath = await getSafeRedirectPath(redirectParam);
      expect(safePath).toBe("/student/progress?tab=history&filter=active");
    });

    it("preserves classroom deep link with video/audio parameters", async () => {
      const target = "http://localhost:3000/classroom/room-session-99?cam=1&mic=0&layout=tiled";
      const req = new NextRequest(target);
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      const url = new URL(location!);
      const redirectParam = url.searchParams.get("redirect");
      expect(redirectParam).toBe("/classroom/room-session-99?cam=1&mic=0&layout=tiled");

      const safePath = await getSafeRedirectPath(redirectParam);
      expect(safePath).toBe("/classroom/room-session-99?cam=1&mic=0&layout=tiled");
    });

    it("preserves companion deep link with surah and ayah parameters", async () => {
      const target = "http://localhost:3000/companion?surah=18&ayah=10";
      const req = new NextRequest(target);
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      const url = new URL(location!);
      const redirectParam = url.searchParams.get("redirect");
      expect(redirectParam).toBe("/companion?surah=18&ayah=10");

      const safePath = await getSafeRedirectPath(redirectParam);
      expect(safePath).toBe("/companion?surah=18&ayah=10");
    });
  });

  // =========================================================================
  // Challenge 4: All 5 Roles Route Cleanly With Zero Bounces or Exceptions
  // =========================================================================
  describe("Challenge 4: Comprehensive 5-Role Journey Clean Routing", () => {
    const roles = ["student", "parent", "teacher", "admin", "superadmin"] as const;

    describe("PublicNavbar getDashboardHref resolution for all roles", () => {
      it("resolves student -> /student", () => {
        expect(getDashboardHref("student")).toBe("/student");
      });

      it("resolves parent -> /parent", () => {
        expect(getDashboardHref("parent")).toBe("/parent");
      });

      it("resolves teacher -> /teacher", () => {
        expect(getDashboardHref("teacher")).toBe("/teacher");
      });

      it("resolves admin -> /admin", () => {
        expect(getDashboardHref("admin")).toBe("/admin");
      });

      it("resolves superadmin -> /admin (NEVER /superadmin)", () => {
        const href = getDashboardHref("superadmin");
        expect(href).toBe("/admin");
        expect(href).not.toBe("/superadmin");
      });

      it("resolves null/undefined/empty -> /dashboard", () => {
        expect(getDashboardHref(null)).toBe("/dashboard");
        expect(getDashboardHref(undefined)).toBe("/dashboard");
        expect(getDashboardHref("")).toBe("/dashboard");
      });
    });

    describe("Login Action Role Routing across all roles", () => {
      for (const role of roles) {
        it(`logs in '${role}' and routes cleanly to valid destination`, async () => {
          mockSignInWithPassword.mockResolvedValueOnce({
            data: { user: { id: `user-${role}` } },
            error: null,
          });
          mockProfileRole = role;

          const formData = new FormData();
          formData.append("email", `${role}@quranacademy.com`);
          formData.append("password", "valid-password");

          try {
            await login(formData);
          } catch (err: unknown) {
            const digest = (err as { digest?: string })?.digest;
            expect(digest).toBeDefined();
            expect(digest?.startsWith("NEXT_REDIRECT")).toBe(true);
          }

          const expectedTarget = role === "superadmin" ? "/admin" : `/${role}`;
          expect(redirectCalls).toContain(expectedTarget);
          expect(redirectCalls).not.toContain("/superadmin");
        });
      }
    });

    describe("Cross-Portal Boundary Enforcement Matrix", () => {
      // Role access rules from middleware:
      // - admin / superadmin: can access all portals
      // - student: can access /student, /companion, /classroom; blocked from /admin, /teacher, /parent
      // - teacher: can access /teacher, /student, /companion, /classroom; blocked from /admin, /parent
      // - parent: can access /parent, /student, /companion, /classroom; blocked from /admin, /teacher

      it("enforces Student boundaries", async () => {
        // Allowed
        for (const path of ["/student", "/companion", "/classroom/room-1"]) {
          const req = new NextRequest(`http://localhost:3000${path}`, {
            headers: { cookie: "demo_role=student" },
          });
          const res = await middleware(req);
          expect(res.status).toBe(200);
        }
        // Forbidden -> bounces to /student
        for (const path of ["/admin", "/teacher", "/parent"]) {
          const req = new NextRequest(`http://localhost:3000${path}`, {
            headers: { cookie: "demo_role=student" },
          });
          const res = await middleware(req);
          expect(res.status).toBe(307);
          expect(res.headers.get("location")).toBe("http://localhost:3000/student");
        }
      });

      it("enforces Teacher boundaries", async () => {
        // Allowed
        for (const path of ["/teacher", "/student", "/companion", "/classroom/room-1"]) {
          const req = new NextRequest(`http://localhost:3000${path}`, {
            headers: { cookie: "demo_role=teacher" },
          });
          const res = await middleware(req);
          expect(res.status).toBe(200);
        }
        // Forbidden -> bounces to /teacher
        for (const path of ["/admin", "/parent"]) {
          const req = new NextRequest(`http://localhost:3000${path}`, {
            headers: { cookie: "demo_role=teacher" },
          });
          const res = await middleware(req);
          expect(res.status).toBe(307);
          expect(res.headers.get("location")).toBe("http://localhost:3000/teacher");
        }
      });

      it("enforces Parent boundaries", async () => {
        // Allowed
        for (const path of ["/parent", "/student", "/companion", "/classroom/room-1"]) {
          const req = new NextRequest(`http://localhost:3000${path}`, {
            headers: { cookie: "demo_role=parent" },
          });
          const res = await middleware(req);
          expect(res.status).toBe(200);
        }
        // Forbidden -> bounces to /parent
        for (const path of ["/admin", "/teacher"]) {
          const req = new NextRequest(`http://localhost:3000${path}`, {
            headers: { cookie: "demo_role=parent" },
          });
          const res = await middleware(req);
          expect(res.status).toBe(307);
          expect(res.headers.get("location")).toBe("http://localhost:3000/parent");
        }
      });

      it("enforces Admin & Superadmin universal access", async () => {
        for (const role of ["admin", "superadmin"]) {
          for (const path of ["/admin", "/teacher", "/parent", "/student", "/companion", "/classroom/room-1"]) {
            const req = new NextRequest(`http://localhost:3000${path}`, {
              headers: { cookie: `demo_role=${role}` },
            });
            const res = await middleware(req);
            expect(res.status).toBe(200);
            expect(res.headers.get("location")).toBeNull();
          }
        }
      });
    });

    describe("Public Visitor Protected Route Interception", () => {
      const protectedPaths = [
        "/student",
        "/student/progress",
        "/teacher",
        "/teacher/classes",
        "/parent",
        "/parent/billing",
        "/admin",
        "/admin/settings",
        "/companion",
        "/classroom/hifz-101",
      ];

      for (const path of protectedPaths) {
        it(`strictly intercepts unauthenticated access to '${path}' and bounces to /login?redirect=...`, async () => {
          const req = new NextRequest(`http://localhost:3000${path}`);
          const res = await middleware(req);

          expect(res.status).toBe(307);
          const location = res.headers.get("location");
          expect(location).toBeDefined();
          expect(location).toContain("/login?redirect=");
          expect(location).toContain(encodeURIComponent(path));
        });
      }
    });
  });

  // =========================================================================
  // Challenge 5: Login Action with Malicious Redirect Payload
  // =========================================================================
  describe("Challenge 5: Login Server Action Under Attack Payloads", () => {
    const maliciousPayloads = [
      "//evil.com",
      "https://attacker.org/steal",
      "/\\phishing.com",
      "javascript:alert(1)",
    ];

    for (const payload of maliciousPayloads) {
      it(`discards malicious redirect '${payload}' and falls back to user role dashboard`, async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "user-std" } },
          error: null,
        });
        mockProfileRole = "student";

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "correct-password");
        formData.append("redirect", payload);

        try {
          await login(formData);
        } catch (err: unknown) {
          const digest = (err as { digest?: string })?.digest;
          expect(digest?.startsWith("NEXT_REDIRECT")).toBe(true);
        }

        expect(redirectCalls).not.toContain(payload);
        expect(redirectCalls).toContain("/student");
      });
    }

    it("accepts safe deep-link '?redirect=/student/progress?tab=history&filter=active' and redirects there", async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: { id: "user-std" } },
        error: null,
      });
      mockProfileRole = "student";

      const formData = new FormData();
      formData.append("email", "student@quranacademy.com");
      formData.append("password", "correct-password");
      formData.append("redirect", "/student/progress?tab=history&filter=active");

      try {
        await login(formData);
      } catch (err: unknown) {
        const digest = (err as { digest?: string })?.digest;
        expect(digest?.startsWith("NEXT_REDIRECT")).toBe(true);
      }

      expect(redirectCalls).toContain("/student/progress?tab=history&filter=active");
    });
  });

  // =========================================================================
  // Challenge 6: Milestone 1 Iteration 2 — 46 Regression-Prevention Matrix
  // =========================================================================
  describe("Challenge 6: Milestone 1 Iteration 2 — 46 Regression-Prevention Matrix", () => {
    // -----------------------------------------------------------------------
    // Matrix 1: Open-Redirect & Control-Character Defense (16 Tests)
    // -----------------------------------------------------------------------
    describe("Matrix 1: Open-Redirect & Control-Character Defense (16 Tests)", () => {
      const controlCharVectors = [
        { id: "OR-01", vector: "/%09/evil.com", desc: "Encoded tab" },
        { id: "OR-02", vector: "/%0a/evil.com", desc: "Encoded LF" },
        { id: "OR-03", vector: "/%0d/evil.com", desc: "Encoded CR" },
        { id: "OR-04", vector: "/%00/evil.com", desc: "Encoded null byte" },
        { id: "OR-05", vector: "/\t/evil.com", desc: "Raw tab literal" },
        { id: "OR-06", vector: "/\n/evil.com", desc: "Raw newline literal" },
        { id: "OR-07", vector: "/\r/evil.com", desc: "Raw CR literal" },
        { id: "OR-08", vector: "/\0/evil.com", desc: "Raw null byte literal" },
        { id: "OR-09", vector: "/%0A/evil.com", desc: "Uppercase hex LF" },
        { id: "OR-10", vector: "/%0D/evil.com", desc: "Uppercase hex CR" },
        { id: "OR-11", vector: "/%2509/evil.com", desc: "Double-encoded tab" },
        { id: "OR-12", vector: "/\r\n/evil.com", desc: "Raw CRLF" },
        { id: "OR-13", vector: "/%0d%0a/evil.com", desc: "Encoded CRLF" },
        { id: "OR-14", vector: "/%09/phishing.com/login?token=abc", desc: "Encoded tab with path & query" },
        { id: "OR-15", vector: "/student\r\nLocation: https://evil.com", desc: "Embedded CRLF in path" },
        { id: "OR-16", vector: "/student\t/evil.com", desc: "Embedded tab in subpath" },
      ];

      for (const { id, vector, desc } of controlCharVectors) {
        it(`[${id}] strictly rejects vector (${desc}): ${JSON.stringify(vector)}`, async () => {
          const result = await getSafeRedirectPath(vector);
          expect(result).toBeNull();
        });
      }
    });

    // -----------------------------------------------------------------------
    // Matrix 2: Case-Insensitive Route Protection & Cross-Portal Boundary (18 Tests)
    // -----------------------------------------------------------------------
    describe("Matrix 2: Case-Insensitive Route Protection & Cross-Portal Boundary (18 Tests)", () => {
      const mixedCaseGuards = [
        { id: "CP-01", path: "/COMPANION", expectedRedirect: "/login?redirect=%2FCOMPANION" },
        { id: "CP-02", path: "/Companion", expectedRedirect: "/login?redirect=%2FCompanion" },
        { id: "CP-03", path: "/cOmPaNiOn", expectedRedirect: "/login?redirect=%2FcOmPaNiOn" },
        { id: "CP-04", path: "/CLASSROOM/room-101", expectedRedirect: "/login?redirect=%2FCLASSROOM%2Froom-101" },
        { id: "CP-05", path: "/Classroom/room-101", expectedRedirect: "/login?redirect=%2FClassroom%2Froom-101" },
        { id: "CP-06", path: "/classroom/ROOM-101", expectedRedirect: "/login?redirect=%2Fclassroom%2FROOM-101" },
        { id: "CP-07", path: "/STUDENT", expectedRedirect: "/login?redirect=%2FSTUDENT" },
        { id: "CP-08", path: "/Student/dashboard", expectedRedirect: "/login?redirect=%2FStudent%2Fdashboard" },
        { id: "CP-09", path: "/TEACHER", expectedRedirect: "/login?redirect=%2FTEACHER" },
        { id: "CP-10", path: "/Teacher/schedule", expectedRedirect: "/login?redirect=%2FTeacher%2Fschedule" },
        { id: "CP-11", path: "/ADMIN", expectedRedirect: "/login?redirect=%2FADMIN" },
        { id: "CP-12", path: "/Admin/users", expectedRedirect: "/login?redirect=%2FAdmin%2Fusers" },
        { id: "CP-13", path: "/PARENT", expectedRedirect: "/login?redirect=%2FPARENT" },
        { id: "CP-14", path: "/Parent/billing", expectedRedirect: "/login?redirect=%2FParent%2Fbilling" },
      ];

      for (const { id, path, expectedRedirect } of mixedCaseGuards) {
        it(`[${id}] intercepts unauthenticated access to mixed-case '${path}'`, async () => {
          const req = new NextRequest(`http://localhost:3000${path}`);
          const res = await middleware(req);
          expect(res.status).toBe(307);
          const location = res.headers.get("location");
          expect(location).toBeDefined();
          expect(location).toContain(expectedRedirect);
        });
      }

      const crossPortalMixed = [
        { id: "CP-15", path: "/ADMIN/users", role: "student", expectedTarget: "http://localhost:3000/student" },
        { id: "CP-16", path: "/Teacher/schedule", role: "student", expectedTarget: "http://localhost:3000/student" },
        { id: "CP-17", path: "/Admin/finance", role: "teacher", expectedTarget: "http://localhost:3000/teacher" },
        { id: "CP-18", path: "/Teacher/classes", role: "parent", expectedTarget: "http://localhost:3000/parent" },
      ];

      for (const { id, path, role, expectedTarget } of crossPortalMixed) {
        it(`[${id}] blocks role '${role}' from accessing mixed-case '${path}'`, async () => {
          const req = new NextRequest(`http://localhost:3000${path}`, {
            headers: { cookie: `demo_role=${role}` },
          });
          const res = await middleware(req);
          expect(res.status).toBe(307);
          expect(res.headers.get("location")).toBe(expectedTarget);
        });
      }
    });

    // -----------------------------------------------------------------------
    // Matrix 3: Complex Legitimate Deep Links Acceptance & Integrity (12 Tests)
    // -----------------------------------------------------------------------
    describe("Matrix 3: Complex Legitimate Deep Links Acceptance & Integrity (12 Tests)", () => {
      const legitimateDeepLinks = [
        { id: "DL-01", path: "/student/assignments?surah=2&page=25&filter=pending&sort=dueDate" },
        { id: "DL-02", path: "/student/progress?tab=history&filter=active&search=Ahmad%20Khan" },
        { id: "DL-03", path: "/courses/tajweed-foundations?category=quran%20recitation&level=intermediate" },
        { id: "DL-04", path: "/teacher/schedule?startDate=2026-11-01T08%3A00%3A00Z&endDate=2026-11-07T18%3A00%3A00Z" },
        { id: "DL-05", path: "/classroom/room-101?camera=true&mic=false&stream=1&quality=1080p" },
        { id: "DL-06", path: "/classroom/room-101?token=eyJhbGciOiJIUzI1NiJ9.test&session=123e4567-e89b-12d3-a456-426614174000#whiteboard" },
        { id: "DL-07", path: "/companion?surah=18&ayah=10&translation=en.sahih&audio=alafasy" },
        { id: "DL-08", path: "/parent/billing?invoice=INV-2026-001&currency=GBP&status=unpaid" },
        { id: "DL-09", path: "/admin/users?role=student&status=active&search=Fatima%20Zahra" },
        { id: "DL-10", path: "/classroom/session-xyz?layout=grid&screen=share&participants=3&recording=1" },
        { id: "DL-11", path: "/companion?surah=1&q=%D8%A7%D9%84%D8%AD%D9%85%D8%AF%20%D9%84%D9%84%D9%87" },
        { id: "DL-12", path: "/parent/billing?invoice=INV-2026-001&returnTo=%2Fparent%2Fdashboard" },
      ];

      for (const { id, path } of legitimateDeepLinks) {
        it(`[${id}] safely accepts and preserves deep-link: ${path}`, async () => {
          const result = await getSafeRedirectPath(path);
          expect(result).toBe(path);
        });
      }
    });
  });
});
