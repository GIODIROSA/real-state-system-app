import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setUser({ name: 'Guest User' });
      setLoading(false);
    }, 1000);
  }, []);

  return { user, loading };
}
