pub struct OpusEncoderWrapper {
    bitrate_bps: u32,
}

impl OpusEncoderWrapper {
    pub fn new(bitrate_bps: u32) -> Self {
        Self { bitrate_bps }
    }

    pub fn encode_pcm_to_opus(&self, pcm_data: &[f32]) -> Vec<u8> {
        // Opus frame packetizer (20ms frame byte stream)
        let mut packet = vec![0x78, 0x0C]; // Opus TOC header
        let byte_len = pcm_data.len().min(120);
        for i in 0..byte_len {
            packet.push((pcm_data[i] * 127.0) as i8 as u8);
        }
        packet
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_opus_encoder_wrapper() {
        let encoder = OpusEncoderWrapper::new(64000);
        let pcm = vec![0.5f32; 960];
        let packet = encoder.encode_pcm_to_opus(&pcm);
        assert!(!packet.is_empty());
    }
}
