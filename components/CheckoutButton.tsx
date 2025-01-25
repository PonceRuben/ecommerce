"use client";
import { useCart } from "../app/context/CartContext";
import { useState } from "react";

type CheckoutButtonProps = {
  totalPrice: number;
};

export default function CheckoutButton({ totalPrice }: CheckoutButtonProps) {
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);

    // Simula el proceso de compra
    setTimeout(() => {
      alert("Compra realizada con éxito. Gracias por tu compra.");

      // Vaciar el carrito después de la compra
      clearCart();
      setIsProcessing(false);
    }, 2000); // Simula un proceso de compra con un retraso de 2 segundos
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isProcessing}
      className="w-full py-3 bg-[#03424a] text-white rounded-full shadow-md hover:shadow-xl hover:bg-[#02242d] transition-all duration-300"
    >
      {isProcessing
        ? "Procesando..."
        : `Finalizar compra - $${totalPrice.toFixed(2)}`}
    </button>
  );
}
