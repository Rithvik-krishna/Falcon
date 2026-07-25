using System;
using System.Drawing;
using System.Windows.Forms;
using System.Runtime.InteropServices;

class Program {
    [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
    public static extern void mouse_event(long dwFlags, long dx, long dy, long cButtons, long dwExtraInfo);

    static void Main(string[] args) {
        try {
            if (args.Length >= 2) {
                int x = int.Parse(args[0]);
                int y = int.Parse(args[1]);
                Cursor.Position = new Point(x, y);
                mouse_event(0x02, 0, 0, 0, 0);
                mouse_event(0x04, 0, 0, 0, 0);
            }
        } catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
