import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // Obtiene el userId desde los parámetros de la URL

    if (!userId) {
      return NextResponse.json(
        { message: "User ID no proporcionado" },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { message: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    // Busca las órdenes del usuario, incluyendo los artículos del pedido y la dirección de envío
    const orders = await prisma.order.findMany({
      where: { userId: parsedUserId },
      include: {
        orderItems: {
          include: {
            product: true, // Incluir productos en cada orden
          },
        },
        address: true, // Incluir dirección de envío
      },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No se encontraron órdenes para este usuario" },
        { status: 404 }
      );
    }

    // Mapeamos las órdenes
    const mappedOrders = orders.map((order) => ({
      id: order.id,
      date: order.createdAt,
      status: order.status,
      total: order.totalPrice,
      items: order.orderItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      address: order.address, // Incluir la dirección completa del pedido
    }));

    return NextResponse.json(
      { message: "Órdenes encontradas", data: mappedOrders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener las órdenes", error);
    return NextResponse.json(
      { message: "Hubo un error al obtener las órdenes" },
      { status: 500 }
    );
  }
}
