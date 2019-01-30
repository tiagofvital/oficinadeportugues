namespace OficinaDePortugues.Web.Controllers
{
    using System.Web.Mvc;

    public class TestimonialsController : Controller
    {
        // GET: Testimonials
        public ActionResult Index()
        {
            ViewBag.Title = "Testimonials";
            return this.View("Index");
        }
    }
}