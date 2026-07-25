param (
    [int]$x,
    [int]$y
)
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point($x, $y)

$signature = @'
[DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
public static extern void mouse_event(long dwFlags, long dx, long dy, long cButtons, long dwExtraInfo);
'@
$SendInput = Add-Type -memberDefinition $signature -name "Win32MouseEvent" -namespace Win32Functions -passThru

# Left click at current position
$SendInput::mouse_event(0x02, 0, 0, 0, 0)
$SendInput::mouse_event(0x04, 0, 0, 0, 0)
