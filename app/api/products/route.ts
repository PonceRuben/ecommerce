import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

// Configurar formidable
const form = new IncomingForm({
  // Configuración del directorio de carga
  uploadDir: path.join(process.cwd(), "public/images/products"),
  // Permitir el mantenimiento de las extensiones del archivo
  keepExtensions: true,
  // Limitar el tamaño del archivo cargado
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  filename: (name, ext, part, form) => {
    // Crear un nombre único para el archivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return `${uniqueSuffix}${ext}`;
  },
});

export const config = {
  api: {
    bodyParser: false, // Desactivar el parser de cuerpo de Next.js
  },
};

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
}

type Response = {
  message: string;
  data: Product[] | Product;
};

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    const mappedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category?.name,
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
    // Obtener el cuerpo de la solicitud como texto
    const body = await req.text();
    const boundary = req.headers.get("content-type")?.split("boundary=")[1];

    if (!boundary) {
      return NextResponse.json({ error: "No boundary found" }, { status: 400 });
    }

    // Dividir el cuerpo en partes usando el boundary
    const parts = body.split(`--${boundary}`).filter(Boolean);

    let productData: any = {};
    let imageUrl: string | null = null;

    for (let part of parts) {
      if (part.includes("Content-Disposition")) {
        const contentDisposition = part.split("\r\n")[1];
        const fieldName = contentDisposition.split('name="')[1]?.split('"')[0];

        if (part.includes("filename")) {
          // Es un archivo, procesarlo
          const filename = part
            .split("filename=")[1]
            ?.split("\r\n")[0]
            .trim()
            .replace(/"/g, "");
          const fileContent = part.split("\r\n\r\n")[1].split("\r\n--")[0];
          const filePath = path.join(
            process.cwd(),
            "public",
            "images",
            "products",
            filename
          );

          // Guardar archivo en el sistema
          fs.writeFileSync(filePath, fileContent, "binary");

          imageUrl = `images/products/${filename}`;
        } else {
          // Es un campo de formulario (texto, número, etc.)
          const fieldValue = part.split("\r\n\r\n")[1].split("\r\n--")[0];
          productData[fieldName] = fieldValue;
        }
      }
    }

    // Guardar producto en la base de datos
    if (productData.name && productData.price && imageUrl) {
      const newProduct = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock, 10),
          image: imageUrl,
          categoryId: parseInt(productData.categoryId, 10),
        },
      });

      return NextResponse.json({
        message: "Producto agregado con éxito",
        data: newProduct,
      });
    } else {
      return NextResponse.json(
        { error: "Faltan datos del producto" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// export async function PUT(req: NextRequest) {
//   try {
//     const id = req.nextUrl.searchParams.get("id");

//     if (!id || isNaN(Number(id))) {
//       return NextResponse.json(
//         { message: "ID inválido o no proporcionado" },
//         { status: 400 }
//       );
//     }

//     const body = await req.json();

//     if (
//       !body.name ||
//       !body.price ||
//       typeof body.name !== "string" ||
//       typeof body.price !== "number"
//     ) {
//       return NextResponse.json(
//         {
//           message:
//             "Datos inválidos. Se requiere 'name' (string) y 'price' (number).",
//         },
//         { status: 400 }
//       );
//     }

//     const updatedProduct = await prisma.product.update({
//       where: { id: Number(id) },
//       data: {
//         name: body.name,
//         price: body.price,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Producto actualizado con éxito",
//         data: updatedProduct,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error al actualizar el producto:", error);
//     return NextResponse.json(
//       { message: "Hubo un error al actualizar el producto" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const id = req.nextUrl.searchParams.get("id");

//     if (!id || isNaN(Number(id))) {
//       return NextResponse.json(
//         { message: "ID inválido o no proporcionado" },
//         { status: 400 }
//       );
//     }

//     const productId = parseInt(id, 10);

//     const deletedProduct = await prisma.product.delete({
//       where: { id: productId },
//     });

//     return NextResponse.json(
//       {
//         message: "Producto eliminado correctamente",
//         data: deletedProduct,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error al procesar la solicitud DELETE:", error);
//     return NextResponse.json(
//       { message: "Error al procesar la solicitud" },
//       { status: 500 }
//     );
//   }
// }
