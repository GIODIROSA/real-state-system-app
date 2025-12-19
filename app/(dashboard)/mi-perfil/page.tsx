"use client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Mi Perfil
      </h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Nombre
              </label>
              <p className="text-base font-medium">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Rol</label>
              <p className="text-base font-medium text-blue-700 bg-blue-50 inline-block px-2 rounded">
                {user?.role}
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">
                Correo Electrónico
              </label>
              <p className="text-base font-medium">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
