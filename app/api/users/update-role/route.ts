import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, roleName } = await req.json();

    if (!userId || !roleName) {
      return NextResponse.json(
        { message: "Faltan datos: userId o roleName" },
        { status: 400 }
      );
    }

    // Buscar el rol por su nombre
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      return NextResponse.json(
        { message: "El rol especificado no existe" },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya tiene este rol
    const userRole = await prisma.user_Role.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
    });

    if (userRole) {
      // Si el rol ya está asignado, no hacemos nada
      return NextResponse.json(
        { message: "El usuario ya tiene este rol" },
        { status: 200 }
      );
    }

    // Si el rol no está asignado, lo creamos
    await prisma.user_Role.create({
      data: {
        userId,
        roleId: role.id,
      },
    });

    return NextResponse.json(
      { message: "Rol actualizado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    return NextResponse.json(
      { message: "Hubo un error al actualizar el rol" },
      { status: 500 }
    );
  }
}
