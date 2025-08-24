import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

// واجهة لتعريف شكل بيانات الدورة القادمة من الباك اند
interface Course {
  id: string;
  title: string;
  price: number;
  enrollment_count: number;
}

// واجهة لتعريف شكل بيانات فورم إضافة دورة جديدة
interface NewCourseData {
  title: string;
  description: string;
  price: number;
  level: string;
  author: string;
  duration: string;
  coverImage: FileList; // حقل خاص بملف الصورة
}

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewCourseData>();

  // دالة لجلب قائمة الدورات من الباك اند
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Course[]>('/admin/courses-stats');
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast({ title: "Error", description: "Could not load course data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // جلب الدورات عند تحميل الصفحة لأول مرة
  useEffect(() => {
    fetchCourses();
  }, []);

  // دالة لمعالجة إرسال فورم إضافة دورة جديدة
  const onSubmit = async (data: NewCourseData) => {
    try {
      const courseDetails = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        level: data.level,
        author: data.author,
        duration: data.duration,
      };

      // الخطوة 1: إنشاء الدورة للحصول على ID خاص بها
      const response = await api.post('/courses', courseDetails);
      const newCourse = response.data;
      
      // الخطوة 2: التحقق مما إذا كان المستخدم قد اختار صورة، ثم رفعها
      if (data.coverImage && data.coverImage.length > 0) {
        const imageFile = data.coverImage[0];
        const formData = new FormData();
        formData.append('coverImage', imageFile);

        // استخدام نقطة النهاية الخاصة برفع الصور وربطها بالدورة الجديدة
        await api.post(`/courses/${newCourse.id}/upload-cover`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      toast({ title: "Success", description: "New course created successfully." });
      reset(); // إعادة تعيين حقول الفورم
      setIsDialogOpen(false); // إغلاق النافذة المنبثقة
      fetchCourses(); // إعادة جلب الدورات لتحديث القائمة في الجدول
    } catch (error) {
      console.error("Failed to create course:", error);
      toast({ title: "Error", description: "Failed to create the course.", variant: "destructive" });
    }
  };

  // دالة لحذف دورة معينة
  const handleDeleteCourse = async (courseId: string) => {
    try {
        await api.delete(`/courses/${courseId}`);
        toast({ title: "Success", description: "Course deleted successfully." });
        // تحديث حالة الدورات في الفرونت اند لإزالة الدورة المحذوفة فوراً
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    } catch (error) {
        console.error("Failed to delete course:", error);
        toast({ title: "Error", description: "Failed to delete the course.", variant: "destructive" });
    }
  };


  return (
    <div className="min-h-screen bg-chess-darker text-white">
      <Navbar />
      <div className="pt-32 pb-20">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Manage Courses</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gold text-chess-dark hover:bg-gold/90">Add New Course</Button>
              </DialogTrigger>
              <DialogContent className="glass-card text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-gold">Create a New Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="title">Title</label>
                    <Input id="title" {...register('title', { required: 'Title is required' })} className="bg-white/5 border-white/20" />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="description">Description</label>
                    <Textarea id="description" {...register('description', { required: 'Description is required' })} className="bg-white/5 border-white/20" />
                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="price">Price ($)</label>
                    <Input id="price" type="number" step="0.01" {...register('price', { required: 'Price is required', valueAsNumber: true, min: 0 })} className="bg-white/5 border-white/20" />
                    {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="level">Level (e.g., Beginner)</label>
                    <Input id="level" {...register('level')} className="bg-white/5 border-white/20" />
                  </div>
                  <div>
                    <label htmlFor="author">Author</label>
                    <Input id="author" {...register('author')} className="bg-white/5 border-white/20" />
                  </div>
                   <div>
                    <label htmlFor="duration">Duration (e.g., 6 weeks)</label>
                    <Input id="duration" {...register('duration')} className="bg-white/5 border-white/20" />
                  </div>
                  <div>
                    <label htmlFor="coverImage">Cover Image</label>
                    <Input 
                      id="coverImage"
                      type="file" 
                      accept="image/*"
                      {...register('coverImage')} 
                      className="bg-white/5 border-white/20 file:text-white" 
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gold text-chess-dark hover:bg-gold/90 mt-4">
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="glass-card p-4">
            {isLoading ? (
              <div className="text-center py-8">Loading courses...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-white/20 hover:bg-transparent">
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white">Price</TableHead>
                    <TableHead className="text-white">Enrollments</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} className="border-b-white/10 hover:bg-white/5">
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell>{course.enrollment_count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10" onClick={() => navigate(`/admin/courses/${course.id}/lessons`)}>
                               Manage Lessons
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="bg-red-800/80 hover:bg-red-800 h-9 w-9">
                                   <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="glass-card text-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-white/70">
                                    This action cannot be undone. This will permanently delete the course "{course.title}" and all of its associated lessons and enrollments.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-white/20 hover:bg-white/10">Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCourse(course.id)} className="bg-red-800 hover:bg-red-700">
                                    Yes, delete course
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default ManageCourses;