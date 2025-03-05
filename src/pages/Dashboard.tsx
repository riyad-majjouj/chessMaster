import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface UserCourse {
  id: string;
  course_id: string;
  course: {
    title: string;
    description: string;
    level: string;
    thumbnail: string;
    author: string;
  };
  progress: number;
  last_accessed: string;
}

const Dashboard = () => {
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/login");
        return;
      }
      
      setUser(data.session.user);
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("user_courses")
          .select(`
            id,
            course_id,
            progress,
            last_accessed,
            course:courses (
              title,
              description,
              level,
              thumbnail,
              author
            )
          `)
          .eq("user_id", user.id);
        
        if (error) {
          throw error;
        }
        
        const formattedData = data?.map(item => ({
          ...item,
          course: item.course && Array.isArray(item.course) && item.course.length > 0 
            ? item.course[0] 
            : {
                title: "",
                description: "",
                level: "",
                thumbnail: "",
                author: ""
              }
        })) as UserCourse[];
        
        setUserCourses(formattedData || []);
      } catch (error) {
        console.error("Error fetching user courses:", error);
        toast({
          title: "Error",
          description: "Failed to load your courses. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCourses();
  }, [user]);

  const dummyUserCourses: UserCourse[] = [
    {
      id: "1",
      course_id: "1",
      course: {
        title: "Chess Fundamentals Masterclass",
        description: "Learn the essentials of chess with Grandmaster Alex Smith.",
        level: "beginner",
        thumbnail: "/assets/courses/fundamentals.jpg",
        author: "GM Alex Smith"
      },
      progress: 65,
      last_accessed: "2023-07-15T14:30:00Z"
    },
    {
      id: "2",
      course_id: "3",
      course: {
        title: "Tactical Patterns & Combinations",
        description: "Master the art of tactical play and learn to spot winning combinations.",
        level: "intermediate",
        thumbnail: "/assets/courses/tactics.jpg",
        author: "GM Mikhail Petrov"
      },
      progress: 30,
      last_accessed: "2023-07-10T09:15:00Z"
    },
    {
      id: "3",
      course_id: "6",
      course: {
        title: "Chess Psychology & Practical Play",
        description: "Learn how to handle pressure and make practical decisions.",
        level: "intermediate",
        thumbnail: "/assets/courses/psychology.jpg",
        author: "IM David Thompson"
      },
      progress: 10,
      last_accessed: "2023-07-05T16:45:00Z"
    }
  ];

  const displayUserCourses = userCourses.length > 0 ? userCourses : dummyUserCourses;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-chess-darker text-white relative">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 filter blur-[100px] animate-float"></div>
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chess-blue/10 filter blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="pt-32 pb-20">
          <Container>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  My Dashboard
                </h1>
                <p className="text-white/70">
                  Track your progress and continue your chess journey
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-4">
                <Button 
                  className="bg-gold text-chess-dark hover:bg-gold/90 hover-shine"
                  onClick={() => navigate("/courses")}
                >
                  Browse Courses
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/20 hover:bg-white/5"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <Card className="glass-card p-6 rounded-xl col-span-1">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <div className="flex flex-col space-y-4">
                  <div className="w-24 h-24 rounded-full bg-white/10 mx-auto flex items-center justify-center text-3xl font-bold text-gold mb-2">
                    {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : 'U'}
                  </div>
                  <h3 className="text-center text-lg font-semibold">
                    {user?.user_metadata?.full_name || 'Chess Enthusiast'}
                  </h3>
                  <p className="text-center text-white/70 text-sm">
                    {user?.email || 'user@example.com'}
                  </p>
                  <div className="flex justify-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 hover:bg-white/5"
                      onClick={() => navigate("/profile")}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-6 rounded-xl col-span-1 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gold mb-1">
                      {displayUserCourses.length}
                    </div>
                    <div className="text-sm text-white/70">
                      Enrolled Courses
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gold mb-1">
                      12
                    </div>
                    <div className="text-sm text-white/70">
                      Hours Learned
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gold mb-1">
                      8
                    </div>
                    <div className="text-sm text-white/70">
                      Certificates
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <h2 className="text-2xl font-semibold mb-6">My Courses</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card animate-pulse h-32 rounded-xl"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {displayUserCourses.map((userCourse) => (
                  <Card key={userCourse.id} className="glass-card rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 h-full">
                      <div className="md:col-span-1 h-40 md:h-full">
                        <div 
                          className="w-full h-full bg-chess-blue/20"
                          style={{
                            backgroundImage: userCourse.course.thumbnail ? `url(${userCourse.course.thumbnail})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        ></div>
                      </div>
                      <div className="p-6 md:col-span-3">
                        <div className="flex flex-col h-full">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              {userCourse.course.title}
                            </h3>
                            <p className="text-sm text-white/70 mb-4">
                              {userCourse.course.description}
                            </p>
                          </div>
                          
                          <div className="mt-auto">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-white/70">Progress: {userCourse.progress}%</span>
                              <span className="text-xs text-white/50">
                                Last accessed: {formatDate(userCourse.last_accessed)}
                              </span>
                            </div>
                            <Progress 
                              value={userCourse.progress} 
                              className="h-2 mb-4"
                              indicatorClassName="bg-gold"
                            />
                            <div className="flex justify-between">
                              <span className="text-sm text-white/70">
                                Instructor: {userCourse.course.author}
                              </span>
                              <Button
                                onClick={() => navigate(`/courses/${userCourse.course_id}`)}
                                className="bg-gold text-chess-dark hover:bg-gold/90 hover-shine"
                              >
                                Continue Learning
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {!isLoading && displayUserCourses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-4">You haven't enrolled in any courses yet</h3>
                <p className="text-white/70 mb-6">
                  Browse our catalog and find the perfect course to start your chess journey
                </p>
                <Button 
                  className="bg-gold text-chess-dark hover:bg-gold/90 hover-shine"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses
                </Button>
              </div>
            )}
          </Container>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
