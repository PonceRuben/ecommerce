import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "El nombre de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return NextResponse.json(
      { message: "Hubo un error al crear la categoría" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json(
        { message: "ID y nombre de la categoría son obligatorios" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return NextResponse.json(
      { message: "Hubo un error al actualizar la categoría" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Categoría eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return NextResponse.json(
      { message: "Hubo un error al eliminar la categoría" },
      { status: 500 }
    );
  }
}
