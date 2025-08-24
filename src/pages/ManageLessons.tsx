import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Trash2, ArrowLeft } from 'lucide-react';

// واجهة لبيانات الدورة الكاملة
interface CourseDetails {
  title: string;
  lessons: Lesson[];
}

// واجهة لبيانات الدرس
interface Lesson {
  id: string;
  title: string;
  video_url: string;
  order: number;
}

// واجهة لبيانات الفورم الجديدة
interface NewLessonData {
  title: string;
  order: number;
  videoFile: FileList;
}

const ManageLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewLessonData>();

  // استخدام useCallback لتجنب إعادة إنشاء الدالة في كل مرة يتم فيها إعادة التصيير
  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) {
      navigate('/admin/courses'); // إذا لم يوجد معرف، عد إلى صفحة الدورات
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get<CourseDetails>(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      toast({ title: "Error", description: "Could not load course data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  // دالة إرسال الفورم
  const onSubmit = async (data: NewLessonData) => {
    if (!data.videoFile || data.videoFile.length === 0) {
      toast({ title: "Error", description: "Please select a video file to upload.", variant: "destructive" });
      return;
    }

    try {
      // الخطوة 1: رفع ملف الفيديو أولاً
      const videoFile = data.videoFile[0];
      const formData = new FormData();
      formData.append('videoFile', videoFile);

      // إظهار رسالة "جار الرفع..." للملفات الكبيرة
      const uploadToast = toast({ title: "Uploading...", description: "Please wait while the video is being uploaded." });

      const uploadResponse = await api.post('/uploads/lesson-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // إغلاق رسالة الرفع
      uploadToast.dismiss();

      const videoUrl = uploadResponse.data.videoUrl;

      // الخطوة 2: إنشاء الدرس في قاعدة البيانات
      const lessonData = {
        title: data.title,
        order: Number(data.order),
        video_url: videoUrl,
      };

      await api.post(`/courses/${courseId}/lessons`, lessonData);

      toast({ title: "Success", description: "New lesson added successfully." });
      reset(); // إعادة تعيين حقول الفورم
      setIsDialogOpen(false); // إغلاق النافذة
      fetchCourseDetails(); // تحديث قائمة الدروس

    } catch (error) {
      console.error("Failed to add lesson:", error);
      toast({ title: "Error", description: "An error occurred while adding the lesson.", variant: "destructive" });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      // عليك إنشاء نقطة النهاية هذه في الباك اند
      // await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
      toast({ title: "Success", description: "Lesson deleted successfully (simulation)." });
      // تحديث الواجهة لإزالة الدرس المحذوف
      setCourse(prev => prev ? { ...prev, lessons: prev.lessons.filter(l => l.id !== lessonId) } : null);
    } catch (error) {
       toast({ title: "Error", description: "Could not delete lesson (simulation).", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-chess-darker text-white flex items-center justify-center">Loading Course Lessons...</div>;
  }

  return (
    <div className="min-h-screen bg-chess-darker text-white">
      <Navbar />
      <div className="pt-32 pb-20">
        <Container>
          <Link to="/admin/courses" className="flex items-center gap-2 text-gold mb-4 hover:underline">
            <ArrowLeft size={20} />
            Back to Courses
          </Link>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Manage Lessons for "{course?.title}"</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold text-chess-dark hover:bg-gold/90">Add New Lesson</Button>
              </DialogTrigger>
              <DialogContent className="glass-card text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-gold">Add a New Lesson</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label>Lesson Title</label>
                    <Input {...register('title', { required: 'Title is required' })} className="bg-white/5 border-white/20" />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                  </div>
                   <div>
                    <label>Order</label>
                    <Input type="number" {...register('order', { required: 'Order is required', valueAsNumber: true })} className="bg-white/5 border-white/20" />
                    {errors.order && <p className="text-red-400 text-sm mt-1">{errors.order.message}</p>}
                  </div>
                  <div>
                    <label>Video File</label>
                    <Input 
                        type="file" 
                        accept="video/mp4,video/webm"
                        {...register('videoFile', { required: 'A video file is required' })} 
                        className="bg-white/5 border-white/20 file:text-white"
                    />
                    {errors.videoFile && <p className="text-red-400 text-sm mt-1">{errors.videoFile.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gold text-chess-dark hover:bg-gold/90">
                    {isSubmitting ? 'Uploading & Adding...' : 'Add Lesson'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="glass-card p-4">
            <Table>
              <TableHeader>
                <TableRow className="border-b-white/20 hover:bg-transparent">
                  <TableHead className="text-white w-[100px]">Order</TableHead>
                  <TableHead className="text-white">Title</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course?.lessons && course.lessons.length > 0 ? (
                  course.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                    <TableRow key={lesson.id} className="border-b-white/10 hover:bg-white/5">
                      <TableCell>{lesson.order}</TableCell>
                      <TableCell className="font-medium">{lesson.title}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="bg-red-800/80 hover:bg-red-800">
                               <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-card text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/70">
                                This will permanently delete the lesson. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/20">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteLesson(lesson.id)} className="bg-red-800 hover:bg-red-700">
                                Delete Lesson
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-white/70 py-8">
                      No lessons found for this course yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default ManageLessons;