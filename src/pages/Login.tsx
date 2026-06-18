import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { movieApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Film, AlertCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

export const Login: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json());

        login({
          userId: parseInt(userInfo.sub.substring(0, 10), 10) || Date.now(),
          token: tokenResponse.access_token,
          username: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
          role: "USER"
        });
        navigate("/");
      } catch {
        setError("Google authentication failed.");
      }
    },
    onError: () => setError("Google authentication failed. Please try again."),
  });

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
      
      login(data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email or password incorrect! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="w-full max-w-[92%] sm:max-w-md space-y-6 sm:space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Film className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              {isRegister ? "Create an account" : "Welcome back"}
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500">
              {isRegister ? "Join MG Movie and build your watchlist" : "Sign in to manage your premium experience"}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 flex-none" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              {isRegister && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
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

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            <div className="text-center text-xs sm:text-sm mt-4">
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

      <div className="hidden lg:flex flex-1 relative bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"
          alt="Cinema Backdrop"
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 dark:from-slate-900 via-transparent to-transparent w-1/2" />
        <div className="absolute bottom-16 left-16 max-w-md space-y-4">
          <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Explore thousands of cinema masterpieces.</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Create your personal watchlist, track your favorite genres, and experience premium streaming tracking at its best.</p>
        </div>
      </div>

    </div>
  );
};