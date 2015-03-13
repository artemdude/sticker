namespace StickerProject.Models
{
    public class Sticker
    {
        public int id { get; set; }
        public string Comment { get; set; }
        public Position Position { get; set; }
        public string Theme { get; set; }
        public Size Size { get; set; }
    }


    public class Size
    {
        public int Width { get; set; }
        public int Height { get; set; }
    }

    public class Position
    {
        public int Top;
        public int Left;
    }
}