import { useEffect, useState, useCallback } from "react";
import { User } from "@/types/user.types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Booleano útil para proteger rutas fácilmente
  const isAuthenticated = !!user;

  // 1. Cargar sesión al iniciar (Rehidratación)
  useEffect(() => {
    const initAuth = () => {
      try {
        if (typeof window !== "undefined") {
          // Solo buscamos al usuario, porque el token vive seguro en la Cookie
          const storedUser = localStorage.getItem("user");
          
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error al recuperar sesión: ", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2. Función LOGIN
  // CORRECCIÓN: Ahora acepta directamente un objeto 'User'
  const login = useCallback((userData: User) => {
    try {
      setUser(userData);
      // Guardamos solo datos visuales (nombre, email, rol) para sobrevivir al F5
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error al guardar sesión:", error);
    }
  }, []);

  // 3. Función LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    // Opcional: Aquí podrías llamar al servicio authService.logout() para matar la cookie
    router.push("/login");
  }, [router]);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
}