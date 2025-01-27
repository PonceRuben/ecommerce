"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AddProductButton from "@/components/AddProductButton";
import EditCategoryButton from "@/components/EditCategoryButton";

export default function EditorPage() {
  const { data: session } = useSession();

  if (session?.user?.role !== "editor") {
    return (
      <div className="text-center text-red-500">
        No tienes acceso a esta sección.
      </div>
    );
  } else
    return (
      <div className="min-h-screen bg-[#cacdca]">
        {/* Barra de navegación */}
        <nav
          className="bg-[#01141f] text-white shadow-md"
          style={{ borderBottom: "2px solid #02333c" }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-white">Editor Dashboard</h1>

            {/* Opciones de usuario */}
            <div className="flex space-x-4">
              {/* Mi perfil */}
              <Link href="/editor-dashboard/profile">
                <button className="bg-[#02333c] py-2 px-4 rounded-full hover:bg-[#03424a]">
                  Mi perfil
                </button>
              </Link>

              {/* Agregar producto */}
              <AddProductButton />
              {/*Editar categoría*/}
              <EditCategoryButton />
            </div>
          </div>
        </nav>

        {/* Contenido principal */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Mostrar detalles de la sesión */}
            <pre>{JSON.stringify(session, null, 2)}</pre>

            {/* Botón de logout */}
            <LogoutButton />
          </div>
        </main>
      </div>
    );
}
