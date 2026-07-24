use super::keyboard::KeyboardAction;
use super::mouse::{normalize_to_win32_coords, MouseAction};
use super::traits::{InputBackend, InputError};

pub struct Win32InputBackend;

impl Win32InputBackend {
    pub fn new() -> Self {
        Self
    }
}

impl InputBackend for Win32InputBackend {
    fn inject_mouse(&mut self, action: MouseAction) -> Result<(), InputError> {
        #[cfg(windows)]
        {
            use windows_sys::Win32::UI::Input::KeyboardAndMouse::{
                SendInput, INPUT, INPUT_MOUSE, MOUSEEVENTF_ABSOLUTE, MOUSEEVENTF_LEFTDOWN,
                MOUSEEVENTF_LEFTUP, MOUSEEVENTF_MOVE, MOUSEINPUT,
            };

            let (dw_flags, dx, dy) = match action {
                MouseAction::Move { x_normalized, y_normalized } => {
                    let (x, y) = normalize_to_win32_coords(x_normalized, y_normalized);
                    (MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE, x, y)
                }
                MouseAction::ButtonDown { x_normalized, y_normalized, .. } => {
                    let (x, y) = normalize_to_win32_coords(x_normalized, y_normalized);
                    (MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_ABSOLUTE, x, y)
                }
                MouseAction::ButtonUp { x_normalized, y_normalized, .. } => {
                    let (x, y) = normalize_to_win32_coords(x_normalized, y_normalized);
                    (MOUSEEVENTF_LEFTUP | MOUSEEVENTF_ABSOLUTE, x, y)
                }
                _ => (MOUSEEVENTF_MOVE, 0, 0),
            };

            let mut input = INPUT {
                r#type: INPUT_MOUSE,
                Anonymous: windows_sys::Win32::UI::Input::KeyboardAndMouse::INPUT_0 {
                    mi: MOUSEINPUT {
                        dx: dx as i32,
                        dy: dy as i32,
                        mouseData: 0,
                        dwFlags: dw_flags,
                        time: 0,
                        dwExtraInfo: 0,
                    },
                },
            };

            let sent = unsafe { SendInput(1, &mut input, std::mem::size_of::<INPUT>() as i32) };
            if sent == 0 {
                return Err(InputError::InjectionFailed("SendInput failed".to_string()));
            }
        }
        Ok(())
    }

    fn inject_keyboard(&mut self, action: KeyboardAction) -> Result<(), InputError> {
        #[cfg(windows)]
        {
            use windows_sys::Win32::UI::Input::KeyboardAndMouse::{
                SendInput, INPUT, INPUT_KEYBOARD, KEYEVENTF_KEYUP, KEYBDINPUT,
            };

            let dw_flags = match action.action_type {
                super::keyboard::KeyActionType::KeyDown => 0,
                super::keyboard::KeyActionType::KeyUp => KEYEVENTF_KEYUP,
            };

            let mut input = INPUT {
                r#type: INPUT_KEYBOARD,
                Anonymous: windows_sys::Win32::UI::Input::KeyboardAndMouse::INPUT_0 {
                    ki: KEYBDINPUT {
                        wVk: action.vk_code,
                        wScan: 0,
                        dwFlags: dw_flags,
                        time: 0,
                        dwExtraInfo: 0,
                    },
                },
            };

            let sent = unsafe { SendInput(1, &mut input, std::mem::size_of::<INPUT>() as i32) };
            if sent == 0 {
                return Err(InputError::InjectionFailed("SendInput failed".to_string()));
            }
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::mouse::MouseButton;

    #[test]
    fn test_win32_input_backend_creation() {
        let mut backend = Win32InputBackend::new();
        let action = MouseAction::Move { x_normalized: 0.5, y_normalized: 0.5 };
        // Test backend call executes without panic
        let _ = backend.inject_mouse(action);
    }
}
