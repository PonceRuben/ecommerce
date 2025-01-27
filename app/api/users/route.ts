import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";

  if (!name.trim()) {
    return NextResponse.json(
      { error: "El parámetro 'name' es requerido." },
      { status: 400 }
    );
  }

  try {
    // Buscar usuarios cuyo nombre coincida parcialmente con la consulta
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
