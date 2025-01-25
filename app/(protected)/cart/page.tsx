"use client";
import { useSession } from "next-auth/react";
import { useCart } from "../../context/CartContext";
import CheckoutButton from "../../../components/CheckoutButton";

export default function CartPage() {
  const { data: session } = useSession();
  const { cartItems, removeFromCart, updateQuantity } = useCart(); // Obtener el carrito

  if (!session) {
    return <div>No autenticado. Inicia sesión para ver tu carrito.</div>;
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemove = (id: string) => {
    removeFromCart(id); // Llamada para eliminar el producto del carrito
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity); // Llamada para actualizar la cantidad del producto
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-[#02242d] text-center mb-8">
        Tu Carrito de Compras
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-700 text-center">
          Tu carrito está vacío.
        </p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg"
            >
              <img
                src={`/${item.image}`}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <div className="flex-1 ml-4">
                <h2 className="font-bold">{item.name}</h2>
                <p>{item.description}</p>
                <p>Precio: ${item.price}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(item.id, Number(e.target.value))
                  }
                  className="w-16 text-center p-2 border border-gray-300 rounded-lg"
                  min="1"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="ml-4 text-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <CheckoutButton totalPrice={totalPrice} />
        </div>
      )}
    </div>
  );
}
