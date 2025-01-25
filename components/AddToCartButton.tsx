"use client";

import { useCart } from "../app/context/CartContext";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type AddToCartButtonProps = {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
  };
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart(); // Accede a la función addToCart del contexto
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { data: session } = useSession(); // Hook para verificar la sesión
  const router = useRouter();

  const handleAddToCart = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setIsAdding(true); // Cambia el estado a "Añadiendo"
    addToCart({
      ...product,
      quantity: 1,
    });
    setShowNotification(true);

    setTimeout(() => setShowNotification(false), 3000);

    setIsAdding(false); // Vuelve a cambiar el estado a "No está añadiendo"
  };

  return (
    <div className="relative">
      {/* Notificación emergente */}
      {showNotification && (
        <div className="absolute top-[-80px] left-1/2 transform -translate-x-1/2 bg-white border border-[#03424a] shadow-xl rounded-lg p-4 flex items-center gap-4">
          <p className="text-[#03424a] font-semibold">
            ¡Producto añadido al carrito!
          </p>
          <span
            onClick={() => setShowNotification(false)}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            ✖
          </span>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full py-3 bg-[#03424a] text-white rounded-full shadow-md hover:shadow-xl hover:bg-[#02242d] transition-all duration-300"
      >
        {isAdding ? "Añadiendo..." : "Añadir al carrito"}
      </button>
    </div>
  );
}
