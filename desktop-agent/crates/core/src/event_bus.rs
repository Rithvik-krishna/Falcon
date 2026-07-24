use serde::{Deserialize, Serialize};
use tokio::sync::broadcast;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum AgentEvent {
    FrameCaptured { width: u32, height: u32, frame_index: u64 },
    BitrateAdjusted { new_bitrate_kbps: u32 },
    PeerConnected { peer_id: String },
    PeerDisconnected { peer_id: String },
    ClipboardSync { payload: Vec<u8> },
    FileTransferProgress { file_id: String, bytes_sent: u64, total_bytes: u64 },
}

pub struct InternalEventBus {
    sender: broadcast::Sender<AgentEvent>,
}

impl InternalEventBus {
    pub fn new(capacity: usize) -> Self {
        let (sender, _) = broadcast::channel(capacity);
        Self { sender }
    }

    pub fn publish(&self, event: AgentEvent) -> Result<usize, broadcast::error::SendError<AgentEvent>> {
        self.sender.send(event)
    }

    pub fn subscribe(&self) -> broadcast::Receiver<AgentEvent> {
        self.sender.subscribe()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_event_bus_broadcast() {
        let bus = InternalEventBus::new(10);
        let mut rx = bus.subscribe();

        let event = AgentEvent::PeerConnected {
            peer_id: "mobile-client-01".to_string(),
        };

        bus.publish(event.clone()).unwrap();
        let received = rx.recv().await.unwrap();
        assert_eq!(received, event);
    }
}
