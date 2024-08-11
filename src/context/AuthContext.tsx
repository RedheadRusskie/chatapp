import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface AuthContext {
  session: Session;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(status === "loading");
  }, [status]);

  return (
    <AuthContext.Provider value={{ session, loading } as AuthContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
