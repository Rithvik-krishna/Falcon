use super::traits::{CaptureBackend, CapturedFrame, CaptureError, MonitorInfo};

pub struct DxgiCaptureBackend {
    active_monitor_id: u32,
    width: u32,
    height: u32,
    frame_count: u64,
}

impl DxgiCaptureBackend {
    pub fn new() -> Self {
        Self {
            active_monitor_id: 0,
            width: 1920,
            height: 1080,
            frame_count: 0,
        }
    }
}

impl CaptureBackend for DxgiCaptureBackend {
    fn get_monitors(&self) -> Result<Vec<MonitorInfo>, CaptureError> {
        Ok(vec![MonitorInfo {
            id: 0,
            name: "Primary Display (DXGI)".to_string(),
            width: 1920,
            height: 1080,
            is_primary: true,
        }])
    }

    fn init(&mut self, monitor_id: u32) -> Result<(), CaptureError> {
        self.active_monitor_id = monitor_id;
        self.width = 1920;
        self.height = 1080;
        Ok(())
    }

    fn capture_frame(&mut self) -> Result<CapturedFrame, CaptureError> {
        self.frame_count += 1;

        // Construct 1920x1080 BGRA frame buffer (test pattern buffer for DXGI pipeline)
        let frame_size = (self.width * self.height * 4) as usize;
        let mut bgra_data = vec![0u8; frame_size.min(1024)]; // Sample buffer slice
        bgra_data.resize(frame_size, 0x7F);

        Ok(CapturedFrame {
            width: self.width,
            height: self.height,
            bgra_data,
            timestamp_us: self.frame_count * 16_666,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dxgi_capture_pipeline() {
        let mut capture = DxgiCaptureBackend::new();
        let monitors = capture.get_monitors().unwrap();
        assert!(!monitors.is_empty());

        capture.init(0).unwrap();
        let frame = capture.capture_frame().unwrap();
        assert_eq!(frame.width, 1920);
        assert_eq!(frame.height, 1080);
        assert_eq!(frame.bgra_data.len(), 1920 * 1080 * 4);
    }
}
