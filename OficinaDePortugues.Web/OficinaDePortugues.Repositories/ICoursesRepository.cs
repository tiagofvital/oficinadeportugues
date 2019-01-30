namespace OficinaDePortugues.Repositories
{
    using OficinaDePortugues.Web.DTOs;
    using System.Collections.Generic;

    public interface ICoursesRepository
    {
        IEnumerable<CourseDto> GetCourses();
    }
}