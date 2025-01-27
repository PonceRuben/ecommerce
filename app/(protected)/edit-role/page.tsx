"use client";

import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AddProductButton from "@/components/AddProductButton";
import EditCategoryButton from "@/components/EditCategoryButton";
import EditRoleForm from "@/components/EditRoleForm";

// Esta función maneja el envío del formulario y la actualización del rol del usuario
const handleSubmit = async (userId: number, role: string) => {
  try {
    const res = await fetch("/api/users/update-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, roleName: role }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Rol actualizado correctamente");
    } else {
      alert(data.message || "Error al actualizar el rol");
    }
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    alert("Hubo un error al actualizar el rol");
  }
};

export default function EditRolePage() {
  const { data: session } = useSession();

  if (session?.user?.role !== "admin") {
    return (
      <div className="text-center text-red-500">
        No tienes acceso a esta sección.
      </div>
    );
  } else {
    return (
      <>
        <div className="w-full min-h-screen bg-[#01141f] flex justify-center items-center px-4">
          <div className="w-full max-w-md bg-[#02242d] p-8 rounded-lg shadow-lg">
            <EditRoleForm onSubmit={handleSubmit} />
          </div>
        </div>
      </>
    );
  }
}
