import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { executeSignOut } from "@/lib/authSignOut";
import {
  enqueueOfflineAction,
  flushOfflineQueue,
  getOfflineQueueSize,
} from "@/lib/safeSync";
import { GET as getClassroomState, POST as postClassroomState } from "@/app/api/classroom/state/route";
import { GET as getInvoices, POST as postInvoices } from "@/app/api/invoices/route";
import { GET as getProgress, POST as postProgress } from "@/app/api/progress/route";
import { GET as getScheduling, POST as postScheduling } from "@/app/api/scheduling/route";
import { GET as getEnrolments } from "@/app/api/enrolments/route";
import { GET as getPayouts } from "@/app/api/payouts/route";
import { GET as getPortalStats } from "@/app/api/portal/stats/route";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getDiagnostics } from "@/app/api/diagnostics/route";
import { GET as getLiveKitToken } from "@/app/api/livekit/token/route";
import { GET as getDeepgramToken } from "@/app/api/speech/deepgram-token/route";
import { GET as getDemoAccess } from "@/app/api/demo-access/route";
import { NextRequest } from "next/server";

// Mock Supabase client for client-side tests
vi.mock("@/utils/supabase/client", () => {
  return {
    createClient: vi.fn(() => ({
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: [{ id: "mock_123" }], error: null }),
        }),
      })),
    })),
  };
});

describe("Milestone 2: Cache Integrity & State Invalidation Suite", () => {
  // =========================================================================
  // F5 & F6: Hardened Service Worker Policy
  // =========================================================================
  describe("Features F5 & F6: Hardened Service Worker Policy (public/sw.js)", () => {
    const swPath = path.resolve(__dirname, "../../public/sw.js");
    const swContent = fs.readFileSync(swPath, "utf-8");

    it("F6: excludes '/' from STATIC_ASSETS precache list", () => {
      expect(swContent).not.toMatch(/STATIC_ASSETS\s*=\s*\[[^\]]*["']\/["']/);
      expect(swContent).not.toMatch(/PRECACHE_URLS\s*=\s*\[[^\]]*["']\/["']/);
    });

    it("F6: only precaches immutable brand and manifest assets", () => {
      expect(swContent).toContain("/manifest.json");
      expect(swContent).toContain("/favicon.ico");
      expect(swContent).toContain("/logo_quran_learn_academy.png");
    });

    it("F5: bypasses all private portal routes (case-insensitive)", () => {
      const privatePortals = [
        "/student",
        "/parent",
        "/teacher",
        "/admin",
        "/companion",
        "/classroom",
        "/dashboard",
        "/auth",
      ];
      for (const portal of privatePortals) {
        expect(swContent).toContain(portal);
      }
      expect(swContent).toContain("toLowerCase()");
    });

    it("F5: bypasses Next.js RSC flight requests via searchParams and headers", () => {
      expect(swContent).toContain("_rsc");
      expect(swContent).toContain('request.headers.get("RSC") === "1"');
      expect(swContent).toContain('request.headers.has("Next-Router-State-Tree")');
    });

    it("F5: strictly isolates cross-origin requests", () => {
      expect(swContent).toContain("url.origin !== self.location.origin");
    });

    it("F5: bypasses API and WebSocket endpoints", () => {
      expect(swContent).toContain('lowerPath.startsWith("/api/")');
      expect(swContent).toContain('lowerPath.startsWith("/ws/")');
    });

    it("F7: service worker message listener awaits caches.delete with event.waitUntil", () => {
      expect(swContent).toMatch(/isPurgeCaches[\s\S]*event\.waitUntil\(/);
      expect(swContent).toContain("caches.delete");
    });

    it("F7: service worker handles both string and structured object PURGE_CACHES payloads", () => {
      expect(swContent).toContain('event.data === "PURGE_CACHES"');
      expect(swContent).toContain('event.data?.type === "PURGE_CACHES"');
      expect(swContent).toContain('event.data?.action === "PURGE_CACHES"');
    });
  });

  // =========================================================================
  // F7: Unified Signout Invalidation (executeSignOut)
  // =========================================================================
  describe("Feature F7: Unified Signout Invalidation (executeSignOut)", () => {
    let mockCookies: string[] = [];
    let mockLocalStorage: Record<string, string> = {};
    let mockSessionStorage: Record<string, string> = {};
    let deletedCaches: string[] = [];
    let postedMessages: any[] = [];

    beforeEach(() => {
      mockCookies = [
        "demo_role=student",
        "demo_user=Yusuf%20Khan",
        "sb-project-ref-auth-token=jwt.token.here",
        "sb-another-auth-token.0=part1",
        "ga_session=xyz123",
      ];
      mockLocalStorage = {
        demo_role: "student",
        demo_user: "Yusuf Khan",
        quran_academy_offline_sync_queue: JSON.stringify([{ id: "1" }]),
        qa_language: "ur",
        user_sect: "shia",
        temp_data: "something",
      };
      mockSessionStorage = {
        session_id: "sess_999",
      };
      deletedCaches = [];
      postedMessages = [];

      (globalThis as any).window = globalThis;

      // Mock document.cookie
      Object.defineProperty(globalThis, "document", {
        writable: true,
        configurable: true,
        value: {
          get cookie() {
            return mockCookies.join("; ");
          },
          set cookie(val: string) {
            const [nameVal] = val.split(";");
            const [name] = nameVal.split("=");
            if (val.includes("max-age=0") || val.includes("1970")) {
              mockCookies = mockCookies.filter((c) => !c.startsWith(`${name}=`));
            } else {
              mockCookies.push(nameVal);
            }
          },
        },
      });

      // Mock localStorage
      Object.defineProperty(globalThis, "localStorage", {
        writable: true,
        configurable: true,
        value: {
          getItem: (key: string) => mockLocalStorage[key] ?? null,
          setItem: (key: string, val: string) => {
            mockLocalStorage[key] = String(val);
          },
          removeItem: (key: string) => {
            delete mockLocalStorage[key];
          },
          clear: () => {
            mockLocalStorage = {};
          },
        },
      });

      // Mock sessionStorage
      Object.defineProperty(globalThis, "sessionStorage", {
        writable: true,
        configurable: true,
        value: {
          getItem: (key: string) => mockSessionStorage[key] ?? null,
          setItem: (key: string, val: string) => {
            mockSessionStorage[key] = String(val);
          },
          clear: () => {
            mockSessionStorage = {};
          },
        },
      });

      // Mock CacheStorage
      Object.defineProperty(globalThis, "caches", {
        writable: true,
        configurable: true,
        value: {
          keys: vi.fn().mockResolvedValue(["quran-academy-v1.1.2", "old-cache-v1"]),
          delete: vi.fn((key: string) => {
            deletedCaches.push(key);
            return Promise.resolve(true);
          }),
        },
      });

      // Mock navigator.serviceWorker
      const mockActiveWorker = {
        postMessage: vi.fn((msg) => postedMessages.push(msg)),
      };
      Object.defineProperty(globalThis, "navigator", {
        writable: true,
        configurable: true,
        value: {
          onLine: true,
          serviceWorker: {
            controller: {
              postMessage: vi.fn((msg) => postedMessages.push(msg)),
            },
            getRegistrations: vi.fn().mockResolvedValue([
              { active: mockActiveWorker },
            ]),
          },
        },
      });
    });

    it("clears demo cookies and Supabase token cookies", async () => {
      await executeSignOut();
      expect(document.cookie).not.toContain("demo_role=");
      expect(document.cookie).not.toContain("demo_user=");
      expect(document.cookie).not.toContain("sb-project-ref-auth-token=");
      expect(document.cookie).not.toContain("sb-another-auth-token.0=");
    });

    it("purges localStorage while safely preserving UI language & sect preferences", async () => {
      await executeSignOut();
      expect(mockLocalStorage.demo_role).toBeUndefined();
      expect(mockLocalStorage.quran_academy_offline_sync_queue).toBeUndefined();
      expect(mockLocalStorage.temp_data).toBeUndefined();
      // Preferences preserved
      expect(mockLocalStorage.qa_language).toBe("ur");
      expect(mockLocalStorage.user_sect).toBe("shia");
    });

    it("purges sessionStorage completely", async () => {
      await executeSignOut();
      expect(Object.keys(mockSessionStorage).length).toBe(0);
    });

    it("fully awaits CacheStorage keys and deletes all active caches", async () => {
      await executeSignOut();
      expect(deletedCaches).toEqual(["quran-academy-v1.1.2", "old-cache-v1"]);
    });

    it("dispatches PURGE_CACHES through both controller and registration channels", async () => {
      await executeSignOut();
      expect(postedMessages).toContain("PURGE_CACHES");
      expect(postedMessages.filter((m) => m === "PURGE_CACHES").length).toBeGreaterThanOrEqual(2);
    });

    it("Sidebar.tsx and PublicNavbar.tsx invoke executeSignOut", () => {
      const sidebarPath = path.resolve(__dirname, "../components/Sidebar.tsx");
      const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");
      expect(sidebarContent).toContain("executeSignOut()");

      const navbarPath = path.resolve(__dirname, "../components/PublicNavbar.tsx");
      const navbarContent = fs.readFileSync(navbarPath, "utf-8");
      expect(navbarContent).toContain("executeSignOut()");
    });
  });

  // =========================================================================
  // F8: API Anti-Caching Headers
  // =========================================================================
  describe("Feature F8: Dynamic API Anti-Caching Headers (Cache-Control: no-store)", () => {
    it("returns Cache-Control: no-store on /api/progress GET and POST", async () => {
      const getReq = new NextRequest("http://localhost:3000/api/progress");
      const getRes = await getProgress(getReq);
      expect(getRes.headers.get("Cache-Control")).toContain("no-store");
      expect(getRes.headers.get("Cache-Control")).toContain("no-cache");

      const postReq = new NextRequest("http://localhost:3000/api/progress", {
        method: "POST",
        body: JSON.stringify({
          studentName: "Test Student",
          teacherName: "Test Teacher",
          lessonTitle: "Test Sabaq",
        }),
      });
      const postRes = await postProgress(postReq);
      expect(postRes.headers.get("Cache-Control")).toContain("no-store");
    });

    it("returns Cache-Control: no-store on /api/invoices GET and POST", async () => {
      const getRes = await getInvoices();
      expect(getRes.headers.get("Cache-Control")).toContain("no-store");

      const postReq = new NextRequest("http://localhost:3000/api/invoices", {
        method: "POST",
        body: JSON.stringify({
          familyName: "Test Family",
          amount: 50,
          currency: "GBP",
          transactionRef: "REF-TEST-999",
        }),
      });
      const postRes = await postInvoices(postReq);
      expect(postRes.headers.get("Cache-Control")).toContain("no-store");
    });

    it("returns Cache-Control: no-store on /api/scheduling GET and POST", async () => {
      const getRes = await getScheduling();
      expect(getRes.headers.get("Cache-Control")).toContain("no-store");

      const postReq = new Request("http://localhost:3000/api/scheduling", {
        method: "POST",
        body: JSON.stringify({
          teacherName: "Ustadha Maryam",
          studentName: "Test Student",
          dayOfWeek: "Monday",
          startTimeLocal: "17:00",
        }),
      });
      const postRes = await postScheduling(postReq);
      expect(postRes.headers.get("Cache-Control")).toContain("no-store");
    });

    it("returns Cache-Control: no-store on /api/enrolments GET", async () => {
      const res = await getEnrolments();
      expect(res.headers.get("Cache-Control")).toContain("no-store");
    });

    it("returns Cache-Control: no-store on /api/payouts GET", async () => {
      const req = new NextRequest("http://localhost:3000/api/payouts");
      const res = await getPayouts(req);
      expect(res.headers.get("Cache-Control")).toContain("no-store");
    });

    it("returns Cache-Control: no-store on /api/portal/stats GET", async () => {
      const req = new NextRequest("http://localhost:3000/api/portal/stats");
      const res = await getPortalStats(req);
      expect(res.headers.get("Cache-Control")).toContain("no-store");
    }, 20000);

    it("returns Cache-Control: no-store on /api/health and /api/diagnostics", async () => {
      const healthRes = await getHealth();
      expect(healthRes.headers.get("Cache-Control")).toContain("no-store");

      const diagReq = new Request("http://localhost:3000/api/diagnostics");
      const diagRes = await getDiagnostics(diagReq);
      expect(diagRes.headers.get("Cache-Control")).toContain("no-store");
    });

    it("returns Cache-Control: no-store on /api/livekit/token and /api/speech/deepgram-token", async () => {
      const lkReq = new NextRequest("http://localhost:3000/api/livekit/token?room=room_1&role=student");
      const lkRes = await getLiveKitToken(lkReq);
      expect(lkRes.headers.get("Cache-Control")).toContain("no-store");

      const dgRes = await getDeepgramToken();
      expect(dgRes.headers.get("Cache-Control")).toContain("no-store");
    });

    it("returns Cache-Control: no-store on /api/demo-access redirect", async () => {
      const req = new NextRequest("http://localhost:3000/api/demo-access?role=teacher");
      const res = await getDemoAccess(req);
      expect(res.headers.get("Cache-Control")).toContain("no-store");
    });
  });

  // =========================================================================
  // F9: Server Action Revalidation Alignment
  // =========================================================================
  describe("Feature F9: Server Action Revalidation Alignment", () => {
    it("login/actions.ts imports revalidatePath and invokes revalidatePath('/', 'layout')", () => {
      const loginActionsPath = path.resolve(__dirname, "../app/(public)/login/actions.ts");
      const content = fs.readFileSync(loginActionsPath, "utf-8");
      expect(content).toContain("import { revalidatePath } from 'next/cache'");
      expect(content).toContain("revalidatePath('/', 'layout')");
    });

    it("trial/actions.ts imports revalidatePath and invokes revalidatePath('/', 'layout')", () => {
      const trialActionsPath = path.resolve(__dirname, "../app/(public)/trial/actions.ts");
      const content = fs.readFileSync(trialActionsPath, "utf-8");
      expect(content).toContain("import { revalidatePath } from 'next/cache'");
      expect(content).toContain("revalidatePath('/', 'layout')");
    });

    it("api/demo-access/route.ts invokes revalidatePath('/', 'layout')", () => {
      const demoPath = path.resolve(__dirname, "../app/api/demo-access/route.ts");
      const content = fs.readFileSync(demoPath, "utf-8");
      expect(content).toContain('revalidatePath("/", "layout")');
    });

    it("auth/callback/route.ts invokes revalidatePath('/', 'layout')", () => {
      const callbackPath = path.resolve(__dirname, "../app/auth/callback/route.ts");
      const content = fs.readFileSync(callbackPath, "utf-8");
      expect(content).toContain('revalidatePath("/", "layout")');
    });
  });

  // =========================================================================
  // F10: Classroom State Parameter Normalization
  // =========================================================================
  describe("Feature F10: Classroom State Parameter Normalization (/api/classroom/state)", () => {
    it("accepts query param roomId and returns normalized state with both roomId and classId", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state?roomId=mushaf_room_1");
      const res = await getClassroomState(req);
      expect(res.headers.get("Cache-Control")).toContain("no-store");

      const body = await res.json();
      expect(body.state).toBeDefined();
      expect(body.state.roomId).toBe("mushaf_room_1");
      expect(body.state.classId).toBe("mushaf_room_1");
      expect(body.state.scriptMode).toBeDefined();
      expect(body.state.script).toBeDefined();
    });

    it("accepts query param classId and returns normalized state with both roomId and classId", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state?classId=class_alpha_42");
      const res = await getClassroomState(req);
      expect(res.headers.get("Cache-Control")).toContain("no-store");

      const body = await res.json();
      expect(body.state).toBeDefined();
      expect(body.state.roomId).toBe("class_alpha_42");
      expect(body.state.classId).toBe("class_alpha_42");
    });

    it("accepts POST with roomId or classId, and normalizes boolean tajweedMode", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state", {
        method: "POST",
        body: JSON.stringify({
          classId: "room_post_test",
          currentPage: 15,
          currentSurah: 2,
          currentAyah: 100,
          tajweedMode: true,
          script: "indopak",
        }),
      });
      const res = await postClassroomState(req);
      expect(res.headers.get("Cache-Control")).toContain("no-store");

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.state.roomId).toBe("room_post_test");
      expect(body.state.classId).toBe("room_post_test");
    });

    it("useClassroomSync.ts hook passes roomId, classId, timestamp, and no-store in restore fetch", () => {
      const hookPath = path.resolve(__dirname, "../features/classroom/hooks/useClassroomSync.ts");
      const hookContent = fs.readFileSync(hookPath, "utf-8");
      expect(hookContent).toContain("roomId: classId");
      expect(hookContent).toContain("classId");
      expect(hookContent).toContain('_t: Date.now().toString()');
      expect(hookContent).toContain('cache: "no-store"');
    });

    it("useClassroomSync.ts normalizes scriptMode/script aliases and boolean/string tajweedMode", () => {
      const hookPath = path.resolve(__dirname, "../features/classroom/hooks/useClassroomSync.ts");
      const hookContent = fs.readFileSync(hookPath, "utf-8");
      expect(hookContent).toContain("state.script || state.scriptMode || state.script_mode");
      expect(hookContent).toContain('state.tajweedMode === "color" || state.tajweedMode === "true"');
    });
  });

  // =========================================================================
  // F11: Offline Lesson Note SafeSync Integration
  // =========================================================================
  describe("Feature F11: Offline Lesson Note SafeSync Integration", () => {
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
      (globalThis as any).window = globalThis;
      Object.defineProperty(globalThis, "localStorage", {
        writable: true,
        configurable: true,
        value: {
          getItem: (k: string) => mockStorage[k] ?? null,
          setItem: (k: string, v: string) => {
            mockStorage[k] = String(v);
          },
          removeItem: (k: string) => {
            delete mockStorage[k];
          },
          clear: () => {
            mockStorage = {};
          },
        },
      });
    });

    it("enqueues offline action for student_lesson_notes and updates queue size", () => {
      expect(getOfflineQueueSize()).toBe(0);

      enqueueOfflineAction({
        type: "INSERT",
        table: "student_lesson_notes",
        payload: {
          student_name: "Yusuf Khan",
          teacher_name: "Ustadha Maryam",
          lesson_title: "Surah Al-Mulk Ayah 1-5",
          grade: "Excellent",
          rating: 5,
          feedback: "MashaAllah brilliant memorization",
          homework: "Revise next 5 ayat",
        },
      });

      expect(getOfflineQueueSize()).toBe(1);

      const queue = JSON.parse(mockStorage["quran_academy_offline_sync_queue"]);
      expect(queue.length).toBe(1);
      expect(queue[0].table).toBe("student_lesson_notes");
      expect(queue[0].payload.student_name).toBe("Yusuf Khan");
    });

    it("flushes offline queue and drains persistent storage", async () => {
      enqueueOfflineAction({
        type: "INSERT",
        table: "student_lesson_notes",
        payload: {
          student_name: "Amina Siddiqui",
          teacher_name: "Ustadha Maryam",
          lesson_title: "Noorani Qaida Lesson 5",
        },
      });

      expect(getOfflineQueueSize()).toBe(1);

      const result = await flushOfflineQueue();
      expect(result.processed).toBe(1);
      expect(result.remaining).toBe(0);
      expect(getOfflineQueueSize()).toBe(0);
    });

    it("TeacherStudents page imports and wires SafeSync offline queueing and listeners", () => {
      const pagePath = path.resolve(__dirname, "../app/(portal)/teacher/students/page.tsx");
      const content = fs.readFileSync(pagePath, "utf-8");

      expect(content).toContain("enqueueOfflineAction");
      expect(content).toContain("flushOfflineQueue");
      expect(content).toContain("getOfflineQueueSize");
      expect(content).toContain("initNetworkSyncListeners");
      expect(content).toContain("onSyncBroadcast");
      expect(content).toContain('table: "student_lesson_notes"');
      expect(content).toContain("Offline Note");
    });
  });
});
