namespace OficinaDePortugues.Web.Models
{
    using OficinaDePortugues.Web.DTOs;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class CourseModel
    {
        public CourseModel(string name)
        {
            this.Name = name;
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public MvcHtmlString Description { get; set; }

        public IEnumerable<string> Categories { get; set; }

        public string Price { get; set; }

        public string Duration { get; set; }

        public string RatingWidth { get; set; }

        public string ImageUrl { get; set; }

        public string Permalink { get; private set; }

        public static CourseModel From(CourseDto courseDto)
        {
            return new CourseModel(courseDto.Name)
            {
                Id = courseDto.Id,
                Description = new MvcHtmlString(courseDto.Description),
                Categories = courseDto.Categories,
                Permalink = courseDto.Permalink,
                Duration = courseDto.Duration,
                ImageUrl = courseDto.ImageUrl,
                Price = courseDto.Price.ToString("C"),
                RatingWidth = ((int)((courseDto.Rating * 100) / 5)).ToString()
            };
        }
    }
}