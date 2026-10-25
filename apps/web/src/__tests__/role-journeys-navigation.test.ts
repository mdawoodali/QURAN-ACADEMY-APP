import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { getDashboardHref } from "@/components/PublicNavbar";
import { getSafeRedirectPath, login } from "@/app/(public)/login/actions";

// Mock next/headers for server action testing
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

// Mock Supabase server client for login action tests
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

// Mock next/navigation redirect to capture redirection target path
const redirectCalls: string[] = [];
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    redirectCalls.push(url);
    const err = new Error(`NEXT_REDIRECT;replace;${url};307;;`);
    (err as { digest?: string }).digest = `NEXT_REDIRECT;replace;${url};307;;`;
    throw err;
  }),
}));

describe("Milestone 1 — Role Journeys, Navigation & Route Protection Suite", () => {
  beforeEach(() => {
    redirectCalls.length = 0;
    mockSetCookie.mockClear();
    mockSignInWithPassword.mockReset();
    mockProfileRole = null;
  });

  // =========================================================================
  // Requirement 1 & 4: Dashboard Href Resolution for All 5 Roles (F2)
  // =========================================================================
  describe("1. PublicNavbar Dashboard Link Resolution (F2)", () => {
    it("maps 'student' role to '/student'", () => {
      expect(getDashboardHref("student")).toBe("/student");
    });

    it("maps 'parent' role to '/parent'", () => {
      expect(getDashboardHref("parent")).toBe("/parent");
    });

    it("maps 'teacher' role to '/teacher'", () => {
      expect(getDashboardHref("teacher")).toBe("/teacher");
    });

    it("maps 'admin' role to '/admin'", () => {
      expect(getDashboardHref("admin")).toBe("/admin");
    });

    it("maps 'superadmin' role to '/admin' (NEVER returns 404 '/superadmin')", () => {
      const href = getDashboardHref("superadmin");
      expect(href).toBe("/admin");
      expect(href).not.toBe("/superadmin");
    });

    it("falls back to '/dashboard' for null, undefined, or unknown roles", () => {
      expect(getDashboardHref(null)).toBe("/dashboard");
      expect(getDashboardHref(undefined)).toBe("/dashboard");
      expect(getDashboardHref("")).toBe("/dashboard");
      expect(getDashboardHref("visitor")).toBe("/dashboard");
    });
  });

  // =========================================================================
  // Requirement 2 & 4: Route Protection for /companion and /classroom (F1)
  // =========================================================================
  describe("2. Route Protection of /companion and /classroom/[id] (F1)", () => {
    it("blocks unauthenticated visitors from accessing /companion and redirects to /login", async () => {
      const req = new NextRequest("http://localhost:3000/companion");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fcompanion");
    });

    it("blocks unauthenticated visitors from accessing /classroom/[id] and redirects to /login", async () => {
      const req = new NextRequest("http://localhost:3000/classroom/room-101");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fclassroom%2Froom-101");
    });

    it("allows authenticated students to access /companion", async () => {
      const req = new NextRequest("http://localhost:3000/companion", {
        headers: { cookie: "demo_role=student; demo_user=Demo%20Student" },
      });
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows authenticated teachers to access /companion", async () => {
      const req = new NextRequest("http://localhost:3000/companion", {
        headers: { cookie: "demo_role=teacher; demo_user=Demo%20Teacher" },
      });
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows authenticated students to access /classroom/[id]", async () => {
      const req = new NextRequest("http://localhost:3000/classroom/hifz-room-a", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows authenticated teachers to access /classroom/[id]", async () => {
      const req = new NextRequest("http://localhost:3000/classroom/hifz-room-a", {
        headers: { cookie: "demo_role=teacher" },
      });
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows authenticated admins to access /classroom/[id]", async () => {
      const req = new NextRequest("http://localhost:3000/classroom/hifz-room-a", {
        headers: { cookie: "demo_role=admin" },
      });
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows authenticated superadmins to access /classroom/[id]", async () => {
      const req = new NextRequest("http://localhost:3000/classroom/hifz-room-a", {
        headers: { cookie: "demo_role=superadmin" },
      });
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });
  });

  // =========================================================================
  // Requirement 3 & 4: Deep-Link Redirection Preservation in Middleware (F3)
  // =========================================================================
  describe("3. Deep-Link Redirection Preservation in Middleware (F3)", () => {
    it("preserves path and query parameters when bouncing unauthenticated users from classroom", async () => {
      const req = new NextRequest("http://localhost:3000/classroom/room-202?camera=1&mic=1&role=student");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe(
        "http://localhost:3000/login?redirect=%2Fclassroom%2Froom-202%3Fcamera%3D1%26mic%3D1%26role%3Dstudent"
      );
    });

    it("preserves deep portal links when unauthenticated user visits /student/assignments", async () => {
      const req = new NextRequest("http://localhost:3000/student/assignments?surah=2&page=25");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fstudent%2Fassignments%3Fsurah%3D2%26page%3D25");
    });

    it("preserves deep portal links when unauthenticated user visits /teacher/classes", async () => {
      const req = new NextRequest("http://localhost:3000/teacher/classes?filter=active");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fteacher%2Fclasses%3Ffilter%3Dactive");
    });

    it("preserves deep portal links when unauthenticated user visits /admin/finance", async () => {
      const req = new NextRequest("http://localhost:3000/admin/finance");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fadmin%2Ffinance");
    });

    it("preserves deep portal links when unauthenticated user visits /parent/billing", async () => {
      const req = new NextRequest("http://localhost:3000/parent/billing");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fparent%2Fbilling");
    });
  });

  // =========================================================================
  // Requirement 4: Role Boundaries & Cross-Portal Access Control
  // =========================================================================
  describe("4. Cross-Portal Role Authorization Boundaries", () => {
    it("redirects student away from /admin to /student", async () => {
      const req = new NextRequest("http://localhost:3000/admin/users", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects student away from /teacher to /student", async () => {
      const req = new NextRequest("http://localhost:3000/teacher/students", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects teacher away from /admin to /teacher", async () => {
      const req = new NextRequest("http://localhost:3000/admin/settings", {
        headers: { cookie: "demo_role=teacher" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/teacher");
    });

    it("redirects parent away from /admin to /parent", async () => {
      const req = new NextRequest("http://localhost:3000/admin/finance", {
        headers: { cookie: "demo_role=parent" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/parent");
    });

    it("allows superadmin unrestricted supervision across all portals", async () => {
      for (const path of ["/admin", "/teacher", "/parent", "/student", "/companion", "/classroom/room-1"]) {
        const req = new NextRequest(`http://localhost:3000${path}`, {
          headers: { cookie: "demo_role=superadmin" },
        });
        const res = await middleware(req);
        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      }
    });
  });

  // =========================================================================
  // Requirement 4: Public Marketing Pages Unrestricted Accessibility
  // =========================================================================
  describe("5. Public Marketing Pages Accessibility & Security Headers", () => {
    const publicPages = [
      "/",
      "/courses",
      "/pricing",
      "/about",
      "/about-us",
      "/programmes",
      "/packages",
      "/payments",
      "/teach-with-us",
      "/blog",
    ];

    for (const page of publicPages) {
      it(`serves public page '${page}' with status 200 and zero auth bounce`, async () => {
        const req = new NextRequest(`http://localhost:3000${page}`);
        const res = await middleware(req);

        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      });
    }

    it("attaches OWASP security and safeguarding headers to all public responses", async () => {
      const req = new NextRequest("http://localhost:3000/courses");
      const res = await middleware(req);

      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
      expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
      expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(res.headers.get("Permissions-Policy")).toContain("camera=(self)");
    });
  });

  // =========================================================================
  // Requirement 3 & 4: Safe Redirect Validation & Login Redirection Action (F3)
  // =========================================================================
  describe("6. Safe Redirect Path Validation (getSafeRedirectPath)", () => {
    it("accepts valid relative internal paths", async () => {
      expect(await getSafeRedirectPath("/companion")).toBe("/companion");
      expect(await getSafeRedirectPath("/classroom/room-101")).toBe("/classroom/room-101");
      expect(await getSafeRedirectPath("/student/homework?id=42")).toBe("/student/homework?id=42");
      expect(await getSafeRedirectPath("/admin/users")).toBe("/admin/users");
    });

    it("blocks malicious external open redirects", async () => {
      expect(await getSafeRedirectPath("https://evil.com")).toBeNull();
      expect(await getSafeRedirectPath("http://phishing.site/login")).toBeNull();
      expect(await getSafeRedirectPath("ftp://files.attacker.com")).toBeNull();
    });

    it("blocks protocol-relative open redirect attacks (//evil.com)", async () => {
      expect(await getSafeRedirectPath("//evil.com")).toBeNull();
      expect(await getSafeRedirectPath("//evil.com/path")).toBeNull();
    });

    it("blocks backslash evasion open redirect attacks (/\\evil.com)", async () => {
      expect(await getSafeRedirectPath("/\\evil.com")).toBeNull();
    });

    it("handles null, undefined, empty, or whitespace-only inputs gracefully", async () => {
      expect(await getSafeRedirectPath(null)).toBeNull();
      expect(await getSafeRedirectPath(undefined)).toBeNull();
      expect(await getSafeRedirectPath("")).toBeNull();
      expect(await getSafeRedirectPath("   ")).toBeNull();
    });

    it("strictly blocks control-character and encoded protocol-relative evasion vectors", async () => {
      const attackVectors = [
        "/%09/evil.com",
        "/%0a/evil.com",
        "/%0d/evil.com",
        "/%00/evil.com",
        "/\t/evil.com",
        "/\n/evil.com",
        "/\r/evil.com",
        "/\0/evil.com",
        "/%0A/evil.com",
        "/%0D/evil.com",
        "/%2509/evil.com",
        "/\r\n/evil.com",
        "/%0d%0a/evil.com",
      ];

      for (const vector of attackVectors) {
        const result = await getSafeRedirectPath(vector);
        expect(result).toBeNull();
      }
    });

    it("preserves complex legitimate deep links with encoded spaces and multi-parameter queries", async () => {
      const deepLinks = [
        "/student/progress?tab=history&filter=active&search=Ahmad%20Khan",
        "/student/assignments?surah=2&page=25&filter=pending&sort=dueDate",
        "/teacher/schedule?startDate=2026-11-01T08%3A00%3A00Z&endDate=2026-11-07T18%3A00%3A00Z",
        "/classroom/room-101?camera=true&mic=false&token=abc#whiteboard",
        "/companion?surah=1&q=%D8%A7%D9%84%D8%AD%D9%85%D8%AF%20%D9%84%D9%84%D9%87",
      ];

      for (const link of deepLinks) {
        expect(await getSafeRedirectPath(link)).toBe(link);
      }
    });
  });

  describe("7. Login Server Action Redirection & Role Dispatching", () => {
    describe("7a. Live Cloud Authentication Flow (Supabase Verified)", () => {
      it("redirects student to /student on successful Supabase login", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "std-001" } },
          error: null,
        });
        mockProfileRole = "student";

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "correct-password");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/student");
        expect(mockSetCookie).toHaveBeenCalledWith("demo_role", "student", { path: "/" });
      });

      it("redirects teacher to /teacher on successful Supabase login", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "tch-001" } },
          error: null,
        });
        mockProfileRole = "teacher";

        const formData = new FormData();
        formData.append("email", "teacher@quranacademy.com");
        formData.append("password", "correct-password");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/teacher");
        expect(mockSetCookie).toHaveBeenCalledWith("demo_role", "teacher", { path: "/" });
      });

      it("redirects parent to /parent on successful Supabase login", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "par-001" } },
          error: null,
        });
        mockProfileRole = "parent";

        const formData = new FormData();
        formData.append("email", "parent@quranacademy.com");
        formData.append("password", "correct-password");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/parent");
        expect(mockSetCookie).toHaveBeenCalledWith("demo_role", "parent", { path: "/" });
      });

      it("redirects admin to /admin on successful Supabase login", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "adm-001" } },
          error: null,
        });
        mockProfileRole = "admin";

        const formData = new FormData();
        formData.append("email", "admin@quranacademy.com");
        formData.append("password", "correct-password");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/admin");
        expect(mockSetCookie).toHaveBeenCalledWith("demo_role", "admin", { path: "/" });
      });

      it("redirects superadmin to /admin (NEVER /superadmin) on successful Supabase login", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "sup-001" } },
          error: null,
        });
        mockProfileRole = "superadmin";

        const formData = new FormData();
        formData.append("email", "superadmin@quranacademy.com");
        formData.append("password", "correct-password");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/admin");
        expect(redirectCalls).not.toContain("/superadmin");
        expect(mockSetCookie).toHaveBeenCalledWith("demo_role", "superadmin", { path: "/" });
      });

      it("redirects to valid deep-link target path on Supabase login when ?redirect= exists", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "std-002" } },
          error: null,
        });
        mockProfileRole = "student";

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "correct-password");
        formData.append("redirect", "/classroom/room-session-99");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/classroom/room-session-99");
      });

      it("redirects to companion deep-link when requested on Supabase login", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "std-003" } },
          error: null,
        });
        mockProfileRole = "student";

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "correct-password");
        formData.append("redirect", "/companion");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/companion");
      });

      it("ignores malicious open redirect and falls back to role dashboard on Supabase login", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "std-004" } },
          error: null,
        });
        mockProfileRole = "student";

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "correct-password");
        formData.append("redirect", "https://malicious-phishing.com/steal-session");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).not.toContain("https://malicious-phishing.com/steal-session");
        expect(redirectCalls).toContain("/student");
      });

      it("discards encoded tab open redirect /%09/evil.com and defaults to role dashboard", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "std-005" } },
          error: null,
        });
        mockProfileRole = "student";

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "correct-password");
        formData.append("redirect", "/%09/evil.com");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).not.toContain("/%09/evil.com");
        expect(redirectCalls).toContain("/student");
      });

      it("discards raw tab open redirect /\\t/evil.com and defaults to role dashboard", async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
          data: { user: { id: "std-006" } },
          error: null,
        });
        mockProfileRole = "student";

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "correct-password");
        formData.append("redirect", "/\t/evil.com");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).not.toContain("/\t/evil.com");
        expect(redirectCalls).toContain("/student");
      });
    });

    describe("7b. Offline / Resilience Fallback Role Routing", () => {
      it("falls back to role routing when Supabase is unreachable (student)", async () => {
        mockSignInWithPassword.mockRejectedValueOnce(new Error("Supabase network unreachable"));

        const formData = new FormData();
        formData.append("email", "student@quranacademy.com");
        formData.append("password", "any-password");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/student");
        expect(mockSetCookie).toHaveBeenCalledWith("demo_role", "student", { path: "/" });
      });

      it("falls back to role routing when Supabase is unreachable (superadmin -> /admin, never /superadmin)", async () => {
        mockSignInWithPassword.mockRejectedValueOnce(new Error("Supabase network unreachable"));

        const formData = new FormData();
        formData.append("email", "superadmin@quranacademy.com");
        formData.append("password", "any-password");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/admin");
        expect(redirectCalls).not.toContain("/superadmin");
        expect(mockSetCookie).toHaveBeenCalledWith("demo_role", "admin", { path: "/" });
      });

      it("falls back to role routing and preserves safe redirect when Supabase is unreachable", async () => {
        mockSignInWithPassword.mockRejectedValueOnce(new Error("Supabase network unreachable"));

        const formData = new FormData();
        formData.append("email", "teacher@quranacademy.com");
        formData.append("password", "any-password");
        formData.append("redirect", "/classroom/room-101");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).toContain("/classroom/room-101");
      });

      it("ignores malicious open redirect on fallback routing and defaults to role portal", async () => {
        mockSignInWithPassword.mockRejectedValueOnce(new Error("Supabase network unreachable"));

        const formData = new FormData();
        formData.append("email", "teacher@quranacademy.com");
        formData.append("password", "any-password");
        formData.append("redirect", "//evil.attacker.com/session-harvest");

        await expect(login(formData)).rejects.toThrow();
        expect(redirectCalls).not.toContain("//evil.attacker.com/session-harvest");
        expect(redirectCalls).toContain("/teacher");
      });
    });
  });
});
