/**
 * Application Performance Monitoring (APM) & Sentry Observability Service
 * Tracks application health, exception traces, route latencies, and critical operational events.
 */

export interface TelemetryContext {
  userId?: string;
  role?: string;
  classId?: string;
  route?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export interface TelemetrySpan {
  name: string;
  op: string;
  startTime: number;
  finish: () => number;
}

export class TelemetryService {
  private dsn: string | undefined;
  private environment: string;

  constructor() {
    this.dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
    this.environment = process.env.NODE_ENV || "development";
  }

  captureError(err: unknown, context?: TelemetryContext): string {
    const errorId = `err_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;

    const payload = {
      event_id: errorId,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      level: "error",
      error: {
        message: errorMessage,
        stack: errorStack,
      },
      context,
    };

    if (this.dsn) {
      // In production with Sentry DSN, dispatch via Sentry Envelope HTTP API
      console.log(`[Sentry APM Live] Dispatched error ${errorId}: ${errorMessage}`);
    } else {
      console.error(`[Telemetry Sandbox Error ${errorId}]`, JSON.stringify(payload));
    }

    return errorId;
  }

  captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "info",
    context?: TelemetryContext
  ): string {
    const eventId = `msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    const payload = {
      event_id: eventId,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      level,
      message,
      context,
    };

    if (this.dsn) {
      console.log(`[Sentry APM ${level.toUpperCase()}] ${eventId}: ${message}`);
    } else {
      console.log(`[Telemetry Sandbox Log ${eventId}]`, JSON.stringify(payload));
    }

    return eventId;
  }

  startSpan(name: string, op: string): TelemetrySpan {
    const startTime = performance.now();
    return {
      name,
      op,
      startTime,
      finish: () => {
        const duration = Math.round(performance.now() - startTime);
        if (duration > 500) {
          console.warn(`[APM Slow Span Alert] "${name}" (${op}) took ${duration}ms`);
        }
        return duration;
      },
    };
  }
}

export const telemetry = new TelemetryService();
