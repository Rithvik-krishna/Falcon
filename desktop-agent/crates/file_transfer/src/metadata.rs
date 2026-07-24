use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileMetadataHeader {
    pub transfer_id: String,
    pub filename: String,
    pub total_size_bytes: u64,
    pub total_chunks: u32,
    pub chunk_size_bytes: u32,
    pub file_sha256: String,
}

impl FileMetadataHeader {
    pub fn new(transfer_id: &str, filename: &str, total_size: u64, file_sha256: &str) -> Self {
        const CHUNK_SIZE: u32 = 64 * 1024; // 64 KB per chunk
        let total_chunks = ((total_size + CHUNK_SIZE as u64 - 1) / CHUNK_SIZE as u64) as u32;

        Self {
            transfer_id: transfer_id.to_string(),
            filename: filename.to_string(),
            total_size_bytes: total_size,
            total_chunks,
            chunk_size_bytes: CHUNK_SIZE,
            file_sha256: file_sha256.to_string(),
        }
    }
}
