import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';

export const PRESET_USERS: AuthUser[] = [
  {
    id: 'user-rudi',
    username: 'rudipradnyana',
    name: 'Rudi Pradnyana',
    email: 'rudipradnyana@gmail.com',
    role: 'NOC Engineer Shift',
    initial: 'R',
    avatarBg: 'bg-blue-600',
    shift: 'Shift 1 (08:00 - 16:00 WIB)',
    gatewayIp: '10.12.0.1',
  },
  {
    id: 'user-farisy',
    username: 'achmad.farisy',
    name: 'Achmad Farisy',
    email: 'achmad.farisy@iconpln.co.id',
    role: 'Echo Team Lead / DWDM Specialist',
    initial: 'A',
    avatarBg: 'bg-emerald-600',
    shift: 'Daily Normal (08:00 - 17:00 WIB)',
    gatewayIp: '10.12.0.254',
  },
  {
    id: 'user-admin',
    username: 'noc.admin',
    name: 'NOC Central Admin',
    email: 'admin.noc@iconpln.co.id',
    role: 'NOC Operations Manager',
    initial: 'N',
    avatarBg: 'bg-indigo-600',
    shift: '24/7 Operations Supervisor',
    gatewayIp: '10.12.100.1',
  },
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password?: string, remember?: boolean) => Promise<boolean>;
  loginAsPreset: (presetUser: AuthUser, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'noc_portal_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AuthUser;
      }
    } catch (err) {
      console.error('Failed to parse stored auth user', err);
    }
    return null;
  });

  const isAuthenticated = !!user;

  const login = async (
    usernameInput: string,
    _password?: string,
    remember: boolean = true
  ): Promise<boolean> => {
    // Snappy authentication UX
    await new Promise((resolve) => setTimeout(resolve, 200));

    const cleanInput = usernameInput.trim().toLowerCase();

    // Check if matches any preset user
    const matchedPreset = PRESET_USERS.find(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        u.email.toLowerCase() === cleanInput ||
        u.name.toLowerCase().includes(cleanInput)
    );

    let loggedInUser: AuthUser;

    if (matchedPreset) {
      loggedInUser = {
        ...matchedPreset,
        loggedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    } else {
      // Dynamic fallback for any dummy username
      const displayName = cleanInput
        ? cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1)
        : 'Operator NOC';
      loggedInUser = {
        id: `user-${Date.now()}`,
        username: cleanInput || 'operator.noc',
        name: displayName,
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput || 'operator'}@iconpln.co.id`,
        role: 'NOC Engineer',
        initial: (displayName.charAt(0) || 'O').toUpperCase(),
        avatarBg: 'bg-blue-600',
        shift: 'Shift Aktif',
        gatewayIp: '10.12.0.1',
        loggedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
    }

    setUser(loggedInUser);

    try {
      const serialized = JSON.stringify(loggedInUser);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, serialized);
      } else {
        sessionStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch {
      // ignore storage errors
    }

    return true;
  };

  const loginAsPreset = (presetUser: AuthUser, remember: boolean = true) => {
    const updatedUser: AuthUser = {
      ...presetUser,
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
        loginAsPreset,
        logout,
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
