use sha2::{Digest, Sha256};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum TransferError {
    #[error("Checksum validation mismatch")]
    ChecksumMismatch,
}

pub struct ChunkData {
    pub chunk_index: u32,
    pub payload: Vec<u8>,
    pub chunk_checksum: String,
}

pub struct ResumableFileChunker;

impl ResumableFileChunker {
    pub fn create_chunk(chunk_index: u32, data: &[u8]) -> ChunkData {
        let mut hasher = Sha256::new();
        hasher.update(data);
        let hash = format!("{:x}", hasher.finalize());

        ChunkData {
            chunk_index,
            payload: data.to_vec(),
            chunk_checksum: hash,
        }
    }

    pub fn verify_chunk(chunk: &ChunkData) -> Result<(), TransferError> {
        let mut hasher = Sha256::new();
        hasher.update(&chunk.payload);
        let hash = format!("{:x}", hasher.finalize());

        if hash == chunk.chunk_checksum {
            Ok(())
        } else {
            Err(TransferError::ChecksumMismatch)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_chunk_creation_and_verification() {
        let data = vec![0xABu8; 64 * 1024];
        let chunk = ResumableFileChunker::create_chunk(0, &data);

        assert_eq!(chunk.chunk_index, 0);
        assert_eq!(chunk.payload.len(), 64 * 1024);
        assert!(ResumableFileChunker::verify_chunk(&chunk).is_ok());
    }
}
