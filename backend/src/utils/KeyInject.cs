using System;
using System.Windows.Forms;

class Program {
    static void Main(string[] args) {
        try {
            if (args.Length > 0) {
                string key = args[0];
                if (key == "{ENTER}") SendKeys.SendWait("~");
                else if (key == "{BACKSPACE}") SendKeys.SendWait("{BACKSPACE}");
                else if (key == "{TAB}") SendKeys.SendWait("{TAB}");
                else if (key == "{ESC}") SendKeys.SendWait("{ESC}");
                else SendKeys.SendWait(key);
            }
        } catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
