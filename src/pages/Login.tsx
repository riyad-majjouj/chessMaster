import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Lottie from 'lottie-react';
import logAnimation from "../../public/logAnimation.json"; // تأكد من أن المسار صحيح
// import { supabase } from "@/lib/supabase"; // سنقوم بإزالة هذا
import { toast } from "@/hooks/use-toast"; // تأكد أن هذا المسار صحيح
import { Container } from "@/components/ui/container";
import Navbar from "@/components/Navbar";
import ChessScene from "@/components/ChessScene";

// تعريف عنوان URL للواجهة الخلفية - يفضل وضعه في ملف .env في مشروع حقيقي
const API_BASE_URL = "http://localhost:5000/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();

      if (response.ok) { // عادةً 200 OK للـ login
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
          description: responseData.message || "You have successfully logged in!",
        });
        // توجيه إلى الصفحة الرئيسية أو لوحة التحكم
        // إذا كنت تريد التوجيه إلى الصفحة الرئيسية:
        navigate("/");
        // إذا كنت تريد التوجيه إلى لوحة التحكم كما كان في الكود الأصلي:
        // navigate("/dashboard");
      } else {
        // خطأ من الواجهة الخلفية
        toast({
          title: "Error",
          description: responseData.message || "Login failed. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chess-blue/10 filter blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              <div className="flex justify-center">
                <div className="glass-card p-8 rounded-xl w-full max-w-md">
                  <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
                  <p className="text-muted-foreground mb-8 text-center">Sign in to your account to continue</p>

                  <form onSubmit={handleLogin} className="space-y-6">
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-gold hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="••••••••" // أضفت placeholder هنا
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gold text-chess-dark hover:bg-gold/90 hover-shine"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-gold hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block h-[500px]">
                <Lottie
                  animationData={logAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: 'auto', height: 'auto', overflow: 'hidden' }} // يمكنك تحديد الحجم هنا
                />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Login;