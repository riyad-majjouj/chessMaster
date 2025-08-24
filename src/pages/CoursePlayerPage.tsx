import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from "@/components/ui/container";
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// واجهات البيانات
interface Lesson {
  id: string;
  title: string;
  order: number;
  video_url: string;
  is_completed: boolean;
}

interface CourseForPlayer {
  id: string;
  title: string;
  lessons: Lesson[];
}

const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [course, setCourse] = useState<CourseForPlayer | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const response = await api.get<CourseForPlayer>(`/courses/${courseId}`);
      
      if (!response.data.isEnrolled || !response.data.lessons || response.data.lessons.length === 0) {
        toast({ title: "Access Denied", description: "You are not enrolled in this course or it has no lessons.", variant: "destructive" });
        navigate(`/courses/${courseId}`);
        return;
      }
      
      const sortedLessons = response.data.lessons.sort((a, b) => a.order - b.order);
      setCourse({ ...response.data, lessons: sortedLessons });
      setCurrentLesson(sortedLessons[0]);
    } catch (error) {
      toast({ title: "Error", description: "Could not load the course.", variant: "destructive" });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCourse();
  }, [isAuthLoading, isAuthenticated, navigate, fetchCourse]);

  const handleMarkAsComplete = async () => {
    if (!currentLesson || currentLesson.is_completed) return;
    
    try {
      // --- هنا يتم إرسال الطلب الحقيقي للباك اند ---
      await api.post(`/progress/lessons/${currentLesson.id}`, { 
        is_completed: true 
      });

      // تحديث الحالة محلياً لتعكس التغيير فوراً دون الحاجة لإعادة تحميل
      const updatedLessons = course!.lessons.map(lesson => 
        lesson.id === currentLesson.id ? { ...lesson, is_completed: true } : lesson
      );
      setCourse(prevCourse => prevCourse ? { ...prevCourse, lessons: updatedLessons } : null);
      setCurrentLesson(prevLesson => prevLesson ? { ...prevLesson, is_completed: true } : null);

      toast({ 
        title: "Progress Saved!", 
        description: `Lesson "${currentLesson.title}" marked as complete.` 
      });

    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Could not save your progress. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  if (isLoading || isAuthLoading) {
    return <div className="min-h-screen bg-chess-darker text-white flex items-center justify-center">Loading Course Player...</div>;
  }
  
  if (!course) return null;

  return (
    <div className="min-h-screen bg-chess-darker text-white">
      <div className="fixed top-0 left-0 right-0 z-20 bg-chess-darker/80 backdrop-blur-lg">
          <Container className="py-4">
              <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold">{course.title}</h1>
                  <button onClick={() => navigate(`/courses/${courseId}`)} className="text-white/70 hover:text-white">Back to Course Details</button>
              </div>
          </Container>
      </div>
      
      <div className="flex pt-20">
        <main className="flex-grow p-8">
          {currentLesson ? (
            <>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                <video key={currentLesson.id} width="100%" height="100%" controls autoPlay>
                  <source src={currentLesson.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">{currentLesson.title}</h2>
                  <button 
                    onClick={handleMarkAsComplete}
                    disabled={currentLesson.is_completed}
                    className="bg-gold disabled:bg-gold/50 text-chess-dark font-semibold px-6 py-2 rounded-lg hover:bg-gold/90 transition-colors"
                  >
                    {currentLesson.is_completed ? 'Completed' : 'Mark as Complete'}
                  </button>
              </div>
            </>
          ) : (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                Select a lesson to begin.
            </div>
          )}
        </main>
        
        <aside className="w-96 bg-chess-dark h-screen sticky top-0 pt-20 flex-shrink-0">
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 px-2">Course Content</h3>
            <ul className="space-y-2">
              {course.lessons.map(lesson => (
                <li key={lesson.id}>
                  <button 
                    onClick={() => setCurrentLesson(lesson)}
                    className={cn(
                        "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors",
                        currentLesson?.id === lesson.id ? "bg-gold/20 text-gold" : "hover:bg-white/5"
                    )}
                  >
                    {lesson.is_completed ? (
                       <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                       <PlayCircle className="w-5 h-5 text-white/50 flex-shrink-0" />
                    )}
                    <span className={cn("flex-grow", lesson.is_completed && "text-white/60")}>{lesson.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayerPage;