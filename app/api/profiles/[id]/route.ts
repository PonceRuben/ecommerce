import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import Busboy from "busboy";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";

const storage = new Storage({
  keyFilename: "concrete-zephyr-448817-t6-7e930e1aa9e3.json",
});
const bucket = storage.bucket("ecommerce-product-images-ruben-ponce");

const DEFAULT_IMAGE_URL =
  "https://storage.googleapis.com/ecommerce-product-images-ruben-ponce/products/1737988750260-default-image.jpg";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const mappedUser = {
      name: user.name || "No disponible",
      email: user.email || "No disponible",
      image: user.image || DEFAULT_IMAGE_URL,
      address:
        user.addresses.length > 0
          ? user.addresses[0]
          : {
              line1: "No disponible",
              line2: "No disponible",
              city: "No disponible",
              postalCode: "No disponible",
              country: "No disponible",
            },
    };

    return NextResponse.json(
      { message: "Usuario encontrado", data: mappedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Hubo un error al obtener el usuario" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });
    let userData: any = {};
    let imageUrl: string | null = null;
    let addressData: any = {};

    const uploadPromise = new Promise<void>((resolve, reject) => {
      busboy.on("field", (name, value) => {
        userData[name] = value;
      });

      busboy.on("file", (_, file, info) => {
        const { filename, mimeType } = info;
        if (!filename)
          return reject(
            NextResponse.json({ error: "Archivo no válido" }, { status: 400 })
          );

        const gcpFilePath = `users/${Date.now()}-${filename}`;
        const gcpFile = bucket.file(gcpFilePath);

        const stream = gcpFile.createWriteStream({
          metadata: { contentType: mimeType },
          resumable: false,
          public: true,
        });
        file.pipe(stream);

        stream.on("finish", () => {
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcpFilePath}`;
          resolve();
        });

        stream.on("error", (err) => reject(err));
      });

      busboy.on("finish", async () => {
        await uploadPromise;

        addressData = {
          line1:
            userData.line1 || existingUser.addresses[0]?.line1 || "Agregar",
          line2:
            userData.line2 || existingUser.addresses[0]?.line2 || "Agregar",
          city: userData.city || existingUser.addresses[0]?.city || "Agregar",
          postalCode:
            userData.postalCode ||
            existingUser.addresses[0]?.postalCode ||
            "Agregar",
          country:
            userData.country || existingUser.addresses[0]?.country || "Agregar",
        };

        const finalImageUrl =
          imageUrl || existingUser.image || DEFAULT_IMAGE_URL;

        try {
          const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: userData.name || existingUser.name,
              email: userData.email || existingUser.email,
              image: finalImageUrl,
              addresses: {
                upsert: {
                  where: { userId: existingUser.id },
                  update: addressData,
                  create: { ...addressData, userId: existingUser.id },
                },
              },
            },
          });

          return NextResponse.json({
            message: "Usuario actualizado con éxito",
            data: updatedUser,
          });
        } catch (error) {
          return NextResponse.json(
            { error: "Error al modificar el usuario" },
            { status: 500 }
          );
        }
      });
    });

    const nodeStream = Readable.from(req.body as any);
    nodeStream.pipe(busboy);

    await uploadPromise;
    return NextResponse.json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
