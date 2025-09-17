
import { useState, useEffect } from 'react';
import { User, UserLogin, UserRegistration } from '../types/User';
import Storage from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const userData = await Storage.getItem('currentUser');
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User authenticated:', userData.email);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: UserLogin): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting login for:', credentials.email);
      
      // Check for admin account
      if (credentials.email === 'admin' && credentials.password === 'admin') {
        const adminUser: User = {
          id: 'admin',
          email: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          profileComplete: true,
          isAdmin: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await Storage.setItem('currentUser', adminUser);
        setUser(adminUser);
        setIsAuthenticated(true);
        console.log('Admin login successful');
        return { success: true };
      }

      // Check existing users
      const users = await Storage.getItem('users') || [];
      const existingUser = users.find((u: User) => u.email === credentials.email);
      
      if (!existingUser) {
        return { success: false, error: 'User not found' };
      }

      // In a real app, you would verify the password hash
      const storedPassword = await Storage.getItem(`password_${existingUser.id}`);
      if (storedPassword !== credentials.password) {
        return { success: false, error: 'Invalid password' };
      }

      await Storage.setItem('currentUser', existingUser);
      setUser(existingUser);
      setIsAuthenticated(true);
      console.log('Login successful for:', existingUser.email);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData: UserRegistration): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting registration for:', userData.email);
      
      // Check if user already exists
      const users = await Storage.getItem('users') || [];
      const existingUser = users.find((u: User) => u.email === userData.email);
      
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user and password
      const updatedUsers = [...users, newUser];
      await Storage.setItem('users', updatedUsers);
      await Storage.setItem(`password_${newUser.id}`, userData.password);
      await Storage.setItem('currentUser', newUser);
      
      setUser(newUser);
      setIsAuthenticated(true);
      console.log('Registration successful for:', newUser.email);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await Storage.removeItem('currentUser');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };
      
      console.log('Updating profile for:', user.email);
      const updatedUser = { 
        ...user, 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      
      // Update in users array
      const users = await Storage.getItem('users') || [];
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await Storage.setItem('users', users);
      }
      
      // Update current user
      await Storage.setItem('currentUser', updatedUser);
      setUser(updatedUser);
      
      console.log('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
};
