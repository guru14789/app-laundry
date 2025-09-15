import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { auth, getCurrentUser, getAuthToken } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: userProfile } = useQuery({
    queryKey: ['/api/me'],
    enabled: !!user,
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) return null;
      
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) return null;
      return response.json();
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getToken = async () => {
    return await getAuthToken();
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
