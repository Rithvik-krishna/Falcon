use byteorder::{BigEndian, ByteOrder};
use thiserror::Error;

pub const HEADER_SIZE: usize = 8;
pub const PROTOCOL_VERSION: u8 = 1;

#[derive(Debug, Error)]
pub enum HeaderError {
    #[error("Buffer underflow: expected at least {HEADER_SIZE} bytes, got {0}")]
    Underflow(usize),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProtocolHeader {
    pub version: u8,
    pub msg_type: u16,
    pub length: u32,
    pub flags: u8,
}

impl ProtocolHeader {
    pub fn serialize(&self) -> [u8; HEADER_SIZE] {
        let mut buf = [0u8; HEADER_SIZE];
        buf[0] = self.version;
        BigEndian::write_u16(&mut buf[1..3], self.msg_type);
        BigEndian::write_u32(&mut buf[3..7], self.length);
        buf[7] = self.flags;
        buf
    }

    pub fn deserialize(buf: &[u8]) -> Result<Self, HeaderError> {
        if buf.len() < HEADER_SIZE {
            return Err(HeaderError::Underflow(buf.len()));
        }
        Ok(Self {
            version: buf[0],
            msg_type: BigEndian::read_u16(&buf[1..3]),
            length: BigEndian::read_u32(&buf[3..7]),
            flags: buf[7],
        })
    }
}

pub fn wrap_frame(msg_type: u16, payload: &[u8], flags: u8) -> Vec<u8> {
    let header = ProtocolHeader {
        version: PROTOCOL_VERSION,
        msg_type,
        length: payload.len() as u32,
        flags,
    };
    let mut frame = Vec::with_capacity(HEADER_SIZE + payload.len());
    frame.extend_from_slice(&header.serialize());
    frame.extend_from_slice(payload);
    frame
}

pub fn unwrap_frame(frame: &[u8]) -> Result<(ProtocolHeader, &[u8]), HeaderError> {
    let header = ProtocolHeader::deserialize(frame)?;
    let end = HEADER_SIZE + header.length as usize;
    let payload = &frame[HEADER_SIZE..end.min(frame.len())];
    Ok((header, payload))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_header_serialization_roundtrip() {
        let header = ProtocolHeader {
            version: 1,
            msg_type: 0x0102,
            length: 100,
            flags: 0x01,
        };
        let buf = header.serialize();
        let parsed = ProtocolHeader::deserialize(&buf).unwrap();
        assert_eq!(header, parsed);
    }
}
