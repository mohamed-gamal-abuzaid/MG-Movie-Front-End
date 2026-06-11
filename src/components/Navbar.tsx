import React from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 استيراد التنقل
import { useAuth } from "../context/AuthContext"; // 👈 استيراد الـ Auth Context بتاعك
import { Sun, Moon, Search, Film, LogOut, User } from "lucide-react";

interface NavbarProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onSearch }) => {
  const { user, logout } = useAuth(); // 👈 سحب بيانات اليوزر ودالة تسجيل الخروج
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // توجيهه لصفحة الـ Login بعد ما يخرج
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* الـ Logo */}
        <Link to="/" className="flex items-center space-x-2 cursor-pointer no-underline">
          <Film className="w-7 h-7 text-indigo-500" />
          <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
            MG MOVIE
          </span>
        </Link>

        {/* الـ Search Bar */}
        <div className="relative w-full max-w-md mx-8 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for movies..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* الـ Controls زرار الـ Theme والـ Auth */}
        <div className="flex items-center space-x-4">
          
          {/* زرار الـ Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* 💡 لقطة السينيور: الـ Dynamic Auth State */}
          {user ? (
            // أ) لو المستخدم مسجل دخول: اعرض صورته (أو أول حرف) وزرار الـ Logout
            <div className="flex items-center space-x-3">
              <div className="relative group cursor-pointer">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500 shadow-md shadow-indigo-600/20"
                    onError={(e) => {
                      // fallback لو لينك صورة جوجل حصل فيه مشكلة
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  // الدائرة الافتراضية بتاعتك بس مخلينها تقرأ أول حرف من إسم اليوزر ديناميكياً
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/20 uppercase">
                    {user.username ? user.username.charAt(0) : "M"}
                  </div>
                )}
                
                {/* تولتيب يظهر فوق الصورة عند الهوفر عشان يوضح اسم المستخدم */}
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                  {user.username}
                </span>
              </div>

              {/* زرار الـ Logout الشيك */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline text-xs font-semibold">Logout</span>
              </button>
            </div>
          ) : (
            // ب) لو مش مسجل دخول: اعرض زرار الـ Login الأزرق
            <Link
              to="/login"
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};