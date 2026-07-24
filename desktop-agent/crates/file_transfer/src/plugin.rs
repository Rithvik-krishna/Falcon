use std::any::Any;
use std::sync::atomic::{AtomicBool, Ordering};
use falcon_agent_core::plugin::{FalconPlugin, PluginError};

pub struct FileTransferPlugin {
    is_active: AtomicBool,
}

impl FileTransferPlugin {
    pub fn new() -> Self {
        Self {
            is_active: AtomicBool::new(false),
        }
    }
}

impl FalconPlugin for FileTransferPlugin {
    fn name(&self) -> &'static str {
        "FileTransferPlugin"
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
    fn test_file_transfer_plugin_lifecycle() {
        let mut plugin = FileTransferPlugin::new();
        assert_eq!(plugin.name(), "FileTransferPlugin");

        plugin.init().unwrap();
        plugin.start().unwrap();
        assert!(plugin.is_active.load(Ordering::SeqCst));

        plugin.stop().unwrap();
        assert!(!plugin.is_active.load(Ordering::SeqCst));
    }
}
