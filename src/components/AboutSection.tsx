
import React, { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";

const AboutSection = () => {
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
    <section id="about" className="py-24 bg-chess-charcoal relative" ref={revealRef}>
      {/* Background gradient effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-chess-blue/5 filter blur-[100px] opacity-40"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-gold/5 filter blur-[120px] opacity-30"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-gradient">Chess Masters</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We're dedicated to transforming passionate chess players into tactical geniuses through comprehensive online education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-8 rounded-xl reveal">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Comprehensive Curriculum</h3>
            <p className="text-white/70 text-center">
              Our structured learning paths guide you from basic moves to advanced tournament strategies, all at your own pace.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-8 rounded-xl reveal">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Grandmaster Instructors</h3>
            <p className="text-white/70 text-center">
              Learn directly from chess champions who share not just techniques, but the strategic mindset behind world-class play.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 rounded-xl reveal">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Interactive Learning</h3>
            <p className="text-white/70 text-center">
              Practice what you learn with our interactive board, AI opponents, and regular tournaments with fellow students.
            </p>
          </div>
        </div>

        <div className="mt-20 glass-card p-8 rounded-xl reveal">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <h4 className="text-4xl font-bold text-gold mb-2">12+</h4>
              <p className="text-white/70">Grandmasters</p>
            </div>
            <div className="p-4">
              <h4 className="text-4xl font-bold text-gold mb-2">40+</h4>
              <p className="text-white/70">Courses</p>
            </div>
            <div className="p-4">
              <h4 className="text-4xl font-bold text-gold mb-2">15K+</h4>
              <p className="text-white/70">Students</p>
            </div>
            <div className="p-4">
              <h4 className="text-4xl font-bold text-gold mb-2">98%</h4>
              <p className="text-white/70">Satisfaction</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
