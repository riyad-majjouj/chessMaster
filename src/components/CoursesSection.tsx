import React, { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import api from "@/lib/api"; // تأكد من أن هذا المسار صحيح لملف api.ts

// واجهة لتعريف شكل بيانات الدورة القادمة من الباك اند
interface Course {
  id: string;
  title: string;
  description: string;
  level: string | null;
  duration: string | null;
  author: string | null;
  cover_image_url: string | null;
}

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Course[]>('/courses');
        // عرض أول 3 دورات فقط في هذه الصفحة
        setCourses(response.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        // يمكنك هنا عرض رسالة خطأ للمستخدم
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []); // يعمل مرة واحدة عند تحميل المكون

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
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    // عرض حالة التحميل
    return (
        <section id="courses" className="py-24 bg-chess-dark">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Featured <span className="text-gradient">Courses</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 rounded-lg animate-pulse"></div>)}
                </div>
            </Container>
        </section>
    );
  }

  return (
    <section id="courses" className="py-24 bg-chess-dark relative" ref={revealRef}>
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
                  src={course.cover_image_url || 'https://images.unsplash.com/photo-1560174072-100b36b50e9a?auto=format&fit=crop&w=500'} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="flex gap-2 mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gold/20 text-gold rounded-full">
                  {course.level || 'All Levels'}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-white/70 mb-4">{course.description}</p>
              <div className="text-sm text-white/60 mb-4">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Duration: {course.duration || 'Self-paced'}
                </span>
              </div>
              <Link to={`/courses/${course.id}`}>
                <Button className="mt-auto w-full bg-gold text-chess-dark hover:bg-gold/90 hover-shine">
                  View Details
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