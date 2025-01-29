"use client";

import { useRouter, usePathname } from "next/navigation";
import EditProfileForm from "../../../../components/EditProfileForm";

export default function EditProfilePage() {
  const router = useRouter();
  const pathname = usePathname(); // Obtén la ruta actual

  // Extraemos el id del usuario de la URL.
  const userId = pathname?.split("/").pop(); // Obtén el último segmento de la ruta

  if (!userId) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <h1 className="text-5xl font-extrabold text-center">Editar Perfil</h1>
      <EditProfileForm userId={userId} />
    </div>
  );
}
