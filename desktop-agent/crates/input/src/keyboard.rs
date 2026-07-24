#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum KeyActionType {
    KeyDown,
    KeyUp,
}

#[derive(Debug, Clone)]
pub struct KeyboardAction {
    pub vk_code: u16,
    pub action_type: KeyActionType,
    pub ctrl_pressed: bool,
    pub alt_pressed: bool,
    pub shift_pressed: bool,
    pub win_pressed: bool,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keyboard_action_creation() {
        let action = KeyboardAction {
            vk_code: 0x41, // 'A'
            action_type: KeyActionType::KeyDown,
            ctrl_pressed: true,
            alt_pressed: false,
            shift_pressed: false,
            win_pressed: false,
        };
        assert_eq!(action.vk_code, 0x41);
        assert_eq!(action.ctrl_pressed, true);
    }
}
