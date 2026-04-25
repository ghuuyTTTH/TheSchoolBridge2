
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string, role: Role) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for a saved user session
    const savedUser = localStorage.getItem('schoolbridge_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('schoolbridge_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (name: string, role: Role) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      passwordHash: '',
      role,
      studentId: role === 'student' ? 'STU' + Math.floor(Math.random() * 1000) : null,
      schoolCode: role === 'teacher' ? 'SCH' + Math.floor(Math.random() * 1000) : null,
      childStudentId: role === 'parent' ? 'STU' + Math.floor(Math.random() * 1000) : null,
      createdAt: Date.now(),
      classes: [],
    };
    
    setUser(newUser);
    localStorage.setItem('schoolbridge_user', JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('schoolbridge_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
