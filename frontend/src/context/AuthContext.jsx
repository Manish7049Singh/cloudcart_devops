import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Sync profile from backend
  const refreshProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('access_token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const res = await userService.getMyInfo();
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      // If unauthorized, clear state
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const handleLogoutEvent = () => logout();
    window.addEventListener('auth:logout', handleLogoutEvent);
    refreshProfile();
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, [logout, refreshProfile]);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const tokenData = await authService.login({ username, password });
      localStorage.setItem('access_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('refresh_token', tokenData.refresh_token);
      }
      setToken(tokenData.access_token);

      const profile = await refreshProfile();
      toast.success(`Welcome back, ${profile?.full_name || username}!`);
      return profile;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      await authService.signup(userData);
      toast.success('Registration successful! Logging in...');
      return await login(userData.username, userData.password);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const updateUser = async (updateData) => {
    const res = await userService.updateMyInfo(updateData);
    const updated = res.data;
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    toast.success('Profile updated successfully!');
    return updated;
  };

  const deleteAccount = async () => {
    await userService.deleteMyAccount();
    logout();
    toast.success('Account deleted successfully.');
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    updateUser,
    deleteAccount,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
