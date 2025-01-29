import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { cartItems, userId } = await req.json();

    if (!userId) {
      throw new Error("No se proporcionó el usuario.");
    }

    // Obtener los IDs del carrito
    const cartItemIds = cartItems.map((item: { id: number }) => item.id);

    // Consultar los productos de la base de datos
    const products = await prisma.product.findMany({
      where: { id: { in: cartItemIds } }, // Buscar solo los productos cuyos IDs estén en el carrito
    });

    // Verificar si hay algún ID que no coincida
    const missingIds = cartItemIds.filter(
      (id: number) => !products.some((product) => product.id === id)
    );

    if (missingIds.length > 0) {
      throw new Error(
        `Los siguientes productos no existen en la base de datos: ${missingIds.join(
          ", "
        )}`
      );
    }

    // Validar el stock de los productos
    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.id);
      if (!product) continue;

      if (product.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}, Requerido: ${item.quantity}`
        );
      }
    }

    const userAddress = await prisma.address.findFirst({
      where: { userId: userId },
    });

    if (!userAddress) {
      const defaultAddress = await prisma.address.create({
        data: {
          userId: userId,
          line1: "Calle Falsa 123",
          city: "Ciudad Ficticia",
          country: "Pais Ficticio",
          line2: "Calle2 Falsa 123",
          postalCode: "123",
        },
      });
    }

    const totalPrice = cartItems.reduce(
      (total: any, item: any) => total + item.price * item.quantity,
      0
    );

    if (isNaN(totalPrice) || totalPrice <= 0) {
      throw new Error("El precio total es inválido.");
    }

    // Crear una nueva orden
    const order = await prisma.order.create({
      data: {
        userId: userId,
        totalPrice: totalPrice,
        status: "Completada",
        addressId: userAddress?.id,
        orderItems: {
          create: cartItems.map((items: any) => ({
            productId: items.id,
            quantity: items.quantity,
            unitPrice: items.price,
          })),
        },
      },
    });

    const updateStockPromises = cartItems.map(
      (item: { id: number; quantity: number }) => {
        return prisma.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    );

    // Esperar a que todas las actualizaciones se completen
    await Promise.all(updateStockPromises);

    return NextResponse.json(
      { message: "Compra exitosa, stock actualizado.", orderId: order.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al procesar la compra:", error.message);
    return NextResponse.json(
      { error: error.message || "Hubo un error al procesar la compra." },
      { status: 500 }
    );
  }
}
