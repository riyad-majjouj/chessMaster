import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // <-- استيراد الهوك الجديد

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCourses from "./pages/ManageCourses";
import ManageUsers from "./pages/ManageUsers";
import ManageLessons from "./pages/ManageLessons";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursePlayerPage from "./pages/CoursePlayerPage";
// Protected route component (النسخة الجديدة والمحسنة)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // عرض شاشة تحميل بينما يتحقق السياق من حالة المصادقة
    return (
      <div className="min-h-screen bg-chess-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  // إذا انتهى التحميل والمستخدم غير مسجل، قم بتوجيهه لصفحة الدخول
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* لا يوجد BrowserRouter هنا! */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
         
        } />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
         <Route path="/learn/:courseId" element={<CoursePlayerPage />} /> 
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
           
            <Route path="/admin/courses" element={
              <ProtectedRoute>
                <ManageCourses />
              </ProtectedRoute>
          } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
          } />
           <Route path="/admin/courses/:courseId/lessons" element={<ManageLessons />} />
          </Route>
          {/* يمكن إضافة المزيد من المسارات الفرعية للإدارة هنا */}
      </Routes>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;