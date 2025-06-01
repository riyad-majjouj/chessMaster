
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import ChessScene from "@/components/ChessScene";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (revealRef.current) {
        const revealsElements = revealRef.current.querySelectorAll(".reveal");
        
        revealsElements.forEach((element) => {
          const windowHeight = window.innerHeight;
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementTop < windowHeight - elementVisible) {
            element.classList.add("active");
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger on initial load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex items-center py-20 relative overflow-hidden" ref={revealRef}>
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-chess-darker z-0">
        <div className="absolute top-[30%] left-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 filter blur-[120px] opacity-50"></div>
        <div className="absolute top-[10%] right-1/3 w-[300px] h-[300px] rounded-full bg-chess-blue/10 filter blur-[120px] opacity-30"></div>
      </div>

      <Container className="relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-4 reveal">
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider bg-gold/20 text-gold rounded-full mb-2">
                PREMIUM ONLINE CHESS COURSES
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 reveal">
              Master The Game of{" "}
              <span className="text-gradient">Chess</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 reveal">
              Learn from grandmasters and transform your strategic thinking with our premium online chess courses. Elevate your game to new heights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start reveal">
              <Link to="/signup">
                <Button className="bg-gold text-chess-dark hover:bg-gold/90 hover-shine">
                  Get Started
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" className="border-white/20 hover:bg-white/5">
                  Explore Courses
                </Button>
              </Link>
            </div>
            <div className="mt-8 text-white/60 text-sm flex items-center justify-center lg:justify-start gap-6 reveal">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>40+ Courses</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>12 Grandmasters</span>
              </div>
            </div>
          </div>
          <div className="h-[500px] w-full mx-auto reveal">
            <ChessScene />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
