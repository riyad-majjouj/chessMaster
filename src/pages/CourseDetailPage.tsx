import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Clock, BarChart2, PlayCircle, Lock, Star, Users, Award, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';

// واجهات البيانات
interface Lesson {
  id: string;
  title: string;
  order: number;
  is_completed: boolean;
}

// تعديل الواجهة لتوقع أن profiles قد تكون null
interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: { full_name: string } | null; // <-- هنا التعديل الرئيسي
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  author: string | null;
  level: string | null;
  duration: string | null;
  cover_image_url: string | null;
  isEnrolled: boolean;
  lessons?: Lesson[];
  reviews: Review[];
}

interface ReviewFormData {
    rating: number;
    comment: string;
}

const StarRating = ({ rating, setRating }: { rating: number; setRating?: (r: number) => void }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={setRating ? 24 : 18}
          className={cn( setRating ? "cursor-pointer" : "", "transition-colors", star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500" )}
          onClick={() => setRating?.(star)}
        />
      ))}
    </div>
  );
};

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<ReviewFormData>({
    defaultValues: { rating: 0, comment: '' }
  });
  const currentRating = watch("rating");

  const fetchCourseDetails = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const response = await api.get<CourseDetails>(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      toast({ title: "Error", description: "Course not found or an error occurred.", variant: "destructive" });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]); // إزالة navigate من التبعيات لتجنب إعادة الجلب غير الضرورية

  const onReviewSubmit = async (data: ReviewFormData) => {
    if (data.rating === 0) {
        toast({ title: "Error", description: "Please select a star rating.", variant: "destructive"});
        return;
    }
    try {
        await api.post(`/courses/${courseId}/reviews`, data);
        toast({ title: "Success!", description: "Your review has been submitted."});
        reset({ rating: 0, comment: '' });
        fetchCourseDetails();
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to submit review.";
        toast({ title: "Error", description: errorMessage, variant: "destructive"});
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast({ description: "Please log in to enroll in a course." });
      navigate('/login');
      return;
    }
    setIsProcessingPayment(true);
    try {
      const response = await api.post('/payments/create-checkout-session', { courseId });
      const { url: stripeCheckoutUrl } = response.data;
      if (!stripeCheckoutUrl) {
        throw new Error("Could not retrieve Stripe checkout URL.");
      }
      window.location.href = stripeCheckoutUrl;
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast({ title: "Payment Error", description: "Could not start the payment process.", variant: "destructive" });
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-chess-darker">
        <Navbar />
        <div className="w-full h-80 bg-white/5 animate-pulse"></div>
        <Container className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-48 relative z-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-12 bg-white/10 rounded w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-white/10 rounded w-1/2 animate-pulse"></div>
                    <div className="h-40 bg-white/10 rounded animate-pulse"></div>
                </div>
                <div className="lg:col-span-1">
                    <div className="h-96 bg-white/10 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </Container>
      </div>
    );
  }

  if (!course) {
    return (
        <div className="min-h-screen bg-chess-darker text-white flex items-center justify-center">
            <p>Course not found.</p>
        </div>
    );
  }

  const avgRating = course.reviews.length > 0 
    ? (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length)
    : 0;

  return (
    <div className="min-h-screen bg-chess-darker text-white">
      <Navbar />
      
      <section className="relative h-96 bg-chess-dark flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${course.cover_image_url || 'default_image_url.jpg'})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-chess-darker to-transparent"></div>
        <Container className="relative z-10 pt-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">{course.description}</p>
        </Container>
      </section>

      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-48 relative z-10">
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass-card p-6 rounded-xl">
                <h2 className="text-3xl font-bold mb-6">Course Curriculum</h2>
                <div className="space-y-3">
                  {course.isEnrolled && course.lessons && course.lessons.length > 0 ? (
                    course.lessons.sort((a, b) => a.order - b.order).map(lesson => (
                      <Link key={lesson.id} to={`/learn/${course.id}`} className="block">
                        <div className="glass-card-inner p-4 flex justify-between items-center hover:bg-gold/10 border-2 border-transparent hover:border-gold/20 rounded-lg transition-all duration-300 cursor-pointer">
                          <div className="flex items-center gap-4">
                            {lesson.is_completed ? <CheckCircle className="w-6 h-6 text-green-400" /> : <PlayCircle className="w-6 h-6 text-gold" />}
                            <span className={cn("font-medium", lesson.is_completed && "text-white/60 line-through")}>{lesson.title}</span>
                          </div>
                          <span className="text-white/50 text-sm">Watch Now</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="glass-card-inner p-8 text-center rounded-lg">
                       <Lock className="w-12 h-12 text-gold/50 mx-auto mb-4" />
                       <h3 className="text-xl font-semibold">Content Locked</h3>
                       <p className="text-white/70 mt-2">Enroll to get access to all lessons.</p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="glass-card p-6 rounded-xl">
                 <h2 className="text-3xl font-bold mb-6">About the Instructor</h2>
                 <div className="flex items-center gap-6">
                    <img src="https://via.placeholder.com/100" alt={course.author || ''} className="w-24 h-24 rounded-full border-2 border-gold/50" />
                    <div>
                        <h3 className="text-2xl font-semibold text-gold">{course.author || 'Anonymous Master'}</h3>
                        <p className="text-white/70 mt-2">Grandmaster with years of competitive experience and a passion for teaching.</p>
                    </div>
                 </div>
              </Card>

              <Card className="glass-card p-6 rounded-xl">
                    <h2 className="text-3xl font-bold mb-6">Student Reviews</h2>
                    {course.isEnrolled && (
                        <div className="glass-card-inner p-4 rounded-lg mb-8">
                            <h3 className="font-semibold mb-2">Leave a Review</h3>
                            <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-4">
                                <StarRating rating={currentRating} setRating={(r) => setValue("rating", r, { shouldValidate: true })} />
                                <Textarea {...register('comment', { required: "Comment cannot be empty."})} placeholder="Share your thoughts..." className="bg-white/5 border-white/20" />
                                <Button type="submit" disabled={isSubmitting} className="bg-gold text-chess-dark hover:bg-gold/90">{isSubmitting ? 'Submitting...' : 'Submit Review'}</Button>
                            </form>
                        </div>
                    )}
                    <div className="space-y-6">
                        {course.reviews.length > 0 ? course.reviews.map(review => {
                            // --- الجزء المعدل بالكامل ---
                            const reviewerName = review.profiles?.full_name || 'Anonymous User';
                            const reviewerInitial = reviewerName?.charAt(0).toUpperCase() || 'A';
                            
                            return (
                                <div key={review.id} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center font-bold text-gold">
                                        {reviewerInitial}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4 mb-1">
                                            <h4 className="font-semibold">{reviewerName}</h4>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className="text-white/80">{review.comment}</p>
                                    </div>
                                </div>
                            );
                            // --- نهاية الجزء المعدل ---
                        }) : (<p className="text-white/70">No reviews yet. Be the first to leave one!</p>)}
                    </div>
                </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="glass-card p-6 rounded-xl sticky top-28">
                <div className="text-4xl font-bold text-center mb-1">${course.price}</div>
                <div className='flex items-center justify-center gap-2 mb-6'>
                    <StarRating rating={Math.round(avgRating)} />
                    <span className='text-white/70 text-sm'>({course.reviews.length} reviews)</span>
                </div>
                {course.isEnrolled ? (
                   <Button size="lg" className="w-full bg-gold text-chess-dark hover:bg-gold/90 text-lg" onClick={() => navigate(`/learn/${course.id}`)}>Go to Course</Button>
                ) : (
                  <Button size="lg" className="w-full bg-gold text-chess-dark hover:bg-gold/90 text-lg disabled:opacity-70" onClick={handlePurchase} disabled={isProcessingPayment}>
                    {isProcessingPayment ? 'Processing...' : (isAuthenticated ? `Enroll Now` : 'Login to Enroll')}
                  </Button>
                )}
                <ul className="mt-6 space-y-4 text-white/80 text-sm">
                    <li className="flex items-center gap-3"><Users className="w-5 h-5 text-gold" /><span>For <b>{course.level || 'All'}</b> levels</span></li>
                    <li className="flex items-center gap-3"><Clock className="w-5 h-5 text-gold" /><span>Approx. <b>{course.duration || 'N/A'}</b> to complete</span></li>
                    <li className="flex items-center gap-3"><PlayCircle className="w-5 h-5 text-gold" /><span>Full lifetime access</span></li>
                    <li className="flex items-center gap-3"><Award className="w-5 h-5 text-gold" /><span>Certificate of completion</span></li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;