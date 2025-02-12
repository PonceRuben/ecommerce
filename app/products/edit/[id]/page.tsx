"use client";

import { usePathname } from "next/navigation";
import EditProductForm from "@/components/EditProductForm";

export default function EditProductPage() {
  const pathname = usePathname(); // Obtén la ruta actual

  // Extraemos el id del producto de la URL.
  const productId = pathname?.split("/").pop(); // Obtén el último segmento de la ruta

  if (!productId) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <h1 className="text-5xl font-extrabold text-center">Editar Producto</h1>
      <EditProductForm productId={productId} />
    </div>
  );
}
