import { useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user.types';
import { AuthResponse } from '@/types/auth.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initial loading for session check
  const [error, setError] = useState<string | null>(null);

  // Check for existing session in localStorage on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Initializes the user session after a successful authentication flow.
   * @param authResponse The response from the server containing user data and token.
   */
  const startSession = useCallback((authResponse: AuthResponse) => {
    try {
      setUser(authResponse.user);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      localStorage.setItem('authToken', authResponse.token);
      setError(null);
    } catch (e) {
      console.error("Failed to start session and save to local storage", e);
      setError("Failed to initialize session.");
    }
  }, []);

  /**
   * Clears the user session.
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }, []);

  return {
    user,
    loading,
    error,
    startSession,
    logout,
  };
}
