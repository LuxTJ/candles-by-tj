import { createContext, useContext, useState, useEffect } from "react";

type AdminContextType = {
  isLoggedIn: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType>({
  isLoggedIn: false,
  login: async () => false,
  logout: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem("adminAuth") === "true");
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("adminAuth", "true");
        setIsLoggedIn(true);
        return true;
      }
    } catch {
      // fallback for local dev
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
