
import React, { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";

const masters = [
  {
    id: 1,
    name: "Alexandra Botez",
    title: "International Master",
    specialty: "Aggressive Openings",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Mikhail Petrov",
    title: "Grandmaster",
    specialty: "Positional Play",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Wei-Yi Chen",
    title: "Grandmaster",
    specialty: "Tactical Combinations",
    image: "https://images.unsplash.com/photo-1567515004624-219c11d31f2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Judit García",
    title: "FIDE Master",
    specialty: "Endgame Techniques",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
];

const MastersSection = () => {
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
    <section id="masters" className="py-24 bg-chess-charcoal relative" ref={revealRef}>
      {/* Background gradient effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-chess-blue/5 filter blur-[120px] opacity-30"></div>
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gold/5 filter blur-[120px] opacity-20"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Chess <span className="text-gradient">Masters</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Learn from champions who've mastered the game at the highest level and are passionate about sharing their knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {masters.map((master, index) => (
            <div 
              key={master.id} 
              className="master-card text-center reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold/30">
                <img 
                  src={master.image} 
                  alt={master.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{master.name}</h3>
              <div className="inline-block px-2 py-1 text-xs font-medium bg-gold/20 text-gold rounded-full mb-2">
                {master.title}
              </div>
              <p className="text-white/70 text-sm">{master.specialty}</p>
              
              <div className="flex justify-center mt-4 space-x-2">
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm0 2h-2v6h2v-6zm3 0h-2v6h2v-2.861c0-1.722 2.002-1.881 2.002 0v2.861h1.998v-3.359c0-3.284-3.128-3.164-4-1.548v-1.093z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card p-8 rounded-xl text-center reveal">
          <h3 className="text-2xl font-semibold mb-4">Ready to Learn From the Best?</h3>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Join our community of chess enthusiasts and transform your game with personalized guidance from our master instructors.
          </p>
          <div className="inline-block px-6 py-3 text-chess-dark font-medium bg-gold rounded-lg hover:bg-gold/90 transition-colors cursor-pointer hover-shine">
            Join Chess Masters Today
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MastersSection;
