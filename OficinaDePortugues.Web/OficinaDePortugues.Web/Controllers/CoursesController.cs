namespace OficinaDePortugues.Web.Controllers
{
    using OficinaDePortugues.Repositories;
    using OficinaDePortugues.Web.Models;
    using System.Linq;
    using System.Web.Mvc;

    [RoutePrefix("portuguese-courses")]
    public class CoursesController : Controller
    {
        // GET: Courses
        [Route("")]
        public ActionResult Index()
        {
            var model = new CoursesModel();

            var repository = new InMemoryCoursesRepository();

            model.Courses = repository.GetCourses().Select(CourseModel.From);

            this.ViewBag.Title = "Courses";

            return View(model);
        }

        public ActionResult Pricing()
        {
            ViewBag.Title = "Pricing";
            return this.View(new PricingModel());
        }

        public ActionResult Promotions()
        {
            ViewBag.Title = "Promotions";
            return this.View("Promotions");
        }
    }
}