import { useState } from "react";

interface DeleteProductButtonProps {
  productId: number;
  onDeleteSuccess?: () => void;
}

export default function DeleteProductButton({
  productId,
  onDeleteSuccess,
}: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirm) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar el producto");
      }

      alert("Producto eliminado correctamente");
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      setError((err as Error).message || "Error desconocido");
      console.error("Error al eliminar el producto:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className={`py-2 px-4 rounded-md font-semibold text-white ${
          loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
        } transition-all`}
      >
        {loading ? "Eliminando..." : "Eliminar Producto"}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
