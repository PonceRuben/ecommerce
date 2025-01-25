import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Storage } from "@google-cloud/storage";

// Configurar Google Cloud Storage
const storage = new Storage({
  keyFilename: "concrete-zephyr-448817-t6-7e930e1aa9e3.json",
});
const bucket = storage.bucket("ecommerce-product-images-ruben-ponce");

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
        console.log("La part es", part);
        if (part.includes("filename")) {
          // Es un archivo, procesarlo
          const filename = part
            .split("filename=")[1]
            ?.split("\r\n")[0]
            .trim()
            .replace(/"/g, "");
          const fileContent = part.split("\r\n\r\n")[1];
          const cleanFileContent = fileContent.slice(
            0,
            fileContent.lastIndexOf("\r\n--")
          );
          console.log("File content es: ", fileContent);

          // Subir el archivo directamente a Google Cloud Storage
          const gcpFilePath = `products/${filename}`;
          const file = bucket.file(gcpFilePath);

          const buffer = Buffer.from(cleanFileContent, "binary"); // Convertimos el archivo a buffer
          console.log("Buffer length:", buffer.length);
          // Subir el archivo a GCS
          await file.save(buffer, {
            resumable: false,
            public: true,
          });

          // Obtener la URL pública del archivo en GCP
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcpFilePath}`;
          console.log("Generated Image URL:", imageUrl);
        } else {
          const fieldValue = part.split("\r\n\r\n")[1].split("\r\n--")[0];
          productData[fieldName] = fieldValue;
        }
      }
    }

    // Validaciones de los datos
    if (
      !productData.name ||
      typeof productData.name !== "string" ||
      productData.name.trim() === ""
    ) {
      return NextResponse.json(
        {
          error:
            "El nombre del producto es obligatorio y debe ser un texto válido",
        },
        { status: 400 }
      );
    }

    if (
      !productData.price ||
      isNaN(parseFloat(productData.price)) ||
      parseFloat(productData.price) <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "El precio del producto es obligatorio y debe ser un número mayor que cero",
        },
        { status: 400 }
      );
    }

    if (productData.stock && isNaN(parseInt(productData.stock, 10))) {
      return NextResponse.json(
        { error: "El stock debe ser un número válido" },
        { status: 400 }
      );
    }

    if (
      !productData.categoryId ||
      isNaN(parseInt(productData.categoryId, 10))
    ) {
      return NextResponse.json(
        {
          error:
            "El ID de la categoría es obligatorio y debe ser un número válido",
        },
        { status: 400 }
      );
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
