import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import Busboy from "busboy";
import { Storage } from "@google-cloud/storage";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    console.log("ID recibido en la API:", productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });

    if (!product) {
      console.log("Producto no encontrado");
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

    console.log("Producto encontrado:", mappedProduct);
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      console.log("Tipo de contenido inválido:", contentType);
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });
    console.log(
      "Inicializando busboy con headers:",
      req.headers.get("content-type")
    );

    const productData: any = {};
    let imageUrl: string | null = null;

    const uploadPromise = new Promise<void>((resolve, reject) => {
      busboy.on("field", (name, value) => {
        console.log(`Campo recibido: ${name} = ${value}`);
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

        console.log("Subiendo archivo a GCP:", `${gcpFilePath}`);

        const stream = gcpFile.createWriteStream({
          metadata: { contentType: mimeType },
          resumable: false,
          public: true,
        });

        file.pipe(stream);

        stream.on("finish", async () => {
          console.log("Finalizando busboy...");
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcpFilePath}`;
          resolve();
        });

        stream.on("error", (err) => {
          console.error("Error al subir archivo a GCP:", err);
          reject(err);
        });
      });

      busboy.on("finish", async () => {
        const existingProduct = await prisma.product.findUnique({
          where: { id: parseInt(id, 10) },
        });

        if (!existingProduct) {
          return reject(
            NextResponse.json(
              { error: "Producto no encontrado" },
              { status: 404 }
            )
          );
        }

        await uploadPromise;

        if (!imageUrl) {
          console.log("URL de la imagen no asignada.");
          return reject(
            NextResponse.json(
              { error: "Error al procesar la imagen" },
              { status: 400 }
            )
          );
        }

        if (!productData.name || !productData.price || !imageUrl) {
          console.log("Faltan datos del producto.");
          return reject(
            NextResponse.json(
              { error: "Faltan datos del producto" },
              { status: 400 }
            )
          );
        }
        console.log("Datos recibidos:", productData);
        console.log("Producto existente:", existingProduct);
        try {
          const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id, 10) },
            data: {
              name: productData.name ?? existingProduct.name,
              description:
                productData.description ?? existingProduct.description,
              price: productData.price
                ? parseFloat(productData.price)
                : existingProduct.price,
              stock: productData.stock
                ? parseInt(productData.stock, 10)
                : existingProduct.stock,
              image: imageUrl ?? existingProduct.image,
              categoryId: productData.categoryId
                ? parseInt(productData.categoryId, 10)
                : existingProduct.categoryId,
            },
          });

          return NextResponse.json({
            message: "Producto modificado con éxito",
            data: updatedProduct,
          });
        } catch (error) {
          console.error("Error al modificar el producto:", error);
          return NextResponse.json(
            { error: "Error al modificar el producto" },
            { status: 500 }
          );
        }
      });
    });
    console.log("Cuerpo de la solicitud:", req.body);
    const nodeStream = Readable.from(req.body as any);
    console.log("Cuerpo del request como stream:", req.body);

    nodeStream.pipe(busboy);

    return NextResponse.json({
      message: "Producto actualizado con éxito",
      data: productData,
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      console.log("ID de producto no proporcionado");
      return NextResponse.json(
        { message: "ID de producto es obligatorio" },
        { status: 400 }
      );
    }

    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      console.log("ID de producto no es válido:", id);
      return NextResponse.json(
        { message: "ID de producto no es válido" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    console.log("Producto eliminado correctamente");
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
