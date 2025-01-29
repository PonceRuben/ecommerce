"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GoToEditProfileButton from "@/components/GoToEditProfileButton";

export default function Profile() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${session.user.id}`,
          {
            cache: "no-store", // No almacena en caché
          }
        );
        console.log("Response: ", response);
        console.log("Session user id:", session.user.id);

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil.");
        }

        const responseData = await response.json();
        console.log("ResponseData", responseData);
        setUser(responseData.data);
      } catch (err) {
        setError("Hubo un error al obtener el perfil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  if (loading) {
    return <div className="text-center text-gray-500">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-red-500">No se encontró el perfil.</div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-12">
      {/* Título del Perfil */}
      <div className="flex justify-center py-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#02242d] to-[#03424a] text-center shadow-xl tracking-tight">
          {user.name}
        </h1>
      </div>

      {/* Detalles del Perfil */}
      <div className="flex justify-center gap-12 px-6 py-10">
        {/* Imagen del Perfil */}
        <div className="w-full max-w-lg p-4 bg-white rounded-xl shadow-2xl hover:shadow-3xl overflow-hidden transition-transform transform hover:scale-105">
          <div className="w-full h-[450px] overflow-hidden rounded-xl border border-[#03424a] shadow-xl">
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Información del Perfil */}
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl hover:shadow-3xl space-y-6">
          {/* Mostrar dirección */}
          <div>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Dirección:</span>{" "}
              {user.address.line1 || "No disponible"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Ciudad:</span>{" "}
              {user.address.city || "No disponible"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">País:</span>{" "}
              {user.address.country || "No disponible"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Código Postal:</span>{" "}
              {user.address.postalCode || "No disponible"}
            </p>
          </div>

          {/* Mostrar email */}
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>

          {/* Mostrar nombre */}
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Nombre:</span> {user.name}
          </p>

          {/* Botón de Editar Perfil */}
          <GoToEditProfileButton />
        </div>
      </div>
    </div>
  );
}
