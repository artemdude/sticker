using System;
using System.Collections.Generic;

namespace StickerProject.Models
{
    public class StickerMoq
    {
        public List<Sticker> Stickers()
        {
            var random = new Random();

            var stickers = new List<Sticker>();

            for (int i = 0; i < 5; i++)
            {
                string theme = "yellow";

                if (i == 3)
                {
                    theme = "blue";
                }

                if (i == 1)
                {
                    theme = "pink";
                }

                stickers.Add(new Sticker
                                 {
                                     id = i,
                                     Comment = "Comment" + i,
                                     Position = new Position{ Top =random.Next(0, 500), Left = random.Next(5, 390)},
                                     Size = new Size {Width = 250 + random.Next(0, 100), Height = 150 + random.Next(0, 100)},
                                     //Size = new Size(250 + random.Next(0, 100), 150 + random.Next(0, 100)),
                                     Theme = theme
                                 });
            }

            return stickers;
        }
    }
}