use super::keyboard::KeyboardAction;
use super::mouse::MouseAction;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum InputError {
    #[error("Input injection error: {0}")]
    InjectionFailed(String),
}

pub trait InputBackend: Send + Sync {
    fn inject_mouse(&mut self, action: MouseAction) -> Result<(), InputError>;
    fn inject_keyboard(&mut self, action: KeyboardAction) -> Result<(), InputError>;
}
