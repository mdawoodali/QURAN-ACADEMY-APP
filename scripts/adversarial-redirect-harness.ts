import { sanitizeRedirectPath, isSafeRedirectPath } from "../apps/web/src/lib/security/redirect.ts";

interface TestCase {
  category: string;
  name: string;
  input: string | null | undefined;
  expectedSafe: boolean;
  expectedValue?: string | null;
}

const testCases: TestCase[] = [
  // -------------------------------------------------------------------------
  // 1. CRLF & Header Injection Attacks
  // -------------------------------------------------------------------------
  { category: "CRLF", name: "Raw LF", input: "/\n/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Raw CR", input: "/\r/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Raw CRLF", input: "/\r\n/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Encoded LF %0a", input: "/%0a/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Encoded LF %0A uppercase", input: "/%0A/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Encoded CR %0d", input: "/%0d/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Encoded CR %0D uppercase", input: "/%0D/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Encoded CRLF %0d%0a", input: "/%0d%0a/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Encoded CRLF %0D%0A", input: "/%0D%0A/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Double encoded LF %250a", input: "/%250a/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Double encoded CR %250d", input: "/%250d/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Double encoded CRLF %250d%250a", input: "/%250d%250a/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Triple encoded LF %25250a", input: "/%25250a/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Triple encoded CRLF %25250d%25250a", input: "/%25250d%25250a/evil.com", expectedSafe: false },
  { category: "CRLF", name: "Header injection Set-Cookie", input: "/student\r\nSet-Cookie: evil_token=1337", expectedSafe: false },
  { category: "CRLF", name: "Encoded header injection Set-Cookie", input: "/student%0d%0aSet-Cookie:%20evil_token=1337", expectedSafe: false },
  { category: "CRLF", name: "Header injection Location header", input: "/student\r\nLocation: https://evil.com", expectedSafe: false },
  { category: "CRLF", name: "Encoded Location header", input: "/%0d%0aLocation:%20https://evil.com", expectedSafe: false },
  { category: "CRLF", name: "Split header response smuggling", input: "/\r\n\r\n<html><body>Defaced</body></html>", expectedSafe: false },

  // -------------------------------------------------------------------------
  // 2. ASCII Tabs & Whitespace & Control Characters (0x00 - 0x1F, 0x7F)
  // -------------------------------------------------------------------------
  { category: "ControlChars", name: "Raw tab literal", input: "/\t/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded tab %09", input: "/%09/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Double encoded tab %2509", input: "/%2509/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Triple encoded tab %252509", input: "/%252509/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Vertical tab \\v (0x0B)", input: "/\v/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded vertical tab %0b", input: "/%0b/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded vertical tab %0B uppercase", input: "/%0B/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Form feed \\f (0x0C)", input: "/\f/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded form feed %0c", input: "/%0c/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Backspace (0x08)", input: "/\b/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded backspace %08", input: "/%08/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Escape char (0x1B)", input: "/\x1B/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded escape char %1b", input: "/%1b/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "DEL char (0x7F)", input: "/\x7F/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded DEL char %7f", input: "/%7f/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Encoded DEL char %7F uppercase", input: "/%7F/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "Raw space in middle", input: "/student /progress", expectedSafe: false },
  { category: "ControlChars", name: "Raw space leading after slash", input: "/ student", expectedSafe: false },
  { category: "ControlChars", name: "Embedded tab in subpath", input: "/student\t/evil.com", expectedSafe: false },
  { category: "ControlChars", name: "All C0 controls check (0x01 to 0x1F)", input: "/\x01/evil.com", expectedSafe: false },

  // -------------------------------------------------------------------------
  // 3. Null Bytes
  // -------------------------------------------------------------------------
  { category: "NullBytes", name: "Raw null byte literal", input: "/\0/evil.com", expectedSafe: false },
  { category: "NullBytes", name: "Encoded null byte %00", input: "/%00/evil.com", expectedSafe: false },
  { category: "NullBytes", name: "Double encoded null byte %2500", input: "/%2500/evil.com", expectedSafe: false },
  { category: "NullBytes", name: "Triple encoded null byte %252500", input: "/%252500/evil.com", expectedSafe: false },
  { category: "NullBytes", name: "Null byte path cutoff attack", input: "/student\0/admin", expectedSafe: false },
  { category: "NullBytes", name: "Encoded null byte path cutoff", input: "/student%00/admin", expectedSafe: false },
  { category: "NullBytes", name: "Null byte in query param", input: "/student?id=1\0", expectedSafe: false },
  { category: "NullBytes", name: "Encoded null byte in query param", input: "/student?id=1%00", expectedSafe: false },
  { category: "NullBytes", name: "Null byte in hash fragment", input: "/classroom#test\0", expectedSafe: false },
  { category: "NullBytes", name: "Encoded null byte in hash fragment", input: "/classroom#test%00", expectedSafe: false },

  // -------------------------------------------------------------------------
  // 4. Backslashes & Path Confusion
  // -------------------------------------------------------------------------
  { category: "Backslashes", name: "Single backslash /\\evil.com", input: "/\\evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Double backslash /\\\\evil.com", input: "/\\\\evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Leading backslashes \\\\evil.com", input: "\\\\evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Leading backslash \\evil.com", input: "\\evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Backslash slash \\/evil.com", input: "\\/evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Slash backslash slash /\\/evil.com", input: "/\\/evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Encoded backslash %5c", input: "/%5c/evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Encoded backslash %5C uppercase", input: "/%5C/evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Double encoded backslash %255c", input: "/%255c/evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Triple encoded backslash %25255c", input: "/%25255c/evil.com", expectedSafe: false },
  { category: "Backslashes", name: "Backslash in subpath /student\\admin", input: "/student\\admin", expectedSafe: false },
  { category: "Backslashes", name: "Encoded backslash in subpath /student%5cadmin", input: "/student%5cadmin", expectedSafe: false },
  { category: "Backslashes", name: "Trailing backslash /student\\", input: "/student\\", expectedSafe: false },
  { category: "Backslashes", name: "Encoded trailing backslash /student%5c", input: "/student%5c", expectedSafe: false },

  // -------------------------------------------------------------------------
  // 5. Schemes & Protocol-Relative Bypasses
  // -------------------------------------------------------------------------
  { category: "Schemes", name: "Protocol-relative //evil.com", input: "//evil.com", expectedSafe: false },
  { category: "Schemes", name: "Triple slash ///evil.com", input: "///evil.com", expectedSafe: false },
  { category: "Schemes", name: "Quad slash ////evil.com", input: "////evil.com", expectedSafe: false },
  { category: "Schemes", name: "Protocol-relative userinfo //localhost@evil.com", input: "//localhost@evil.com", expectedSafe: false },
  { category: "Schemes", name: "Absolute HTTP scheme", input: "http://evil.com", expectedSafe: false },
  { category: "Schemes", name: "Absolute HTTPS scheme", input: "https://evil.com", expectedSafe: false },
  { category: "Schemes", name: "JavaScript pseudo-protocol", input: "javascript:alert(1)", expectedSafe: false },
  { category: "Schemes", name: "JavaScript with leading whitespace", input: "  javascript:alert(1)  ", expectedSafe: false },
  { category: "Schemes", name: "Data URI HTML payload", input: "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==", expectedSafe: false },
  { category: "Schemes", name: "VBScript pseudo-protocol", input: "vbscript:msgbox(1)", expectedSafe: false },
  { category: "Schemes", name: "Blob URI", input: "blob:https://evil.com/1234-uuid", expectedSafe: false },
  { category: "Schemes", name: "File URI Unix", input: "file:///etc/passwd", expectedSafe: false },
  { category: "Schemes", name: "File URI Windows", input: "file://C:/Windows/win.ini", expectedSafe: false },
  { category: "Schemes", name: "FTP scheme", input: "ftp://evil.com/resource", expectedSafe: false },
  { category: "Schemes", name: "WebSocket scheme ws://", input: "ws://evil.com/socket", expectedSafe: false },
  { category: "Schemes", name: "Secure WebSocket wss://", input: "wss://evil.com/socket", expectedSafe: false },

  // -------------------------------------------------------------------------
  // 6. Mixed & Over-Encoding & Malformed URIs
  // -------------------------------------------------------------------------
  { category: "Encoding", name: "Double encoded protocol-relative %252f%252fevil.com", input: "/%252f%252fevil.com", expectedSafe: false },
  { category: "Encoding", name: "Double encoded slash backslash %252f%255cevil.com", input: "/%252f%255cevil.com", expectedSafe: false },
  { category: "Encoding", name: "Double encoded slash /%252f/evil.com", input: "/%252f/evil.com", expectedSafe: false },
  { category: "Encoding", name: "Single encoded double slash /%2f/evil.com", input: "/%2f/evil.com", expectedSafe: false },
  { category: "Encoding", name: "Malformed URI hanging %", input: "/%", expectedSafe: false },
  { category: "Encoding", name: "Malformed URI partial hex %2", input: "/%2", expectedSafe: false },
  { category: "Encoding", name: "Malformed URI invalid hex %zz", input: "/%zz", expectedSafe: false },
  { category: "Encoding", name: "Malformed URI incomplete UTF-8 %E0%A0%", input: "/%E0%A0%", expectedSafe: false },
  { category: "Encoding", name: "Invalid UTF-8 byte %FF", input: "/%FF/evil.com", expectedSafe: false },
  { category: "Encoding", name: "Overlong UTF-8 slash %c0%af", input: "/%c0%af/evil.com", expectedSafe: false },
  { category: "Encoding", name: "Overlong UTF-8 null byte %c0%80", input: "/%c0%80/evil.com", expectedSafe: false },
  { category: "Encoding", name: "Triple overlong UTF-8 slash %e0%80%af", input: "/%e0%80%af/evil.com", expectedSafe: false },

  // -------------------------------------------------------------------------
  // 7. Multi-Byte Unicode & Homoglyphs & International Scripts
  // -------------------------------------------------------------------------
  { category: "Unicode", name: "Fullwidth solidus U+FF0F", input: "/\uFF0Fevil.com", expectedSafe: false },
  { category: "Unicode", name: "Fullwidth reverse solidus U+FF3C", input: "/\uFF3Cevil.com", expectedSafe: false },
  { category: "Unicode", name: "Division slash U+2215", input: "/\u2215evil.com", expectedSafe: false },
  { category: "Unicode", name: "Fraction slash U+2044", input: "/\u2044evil.com", expectedSafe: false },

  // -------------------------------------------------------------------------
  // 8. Legitimate Deep Links (MUST BE PRESERVED ACCURATELY)
  // -------------------------------------------------------------------------
  { category: "Legitimate", name: "Root path", input: "/", expectedSafe: true, expectedValue: "/" },
  { category: "Legitimate", name: "Simple student portal", input: "/student", expectedSafe: true, expectedValue: "/student" },
  { category: "Legitimate", name: "Simple teacher portal", input: "/teacher", expectedSafe: true, expectedValue: "/teacher" },
  { category: "Legitimate", name: "Simple parent portal", input: "/parent", expectedSafe: true, expectedValue: "/parent" },
  { category: "Legitimate", name: "Simple admin portal", input: "/admin", expectedSafe: true, expectedValue: "/admin" },
  { category: "Legitimate", name: "Simple companion portal", input: "/companion", expectedSafe: true, expectedValue: "/companion" },
  { category: "Legitimate", name: "Classroom with room ID", input: "/classroom/room-101", expectedSafe: true, expectedValue: "/classroom/room-101" },
  {
    category: "Legitimate",
    name: "Student progress with query parameters and encoded space",
    input: "/student/progress?tab=history&filter=active&search=Ahmad%20Khan",
    expectedSafe: true,
    expectedValue: "/student/progress?tab=history&filter=active&search=Ahmad%20Khan",
  },
  {
    category: "Legitimate",
    name: "Teacher schedule with ISO timestamp queries",
    input: "/teacher/schedule?startDate=2026-11-01T08%3A00%3A00Z&endDate=2026-11-07T18%3A00%3A00Z",
    expectedSafe: true,
    expectedValue: "/teacher/schedule?startDate=2026-11-01T08%3A00%3A00Z&endDate=2026-11-07T18%3A00%3A00Z",
  },
  {
    category: "Legitimate",
    name: "LiveKit classroom with JWT token and hash fragment",
    input: "/classroom/room-101?token=eyJhbGciOiJIUzI1NiJ9.test&session=123e4567-e89b-12d3-a456-426614174000#whiteboard",
    expectedSafe: true,
    expectedValue: "/classroom/room-101?token=eyJhbGciOiJIUzI1NiJ9.test&session=123e4567-e89b-12d3-a456-426614174000#whiteboard",
  },
  {
    category: "Legitimate",
    name: "Companion with Surah, Ayah and translation parameters",
    input: "/companion?surah=18&ayah=10&translation=en.sahih&audio=alafasy",
    expectedSafe: true,
    expectedValue: "/companion?surah=18&ayah=10&translation=en.sahih&audio=alafasy",
  },
  {
    category: "Legitimate",
    name: "Parent billing with nested returnTo path",
    input: "/parent/billing?invoice=INV-2026-001&returnTo=%2Fparent%2Fdashboard",
    expectedSafe: true,
    expectedValue: "/parent/billing?invoice=INV-2026-001&returnTo=%2Fparent%2Fdashboard",
  },
  {
    category: "Legitimate",
    name: "Arabic Unicode query parameters",
    input: "/companion?surah=1&q=%D8%A7%D9%84%D8%AD%D9%85%D8%AF%20%D9%84%D9%84%D9%87",
    expectedSafe: true,
    expectedValue: "/companion?surah=1&q=%D8%A7%D9%84%D8%AD%D9%85%D8%AF%20%D9%84%D9%84%D9%87",
  },
  {
    category: "Legitimate",
    name: "Classroom subpath with Arabic name (percent encoded)",
    input: "/classroom/%D8%AD%D9%84%D9%82%D8%A9-%D8%A7%D9%84%D8%AA%D8%AC%D9%88%D9%8A%D8%AF",
    expectedSafe: true,
    expectedValue: "/classroom/%D8%AD%D9%84%D9%82%D8%A9-%D8%A7%D9%84%D8%AA%D8%AC%D9%88%D9%8A%D8%AF",
  },
  {
    category: "Legitimate",
    name: "Courses with categories, filters and hash fragment",
    input: "/courses/tajweed-foundations?category=quran%20recitation&level=intermediate#curriculum",
    expectedSafe: true,
    expectedValue: "/courses/tajweed-foundations?category=quran%20recitation&level=intermediate#curriculum",
  },

  // -------------------------------------------------------------------------
  // 9. Boundary & Nullish Values
  // -------------------------------------------------------------------------
  { category: "Boundary", name: "Null input", input: null, expectedSafe: false },
  { category: "Boundary", name: "Undefined input", input: undefined, expectedSafe: false },
  { category: "Boundary", name: "Empty string", input: "", expectedSafe: false },
  { category: "Boundary", name: "Whitespace only string", input: "   ", expectedSafe: false },
  { category: "Boundary", name: "Single dot", input: ".", expectedSafe: false },
  { category: "Boundary", name: "Double dot", input: "..", expectedSafe: false },
  { category: "Boundary", name: "Path traversal /../admin", input: "/../admin", expectedSafe: false },
  { category: "Boundary", name: "Multiple slashes ///", input: "///", expectedSafe: false },
];

// Execute all test cases and gather empirical results
let passed = 0;
let failed = 0;
const failures: Array<{ test: TestCase; actual: string | null; reason: string }> = [];

console.log("===============================================================================");
console.log("Adversarial Redirection Empirical Challenge Suite");
console.log(`Executing ${testCases.length} comprehensive stress tests...`);
console.log("===============================================================================");

for (const tc of testCases) {
  const result = sanitizeRedirectPath(tc.input);
  const isSafe = isSafeRedirectPath(tc.input);

  // Check consistency between sanitizeRedirectPath and isSafeRedirectPath
  if ((result !== null) !== isSafe) {
    failed++;
    failures.push({
      test: tc,
      actual: result,
      reason: `isSafeRedirectPath returned ${isSafe} but sanitizeRedirectPath returned ${result}`,
    });
    continue;
  }

  if (tc.expectedSafe) {
    if (result === null) {
      failed++;
      failures.push({
        test: tc,
        actual: result,
        reason: `Expected safe path but got null`,
      });
    } else if (tc.expectedValue !== undefined && result !== tc.expectedValue) {
      failed++;
      failures.push({
        test: tc,
        actual: result,
        reason: `Expected '${tc.expectedValue}' but got '${result}'`,
      });
    } else {
      // Additional check: Does WHATWG URL resolve to localhost origin?
      const resolved = new URL(result, "http://localhost");
      if (resolved.origin !== "http://localhost") {
        failed++;
        failures.push({
          test: tc,
          actual: result,
          reason: `Resolved URL origin was '${resolved.origin}', not 'http://localhost'`,
        });
      } else {
        passed++;
      }
    }
  } else {
    // Malicious or invalid: MUST return null
    if (result !== null) {
      // Check if it escapes to another origin
      const resolved = new URL(result, "http://localhost");
      const originEscaped = resolved.origin !== "http://localhost";
      failed++;
      failures.push({
        test: tc,
        actual: result,
        reason: `Malicious payload was NOT rejected (returned '${result}'). Origin escaped: ${originEscaped}`,
      });
    } else {
      passed++;
    }
  }
}

// Additional dynamic C0 control characters sweep: test 0x01 through 0x1F and 0x7F
let c0Passed = 0;
let c0Failed = 0;
for (let b = 1; b < 32; b++) {
  const char = String.fromCharCode(b);
  const hex = b.toString(16).padStart(2, "0");
  const rawVec = `/${char}/evil.com`;
  const encVec = `/%${hex}/evil.com`;

  if (sanitizeRedirectPath(rawVec) !== null) {
    c0Failed++;
    failures.push({
      test: { category: "DynamicC0", name: `Raw C0 0x${hex}`, input: rawVec, expectedSafe: false },
      actual: sanitizeRedirectPath(rawVec),
      reason: `Raw C0 byte 0x${hex} was not rejected`,
    });
  } else {
    c0Passed++;
  }

  if (sanitizeRedirectPath(encVec) !== null) {
    c0Failed++;
    failures.push({
      test: { category: "DynamicC0", name: `Encoded C0 %${hex}`, input: encVec, expectedSafe: false },
      actual: sanitizeRedirectPath(encVec),
      reason: `Encoded C0 %${hex} was not rejected`,
    });
  } else {
    c0Passed++;
  }
}

console.log(`Test Cases Completed:`);
console.log(`  - Core Matrix: ${passed}/${testCases.length} PASSED`);
console.log(`  - Dynamic C0 Control Range (0x01-0x1F): ${c0Passed}/62 PASSED`);
console.log(`  - Total Passed: ${passed + c0Passed} / ${testCases.length + 62}`);
console.log(`  - Total Failed: ${failed + c0Failed}`);

if (failures.length > 0) {
  console.error("FAILURES DETECTED:");
  for (const f of failures) {
    console.error(`  [${f.test.category}] ${f.test.name}`);
    console.error(`    Input:    ${JSON.stringify(f.test.input)}`);
    console.error(`    Actual:   ${JSON.stringify(f.actual)}`);
    console.error(`    Reason:   ${f.reason}`);
  }
  process.exit(1);
} else {
  console.log("VERDICT: ALL ADVERSARIAL CHALLENGES PASSED EMPIRICALLY (0 VULNERABILITIES).");
  process.exit(0);
}
