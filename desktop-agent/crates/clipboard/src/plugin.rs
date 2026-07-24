use std::any::Any;
use std::sync::atomic::{AtomicBool, Ordering};
use super::win_clipboard::WinClipboardManager;
use falcon_agent_core::plugin::{FalconPlugin, PluginError};

pub struct ClipboardSyncPlugin {
    _manager: WinClipboardManager,
    is_active: AtomicBool,
}

impl ClipboardSyncPlugin {
    pub fn new() -> Self {
        Self {
            _manager: WinClipboardManager::new(),
            is_active: AtomicBool::new(false),
        }
    }
}

impl FalconPlugin for ClipboardSyncPlugin {
    fn name(&self) -> &'static str {
        "ClipboardSyncPlugin"
    }

    fn version(&self) -> &'static str {
        "1.0.0"
    }

    fn init(&mut self) -> Result<(), PluginError> {
        Ok(())
    }

    fn start(&self) -> Result<(), PluginError> {
        self.is_active.store(true, Ordering::SeqCst);
        Ok(())
    }

    fn stop(&self) -> Result<(), PluginError> {
        self.is_active.store(false, Ordering::SeqCst);
        Ok(())
    }

    fn as_any(&self) -> &dyn Any {
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_clipboard_plugin_lifecycle() {
        let mut plugin = ClipboardSyncPlugin::new();
        assert_eq!(plugin.name(), "ClipboardSyncPlugin");

        plugin.init().unwrap();
        plugin.start().unwrap();
        assert!(plugin.is_active.load(Ordering::SeqCst));

        plugin.stop().unwrap();
        assert!(!plugin.is_active.load(Ordering::SeqCst));
    }
}
