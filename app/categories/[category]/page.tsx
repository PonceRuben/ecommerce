import productType from "@/app/types/products";
import ProductCard from "../../../components/ProductCard";
import Link from "next/link";

function formatCategoryName(category: string) {
  const categoryWithoutHyphens = category.replace(/-/g, " ");
  return (
    categoryWithoutHyphens.charAt(0).toUpperCase() +
    categoryWithoutHyphens.slice(1).toLowerCase()
  );
}

export default async function Category({
  params, // esto es la categoría que voy a recibir, es decir, en la URL (lo que está entre corchetes)
}: {
  params: { category: string }; // acá estoy diciendo que ese param va a ser una categoría que es un string
}) {
  const res = await params; // Resuelve la Promise

  const categoria = decodeURIComponent(res.category || ""); // Decodifica la categoría

  if (!categoria) {
    return <div>No se ha recibido ninguna categoría válida.</div>;
  }

  const response = await fetch(`http://localhost:3000/api/products`, {
    cache: "no-store", // Asegura que la solicitud no se almacene en caché
  }); // El fetch hace la petición y me devuelve un JSON

  if (!response.ok) {
    // Maneja errores en la solicitud
    console.error("Error al obtener los productos");
    return <div>Error al cargar los productos.</div>;
  }

  const jsonResponse = await response.json();
  const products: productType[] = jsonResponse.data;

  const filteredProducts = products.filter(
    (product) => product.category === categoria
  );

  return (
    <>
      {/* Encabezado de la Categoría */}
      <div className="bg-[#02242d] text-white py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
            Productos de la Categoría:{" "}
            <span className="text-[#03424a]">
              {formatCategoryName(categoria)}
            </span>
          </h1>
          {/* Lista de Categorías */}
          <div className="flex justify-center gap-6 mt-8">
            <Link
              href="/categories/ropa-de-hombre"
              className="text-white hover:text-[#03424a] transition-colors"
            >
              Ropa de hombre
            </Link>
            <Link
              href="/categories/ropa-de-mujer"
              className="text-white hover:text-[#03424a] transition-colors"
            >
              Ropa de mujer
            </Link>
            <Link
              href="/categories/electronics"
              className="text-white hover:text-[#03424a] transition-colors"
            >
              Electrónica
            </Link>
            {/* Agrega más enlaces de categorías si es necesario */}
          </div>
        </div>
      </div>

      {/* Contenedor de Productos */}
      <div className="bg-[#f0f4f8] py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex flex-wrap justify-between">
            {filteredProducts.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="w-full sm:w-[48%] lg:w-[30%] xl:w-[22%] my-6"
              >
                <ProductCard
                  image={
                    product.image ? product.image : "/images/default-image.jpg"
                  }
                  title={product.name}
                  price={product.price}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
