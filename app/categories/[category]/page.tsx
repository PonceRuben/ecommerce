import productType from "@/app/types/products";
import ProductCard from "../../../components/ProductCard";
import Link from "next/link";

export default async function Category({
  params, //esto es la categoria que voy a recibir, es decir, en la URL(lo que esta entre corchetes)
}: {
  params: { category: string }; //aca estoy diciendo que ese param va a ser una categoria qu es un stream
}) {
  const res = await params; // Resuelve la Promise

  const categoria = decodeURIComponent(res.category || ""); // Decodifica la categoría
  console.log("Categoría recibida desde la URL:", categoria);

  if (!categoria) {
    return <div>No se ha recibido ninguna categoría válida.</div>;
  }

  const response = await fetch(`http://localhost:3000/api/products`, {
    cache: "no-store", // Asegura que la solicitud no se almacene en caché
  }); // el fetch hace la peticion y me devuelve un json

  if (!response.ok) {
    // Maneja errores en la solicitud
    console.error("Error al obtener los productos");
    return <div>Error al cargar los productos.</div>;
  }

  const jsonResponse = await response.json();
  const products: productType[] = jsonResponse.data;
  console.log(products);

  const filteredProducts = products.filter(
    (product) => product.category === categoria
  );

  return (
    <>
      <div className="bg-[#cacdca]">
        <h1>Categorías</h1>
        <ul>
          <li>
            <Link href="/categories/ropa-de-hombre">Ropa de hombre</Link>
            {/*aca estoy diciendo que la categoria que tiene que ser igual al category traido del producto tiene que ser men's clothing */}
          </li>
          <li>
            <Link href="/categorias/jewelery">Jewelery</Link>
          </li>
          <li>
            <Link href="/categorias/electronics">Electronics</Link>
          </li>
          <li>
            <Link href="/categorias/women's clothing">Women's Clothing</Link>
          </li>
        </ul>
      </div>

      <div>
        <div className="flex flex-wrap justify-between bg-[#cacdca]">
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              image={
                product.image
                  ? `/images/products/${product.image}`
                  : "/images/default-image.jpg"
              }
              title={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </>
  );
}
