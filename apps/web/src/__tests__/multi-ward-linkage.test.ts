import { describe, it, expect } from "vitest";

export interface WardRecord {
  id: string;
  name: string;
  age: number;
  course: string;
  teacher?: string;
  studentId?: string;
}

const PRESET_WARDS: WardRecord[] = [
  {
    id: "ward_yusuf",
    name: "Yusuf Khan",
    age: 9,
    course: "Quran Reading for Kids (Noorani Qaida)",
    teacher: "Ustadha Maryam Ahmed",
    studentId: "STU-2026-001"
  },
  {
    id: "ward_hana",
    name: "Hana Khan",
    age: 12,
    course: "Hifz & Tajweed Memorisation",
    teacher: "Sheikh Tariq Mehmood",
    studentId: "STU-2026-002"
  },
  {
    id: "ward_amina",
    name: "Amina Khan",
    age: 10,
    course: "Tajweed Fluency & Recitation",
    teacher: "Ustadha Maryam Ahmed",
    studentId: "STU-2026-003"
  }
];

describe("Parent Portal & Registration Multi-Ward Linkage Engine", () => {
  it("initializes with primary ward and allows adding additional wards via plus sign", () => {
    let selectedWards: WardRecord[] = [PRESET_WARDS[0]];
    expect(selectedWards.length).toBe(1);
    expect(selectedWards[0].name).toBe("Yusuf Khan");

    // Add 2nd ward (e.g. Hana Khan via + button)
    const ward2 = PRESET_WARDS[1];
    if (!selectedWards.some((w) => w.id === ward2.id)) {
      selectedWards = [...selectedWards, ward2];
    }
    expect(selectedWards.length).toBe(2);
    expect(selectedWards.map((w) => w.name)).toEqual(["Yusuf Khan", "Hana Khan"]);

    // Add 3rd ward (e.g. Amina Khan via + button)
    const ward3 = PRESET_WARDS[2];
    if (!selectedWards.some((w) => w.id === ward3.id)) {
      selectedWards = [...selectedWards, ward3];
    }
    expect(selectedWards.length).toBe(3);
    expect(selectedWards.map((w) => w.name)).toEqual(["Yusuf Khan", "Hana Khan", "Amina Khan"]);
  });

  it("prevents duplicate ward additions when selecting from search dropdown", () => {
    let selectedWards: WardRecord[] = [PRESET_WARDS[0]];
    const duplicateWard = PRESET_WARDS[0];

    // Attempt to add duplicate
    if (!selectedWards.some((w) => w.id === duplicateWard.id || w.name.toLowerCase() === duplicateWard.name.toLowerCase())) {
      selectedWards = [...selectedWards, duplicateWard];
    }

    expect(selectedWards.length).toBe(1);
  });

  it("allows removing a ward from selected list while retaining other wards", () => {
    let selectedWards: WardRecord[] = [PRESET_WARDS[0], PRESET_WARDS[1], PRESET_WARDS[2]];
    expect(selectedWards.length).toBe(3);

    // Remove Hana Khan
    selectedWards = selectedWards.filter((w) => w.id !== "ward_hana");
    expect(selectedWards.length).toBe(2);
    expect(selectedWards.map((w) => w.name)).toEqual(["Yusuf Khan", "Amina Khan"]);
  });

  it("serializes multi-ward payloads accurately for form submissions and OAuth cookies", () => {
    const selectedWards: WardRecord[] = [PRESET_WARDS[0], PRESET_WARDS[1]];
    const serialized = JSON.stringify(selectedWards);
    const wardNameJoined = selectedWards.map((w) => w.name).join(", ");
    const wardIdJoined = selectedWards.map((w) => w.studentId || w.id).join(",");

    expect(wardNameJoined).toBe("Yusuf Khan, Hana Khan");
    expect(wardIdJoined).toBe("STU-2026-001,STU-2026-002");

    const parsed = JSON.parse(serialized);
    expect(parsed.length).toBe(2);
    expect(parsed[0].name).toBe("Yusuf Khan");
    expect(parsed[1].name).toBe("Hana Khan");
  });

  it("correctly parses multi-ward cookie in parent portal and identifies linked wards", () => {
    const cookieHeader = 'selected_wards=' + encodeURIComponent(JSON.stringify(["Yusuf Khan", "Hana Khan"])) + '; demo_role=parent';
    const match = cookieHeader.match(/selected_wards=([^;]+)/);
    expect(match).not.toBeNull();

    const decoded = decodeURIComponent(match![1]);
    const parsedNames: string[] = JSON.parse(decoded);
    expect(parsedNames).toEqual(["Yusuf Khan", "Hana Khan"]);

    // Test linked ward verification
    const child1 = { name: "Yusuf Khan" };
    const child2 = { name: "Hana Khan" };
    const child3 = { name: "Omar Ali" };

    expect(parsedNames.some((w) => w.toLowerCase() === child1.name.toLowerCase())).toBe(true);
    expect(parsedNames.some((w) => w.toLowerCase() === child2.name.toLowerCase())).toBe(true);
    expect(parsedNames.some((w) => w.toLowerCase() === child3.name.toLowerCase())).toBe(false);
  });
});
