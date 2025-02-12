"use client";

import { useState, useEffect } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Product({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { data: session } = useSession();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await params;
        setProductId(resolvedParams.product);
      } catch (e) {
        setError("Failed to load product ID");
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
          {
            cache: "no-store", // No almacena en caché
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos del producto.");
        }

        const responseData = await response.json();
        setProduct(responseData.data);
      } catch (err) {
        setError("Hubo un error al obtener el producto.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) {
    return <div className="text-center text-gray-500">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center text-red-500">
        No se encontró el producto.
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-12">
      {/* Título del Producto */}
      <div className="flex justify-center py-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#02242d] to-[#03424a] text-center shadow-xl tracking-tight">
          {product.name}
        </h1>
      </div>

      {/* Detalles del Producto */}
      <div className="flex justify-center gap-12 px-6 py-10">
        {/* Imagen del Producto */}
        <div className="w-full max-w-lg p-4 bg-white rounded-xl shadow-2xl hover:shadow-3xl overflow-hidden transition-transform transform hover:scale-105">
          <div className="w-full h-[450px] overflow-hidden rounded-xl border border-[#03424a] shadow-xl">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              width={500}
              height={500}
            />
          </div>
        </div>

        {/* Descripción y Precio */}
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl hover:shadow-3xl space-y-6">
          <p className="text-xl text-gray-700">{product.description}</p>
          <div className="flex flex-col justify-between items-start space-y-3">
            <p className="text-3xl font-bold text-[#02242d]">
              Precio: ${product.price}
            </p>
            {/* Mostrar stock */}
            <p className="text-lg text-gray-500">
              <span className="font-semibold text-gray-700">
                Stock disponible:
              </span>{" "}
              {product.stock}
            </p>
          </div>
          {/* Botón de Añadir al Carrito */}
          <AddToCartButton product={product} />
          {/* Condición para mostrar el botón de "Editar Producto" */}
          {session &&
            (session?.user?.role === "admin" ||
              session?.user?.role === "editor") && (
              <Link href={`/products/edit/${product.id}`}>
                <button className="w-full py-3 bg-[#03424a] text-white rounded-full shadow-md hover:shadow-xl hover:bg-[#02242d] transition-all duration-300 mt-2">
                  Editar Producto
                </button>
              </Link>
            )}
        </div>
      </div>
    </div>
  );
}
