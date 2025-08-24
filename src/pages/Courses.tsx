import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api"; // استيراد عميل API

// واجهة متطابقة مع بيانات الباك اند
interface Course {
  id: string;
  title: string;
  description: string;
  level: string | null;
  price: number;
  duration: string | null;
  author: string | null;
  cover_image_url: string | null; // اسم الحقل في الباك اند
  // يمكن إضافة التقييم وعدد الطلاب لاحقاً بتطوير الباك اند
}

const Courses = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCourses = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Course[]>('/courses');
        setAllCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch all courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCourses();
  }, []);

  const filteredCourses = filter === "all" 
    ? allCourses 
    : allCourses.filter(course => course.level === filter);

  const getLevelColor = (level: string | null) => {
    switch(level) {
      case "beginner":
        return "bg-green-500/20 text-green-500";
      case "intermediate":
        return "bg-blue-500/20 text-blue-500";
      case "advanced":
        return "bg-purple-500/20 text-purple-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-chess-darker text-white relative">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 filter blur-[100px] animate-float"></div>
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chess-blue/10 filter blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-gold/5 filter blur-[80px] animate-float" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="pt-32 pb-20">
          <Container>
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Explore Our <span className="text-gradient">Chess Courses</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                From beginner fundamentals to advanced strategies, our comprehensive courses will help you master the game of chess.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                <Button
                  onClick={() => setFilter("all")}
                  variant={filter === "all" ? "default" : "outline"}
                  className={filter === "all" 
                    ? "bg-gold text-chess-dark hover:bg-gold/90" 
                    : "border-white/20 text-white hover:bg-white/10 hover:text-white"
                  }
                >
                  All Courses
                </Button>
                <Button
                  onClick={() => setFilter("beginner")}
                  variant={filter === "beginner" ? "default" : "outline"}
                  className={filter === "beginner" 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "border-white/20 text-white hover:bg-white/10 hover:text-white"
                  }
                >
                  Beginner
                </Button>
                {/* ... أزرار الفلترة الأخرى تبقى كما هي ... */}
              </div>
            </div>
            
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-white/5 rounded-xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                    <Card key={course.id} className="glass-card transition-all duration-300 hover:border-gold/30 hover:bg-white/10 overflow-hidden rounded-xl flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-chess-darker to-transparent z-10"></div>
                        <div 
                        className="w-full h-full bg-chess-blue/20 bg-cover bg-center"
                        style={{
                            backgroundImage: course.cover_image_url ? `url(${course.cover_image_url})` : `url('/assets/courses/placeholder.jpg')`,
                        }}
                        ></div>
                        <Badge className={`absolute top-4 right-4 z-20 ${getLevelColor(course.level)}`}>
                        {course.level ? (course.level.charAt(0).toUpperCase() + course.level.slice(1)) : 'General'}
                        </Badge>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold line-clamp-2 mb-2">{course.title}</h3>
                        <p className="text-sm text-white/70 mb-4 line-clamp-3">
                        {course.description}
                        </p>
                        
                        <div className="mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm text-white/70">
                            <span className="text-white/90 font-medium">{course.author || 'ChessMasters Team'}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-white/70 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {course.duration || 'Self-paced'}
                            </div>
                            <div className="text-xl font-bold text-gold">
                            ${course.price}
                            </div>
                        </div>
                        
                        <Button 
                            className="w-full mt-4 bg-gold text-chess-dark hover:bg-gold/90 hover-shine"
                            onClick={() => navigate(`/courses/${course.id}`)}
                        >
                            View Course
                        </Button>
                        </div>
                    </div>
                    </Card>
                ))}
                </div>
            )}
          </Container>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Courses;