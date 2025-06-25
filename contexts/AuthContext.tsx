import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role: 'admin' | 'client';
    company_id?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'admin@demo.com',
    password: 'admin123',
    user_metadata: {
      full_name: 'Administrador Sistema',
      role: 'admin' as const,
    },
  },
  {
    id: '2',
    email: 'cliente@demo.com',
    password: 'cliente123',
    user_metadata: {
      full_name: 'Cliente Demo',
      role: 'client' as const,
      company_id: '1',
    },
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (simulate session check)
    const checkSession = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      throw new Error('Credenciales inválidas');
    }

    const user: User = {
      id: mockUser.id,
      email: mockUser.email,
      user_metadata: mockUser.user_metadata,
    };

    setUser(user);
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}