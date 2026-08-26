import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'potluck:currentMember';

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setMember(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  function login(memberData) {
    setMember(memberData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
  }

  function logout() {
    setMember(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ member, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
