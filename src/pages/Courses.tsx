
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Course {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  thumbnail: string;
  author: string;
  rating: number;
  students_count: number;
}

const Courses = () => {
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();

  // Dummy data for courses
  const allCourses: Course[] = [
    {
      id: "1",
      title: "Chess Fundamentals Masterclass",
      description: "Learn the essentials of chess with Grandmaster Alex Smith. Perfect for beginners wanting to establish a solid foundation.",
      level: "beginner",
      price: 49.99,
      duration: "10 hours",
      thumbnail: "/assets/courses/fundamentals.jpg",
      author: "GM Alex Smith",
      rating: 4.8,
      students_count: 1243
    },
    {
      id: "2",
      title: "Advanced Opening Strategies",
      description: "Dive deep into opening theory and learn how to gain early advantages in your games.",
      level: "intermediate",
      price: 69.99,
      duration: "15 hours",
      thumbnail: "/assets/courses/openings.jpg",
      author: "IM Jessica Chen",
      rating: 4.9,
      students_count: 892
    },
    {
      id: "3",
      title: "Tactical Patterns & Combinations",
      description: "Master the art of tactical play and learn to spot winning combinations in any position.",
      level: "intermediate",
      price: 59.99,
      duration: "12 hours",
      thumbnail: "/assets/courses/tactics.jpg",
      author: "GM Mikhail Petrov",
      rating: 4.7,
      students_count: 1056
    },
    {
      id: "4",
      title: "Endgame Mastery",
      description: "Learn essential endgame techniques and principles to convert your advantages into wins.",
      level: "advanced",
      price: 79.99,
      duration: "18 hours",
      thumbnail: "/assets/courses/endgame.jpg",
      author: "GM Sarah Johnson",
      rating: 4.9,
      students_count: 765
    },
    {
      id: "5",
      title: "Strategic Middlegame Concepts",
      description: "Develop your positional understanding and improve your strategic decision-making.",
      level: "advanced",
      price: 74.99,
      duration: "16 hours",
      thumbnail: "/assets/courses/middlegame.jpg",
      author: "GM Robert Williams",
      rating: 4.8,
      students_count: 842
    },
    {
      id: "6",
      title: "Chess Psychology & Practical Play",
      description: "Learn how to handle pressure, manage your time, and make practical decisions in competitive games.",
      level: "intermediate",
      price: 64.99,
      duration: "14 hours",
      thumbnail: "/assets/courses/psychology.jpg",
      author: "IM David Thompson",
      rating: 4.6,
      students_count: 678
    }
  ];

  const filteredCourses = filter === "all" 
    ? allCourses 
    : allCourses.filter(course => course.level === filter);

  const getLevelColor = (level: string) => {
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
      {/* Blur background effects */}
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
                <Button
                  onClick={() => setFilter("intermediate")}
                  variant={filter === "intermediate" ? "default" : "outline"}
                  className={filter === "intermediate" 
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "border-white/20 text-white hover:bg-white/10 hover:text-white"
                  }
                >
                  Intermediate
                </Button>
                <Button
                  onClick={() => setFilter("advanced")}
                  variant={filter === "advanced" ? "default" : "outline"}
                  className={filter === "advanced" 
                    ? "bg-purple-500 text-white hover:bg-purple-600" 
                    : "border-white/20 text-white hover:bg-white/10 hover:text-white"
                  }
                >
                  Advanced
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="glass-card transition-all duration-300 hover:border-gold/30 hover:bg-white/10 overflow-hidden rounded-xl flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-chess-darker to-transparent z-10"
                    ></div>
                    <div 
                      className="w-full h-full bg-chess-blue/20"
                      style={{
                        backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></div>
                    <Badge className={`absolute top-4 right-4 z-20 ${getLevelColor(course.level)}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold line-clamp-2">{course.title}</h3>
                      <div className="flex items-center ml-2 whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium ml-1">{course.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/70 mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-white/70">
                          <span className="text-white/90 font-medium">{course.author}</span>
                        </div>
                        <div className="text-sm text-white/70 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          {course.students_count} students
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-white/70 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {course.duration}
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
          </Container>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Courses;
