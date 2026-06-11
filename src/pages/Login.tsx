import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { movieApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Film, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google"; // 👈 استيراد زرار جوجل الجاهز
import { jwtDecode } from "jwt-decode"; // 👈 استيراد مفكك التوكن لنسخ الداتا الشخصية والصورة

export const Login: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        data = await movieApi.register({ username, email, password });
      } else {
        data = await movieApi.login({ email, password });
      }
      
      login(data); // حفظ بيانات المستخدم والتوكن في الـ Context
      navigate("/"); // التوجه للصفحة الرئيسية فوراً
    } catch (err: any) {
      setError(err.response?.data?.message || "Email or password incorrect! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* الجانب الأيسر: الـ Form والـ Social Login */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Film className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              {isRegister ? "Create an account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {isRegister ? "Join MG Movie and build your watchlist" : "Sign in to manage your premium experience"}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 flex-none" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isRegister && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="type"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processing..." : isRegister ? "Sign Up" : "Sign In"}
            </button>

            {/* 💡 لقطة السينيور: فاصل خطي شيك قبل خيار التسجيل بجوجل */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            {/* 💡 زرار تسجيل الدخول عبر الـ Gmail */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    // فك تشفير التوكن المرتجع من جوجل للحصول على بيانات البروفايل والصورة
                    const decoded: any = jwtDecode(credentialResponse.credential);
                    
                    const googleUserData = {
                      token: credentialResponse.credential,
                      username: decoded.name,
                      email: decoded.email,
                      avatarUrl: decoded.picture, // 👈 هنا لينك صورة الـ Gmail الشخصية!
                      role: "USER"
                    };

                    login(googleUserData); // تخزين البيانات والتوكن في الـ Context فوراً
                    navigate("/"); // التوجيه للرئيسية
                  }
                }}
                onError={() => {
                  setError("Google authentication failed. Please try again.");
                }}
                theme={document.documentElement.classList.contains("dark") ? "filled_black" : "outline"}
                shape="circle"
                width="100%"
              />
            </div>

            <div className="text-center text-sm mt-4">
              <span className="text-slate-500">
                {isRegister ? "Already have an account? " : "New to MG Movie? "}
              </span>
              <Link
                to={isRegister ? "/login" : "/register"}
                className="text-indigo-500 font-bold hover:underline"
              >
                {isRegister ? "Sign In" : "Create Account"}
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* الجانب الأيمن: صورة جمالية للشاشات الكبيرة */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"
          alt="Cinema Backdrop"
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 dark:from-slate-950 via-transparent to-transparent w-1/4" />
        <div className="absolute bottom-16 left-16 max-w-md space-y-4">
          <h3 className="text-4xl font-black text-white leading-tight">Explore thousands of cinema masterpieces.</h3>
          <p className="text-slate-300 text-sm">Create your personal watchlist, track your favorite genres, and experience premium streaming tracking at its best.</p>
        </div>
      </div>

    </div>
  );
};