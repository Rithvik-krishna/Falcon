use std::any::Any;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum PluginError {
    #[error("Plugin initialization failed: {0}")]
    InitFailed(String),
    #[error("Plugin execution error: {0}")]
    ExecutionFailed(String),
}

pub trait FalconPlugin: Send + Sync {
    fn name(&self) -> &'static str;
    fn version(&self) -> &'static str;
    fn init(&mut self) -> Result<(), PluginError>;
    fn start(&self) -> Result<(), PluginError>;
    fn stop(&self) -> Result<(), PluginError>;
    fn as_any(&self) -> &dyn Any;
}

pub struct PluginManager {
    plugins: Vec<Box<dyn FalconPlugin>>,
}

impl PluginManager {
    pub fn new() -> Self {
        Self { plugins: Vec::new() }
    }

    pub fn register<P: FalconPlugin + 'static>(&mut self, mut plugin: P) -> Result<(), PluginError> {
        plugin.init()?;
        self.plugins.push(Box::new(plugin));
        Ok(())
    }

    pub fn start_all(&self) -> Result<(), PluginError> {
        for plugin in &self.plugins {
            plugin.start()?;
        }
        Ok(())
    }

    pub fn stop_all(&self) -> Result<(), PluginError> {
        for plugin in &self.plugins {
            plugin.stop()?;
        }
        Ok(())
    }

    pub fn count(&self) -> usize {
        self.plugins.len()
    }
}
