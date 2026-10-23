/**
 * Authentic Reed Pen (Qalam / قلم) Calligraphy Stroke Engine
 * Implements slant-angle variable ribbon geometry inspired by the
 * 'perfect-freehand' algorithm specifically tuned for Arabic/Urdu Naskh and Thuluth calligraphy.
 */

export interface Point {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

export interface CalligraphyOptions {
  /** Base pen size in pixels (default: 8) */
  size?: number;
  /** Qalam nib cut angle in degrees (default: 40 deg for Naskh/Thuluth) */
  nibAngle?: number;
  /** Aspect ratio of the nib thickness to width: 0.1 (razor reed) to 1.0 (round marker) */
  nibAspectRatio?: number;
  /** Smoothing factor between 0.0 (raw) and 1.0 (heavy smoothing) */
  smoothing?: number;
  /** Taper start/end percentage (0.0 to 0.5) */
  taper?: number;
}

export const QALAM_PRESETS = {
  naskh: {
    size: 10,
    nibAngle: 40,
    nibAspectRatio: 0.22,
    smoothing: 0.45,
    taper: 0.15,
  },
  thuluth: {
    size: 16,
    nibAngle: 45,
    nibAspectRatio: 0.18,
    smoothing: 0.5,
    taper: 0.2,
  },
  nastaliq: {
    size: 12,
    nibAngle: 65,
    nibAspectRatio: 0.15,
    smoothing: 0.55,
    taper: 0.25,
  },
  marker: {
    size: 6,
    nibAngle: 0,
    nibAspectRatio: 1.0,
    smoothing: 0.3,
    taper: 0.05,
  },
} as const;

/**
 * Calculates a smooth calligraphy polygon contour from an array of input points.
 */
export function getCalligraphyOutline(
  points: Point[],
  options: CalligraphyOptions = {}
): [number, number][] {
  if (points.length === 0) return [];
  if (points.length === 1) {
    const p = points[0]!;
    const r = (options.size || 8) / 2;
    return [
      [p.x - r, p.y - r],
      [p.x + r, p.y - r],
      [p.x + r, p.y + r],
      [p.x - r, p.y + r],
    ];
  }

  const {
    size = 8,
    nibAngle = 40,
    nibAspectRatio = 0.22,
    smoothing = 0.45,
    taper = 0.15,
  } = options;

  // Convert nib angle to radians
  const angleRad = (nibAngle * Math.PI) / 180;
  const nibDx = Math.cos(angleRad);
  const nibDy = -Math.sin(angleRad);

  // 1. Smooth input points
  const smoothed: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    const cur = points[i]!;
    if (i === 0 || i === points.length - 1) {
      smoothed.push(cur);
    } else {
      const prev = smoothed[i - 1]!;
      const next = points[i + 1]!;
      const sx = cur.x * (1 - smoothing) + ((prev.x + next.x) / 2) * smoothing;
      const sy = cur.y * (1 - smoothing) + ((prev.y + next.y) / 2) * smoothing;
      smoothed.push({
        x: sx,
        y: sy,
        pressure: cur.pressure ?? 0.5,
      });
    }
  }

  const leftRibbon: [number, number][] = [];
  const rightRibbon: [number, number][] = [];

  const totalPoints = smoothed.length;
  const taperCount = Math.max(1, Math.floor(totalPoints * taper));

  for (let i = 0; i < totalPoints; i++) {
    const p = smoothed[i]!;

    // Taper scale
    let tScale = 1.0;
    if (i < taperCount) {
      tScale = (i + 1) / taperCount;
    } else if (i >= totalPoints - taperCount) {
      tScale = (totalPoints - i) / taperCount;
    }

    const effectivePressure = p.pressure ?? 0.5;
    const currentRadius = (size / 2) * (0.6 + effectivePressure * 0.8) * Math.max(0.15, tScale);

    // Vector offset along nib orientation
    const ox = nibDx * currentRadius;
    const oy = nibDy * currentRadius;

    // Perpendicular thickness controlled by nibAspectRatio
    const perpOx = -nibDy * (currentRadius * nibAspectRatio);
    const perpOy = nibDx * (currentRadius * nibAspectRatio);

    leftRibbon.push([p.x + ox + perpOx, p.y + oy + perpOy]);
    rightRibbon.push([p.x - ox - perpOx, p.y - oy - perpOy]);
  }

  // Reverse right ribbon to complete closed polygon loop
  return [...leftRibbon, ...rightRibbon.reverse()];
}

/**
 * Converts a polygon outline into an SVG path string `M x y Q ... Z`
 */
export function getSvgPathFromStroke(stroke: [number, number][]): string {
  if (stroke.length < 2) return "";

  const d: string[] = [];
  const first = stroke[0]!;
  d.push(`M ${first[0].toFixed(2)} ${first[1].toFixed(2)}`);

  for (let i = 1; i < stroke.length; i++) {
    const cur = stroke[i]!;
    const next = stroke[(i + 1) % stroke.length]!;
    const midX = (cur[0] + next[0]) / 2;
    const midY = (cur[1] + next[1]) / 2;
    d.push(`Q ${cur[0].toFixed(2)} ${cur[1].toFixed(2)}, ${midX.toFixed(2)} ${midY.toFixed(2)}`);
  }

  d.push("Z");
  return d.join(" ");
}

/**
 * Helper to generate full SVG path directly from raw points and options.
 */
export function generateCalligraphyPath(
  points: Point[],
  options?: CalligraphyOptions
): string {
  const stroke = getCalligraphyOutline(points, options);
  return getSvgPathFromStroke(stroke);
}
