use std::any::Any;
use std::sync::atomic::{AtomicBool, Ordering};
use falcon_agent_core::plugin::{FalconPlugin, PluginError};

pub struct WolPlugin {
    is_active: AtomicBool,
}

impl WolPlugin {
    pub fn new() -> Self {
        Self {
            is_active: AtomicBool::new(false),
        }
    }
}

impl FalconPlugin for WolPlugin {
    fn name(&self) -> &'static str {
        "WolPlugin"
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
    fn test_wol_plugin_lifecycle() {
        let mut plugin = WolPlugin::new();
        assert_eq!(plugin.name(), "WolPlugin");

        plugin.init().unwrap();
        plugin.start().unwrap();
        assert!(plugin.is_active.load(Ordering::SeqCst));

        plugin.stop().unwrap();
        assert!(!plugin.is_active.load(Ordering::SeqCst));
    }
}
