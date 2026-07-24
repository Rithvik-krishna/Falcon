export class PrometheusMetricsExporter {
  private httpRequestsTotal: number = 0;
  private activeDevicesTotal: number = 0;
  private activeSignalingConnections: number = 0;
  private authFailuresTotal: number = 0;

  public incHttpRequests(): void {
    this.httpRequestsTotal++;
  }

  public incAuthFailures(): void {
    this.authFailuresTotal++;
  }

  public setActiveDevices(count: number): void {
    this.activeDevicesTotal = count;
  }

  public setActiveSignalingConnections(count: number): void {
    this.activeSignalingConnections = count;
  }

  public renderPrometheusMetrics(): string {
    return [
      '# HELP falcon_http_requests_total Total number of HTTP requests',
      '# TYPE falcon_http_requests_total counter',
      `falcon_http_requests_total ${this.httpRequestsTotal}`,
      '# HELP falcon_auth_failures_total Total number of authentication failures',
      '# TYPE falcon_auth_failures_total counter',
      `falcon_auth_failures_total ${this.authFailuresTotal}`,
      '# HELP falcon_active_devices_total Current total active devices',
      '# TYPE falcon_active_devices_total gauge',
      `falcon_active_devices_total ${this.activeDevicesTotal}`,
      '# HELP falcon_signaling_connections_active Current active WebSocket signaling clients',
      '# TYPE falcon_signaling_connections_active gauge',
      `falcon_signaling_connections_active ${this.activeSignalingConnections}`,
    ].join('\n') + '\n';
  }
}
