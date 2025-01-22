import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Obtenemos el ID desde los parámetros de la URL
    const productId = parseInt(params.id); // Asegúrate de convertir el ID a un número si es necesario
    console.log("ID recibido en la API:", productId);
    // Buscamos el producto por ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const mappedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category?.name,
    };

    return NextResponse.json(
      { message: "Producto encontrado", data: mappedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener el producto");
    return NextResponse.json(
      { message: "Hubo un error al obtener el producto" },
      { status: 500 }
    );
  }
}
