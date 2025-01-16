import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()


async function main() {
  // Crear una categoría primero
  const category = await prisma.category.create({
    data: {
      name: "ropa",
    },
  });

  // Crear un producto vinculado a la categoría
  const newProduct = await prisma.product.create({
    data: {
      name: "Remera",
      price: 22,
      stock: 27,
      updatedAt: new Date(), // Usar un formato válido para DateTime
      categoryId: category.id, // Usar el ID de la categoría creada
    },
  });

  console.log("Categoría y producto creados:");
  console.log({ category, newProduct });
}

main()