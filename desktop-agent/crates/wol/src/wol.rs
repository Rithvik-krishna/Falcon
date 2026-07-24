use std::net::UdpSocket;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum WolError {
    #[error("Invalid MAC address format: {0}")]
    InvalidMac(String),
    #[error("Socket send error: {0}")]
    SendFailed(String),
}

pub struct WolService;

impl WolService {
    pub fn build_magic_packet(mac_str: &str) -> Result<Vec<u8>, WolError> {
        let clean_mac = mac_str.replace([':', '-'], "");
        if clean_mac.len() != 12 {
            return Err(WolError::InvalidMac(mac_str.to_string()));
        }

        let mut mac_bytes = [0u8; 6];
        for i in 0..6 {
            mac_bytes[i] = u8::from_str_radix(&clean_mac[i * 2..i * 2 + 2], 16)
                .map_err(|_| WolError::InvalidMac(mac_str.to_string()))?;
        }

        // Magic Packet: 6 bytes of 0xFF followed by 16 repetitions of MAC address (102 bytes total)
        let mut packet = vec![0xFFu8; 6];
        for _ in 0..16 {
            packet.extend_from_slice(&mac_bytes);
        }

        Ok(packet)
    }

    pub fn send_magic_packet(mac_str: &str) -> Result<(), WolError> {
        let packet = Self::build_magic_packet(mac_str)?;
        let socket = UdpSocket::bind("0.0.0.0:0")
            .map_err(|e| WolError::SendFailed(e.to_string()))?;
        socket.set_broadcast(true)
            .map_err(|e| WolError::SendFailed(e.to_string()))?;

        socket.send_to(&packet, "255.255.255.255:9")
            .map_err(|e| WolError::SendFailed(e.to_string()))?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_magic_packet_construction() {
        let mac = "AA:BB:CC:DD:EE:FF";
        let packet = WolService::build_magic_packet(mac).unwrap();

        assert_eq!(packet.len(), 102); // 6 + (16 * 6)
        assert_eq!(&packet[0..6], &[0xFF; 6]);
        assert_eq!(&packet[6..12], &[0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    }
}
