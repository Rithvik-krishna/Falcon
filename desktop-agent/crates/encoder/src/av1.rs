use super::traits::{CodecType, EncodedFrame, EncoderError, VideoEncoder};

pub struct AV1Encoder {
    width: u32,
    height: u32,
    bitrate_kbps: u32,
    frame_counter: u64,
}

impl AV1Encoder {
    pub fn new() -> Self {
        Self {
            width: 0,
            height: 0,
            bitrate_kbps: 1500,
            frame_counter: 0,
        }
    }
}

impl VideoEncoder for AV1Encoder {
    fn codec_type(&self) -> CodecType {
        CodecType::AV1
    }

    fn init(&mut self, width: u32, height: u32, target_bitrate_kbps: u32) -> Result<(), EncoderError> {
        self.width = width;
        self.height = height;
        self.bitrate_kbps = target_bitrate_kbps;
        Ok(())
    }

    fn encode_frame(&mut self, bgra_buffer: &[u8], is_keyframe_requested: bool) -> Result<EncodedFrame, EncoderError> {
        if bgra_buffer.is_empty() {
            return Err(EncoderError::EncodeFailed("Empty frame buffer".to_string()));
        }

        self.frame_counter += 1;
        let is_keyframe = is_keyframe_requested || (self.frame_counter % 60 == 1);

        let mut av1_payload = vec![0x12, 0x00]; // OBU Header
        av1_payload.extend_from_slice(&bgra_buffer[..bgra_buffer.len().min(80)]);

        Ok(EncodedFrame {
            codec: CodecType::AV1,
            is_keyframe,
            payload: av1_payload,
            timestamp_us: self.frame_counter * 16_666,
        })
    }

    fn set_bitrate(&mut self, target_bitrate_kbps: u32) -> Result<(), EncoderError> {
        self.bitrate_kbps = target_bitrate_kbps;
        Ok(())
    }

    fn force_keyframe(&mut self) {}
}
