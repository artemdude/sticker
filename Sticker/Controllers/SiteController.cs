using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using StickerProject.Models;

namespace StickerProject.Controllers
{
    public class SiteController : Controller
    {
        public static List<Sticker> Stickers;

        public ActionResult Index()
        {
            Stickers = new StickerMoq().Stickers();

            return View();
        }

        [HttpPost]
        public JsonResult CreateSticker(Sticker sticker)
        {
                if (Stickers.Count != 0)
                {
                    sticker.id = Stickers.Last().id + 1;
                }
                else
                {
                    sticker.id = 0;
                }

                Stickers.Add(sticker);

                //need to test exception handling on client side
                //throw new Exception("Some exception has occurred during saving!");

                return Json(sticker);
        }

        [HttpPut]
        public void EditSticker(Sticker sticker)
        {
            Sticker editedSticker = Stickers.Where(s => s.id == sticker.id).FirstOrDefault();

            if (editedSticker != null)
            {
                editedSticker.Comment = sticker.Comment;
                editedSticker.Position = sticker.Position;
                editedSticker.Theme = sticker.Theme;
                editedSticker.Size = sticker.Size;
            }
        }

        [HttpDelete]
        public void DeleteSticker(int id)
        {
            Sticker deletedSticker = Stickers.First(s => s.id == id);

            if (deletedSticker != null)
            {
                Stickers.Remove(deletedSticker);
            }
        }

        [HttpGet]
        public JsonResult GetStickerById(int id)
        {
            return Json(Stickers.Where(s => s.id == id).SingleOrDefault(), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetStickers()
        {
            return Json(Stickers, JsonRequestBehavior.AllowGet);
        }
    }
}