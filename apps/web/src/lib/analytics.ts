/**
 * Academy Conversion Funnel & User Engagement Telemetry
 * Captures lifecycle milestones: Trial Booking -> Classroom Attendance -> Scorecard -> Tuition Clearance.
 */

export type FunnelEventName =
  | "trial_booked"
  | "classroom_entered"
  | "lesson_completed"
  | "receipt_uploaded"
  | "payment_verified"
  | "package_switched";

export interface FunnelEventData {
  event: FunnelEventName;
  timestamp: string;
  properties: Record<string, unknown>;
}

class AnalyticsService {
  private eventsLog: FunnelEventData[] = [];

  track(event: FunnelEventName, properties: Record<string, unknown> = {}): FunnelEventData {
    const entry: FunnelEventData = {
      event,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        platform: "web",
        environment: process.env.NODE_ENV || "development",
      },
    };

    this.eventsLog.push(entry);

    // Keep in-memory buffer limited to last 100 events
    if (this.eventsLog.length > 100) {
      this.eventsLog.shift();
    }

    console.log(`[Funnel Analytics] ${event.toUpperCase()}`, JSON.stringify(properties));
    return entry;
  }

  getRecentEvents(): FunnelEventData[] {
    return [...this.eventsLog];
  }

  clear() {
    this.eventsLog = [];
  }
}

export const analytics = new AnalyticsService();
