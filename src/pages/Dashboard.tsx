import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

interface MyCourse {
  id: string;
  title: string;
  description: string;
  author: string | null;
  cover_image_url: string | null;
}

const Dashboard = () => {
  const [myCourses, setMyCourses] = useState<MyCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: isAuthLoading, logout } = useAuth();

  // التأثير الأول: مسؤول فقط عن التحقق من المصادقة وإعادة التوجيه
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // التأثير الثاني: مسؤول فقط عن جلب البيانات
  // سيتم تشغيله فقط عندما يتغير كائن "user" من null إلى كائن فعلي
  useEffect(() => {
    // تحقق من وجود كائن المستخدم قبل محاولة جلب البيانات
    if (user) {
      const fetchMyCourses = async () => {
        setIsLoadingCourses(true);
        try {
          const response = await api.get<MyCourse[]>('/enroll/my-courses');
          setMyCourses(response.data);
        } catch (error) {
          console.error("Dashboard: Error fetching my courses:", error);
          toast({
            title: "Error",
            description: "Failed to load your enrolled courses. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingCourses(false);
        }
      };

      fetchMyCourses();
    }
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // هذا هو التغيير الحاسم. نعتمد على استقرار كائن المستخدم نفسه.
  }, [user]); 
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  const handleSignOut = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-chess-darker flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Authenticating...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chess-darker text-white relative">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 filter blur-[100px] animate-float"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chess-blue/10 filter blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="pt-32 pb-20">
          <Container>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">My Dashboard</h1>
                <p className="text-white/70">Track your progress and continue your chess journey</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-4">
                <Button className="bg-gold text-chess-dark hover:bg-gold/90 hover-shine" onClick={() => navigate("/courses")}>Browse Courses</Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/5" onClick={handleSignOut}>Sign Out</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <Card className="glass-card p-6 rounded-xl col-span-1">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <div className="flex flex-col space-y-4">
                  <div className="w-24 h-24 rounded-full bg-white/10 mx-auto flex items-center justify-center text-3xl font-bold text-gold mb-2">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <h3 className="text-center text-lg font-semibold">{user?.full_name || 'Chess Enthusiast'}</h3>
                  <p className="text-center text-white/70 text-sm">{user?.email || 'user@example.com'}</p>
                  <div className="flex justify-center pt-2">
                    <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/5" onClick={() => navigate("/profile")}>Edit Profile</Button>
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-6 rounded-xl col-span-1 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gold mb-1">{isLoadingCourses ? '...' : myCourses.length}</div>
                    <div className="text-sm text-white/70">Enrolled Courses</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gold mb-1">12</div>
                    <div className="text-sm text-white/70">Hours Learned</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gold mb-1">8</div>
                    <div className="text-sm text-white/70">Certificates</div>
                  </div>
                </div>
              </Card>
            </div>
            
            <h2 className="text-2xl font-semibold mb-6">My Courses</h2>
            
            {isLoadingCourses ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((i) => (<div key={i} className="glass-card animate-pulse h-48 rounded-xl"></div>))}
              </div>
            ) : myCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {myCourses.map((course) => (
                  <Card key={course.id} className="glass-card rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 h-full">
                      <div className="md:col-span-1 h-40 md:h-full">
                        <div className="w-full h-full bg-chess-blue/20 bg-cover bg-center" style={{ backgroundImage: course.cover_image_url ? `url(${course.cover_image_url})` : 'none' }}></div>
                      </div>
                      <div className="p-6 md:col-span-3">
                        <div className="flex flex-col h-full">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                            <p className="text-sm text-white/70 mb-4">{course.description}</p>
                          </div>
                          <div className="mt-auto">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white/70">Instructor: {course.author || 'N/A'}</span>
                              <Button onClick={() => navigate(`/courses/${course.id}`)} className="bg-gold text-chess-dark hover:bg-gold/90 hover-shine">Continue Learning</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-4">You haven't enrolled in any courses yet</h3>
                <p className="text-white/70 mb-6">Browse our catalog and find the perfect course to start your chess journey</p>
                <Button className="bg-gold text-chess-dark hover:bg-gold/90 hover-shine" onClick={() => navigate("/courses")}>Explore Courses</Button>
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