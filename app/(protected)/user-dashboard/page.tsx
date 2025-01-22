import { auth } from "../../../auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  } else
    return (
      <div>
        <h2 className="text-3xl font-bold text-[#02242d] mb-4">
          Bienvenido al Dashboard
        </h2>
        <p className="text-[#02242d]">
          Desde aquí puedes gestionar tus compras, ver tu historial y actualizar
          tu perfil.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="bg-[#02333c] text-white py-2 px-4 rounded-full hover:bg-[#03424a]">
            Ver compras
          </button>
          <button className="bg-[#02333c] text-white py-2 px-4 rounded-full hover:bg-[#03424a]">
            Editar perfil
          </button>
        </div>
      </div>
    );
}
