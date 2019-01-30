using System.Collections.Generic;

namespace OficinaDePortugues.Web.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<string> Categories { get; set; }

        public decimal Price { get; set; }

        public string Duration { get; set; }

        public decimal Rating { get; set; }

        public string ImageUrl { get; set; }

        public string Permalink { get; set; }
    }
}