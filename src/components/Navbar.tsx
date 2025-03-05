
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled
          ? "bg-chess-darker/80 backdrop-blur-lg shadow-md py-3"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              Chess<span className="text-gold">Masters</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className="text-white/80 hover:text-gold transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#courses"
              className="text-white/80 hover:text-gold transition-colors duration-200"
            >
              Courses
            </a>
            <a
              href="#masters"
              className="text-white/80 hover:text-gold transition-colors duration-200"
            >
              Masters
            </a>
            <Button className="bg-gold text-chess-dark hover:bg-gold/90">
              Join Now
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 glass-card rounded-lg animate-fadeIn">
            <nav className="flex flex-col space-y-4 px-4">
              <a
                href="#about"
                className="text-white/80 hover:text-gold transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#courses"
                className="text-white/80 hover:text-gold transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </a>
              <a
                href="#masters"
                className="text-white/80 hover:text-gold transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Masters
              </a>
              <Button className="bg-gold text-chess-dark hover:bg-gold/90 w-full">
                Join Now
              </Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
