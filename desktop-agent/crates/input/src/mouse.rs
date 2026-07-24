#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MouseButton {
    Left,
    Right,
    Middle,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum MouseAction {
    Move { x_normalized: f32, y_normalized: f32 },
    ButtonDown { button: MouseButton, x_normalized: f32, y_normalized: f32 },
    ButtonUp { button: MouseButton, x_normalized: f32, y_normalized: f32 },
    Scroll { delta_y: i32 },
}

pub fn normalize_to_win32_coords(x: f32, y: f32) -> (u32, u32) {
    let win32_x = (x.clamp(0.0, 1.0) * 65535.0) as u32;
    let win32_y = (y.clamp(0.0, 1.0) * 65535.0) as u32;
    (win32_x, win32_y)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_coordinate_normalization() {
        let (x, y) = normalize_to_win32_coords(0.5, 0.5);
        assert_eq!(x, 32767);
        assert_eq!(y, 32767);
    }
}
