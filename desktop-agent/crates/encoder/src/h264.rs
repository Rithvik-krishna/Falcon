use super::traits::{CodecType, EncodedFrame, EncoderError, VideoEncoder};

pub struct H264Encoder {
    width: u32,
    height: u32,
    bitrate_kbps: u32,
    force_keyframe_flag: bool,
    frame_counter: u64,
}

impl H264Encoder {
    pub fn new() -> Self {
        Self {
            width: 0,
            height: 0,
            bitrate_kbps: 2000,
            force_keyframe_flag: false,
            frame_counter: 0,
        }
    }
}

impl VideoEncoder for H264Encoder {
    fn codec_type(&self) -> CodecType {
        CodecType::H264
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
        let is_keyframe = is_keyframe_requested || self.force_keyframe_flag || (self.frame_counter % 60 == 1);
        self.force_keyframe_flag = false;

        // Mock H.264 NAL unit header payload for encoder pipeline verification
        let mut nal_payload = vec![0x00, 0x00, 0x00, 0x01];
        nal_payload.push(if is_keyframe { 0x65 } else { 0x41 }); // NAL IDR / non-IDR
        nal_payload.extend_from_slice(&bgra_buffer[..bgra_buffer.len().min(100)]);

        Ok(EncodedFrame {
            codec: CodecType::H264,
            is_keyframe,
            payload: nal_payload,
            timestamp_us: self.frame_counter * 16_666, // ~60 FPS
        })
    }

    fn set_bitrate(&mut self, target_bitrate_kbps: u32) -> Result<(), EncoderError> {
        self.bitrate_kbps = target_bitrate_kbps;
        Ok(())
    }

    fn force_keyframe(&mut self) {
        self.force_keyframe_flag = true;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_h264_encoder_pipeline() {
        let mut encoder = H264Encoder::new();
        encoder.init(1920, 1080, 4000).unwrap();

        let dummy_bgra = vec![0xFFu8; 1920 * 1080 * 4];
        let frame = encoder.encode_frame(&dummy_bgra, true).unwrap();

        assert_eq!(frame.codec, CodecType::H264);
        assert_eq!(frame.is_keyframe, true);
        assert!(!frame.payload.is_empty());
    }
}
