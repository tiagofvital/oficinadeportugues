namespace OficinaDePortugues.Web.Controllers
{
    using OficinaDePortugues.Web.Models;
    using System.Web.Mvc;

    public class ContactsController : Controller
    {
        public ActionResult Index()
        {
            var model = new ContactsModel();
            this.ViewBag.Title = "Contacts";

            return View(model);
        }
    }
}