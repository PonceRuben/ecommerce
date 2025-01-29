import { auth } from "../../../auth";
import Link from "next/link";
import GoToProfileButton from "@/components/GoToProfileButton";
import GoToEditProfileButton from "@/components/GoToEditProfileButton";

export default async function UserPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
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
            <h1 className="text-2xl font-bold text-white">User Dashboard</h1>

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
              Bienvenido al Dashboard
            </h2>
            <p className="text-[#02242d]">
              Desde aquí puedes gestionar tus compras, ver tu historial y
              actualizar tu perfil.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/user-dashboard/orders">
                <button className="bg-[#02333c] text-white py-2 px-4 rounded-full hover:bg-[#03424a]">
                  Ver compras
                </button>
              </Link>
              <GoToEditProfileButton />
            </div>
          </div>
        </main>
      </div>
    );
  }
}
