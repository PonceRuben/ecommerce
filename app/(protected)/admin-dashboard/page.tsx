"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import AddProductButton from "@/components/AddProductButton";
import EditCategoryButton from "@/components/EditCategoryButton";
import EditRoleButton from "@/components/EditRoleButton";
import GoToProfileButton from "@/components/GoToProfileButton";

export default function AdminPage() {
  const { data: session } = useSession();

  if (session?.user?.role !== "admin") {
    return (
      <div className="text-center text-red-500">
        No tienes acceso a esta sección.
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-[#cacdca]">
        {/* Barra de navegación */}
        <nav
          className="bg-[#01141f] text-white shadow-md"
          style={{ borderBottom: "2px solid #02333c" }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

            {/* Opciones de usuario */}
            <div className="flex space-x-4">
              {/* Mi perfil */}
              <GoToProfileButton />
            </div>
          </div>
        </nav>

        {/* Contenido principal */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold text-[#02242d] mb-4">
              Bienvenido al Admin Dashboard
            </h2>
            <p className="text-[#02242d]">
              Desde aquí puedes gestionar roles de cuentas, categorías de
              productos, agregar productos, ver historiales de compras y
              actualizar tu perfil.
            </p>
            <div className="mt-6 flex gap-4">
              {/* Ver historiales de compras */}
              <Link href="/admin-dashboard/orders">
                <button className="bg-[#02333c] text-white py-2 px-4 rounded-full hover:bg-[#03424a]">
                  Ver historiales de compras
                </button>
              </Link>

              {/* Agregar producto */}
              <AddProductButton />

              {/* Editar categoría */}
              <EditCategoryButton />

              {/* Editar rol */}
              <EditRoleButton />

              {/* Editar perfil */}
              <button className="bg-[#02333c] text-white py-2 px-4 rounded-full hover:bg-[#03424a]">
                Editar perfil
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
