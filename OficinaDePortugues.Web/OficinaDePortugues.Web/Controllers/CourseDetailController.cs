namespace OficinaDePortugues.Web.Controllers
{
    using OficinaDePortugues.Repositories;
    using OficinaDePortugues.Web.Models;
    using System.Linq;
    using System.Web.Mvc;

    [RoutePrefix("courses/portuguese-course")]
    public class CourseDetailController : Controller
    {
        [Route("")]
        public ActionResult Index(string permalink)
        {
            var repository = new InMemoryCoursesRepository();

            var course = repository.GetCourses().FirstOrDefault(c => c.Permalink == permalink);

            if (course != null)
            {
                ViewBag.Title = course.Name;
                return View("Course", CourseModel.From(course));
            }

            return this.RedirectToAction("Index", "Courses");
        }
    }
}