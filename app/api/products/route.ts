import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Storage } from "@google-cloud/storage";
import Busboy from "busboy";
import { Readable } from "stream";

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

export async function GET() {
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
      { message: "Hubo un error al obtener los productos", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });

    const productData: any = {};
    let imageUrl: string | null = null;

    // Promesa para la carga de archivo
    const uploadPromise = new Promise<void>((resolve, reject) => {
      busboy.on("field", (name, value) => {
        productData[name] = value;
      });

      busboy.on("file", (_, file, info) => {
        console.log("Archivo recibido:", info.filename);
        const { filename, mimeType } = info;

        if (!filename) {
          console.log("No se ha recibido un archivo.");
          return reject(
            NextResponse.json({ error: "Archivo no válido" }, { status: 400 })
          );
        }

        const gcpFilePath = `products/${Date.now()}-${filename}`;
        const gcpFile = bucket.file(gcpFilePath);

        console.log(`Subiendo archivo a GCP: ${gcpFilePath}`);

        const stream = gcpFile.createWriteStream({
          metadata: { contentType: mimeType },
          resumable: false,
          public: true,
        });

        file.pipe(stream);

        stream.on("finish", async () => {
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcpFilePath}`;
          console.log("Archivo subido exitosamente a GCP");
          console.log("URL de la imagen:", imageUrl);
          resolve(); // Resolver la promesa después de que la imagen se haya subido correctamente
        });

        stream.on("error", (err) => {
          console.error("Error al subir archivo a GCP:", err);
          reject(err); // Rechazar la promesa si hubo un error
        });
      });

      busboy.on("finish", async () => {
        console.log("Finish de busboy alcanzado");

        // Esperar que la promesa de la imagen se haya resuelto
        await uploadPromise;

        // Verifica si la URL se asignó correctamente
        if (!imageUrl) {
          console.log("URL de la imagen no asignada.");
          return reject(
            NextResponse.json(
              { error: "Error al procesar la imagen" },
              { status: 400 }
            )
          );
        }

        console.log("Datos del producto recibidos:", productData);
        console.log("URL de la imagen:", imageUrl);

        if (!productData.name || !productData.price || !imageUrl) {
          return reject(
            NextResponse.json(
              { error: "Faltan datos del producto" },
              { status: 400 }
            )
          );
        }

        try {
          // Crear el producto en la base de datos
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

          console.log("Producto agregado:", newProduct);

          // Devuelve la respuesta aquí, fuera de la promesa
          return NextResponse.json({
            message: "Producto agregado con éxito",
            data: newProduct,
          });
        } catch (error) {
          console.error("Error al agregar el producto:", error);
          return NextResponse.json(
            { error: "Error al agregar el producto" },
            { status: 500 }
          );
        }
      });
    });

    // Convierte el ReadableStream de Web API a un Readable Stream de Node.js
    const nodeStream = Readable.from(req.body as any);

    // Pasa el stream convertido a busboy
    nodeStream.pipe(busboy);

    // Espera a que se complete la carga
    await uploadPromise;

    console.log("Promesa de carga completada con éxito.");

    // Si llega aquí y todo ha sido exitoso, se puede devolver la respuesta
    return NextResponse.json({
      message: "Producto agregado con éxito",
      data: productData, // Devolver los datos del producto si no hubo un error
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
// Primero lo que hace es chequear el header content-type, si eso falla, tira 400.
// Despues empieza el proceso de busboy para subir la imagen a GCP y devolver la URL. Si eso falla, tira 500.
// Se espera a que la imagen se termine de subir con checkImageUrl.
// Si falta el name, price o foto, tira 400.
// Si nada de eso falló, crea el producto en tu db. Devuelve 201
