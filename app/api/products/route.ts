import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null; // Añadimos este campo que falta
}

type Response = {
  message: string;
  data: Product[];
};

export async function GET(req: NextRequest) {
  try {
    //Obtener productos de la db
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    // Mapeamos los productos para devolver solo los campos que queremos en el frontend
    const mappedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    }));

    return NextResponse.json<Response>(
      { message: "Productos encontrados", data: mappedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener productos");
    return NextResponse.json(
      { message: "Hubo un error al obtener los productos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.name ||
      !body.price ||
      typeof body.name !== "string" ||
      typeof body.price !== "number"
    ) {
      return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
    }

    const newProduct: Product = {
      id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
      name: body.name,
      price: body.price,
    };

    productos.push(newProduct);

    return NextResponse.json(
      { message: "Producto creado con éxito", data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return NextResponse.json(
      { message: "Hubo un error al crear el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Obtener el id del producto desde los parámetros de la URL
    const id = req.nextUrl.searchParams.get("id");

    // Verificar que el id no sea null y convertirlo a número
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: "ID inválido o no proporcionado" },
        { status: 400 }
      );
    }

    // Leer los datos enviados en el cuerpo de la solicitud
    const body = await req.json();

    // Validar que el cuerpo contiene las propiedades necesarias
    if (
      !body.name ||
      !body.price ||
      typeof body.name !== "string" ||
      typeof body.price !== "number"
    ) {
      return NextResponse.json(
        {
          message:
            "Datos inválidos. Se requiere 'name' (string) y 'price' (number).",
        },
        { status: 400 }
      );
    }

    // Buscar el producto por id
    const productIndex = productos.findIndex(
      (producto) => producto.id === parseInt(id)
    );

    // Si el producto no se encuentra, devolver un error
    if (productIndex === -1) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el producto encontrado
    productos[productIndex] = {
      id: parseInt(id), // El id no cambia
      name: body.name,
      price: body.price,
    };

    // Responder con el producto actualizado
    return NextResponse.json(
      {
        message: "Producto actualizado con éxito",
        data: productos[productIndex],
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json(
      { message: "Hubo un error al actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Obtener el id del producto desde los parámetros de consulta
    const id = req.nextUrl.searchParams.get("id");

    // Validar el id
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: "ID inválido o no proporcionado" },
        { status: 400 }
      );
    }

    const productId = parseInt(id, 10); // Convertir id a número

    // Buscar el índice del producto
    const productIndex = productos.findIndex(
      (producto) => producto.id === productId
    );

    // Si no se encuentra el producto
    if (productIndex === -1) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el producto
    const deletedProduct = productos.splice(productIndex, 1)[0]; // Elimina y devuelve el producto

    // Respuesta exitosa
    return NextResponse.json(
      {
        message: "Producto eliminado correctamente",
        data: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud DELETE:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
