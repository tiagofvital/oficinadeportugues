namespace OficinaDePortugues.Web.Controllers
{
    using OficinaDePortugues.Repositories;
    using OficinaDePortugues.Web.Models;
    using System.Linq;
    using System.Web.Mvc;

    [RoutePrefix("online-application")]
    public class OnlineApplicationController : Controller
    {
        [Route("")]
        public ActionResult Index(OnlineApplicationModel model)
        {
            //var model = new OnlineApplicationModel();

            var coursesRepository = new InMemoryCoursesRepository();
            var permalink = this.Request.QueryString["permalink"];

            model.Courses = coursesRepository.GetCourses().Select(dto => new SelectListItem
            {
                Text = dto.Name,
                Value = dto.Id.ToString(),
                Selected = permalink != null ? dto.Permalink == permalink : false
            });

            this.ViewBag.Title = "Online Application";

            return View(model);
        }

        [HttpPost]
        public JsonResult Register(OnlineApplicationModel model)
        {
            if (!this.ModelState.IsValid)
            {
                //faz cenas
                return this.Json(new { status = OnlineApplicationResultStatus.ValidationFailed });
            }

            return this.Json(new { status = OnlineApplicationResultStatus.MailSent, message = "Your message was sent successfully. Thanks." });
        }
    }
}