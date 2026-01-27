import logger from "@/utils/logger";

export interface DecisionMetrics {
  mediaId: number;
  decisionTimeMs: number;
  confidenceLevelAtDecision: "high" | "medium" | "low";
  intentPresetUsed?: string;
  sourceComponent: string;
}

export class MetricsService {
  static trackDecision(metrics: DecisionMetrics) {
    logger.log(" [Metrics] Decision Recorded:", metrics);

    // In a real app, this would be a POST to an analytics endpoint
    // fetch('/api/metrics/decision', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     ...metrics,
    //     timestamp: Date.now(),
    //     sessionId: localStorage.getItem('sessionId')
    //   })
    // });
  }

  static trackIntelligenceView(mediaId: number, component: string) {
    logger.log(` [Metrics] Intelligence Viewed for ${mediaId} in ${component}`);
  }
}
