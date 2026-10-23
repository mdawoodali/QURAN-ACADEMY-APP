import { describe, it, expect } from "vitest";
import {
  getCalligraphyOutline,
  getSvgPathFromStroke,
  generateCalligraphyPath,
  QALAM_PRESETS,
} from "../lib/calligraphyStroke";

describe("Authentic Reed Pen (Qalam) Calligraphy Stroke Engine", () => {
  it("returns an empty outline for empty input points", () => {
    expect(getCalligraphyOutline([])).toEqual([]);
    expect(generateCalligraphyPath([])).toBe("");
  });

  it("handles a single dot / touch point", () => {
    const singlePoint = [{ x: 100, y: 100, pressure: 0.8 }];
    const outline = getCalligraphyOutline(singlePoint, { size: 10 });
    expect(outline.length).toBe(4);
    const path = generateCalligraphyPath(singlePoint, { size: 10 });
    expect(path).toContain("M ");
    expect(path).toContain("Z");
  });

  it("generates a smooth continuous polygon for Arabic stroke coordinates", () => {
    // Simulated vertical Baa stroke downward then horizontally left (RTL stroke)
    const points = [
      { x: 100, y: 50, pressure: 0.4 },
      { x: 100, y: 70, pressure: 0.6 },
      { x: 100, y: 100, pressure: 0.8 },
      { x: 90, y: 110, pressure: 0.7 },
      { x: 70, y: 110, pressure: 0.5 },
      { x: 50, y: 105, pressure: 0.3 },
    ];

    const outline = getCalligraphyOutline(points, QALAM_PRESETS.naskh);
    expect(outline.length).toBe(points.length * 2);

    const svgPath = getSvgPathFromStroke(outline);
    expect(svgPath.startsWith("M ")).toBe(true);
    expect(svgPath.endsWith("Z")).toBe(true);
    expect(svgPath).toContain("Q ");
  });

  it("implements distinct nib geometry presets (Naskh, Thuluth, Nastaliq, Marker)", () => {
    const testPoints = [
      { x: 10, y: 10 },
      { x: 20, y: 30 },
      { x: 30, y: 50 },
    ];

    const naskhPath = generateCalligraphyPath(testPoints, QALAM_PRESETS.naskh);
    const thuluthPath = generateCalligraphyPath(testPoints, QALAM_PRESETS.thuluth);
    const markerPath = generateCalligraphyPath(testPoints, QALAM_PRESETS.marker);

    expect(naskhPath).toBeTruthy();
    expect(thuluthPath).toBeTruthy();
    expect(markerPath).toBeTruthy();
    expect(naskhPath).not.toEqual(thuluthPath);
  });
});
