import productType from "@/app/types/products";
import ProductCard from "../../../components/ProductCard";
import Link from "next/link";

export default async function Categoria({
  params, //esto es la categoria que voy a recibir, es decir, en la URL(lo que esta entre corchetes)
}: {
  params: { categoria: string }; //aca estoy diciendo que ese param va a ser una categoria qu es un stream
}) {
  const categoria = decodeURIComponent(params.categoria); // Decodifica la categoría
  const response = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store", // Asegura que la solicitud no se almacene en caché
  }); // el fetch hace la peticion y me devuelve un json
  const products: productType[] = await response.json(); // agregamos productType como unu tipo en la carpeta types y el response.json convierte el json a un objeto

  const filteredProducts = products.filter(
    (product) => product.category === categoria
  );

  return (
    <>
      <div className="bg-[#cacdca]">
        <h1>Categorías</h1>
        <ul>
          <li>
            <Link href="/categorias/men's clothing">Men's Clothing</Link>
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
              image={product.image}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </>
  );
}
