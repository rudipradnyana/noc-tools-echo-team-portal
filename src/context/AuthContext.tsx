import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AccessLevel } from '../types';

export const PRESET_USERS: AuthUser[] = [
  {
    id: '1',
    username: 'noc.admin',
    name: 'Administrator NOC',
    email: 'admin.noc@iconpln.co.id',
    role: 'admin',
    accessLevel: 'admin',
    initial: 'A',
    avatarBg: 'bg-indigo-600',
    shift: '24/7 Operations Supervisor',
    gatewayIp: '10.12.100.1',
  },
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password?: string, remember?: boolean) => Promise<boolean>;
  register: (username: string, password: string, fullName: string, role: string) => Promise<{ success: boolean; message: string }>;
  loginAsPreset: (presetUser: AuthUser, remember?: boolean) => void;
  logout: () => void;
  favorites: string[];
  toggleFavoriteTool: (toolId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'noc_portal_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (!parsed.accessLevel) {
          parsed.accessLevel = parsed.role === 'admin' || parsed.username === 'noc.admin' ? 'admin' : 'employee';
        }
        return parsed;
      }
    } catch (err) {
      console.error('Failed to parse stored auth user', err);
    }
    return null;
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const isAuthenticated = !!user;

  // Fetch favorites from API whenever user changes
  const refreshFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavorites([]);
      return;
    }
    try {
      const res = await fetch(`/api/users/${user.id}/favorites`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
          return;
        }
      }
    } catch {
      // Fallback: local storage
    }

    try {
      const saved = localStorage.getItem(`noc_favs_${user.id}`);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      refreshFavorites();
    } else {
      setFavorites([]);
    }
  }, [user?.id, refreshFavorites]);

  const toggleFavoriteTool = async (toolId: string) => {
    if (!user?.id) return;

    // Optimistic UI update
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem(`noc_favs_${user.id}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    try {
      const res = await fetch(`/api/users/${user.id}/favorites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
          localStorage.setItem(`noc_favs_${user.id}`, JSON.stringify(data.favorites));
        }
      }
    } catch {
      // API offline, state already saved locally
    }
  };

  const register = async (username: string, password: string, fullName: string, role: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, fullName, role }),
    });

    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error('Server backend (port 5001) tidak dapat dihubungi. Pastikan server backend sedang aktif.');
    }

    if (!res.ok || !data.success) {
      throw new Error(data?.message || 'Gagal melakukan pendaftaran akun.');
    }

    return {
      success: true,
      message: data.message || 'Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan (ACC) Admin.',
    };
  };

  const login = async (
    usernameInput: string,
    passwordInput?: string,
    remember: boolean = true
  ): Promise<boolean> => {
    const cleanUsername = usernameInput.trim().toLowerCase();

    // 1. Try real MySQL API first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: passwordInput || 'password',
        }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error('Server backend (port 5001) tidak dapat dihubungi. Pastikan server backend sedang aktif.');
      }

      if (!res.ok || !data.success) {
        // Jika ada pesan khusus (misal: "menunggu ACC" atau "password salah")
        throw new Error(data?.message || 'Gagal masuk.');
      }

      const dbUser = data.user;
      const isAdminRole = dbUser.role === 'admin' || dbUser.username === 'noc.admin';
      const roleDisplayName =
        dbUser.role === 'admin'
          ? 'Administrator NOC'
          : dbUser.role === 'manager'
          ? 'NOC Operations Manager'
          : dbUser.role === 'mod'
          ? 'Manager On Duty'
          : dbUser.role === 'analis'
          ? 'Data & Traffic Analyst'
          : dbUser.role === 'ea'
          ? 'Enterprise Access Specialist'
          : dbUser.role === 'tdm'
          ? 'TDM Specialist'
          : 'NOC Engineer Regular';

      const loggedInUser: AuthUser = {
        id: String(dbUser.id),
        username: dbUser.username,
        name: dbUser.name || dbUser.full_name || dbUser.username,
        email: `${dbUser.username}@iconpln.co.id`,
        role: roleDisplayName,
        accessLevel: (isAdminRole ? 'admin' : 'employee') as AccessLevel,
        initial: (dbUser.name || dbUser.username).charAt(0).toUpperCase(),
        avatarBg: isAdminRole ? 'bg-indigo-600' : 'bg-blue-600',
        shift: isAdminRole ? '24/7 Operations Supervisor' : 'Shift Aktif',
        gatewayIp: isAdminRole ? '10.12.100.1' : '10.12.0.1',
        loggedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setUser(loggedInUser);
      if (Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      }

      const serialized = JSON.stringify(loggedInUser);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, serialized);
      } else {
        sessionStorage.setItem(STORAGE_KEY, serialized);
      }

      return true;
    } catch (err: unknown) {
      // Re-throw if it was a server error message (e.g. pending approval)
      if (err instanceof Error && !err.message.includes('Failed to fetch')) {
        throw err;
      }
    }

    // 2. Fallback jika Backend offline / mockup demo
    const matchedPreset = PRESET_USERS.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername ||
        u.email.toLowerCase() === cleanInputEmail(cleanUsername) ||
        u.name.toLowerCase().includes(cleanUsername)
    );

    let fallbackUser: AuthUser;
    if (matchedPreset) {
      fallbackUser = {
        ...matchedPreset,
        loggedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    } else {
      const displayName = cleanUsername
        ? cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1)
        : 'Operator NOC';
      const isAdmin = cleanUsername === 'admin' || cleanUsername === 'noc.admin';
      fallbackUser = {
        id: `user-${Date.now()}`,
        username: cleanUsername || 'operator.noc',
        name: displayName,
        email: `${cleanUsername || 'operator'}@iconpln.co.id`,
        role: isAdmin ? 'NOC Operations Manager' : 'NOC Engineer Regular',
        accessLevel: isAdmin ? 'admin' : 'employee',
        initial: (displayName.charAt(0) || 'O').toUpperCase(),
        avatarBg: isAdmin ? 'bg-indigo-600' : 'bg-blue-600',
        shift: isAdmin ? '24/7 Operations Supervisor' : 'Shift Aktif',
        gatewayIp: isAdmin ? '10.12.100.1' : '10.12.0.1',
        loggedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    }

    setUser(fallbackUser);
    const serialized = JSON.stringify(fallbackUser);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, serialized);
    } else {
      sessionStorage.setItem(STORAGE_KEY, serialized);
    }

    return true;
  };

  function cleanInputEmail(input: string) {
    return input.includes('@') ? input : `${input}@iconpln.co.id`;
  }

  const loginAsPreset = (presetUser: AuthUser, remember: boolean = true) => {
    const updatedUser: AuthUser = {
      ...presetUser,
      accessLevel: presetUser.accessLevel || (presetUser.username === 'noc.admin' ? 'admin' : 'employee'),
      loggedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setUser(updatedUser);

    try {
      const serialized = JSON.stringify(updatedUser);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, serialized);
      } else {
        sessionStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        loginAsPreset,
        logout,
        favorites,
        toggleFavoriteTool,
        refreshFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
