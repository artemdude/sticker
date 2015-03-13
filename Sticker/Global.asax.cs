using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace StickerProject
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "create",
                "api/stickers/create",
                new {controller = "Site", action = "CreateSticker"}
                );

            routes.MapRoute(
                "edit",
                "api/stickers/edit",
                new {controller = "Site", action = "EditSticker"}
                );

            routes.MapRoute(
                "delete",
                "api/stickers/delete/{id}",
                new {controller = "Site", action = "DeleteSticker", id = UrlParameter.Optional}
                );

            routes.MapRoute(
                "GetStikcers",
                "api/stickers/",
                new {controller = "Site", action = "GetStickers"}
                );

            routes.MapRoute(
                "GetStickerById",
                "api/stickers/get/{id}",
                new {controller = "Site", action = "GetStickerById", id = UrlParameter.Optional}
                );

            routes.MapRoute(
                "Default",
                "{controller}/{action}/{id}",
                new {controller = "Site", action = "Index", id = UrlParameter.Optional}
                );
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
        }
    }
}