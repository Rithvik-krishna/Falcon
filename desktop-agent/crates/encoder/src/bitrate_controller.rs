pub struct BitrateController {
    current_bitrate_kbps: u32,
    min_bitrate_kbps: u32,
    max_bitrate_kbps: u32,
}

impl BitrateController {
    pub fn new(initial_bitrate_kbps: u32, min_bitrate_kbps: u32, max_bitrate_kbps: u32) -> Self {
        Self {
            current_bitrate_kbps: initial_bitrate_kbps,
            min_bitrate_kbps,
            max_bitrate_kbps,
        }
    }

    pub fn update_from_gcc(&mut self, packet_loss_fraction: f32, rtt_ms: u32) -> u32 {
        if packet_loss_fraction > 0.10 {
            // High loss (>10%): Back off bitrate by 15%
            self.current_bitrate_kbps = (self.current_bitrate_kbps as f32 * 0.85) as u32;
        } else if packet_loss_fraction < 0.02 && rtt_ms < 100 {
            // Excellent network (<2% loss, RTT < 100ms): Increase bitrate by 5%
            self.current_bitrate_kbps = (self.current_bitrate_kbps as f32 * 1.05) as u32;
        }

        self.current_bitrate_kbps = self.current_bitrate_kbps
            .clamp(self.min_bitrate_kbps, self.max_bitrate_kbps);

        self.current_bitrate_kbps
    }

    pub fn current_bitrate(&self) -> u32 {
        self.current_bitrate_kbps
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bitrate_adaptation() {
        let mut controller = BitrateController::new(2000, 500, 15000);

        // High packet loss triggers backoff
        let new_rate = controller.update_from_gcc(0.15, 120);
        assert!(new_rate < 2000);

        // Low loss triggers increase
        let increased = controller.update_from_gcc(0.01, 30);
        assert!(increased > new_rate);
    }
}
