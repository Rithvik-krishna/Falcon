import { Logger } from 'pino';

export interface TraceContext {
  traceId: string;
  spanId: string;
  sampled: boolean;
}

export class OpenTelemetryTracer {
  private logger: Logger;
  private collectorUrl: string;

  constructor(logger: Logger, collectorUrl: string = 'http://localhost:4318/v1/traces') {
    this.logger = logger;
    this.collectorUrl = collectorUrl;
  }

  public extractW3cHeader(traceparent?: string): TraceContext {
    if (!traceparent) {
      return this.generateNewTraceContext();
    }

    // Format: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
    const parts = traceparent.split('-');
    if (parts.length < 4) {
      return this.generateNewTraceContext();
    }

    return {
      traceId: parts[1],
      spanId: parts[2],
      sampled: parts[3] === '01',
    };
  }

  public generateTraceparentHeader(ctx: TraceContext): string {
    return `00-${ctx.traceId}-${ctx.spanId}-${ctx.sampled ? '01' : '00'}`;
  }

  private generateNewTraceContext(): TraceContext {
    return {
      traceId: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      spanId: Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      sampled: true,
    };
  }
}
