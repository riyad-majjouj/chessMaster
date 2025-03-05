
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import MastersSection from "@/components/MastersSection";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-chess-dark text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <MastersSection />
      <Footer />
    </div>
  );
};

export default Index;
