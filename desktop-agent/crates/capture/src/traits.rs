use thiserror::Error;

#[derive(Debug, Error)]
pub enum CaptureError {
    #[error("Capture initialization error: {0}")]
    InitFailed(String),
    #[error("Frame capture error: {0}")]
    CaptureFailed(String),
}

#[derive(Debug, Clone)]
pub struct MonitorInfo {
    pub id: u32,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub is_primary: bool,
}

pub struct CapturedFrame {
    pub width: u32,
    pub height: u32,
    pub bgra_data: Vec<u8>,
    pub timestamp_us: u64,
}

pub trait CaptureBackend: Send + Sync {
    fn get_monitors(&self) -> Result<Vec<MonitorInfo>, CaptureError>;
    fn init(&mut self, monitor_id: u32) -> Result<(), CaptureError>;
    fn capture_frame(&mut self) -> Result<CapturedFrame, CaptureError>;
}
