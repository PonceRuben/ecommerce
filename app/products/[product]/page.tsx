import productType from "@/app/types/products";
import Link from "next/link";

export default async function Product({
  params,
}: {
  params: { product: string };
}) {
  const productId = params.product;

  console.log("Id del producto:", productId);

  if (!productId) {
    return <div>No se ha recibido ningún ID válido.</div>;
  }

  // Realiza la petición para obtener los datos del producto
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
    {
      cache: "no-store", // No almacena en caché
    }
  );
  console.log("Estado de la respuesta:", response.status);

  if (!response.ok) {
    console.error("Error en el fetch:", response.statusText);
    return <div>Error al obtener los datos del producto.</div>;
  }

  const responseData = await response.json();
  const product = responseData.data;
  console.log("Producto obtenido", product);

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Título del Producto */}
      <div className="flex justify-center py-6">
        <h1 className="text-4xl font-extrabold text-[#02242d] text-center shadow-md">
          {product.name}
        </h1>
      </div>

      {/* Detalles del Producto */}
      <div className="flex justify-center gap-10 px-6 py-8">
        {/* Imagen del Producto */}
        <div className="w-full max-w-lg p-4 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="w-full h-[400px] overflow-hidden rounded-xl border border-[#03424a] shadow-lg">
            <img
              src={`/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform transform hover:scale-105"
            />
          </div>
        </div>

        {/* Descripción y Precio */}
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
          <p className="text-lg text-gray-700 mt-2">{product.description}</p>
          <div className="flex justify-between items-center mt-6">
            <p className="text-3xl font-bold text-[#02242d]">
              ${product.price}
            </p>
            {/* Botón de Añadir al Carrito */}
            <button className="px-6 py-3 bg-[#03424a] text-white rounded-full hover:bg-[#02242d] transition-colors duration-300">
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
