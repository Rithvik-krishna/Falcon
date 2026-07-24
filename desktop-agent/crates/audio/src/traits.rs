use thiserror::Error;

#[derive(Debug, Error)]
pub enum AudioError {
    #[error("Audio capture init error: {0}")]
    InitFailed(String),
    #[error("Audio read error: {0}")]
    ReadFailed(String),
}

pub struct AudioChunk {
    pub sample_rate: u32,
    pub channels: u16,
    pub pcm_data: Vec<f32>,
    pub timestamp_us: u64,
}

pub trait AudioBackend: Send + Sync {
    fn init(&mut self, sample_rate: u32, channels: u16) -> Result<(), AudioError>;
    fn capture_pcm_chunk(&mut self) -> Result<AudioChunk, AudioError>;
}
