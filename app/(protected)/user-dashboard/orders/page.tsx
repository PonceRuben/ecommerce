"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  total: number;
  items: OrderItem[];
};

type OrderItem = {
  id: number;
  quantity: number;
  productName: string;
  price: number;
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`/api/orders?userId=${session.user.id}`);

          const data = await response.json();

          if (response.ok) {
            setOrders(Array.isArray(data.data) ? data.data : []);
          } else {
            console.error("Error al obtener los pedidos", data.message);
          }
        } catch (error) {
          console.error("Error de red", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else if (status === "unauthenticated") {
      setLoading(false);
    } else {
      console.log("Esperando sesión...");
    }
  }, [status, session]);

  if (loading) {
    return <div className="text-center text-gray-500">Cargando...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="text-center text-red-500">No estás autenticado</div>;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-12">
      <nav
        className="bg-[#01141f] text-white shadow-md"
        style={{ borderBottom: "2px solid #02333c" }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">Historial de Compras</h1>
        </div>
      </nav>

      <main className="p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6">
          <h2 className="text-3xl font-bold text-[#02242d] mb-4">
            Tus Pedidos
          </h2>

          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No tienes pedidos aún.</p>
          ) : (
            <ul className="space-y-6">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="p-6 bg-[#f3f4f6] rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-[#02242d]">
                    Pedido #{order.id}
                  </h3>
                  <p className="text-gray-600">Estado: {order.status}</p>
                  <p className="font-semibold text-[#02242d]">
                    Total: $
                    {order.items
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>

                  <div className="mt-4">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-[#02242d]">
                              {item.productName}
                            </p>
                            <p>Cantidad: {item.quantity}</p>
                            <p>Precio: ${item.price}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No hay productos en este pedido.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
