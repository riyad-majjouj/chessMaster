import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth(); // جلب isAdmin
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  const createHomeLink = (anchor: string, text: string) => {
    const closeMenu = () => setIsMobileMenuOpen(false);
    if (isHomePage) {
      return <a href={`#${anchor}`} className="text-white/80 hover:text-gold transition-colors duration-200" onClick={closeMenu}>{text}</a>;
    }
    return <Link to={`/#${anchor}`} className="text-white/80 hover:text-gold transition-colors duration-200" onClick={closeMenu}>{text}</Link>;
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4", isScrolled ? "bg-chess-darker/80 backdrop-blur-lg shadow-md py-3" : "bg-transparent")}>
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">Chess<span className="text-gold">Masters</span></span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {createHomeLink("about", "About")}
            {createHomeLink("courses", "Courses")}
            {createHomeLink("masters", "Masters")}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="ghost" className="hover:bg-white/10 text-white">Dashboard</Button>
                </Link>
                
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="hover:bg-gold/10 text-gold">Admin Panel</Button>
                  </Link>
                )}
                
                <Button onClick={logout} variant="outline" className="border-white/20 hover:bg-white/10 text-white">Sign Out</Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login"><Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">Sign In</Button></Link>
                <Link to="/signup"><Button className="bg-gold text-chess-dark hover:bg-gold/90">Join Now</Button></Link>
              </div>
            )}
          </nav>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 glass-card rounded-lg animate-fadeIn">
            <nav className="flex flex-col space-y-4 px-4">
              {createHomeLink("about", "About")}
              <Link to="/courses" className="text-white/80 hover:text-gold transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
              {createHomeLink("masters", "Masters")}

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-white/80 hover:text-gold transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-gold hover:text-gold/80 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
                  )}
                  <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="outline" className="border-white/20 hover:bg-white/10 w-full text-white">Sign Out</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="border-white/20 hover:bg-white/10 w-full text-white">Sign In</Button></Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}><Button className="bg-gold text-chess-dark hover:bg-gold/90 w-full">Join Now</Button></Link>
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