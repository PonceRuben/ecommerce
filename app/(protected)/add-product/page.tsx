import { auth } from "../../../auth";
import AddProductForm from "@/components/AddProductForm";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  } else if (session?.user?.role == "user") {
    return <div>You're not an editor or admin</div>;
  } else
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Agregar Producto</h1>
        <AddProductForm />
      </div>
    );
}
