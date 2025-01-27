import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Esperamos a que los parámetros sean resueltos correctamente
    const { id } = await params;
    const productId = parseInt(id); // Asegúrate de convertir el ID a un número

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
      stock: product.stock,
    };

    return NextResponse.json(
      { message: "Producto encontrado", data: mappedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener el producto", error);
    return NextResponse.json(
      { message: "Hubo un error al obtener el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description, price, stock, categoryId } = body;

    // Validación de tipo de datos
    if (isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Precio, stock y categoría deben ser números válidos" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId: parseInt(categoryId, 10),
      },
    });

    return NextResponse.json(
      { message: "Producto actualizado con éxito", data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    let errorMessage = "Hubo un error al actualizar el producto";

    // Asegurarse de que 'error' siempre sea un string
    const errorToLog = error instanceof Error ? error.message : String(error);

    console.error("Error al actualizar el producto:", errorToLog); // Log del error como cadena

    return NextResponse.json(
      { message: errorMessage, error: errorToLog }, // Asegura que el error sea un string
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID de producto es obligatorio" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Producto eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el producto", error);
    return NextResponse.json(
      { message: "Hubo un error al eliminar el producto" },
      { status: 500 }
    );
  }
}
