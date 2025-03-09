
import React, { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

// Lazy load components for better performance
const AboutSection = lazy(() => import("@/components/AboutSection"));
const CoursesSection = lazy(() => import("@/components/CoursesSection"));
const MastersSection = lazy(() => import("@/components/MastersSection"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading fallback for lazy-loaded components
const SectionLoader = () => (
  <div className="w-full h-[300px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
  </div>
);

const Index = () => {
  // Initialize reveal animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const revealsElements = document.querySelectorAll(".reveal");
      
      revealsElements.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on initial load
    setTimeout(() => {
      handleScroll();
    }, 100);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-chess-darker text-white overflow-x-hidden relative">
      {/* Blur background effects */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 filter blur-[100px] animate-float"></div>
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chess-blue/10 filter blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-gold/5 filter blur-[80px] animate-float" style={{ animationDelay: "2s" }}></div>
      </div>
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CoursesSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <MastersSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Index;
