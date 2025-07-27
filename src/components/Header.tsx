import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleNavigation = (section: string) => {
    if (location.pathname !== "/") {
      // If not on home page, navigate to home first, then scroll to section
      navigate("/", { state: { scrollTo: section } });
    } else {
      // If on home page, just scroll to section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full bg-black backdrop-blur-lg fixed top-0 z-50  shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-blue-400/20 rounded-xl backdrop-blur-sm">
              <Car className="h-7 w-7 text-blue-300" />
            </div>
            <span className="text-2xl font-bold text-blue-100 font-space tracking-tight drop-shadow">Apex Auto Mods</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => handleNavigation("home")} 
            className="text-blue-100/90 hover:text-blue-300 transition-all duration-300 font-medium relative group px-2 py-1"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </button>
          <button 
            onClick={() => handleNavigation("services")} 
            className="text-blue-100/90 hover:text-blue-300 transition-all duration-300 font-medium relative group px-2 py-1"
          >
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </button>
          <button 
            onClick={() => handleNavigation("customize")} 
            className="text-blue-100/90 hover:text-blue-300 transition-all duration-300 font-medium relative group px-2 py-1"
          >
            Customize
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </button>
          <button 
            onClick={() => handleNavigation("gallery")} 
            className="text-blue-100/90 hover:text-blue-300 transition-all duration-300 font-medium relative group px-2 py-1"
          >
            Gallery
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </button>
          <button 
            onClick={() => handleNavigation("contact")} 
            className="text-blue-100/90 hover:text-blue-300 transition-all duration-300 font-medium relative group px-2 py-1"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </button>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-blue-100/90 hover:text-blue-300 transition-all duration-300 font-medium relative group px-2 py-1">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-blue-100 text-sm">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <Button 
                variant="ghost" 
                className="text-blue-100 hover:text-blue-300 hover:bg-blue-400/10 transition-all duration-300"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-blue-100 hover:text-blue-300 hover:bg-blue-400/10 transition-all duration-300">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-blue-400/25 transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;