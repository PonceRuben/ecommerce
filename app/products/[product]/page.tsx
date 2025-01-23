export default async function Product({
  params,
}: {
  params: { product: string };
}) {
  const productId = params.product;

  if (!productId) {
    return (
      <div className="text-center text-red-500">
        No se ha recibido ningún ID válido.
      </div>
    );
  }

  // Realiza la petición para obtener los datos del producto
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
    {
      cache: "no-store", // No almacena en caché
    }
  );

  if (!response.ok) {
    console.error("Error en el fetch:", response.statusText);
    return (
      <div className="text-center text-red-500">
        Error al obtener los datos del producto.
      </div>
    );
  }

  const responseData = await response.json();
  const product = responseData.data;

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
            <img
              src={`/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Descripción y Precio */}
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl hover:shadow-3xl space-y-6">
          <p className="text-xl text-gray-700">{product.description}</p>{" "}
          {/* Aumenté el tamaño de la descripción */}
          <div className="flex flex-col justify-between items-start space-y-3">
            {" "}
            {/* Cambié el layout para poner el stock abajo */}
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
          <button className="w-full py-3 bg-[#03424a] text-white rounded-full shadow-md hover:shadow-xl hover:bg-[#02242d] transition-all duration-300">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
