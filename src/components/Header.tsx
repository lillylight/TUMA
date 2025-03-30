
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ConnectButton from "./ConnectButton";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/hooks/use-theme";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg rounded-xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-900/50">
        <div className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-doc-deep-blue to-blue-500 bg-clip-text text-transparent">
            TUMA
          </span>
        </div>

        {isMobile ? (
          <button 
            onClick={toggleMenu} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        ) : (
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              } 
              end
            >
              Send
            </NavLink>
            <NavLink 
              to="/documents" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Documents
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              }
            >
              About
            </NavLink>
            <div className="ml-6 z-50">
              <ConnectButton />
            </div>
            <Toggle 
              aria-label="Toggle dark mode"
              className="ml-2 p-2 rounded-full"
              pressed={theme === "dark"}
              onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Toggle>
          </nav>
        )}
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobile && isMenuOpen && (
        <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg md:hidden mt-2 py-4 px-2 rounded-xl animate-scale-in">
          <nav className="flex flex-col space-y-3">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              } 
              onClick={() => setIsMenuOpen(false)}
              end
            >
              Send
            </NavLink>
            <NavLink 
              to="/documents" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Documents
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <div className="pt-2 flex items-center justify-between">
              <ConnectButton />
              <Toggle 
                aria-label="Toggle dark mode"
                className="p-2 rounded-full"
                pressed={theme === "dark"}
                onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Toggle>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
