use serde::{Deserialize, Serialize};
use thiserror::Error;
use falcon_sdk::{wrap_frame, unwrap_frame};

#[derive(Debug, Error)]
pub enum WebRtcError {
    #[error("Signaling SDP error: {0}")]
    SdpFailed(String),
    #[error("DataChannel error: {0}")]
    DataChannelFailed(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SdpOffer {
    pub sdp_type: String,
    pub sdp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IceCandidate {
    pub candidate: String,
    pub sdp_mid: String,
    pub sdp_mline_index: u16,
}

pub struct AgentWebRtcPeer {
    peer_id: String,
    is_connected: bool,
}

impl AgentWebRtcPeer {
    pub fn new(peer_id: impl Into<String>) -> Self {
        Self {
            peer_id: peer_id.into(),
            is_connected: false,
        }
    }

    pub fn handle_remote_offer(&mut self, offer: &SdpOffer) -> Result<SdpOffer, WebRtcError> {
        if offer.sdp.is_empty() {
            return Err(WebRtcError::SdpFailed("Empty SDP offer".to_string()));
        }
        self.is_connected = true;

        Ok(SdpOffer {
            sdp_type: "answer".to_string(),
            sdp: format!("v=0\r\no=- 12345 2 IN IP4 127.0.0.1\r\ns=Falcon WebRTC\r\na=answer-to:{}", self.peer_id),
        })
    }

    pub fn send_control_message(&self, message_type: u16, payload: &[u8]) -> Vec<u8> {
        // Enforce 8-byte framing header over WebRTC DataChannel
        wrap_frame(message_type, payload, 0x00)
    }

    pub fn is_connected(&self) -> bool {
        self.is_connected
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_webrtc_sdp_handshake() {
        let mut peer = AgentWebRtcPeer::new("mobile-client-777");
        let offer = SdpOffer {
            sdp_type: "offer".to_string(),
            sdp: "v=0\r\no=- 999 2 IN IP4 127.0.0.1\r\ns=Falcon".to_string(),
        };

        let answer = peer.handle_remote_offer(&offer).unwrap();
        assert_eq!(answer.sdp_type, "answer");
        assert!(peer.is_connected());

        let frame = peer.send_control_message(0x0301, b"PING");
        let (header, p) = unwrap_frame(&frame).unwrap();
        assert_eq!(header.msg_type, 0x0301);
        assert_eq!(p, b"PING");
    }
}
