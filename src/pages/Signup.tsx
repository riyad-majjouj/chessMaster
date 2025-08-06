import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { supabase } from "@/lib/supabase"; // سنقوم بإزالة هذا
import { toast } from "@/hooks/use-toast"; // تأكد أن هذا المسار صحيح
import { Container } from "@/components/ui/container";
import Navbar from "@/components/Navbar";
import ChessScene from "@/components/ChessScene";
import Lottie from 'lottie-react';
import signAnimation from "../../public/signAnimation.json"; // تأكد من أن المسار صحيح
// تعريف عنوان URL للواجهة الخلفية - يفضل وضعه في ملف .env في مشروع حقيقي
const API_BASE_URL = "https://chess-master-backend-one.vercel.app/api";

const Signup = () => {
  // تم تغيير fullName إلى username لمطابقة الواجهة الخلفية
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // يمكنك إضافة حالة isSubscribed إذا كنت تريد التحكم بها من الواجهة الأمامية
  // const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // البيانات التي سترسل إلى الواجهة الخلفية
    const signupData = {
      username,
      email,
      password,
      // isSubscribed, // أضف هذا إذا كنت تريد التحكم به
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const responseData = await response.json();

      if (response.ok) { // عادةً 201 Created للـ register
        // تخزين التوكن في localStorage
        if (responseData.token) {
          localStorage.setItem("authToken", responseData.token);
        }
        // يمكنك أيضًا تخزين معلومات المستخدم إذا أردت
        // localStorage.setItem("userInfo", JSON.stringify({
        //   _id: responseData._id,
        //   username: responseData.username,
        //   email: responseData.email,
        //   isSubscribed: responseData.isSubscribed,
        // }));

        toast({
          title: "Success",
          description: responseData.message || "Account created successfully! Redirecting...",
        });
        navigate("/"); // أو إلى الصفحة التي تريدها بعد التسجيل، مثلاً /dashboard
      } else {
        // خطأ من الواجهة الخلفية
        toast({
          title: "Error",
          description: responseData.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Network Error",
        description: "An unexpected error occurred. Please check your connection or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chess-darker text-white relative">
      {/* Blur background effects */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 filter blur-[100px] animate-float"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chess-blue/10 filter blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              <div className="flex justify-center">
                <div className="glass-card p-8 rounded-xl w-full max-w-md">
                  <h1 className="text-3xl font-bold mb-2 text-center">Create an Account</h1>
                  <p className="text-muted-foreground mb-8 text-center">Join our chess community and start learning today</p>

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      {/* تم التعديل من fullName إلى username */}
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Choose a username"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="••••••••"
                        required
                        minLength={6} // يتطابق مع التحقق في الواجهة الخلفية
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    {/* يمكنك إضافة حقل isSubscribed هنا إذا أردت */}
                    {/* 
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="isSubscribed" 
                        checked={isSubscribed}
                        onChange={(e) => setIsSubscribed(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-gold bg-white/10 border-white/20 rounded focus:ring-gold"
                      />
                      <Label htmlFor="isSubscribed" className="text-sm">
                        Subscribe to our newsletter?
                      </Label>
                    </div>
                    */}

                    <Button
                      type="submit"
                      className="w-full bg-gold text-chess-dark hover:bg-gold/90 hover-shine"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Sign Up"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="text-gold hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block h-[500px]">
                <div>
                  <Lottie
                    animationData={signAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: 'auto', height: 'auto' , marginTop:100  , overflow:'hidden'}} // يمكنك تحديد الحجم هنا
                  />
                  {/* أو باستخدام options prop لمزيد من التحكم */}
                  {/* <Lottie options={defaultOptions} height={400} width={400} /> */}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Signup;