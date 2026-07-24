pub struct AgentMetrics {
  pub fps: f32,
  pub bitrate_kbps: u32,
  pub dropped_frames: u64,
  pub rtt_ms: u32,
}

impl AgentMetrics {
  pub fn new() -> Self {
    Self {
      fps: 60.0,
      bitrate_kbps: 4500,
      dropped_frames: 0,
      rtt_ms: 15,
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_agent_metrics_defaults() {
    let metrics = AgentMetrics::new();
    assert_eq!(metrics.fps, 60.0);
    assert_eq!(metrics.bitrate_kbps, 4500);
  }
}
