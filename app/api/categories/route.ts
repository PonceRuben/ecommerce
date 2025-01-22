import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return new Response(
      JSON.stringify({ message: "Hubo un error al obtener las categorías" }),
      { status: 500 }
    );
  }
}
