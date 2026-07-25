using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Windows.Forms;
using System.IO;

class Program {
    static void Main(string[] args) {
        try {
            Rectangle bounds = Screen.PrimaryScreen.Bounds;
            // Downscale to 1280x720 for ultra-fast, zero-lag streaming
            int targetWidth = 1280;
            int targetHeight = 720;

            using (Bitmap bitmap = new Bitmap(targetWidth, targetHeight)) {
                using (Graphics g = Graphics.FromImage(bitmap)) {
                    g.InterpolationMode = InterpolationMode.Low;
                    g.CompositingQuality = CompositingQuality.HighSpeed;
                    g.SmoothingMode = SmoothingMode.HighSpeed;
                    g.DrawImage(CaptureScreen(bounds), new Rectangle(0, 0, targetWidth, targetHeight));
                }
                string outPath = args.Length > 0 ? args[0] : "screen.jpg";

                ImageCodecInfo jpgEncoder = GetEncoder(ImageFormat.Jpeg);
                EncoderParameters myEncoderParameters = new EncoderParameters(1);
                myEncoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, 55L); // 35KB compressed frame

                bitmap.Save(outPath, jpgEncoder, myEncoderParameters);
            }
        } catch (Exception ex) {
            Console.WriteLine("Error: " + ex.Message);
        }
    }

    private static Bitmap CaptureScreen(Rectangle bounds) {
        Bitmap screenBmp = new Bitmap(bounds.Width, bounds.Height);
        using (Graphics g = Graphics.FromImage(screenBmp)) {
            g.CopyFromScreen(Point.Empty, Point.Empty, bounds.Size);
        }
        return screenBmp;
    }

    private static ImageCodecInfo GetEncoder(ImageFormat format) {
        ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
        foreach (ImageCodecInfo codec in codecs) {
            if (codec.FormatID == format.Guid) {
                return codec;
            }
        }
        return null;
    }
}
