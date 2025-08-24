import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/Navbar";
import Lottie from 'lottie-react';
import signAnimation from "../../public/signAnimation.json";

const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "https://chess-master-backend-one.vercel.app/api";

const Signup = () => {
  const [fullName, setFullName] = useState(""); // <-- تم التغيير إلى fullName
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const signupData = {
      full_name: fullName, // <-- إرسال full_name للباك اند
      email,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Account Created",
          description: responseData.message || "Please check your email to verify your account.",
        });
        navigate("/login"); // توجيه المستخدم لصفحة تسجيل الدخول
      } else {
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
                      <Label htmlFor="fullName">Full Name</Label> {/* <-- تم التغيير */}
                      <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Your full name" required /> {/* <-- تم التغيير */}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="••••••••" required minLength={6} />
                      <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                    </div>
                    <Button type="submit" className="w-full bg-gold text-chess-dark hover:bg-gold/90 hover-shine" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Sign Up"}
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-gold hover:underline">Sign in</Link></p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block h-[500px]">
                <Lottie animationData={signAnimation} loop={true} autoplay={true} style={{ width: 'auto', height: 'auto' , marginTop:100  , overflow:'hidden'}} />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Signup;