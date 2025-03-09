
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase, isUserAuthenticated } from "@/lib/supabase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isUserAuthenticated();
      setIsAuthenticated(authenticated);
    };
    
    checkAuth();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate("/");
  };

  const isHomePage = location.pathname === "/";

  // Helper function to create home route links
  const createHomeLink = (anchor: string, text: string) => {
    if (isHomePage) {
      return (
        <a
          href={`#${anchor}`}
          className="text-white/80 hover:text-gold transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {text}
        </a>
      );
    } else {
      return (
        <Link
          to={`/#${anchor}`}
          className="text-white/80 hover:text-gold transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {text}
        </Link>
      );
    }
  };

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
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              Chess<span className="text-gold">Masters</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {createHomeLink("about", "About")}
            <Link
              to="/courses"
              className="text-white/80 hover:text-gold transition-colors duration-200"
            >
              Courses
            </Link>
            {createHomeLink("masters", "Masters")}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-white/80 hover:text-gold transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="border-white/20 hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gold text-chess-dark hover:bg-gold/90">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
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
              {createHomeLink("about", "About")}
              <Link
                to="/courses"
                className="text-white/80 hover:text-gold transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              {createHomeLink("masters", "Masters")}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white/80 hover:text-gold transition-colors duration-200 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button 
                      variant="outline" 
                      className="border-white/20 hover:bg-white/10 w-full"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button 
                      className="bg-gold text-chess-dark hover:bg-gold/90 w-full"
                    >
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
