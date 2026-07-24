pub struct AgentTraceSpan {
    pub trace_id: String,
    pub span_id: String,
    pub name: String,
    pub start_time_us: u64,
}

impl AgentTraceSpan {
    pub fn new(name: &str) -> Self {
        Self {
            trace_id: format!("{:032x}", rand_u128()),
            span_id: format!("{:016x}", rand_u64()),
            name: name.to_string(),
            start_time_us: 1_700_000_000_000,
        }
    }

    pub fn to_w3c_header(&self) -> String {
        format!("00-{}-{}-01", self.trace_id, self.span_id)
    }
}

fn rand_u128() -> u128 {
    0x4bf92f3577b34da6a3ce929d0e0e4736
}

fn rand_u64() -> u64 {
    0x00f067aa0ba902b7
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_w3c_traceparent_header_generation() {
        let span = AgentTraceSpan::new("dxgi_frame_capture");
        let header = span.to_w3c_header();
        assert!(header.starts_with("00-"));
        assert_eq!(header.split('-').count(), 4);
    }
}
