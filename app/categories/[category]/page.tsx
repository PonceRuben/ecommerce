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

async function fetchCategories() {
  const response = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error al obtener las categorías");
  }

  const categoriesData = await response.json();

  return categoriesData;
}
export default async function Category({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const res = await params;
  const categoria = decodeURIComponent(res.category || "");

  if (!categoria) {
    return <div>No se ha recibido ninguna categoría válida.</div>;
  }

  const [categoriesResponse, productsResponse] = await Promise.all([
    fetchCategories(),
    fetch("http://localhost:3000/api/products", { cache: "no-store" }),
  ]);

  if (!productsResponse.ok) {
    console.error("Error al obtener los productos");
    return <div>Error al cargar los productos.</div>;
  }

  const categories = categoriesResponse || [];
  const products: productType[] = (await productsResponse.json()).data;
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

          {/* Lista de Categorías dinámicas */}
          <div className="flex justify-center gap-6 mt-8">
            {categories?.length > 0 ? ( // Maneja undefined y null
              categories.map(
                (
                  category: { id: number; name: string } // Añadí el tipo explícito
                ) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                    className="text-white hover:text-[#03424a] transition-colors"
                  >
                    {formatCategoryName(category.name)}
                  </Link>
                )
              )
            ) : (
              <p>No hay categorías disponibles</p>
            )}
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
