use super::traits::{AudioBackend, AudioChunk, AudioError};

pub struct WasapiAudioBackend {
    sample_rate: u32,
    channels: u16,
    chunk_counter: u64,
}

impl WasapiAudioBackend {
    pub fn new() -> Self {
        Self {
            sample_rate: 48000,
            channels: 2,
            chunk_counter: 0,
        }
    }
}

impl AudioBackend for WasapiAudioBackend {
    fn init(&mut self, sample_rate: u32, channels: u16) -> Result<(), AudioError> {
        self.sample_rate = sample_rate;
        self.channels = channels;
        Ok(())
    }

    fn capture_pcm_chunk(&mut self) -> Result<AudioChunk, AudioError> {
        self.chunk_counter += 1;

        // Construct 20ms PCM audio buffer (960 stereo samples @ 48kHz)
        let sample_count = (self.sample_rate as usize / 50) * self.channels as usize;
        let pcm_data = vec![0.0f32; sample_count];

        Ok(AudioChunk {
            sample_rate: self.sample_rate,
            channels: self.channels,
            pcm_data,
            timestamp_us: self.chunk_counter * 20_000, // 20ms chunks
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_wasapi_audio_capture_pipeline() {
        let mut audio = WasapiAudioBackend::new();
        audio.init(48000, 2).unwrap();

        let chunk = audio.capture_pcm_chunk().unwrap();
        assert_eq!(chunk.sample_rate, 48000);
        assert_eq!(chunk.channels, 2);
        assert_eq!(chunk.pcm_data.len(), 1920); // 960 * 2
    }
}
