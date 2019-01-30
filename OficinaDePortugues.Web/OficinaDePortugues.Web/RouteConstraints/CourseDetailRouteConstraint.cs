namespace OficinaDePortugues.Web.RouteConstraints
{
    using OficinaDePortugues.Repositories;
    using System.Linq;
    using System.Web;
    using System.Web.Routing;

    public class CourseDetailRouteConstraint : IRouteConstraint
    {
        public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
        {
            var repository = new InMemoryCoursesRepository();

            if (values[parameterName] != null)
            {
                var permalink = values[parameterName].ToString();
                return repository.GetCourses().Any(p => p.Permalink == permalink);
            }
            return false;
        }
    }
}