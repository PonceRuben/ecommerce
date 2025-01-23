"use client";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="bg-gray-100 min-h-screen p-8">
        <h1 className="text-4xl font-bold text-[#02242d] text-center mb-8">
          Tu Carrito de Compras
        </h1>
        <div className="flex justify-center">
          <p className="text-lg text-gray-700">
            Aquí aparecerán los productos que agregues al carrito.
          </p>
        </div>
      </div>
    );
  } else {
    return <div>Not authenticated</div>;
  }
}
