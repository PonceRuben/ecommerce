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
    const form = new IncomingForm();
    const reqAsAny: any = req;

    return new Promise((resolve, reject) => {
      form.parse(reqAsAny, async (err: any, fields: any, files: any) => {
        if (err) {
          console.error("Error al procesar el formulario:", err);
          return resolve(
            NextResponse.json(
              { error: "Error processing form" },
              { status: 500 }
            )
          );
        }

        const { name, description, price, stock, categoryId } = fields;

        // Accede a files solo dentro del callback
        const imageFile = files?.image?.filepath;

        if (!imageFile) {
          return resolve(
            NextResponse.json({ error: "No image provided" }, { status: 400 })
          );
        }

        const imagePath = `/images/products/${path.basename(imageFile)}`;

        // Procesa los datos aquí según tus necesidades
        return resolve(
          NextResponse.json({
            message: "Producto agregado correctamente",
            imageUrl: imagePath,
          })
        );
      });
    });
  } catch (error) {
    console.error("Error en la carga de archivos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
