
import React, { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Fundamentals of Chess",
    description: "Master the basic principles and essential strategies that form the foundation of strong chess play.",
    level: "Beginner",
    lessons: 24,
    duration: "6 weeks",
    image: "https://images.unsplash.com/photo-1560174072-100b36b50e9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Advanced Openings",
    description: "Dive deep into opening theory and build a repertoire that gives you an edge from the very first moves.",
    level: "Intermediate",
    lessons: 32,
    duration: "8 weeks",
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Mastering the Endgame",
    description: "Learn the principles and techniques that will help you convert advantages and save difficult positions.",
    level: "Advanced",
    lessons: 28,
    duration: "7 weeks",
    image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
];

const CoursesSection = () => {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (revealRef.current) {
        const revealsElements = revealRef.current.querySelectorAll(".reveal");
        
        revealsElements.forEach((element) => {
          const windowHeight = window.innerHeight;
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementTop < windowHeight - elementVisible) {
            element.classList.add("active");
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on initial load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="courses" className="py-24 bg-chess-dark relative" ref={revealRef}>
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/5 filter blur-[120px] opacity-30"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-gradient">Courses</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            From beginners to advanced players, our curriculum covers every aspect of chess mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              className="course-card reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="flex gap-2 mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gold/20 text-gold rounded-full">
                  {course.level}
                </span>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-white/10 text-white/70 rounded-full">
                  {course.lessons} Lessons
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-white/70 mb-4">{course.description}</p>
              <div className="text-sm text-white/60 mb-4">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Duration: {course.duration}
                </span>
              </div>
              <Link to={`/courses#course-${course.id}`}>
                <Button className="mt-auto w-full bg-gold text-chess-dark hover:bg-gold/90 hover-shine">
                  Enroll Now
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 reveal">
          <Link to="/courses">
            <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
              View All Courses
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default CoursesSection;
