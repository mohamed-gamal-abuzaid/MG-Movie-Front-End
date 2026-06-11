import React, { createContext, useContext, useState, useEffect } from "react";

interface UserData {
  userId: number;
  username: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  token: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (authData: UserData) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // لقطة السينيور: أول ما الأبلكيشن يفتح، بنشوف هل فيه توكن متسيفة قبل كده؟
    const storedUser = localStorage.getItem("mg_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (authData: UserData) => {
    setUser(authData);
    localStorage.setItem("mg_user", JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mg_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};