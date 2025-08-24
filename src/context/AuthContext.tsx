import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import { useNavigate } from 'react-router-dom';

// 1. تحديث واجهة المستخدم لتشمل الدور والاسم الكامل
interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user'; // <-- إضافة الدور
}

// 2. تحديث واجهة السياق لتشمل isAdmin
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean; // <-- إضافة خاصية مساعدة
  login: (newToken: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userInfo');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: any) => {
    localStorage.clear();

    localStorage.setItem('authToken', newToken);
    
    // 3. استخلاص البيانات الجديدة بما في ذلك الدور والاسم
    const essentialUserData: User = {
      id: userData.id,
      email: userData.email,
      // الاسم الكامل الآن يأتي مباشرة من الباك اند المعدل
      full_name: userData.full_name || userData.user_metadata?.full_name || null,
      // الدور الآن يأتي مباشرة من الباك اند المعدل
      role: userData.role || 'user',
    };
    
    localStorage.setItem('userInfo', JSON.stringify(essentialUserData));
    setToken(newToken);
    setUser(essentialUserData);
    
    // 4. توجيه المستخدم بناءً على دوره
    if (essentialUserData.role === 'admin') {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/login");
  };
  
  const isAuthenticated = !!token;
  // 5. حساب قيمة isAdmin بناءً على بيانات المستخدم
  const isAdmin = user?.role === 'admin';

  const value = { token, user, isAuthenticated, isLoading, isAdmin, login, logout };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};