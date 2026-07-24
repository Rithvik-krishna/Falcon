use thiserror::Error;

#[derive(Debug, Error)]
pub enum EncoderError {
    #[error("Initialization error: {0}")]
    InitFailed(String),
    #[error("Encoding error: {0}")]
    EncodeFailed(String),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CodecType {
    H264,
    AV1,
    VP9,
}

pub struct EncodedFrame {
    pub codec: CodecType,
    pub is_keyframe: bool,
    pub payload: Vec<u8>,
    pub timestamp_us: u64,
}

pub trait VideoEncoder: Send + Sync {
    fn codec_type(&self) -> CodecType;
    fn init(&mut self, width: u32, height: u32, target_bitrate_kbps: u32) -> Result<(), EncoderError>;
    fn encode_frame(&mut self, bgra_buffer: &[u8], is_keyframe_requested: bool) -> Result<EncodedFrame, EncoderError>;
    fn set_bitrate(&mut self, target_bitrate_kbps: u32) -> Result<(), EncoderError>;
    fn force_keyframe(&mut self);
}
