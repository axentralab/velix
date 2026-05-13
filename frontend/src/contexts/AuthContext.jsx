import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  login as loginRequest,
  register as registerRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
} from '../services/auth.js';
import { setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

const storageKeys = {
  token: 'veloura_auth_token',
  user: 'veloura_auth_user',
};

function getInitialAuth() {
  const token = localStorage.getItem(storageKeys.token);
  const user = localStorage.getItem(storageKeys.user);

  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
  };
}

export function AuthProvider({ children }) {
  const initialAuth = getInitialAuth();
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const persistAuth = ({ token: authToken, user: authUser }) => {
    if (authToken) {
      localStorage.setItem(storageKeys.token, authToken);
      setToken(authToken);
    } else {
      localStorage.removeItem(storageKeys.token);
      setToken(null);
    }

    if (authUser) {
      localStorage.setItem(storageKeys.user, JSON.stringify(authUser));
      setUser(authUser);
    } else {
      localStorage.removeItem(storageKeys.user);
      setUser(null);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const authData = await loginRequest(credentials);
      persistAuth(authData);
      return authData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (details) => {
    setLoading(true);
    try {
      const authData = await registerRequest(details);
      persistAuth(authData);
      return authData;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      return await forgotPasswordRequest(email);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (payload) => {
    setLoading(true);
    try {
      return await resetPasswordRequest(payload);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    persistAuth({ token: null, user: null });
  };

  const value = useMemo(
    () => ({ token, user, setUser, loading, login, register, forgotPassword, resetPassword, logout }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
