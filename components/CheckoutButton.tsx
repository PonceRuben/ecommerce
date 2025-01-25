"use client";
import { useCart } from "../app/context/CartContext";
import { useState } from "react";

type CheckoutButtonProps = {
  totalPrice: number;
};

export default function CheckoutButton({ totalPrice }: CheckoutButtonProps) {
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    console.log("Inicio de la solicitud de compra");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }), // Pasamos el carrito con los productos y cantidades
      });
      console.log("Carrito enviado:", cartItems);
      console.log("Respuesta del servidor:", res);

      if (!res.ok) {
        console.error("Error en la respuesta:", res);
        throw new Error("Error al procesar la compra");
      }

      // Simula el proceso de compra
      setTimeout(() => {
        alert("Compra realizada con éxito. Gracias por tu compra.");

        // Vaciar el carrito después de la compra
        clearCart();
      }, 2000); // Simula un proceso de compra con un retraso de 2 segundos
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar tu compra.");
    } finally {
      setIsProcessing(false);
    }
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
