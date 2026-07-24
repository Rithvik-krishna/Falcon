use thiserror::Error;

const MAX_CLIPBOARD_BYTES: usize = 10 * 1024 * 1024; // 10 MB limit

#[derive(Debug, Error)]
pub enum ClipboardError {
    #[error("Clipboard access failed: {0}")]
    AccessFailed(String),
    #[error("Payload exceeds 10MB limit")]
    PayloadTooLarge,
}

pub struct WinClipboardManager {
    last_synced_content: String,
    ignore_next_event: bool,
}

impl WinClipboardManager {
    pub fn new() -> Self {
        Self {
            last_synced_content: String::new(),
            ignore_next_event: false,
        }
    }

    pub fn set_remote_text(&mut self, text: &str) -> Result<(), ClipboardError> {
        if text.len() > MAX_CLIPBOARD_BYTES {
            return Err(ClipboardError::PayloadTooLarge);
        }

        // Set anti-infinite-loop flag so local copy event isn't re-broadcast back to remote
        self.ignore_next_event = true;
        self.last_synced_content = text.to_string();

        Ok(())
    }

    pub fn on_local_clipboard_changed(&mut self, new_text: &str) -> Option<String> {
        if self.ignore_next_event {
            self.ignore_next_event = false;
            return None;
        }

        if new_text.len() > MAX_CLIPBOARD_BYTES {
            return None;
        }

        if new_text != self.last_synced_content {
            self.last_synced_content = new_text.to_string();
            Some(new_text.to_string())
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_clipboard_anti_loopback() {
        let mut manager = WinClipboardManager::new();

        // Remote sets text -> sets ignore_next_event
        manager.set_remote_text("Pasted from Phone").unwrap();

        // Immediate local event should be ignored to prevent echo back loop
        let broadcast = manager.on_local_clipboard_changed("Pasted from Phone");
        assert!(broadcast.is_none());

        // Subsequent user copy should be broadcasted
        let broadcast_user = manager.on_local_clipboard_changed("User copied this text");
        assert_eq!(broadcast_user.unwrap(), "User copied this text");
    }

    #[test]
    fn test_clipboard_size_limit() {
        let mut manager = WinClipboardManager::new();
        let huge_text = "A".repeat(11 * 1024 * 1024); // 11 MB
        let res = manager.set_remote_text(&huge_text);
        assert!(res.is_err());
    }
}
