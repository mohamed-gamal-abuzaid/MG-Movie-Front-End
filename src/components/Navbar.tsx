import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, Search, Film, LogOut, User } from "lucide-react";

interface NavbarProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onSearch }) => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  return (
    
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900 transition-colors duration-300 py-2 sm:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline flex-shrink-0">
            <Film className="w-7 h-7 text-indigo-500" />
            <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
              MG MOVIE
            </span>
          </Link>

          <div className="relative w-full max-w-md mx-8 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for movies..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

        
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* 
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            
            */}
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative group cursor-pointer flex-shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500 shadow-md shadow-indigo-600/20"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/20 uppercase">
                      {user.username ? user.username.charAt(0) : "M"}
                    </div>
                  )}
                  
                  <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                    {user.username}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden md:inline text-xs font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

          </div>
        </div>

        <div className="relative w-full pb-3 pt-1 block sm:hidden">
          <Search className="absolute left-3 top-[42%] -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for movies..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

      </div>
    </nav>
  );
};