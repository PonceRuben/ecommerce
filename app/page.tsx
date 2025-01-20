"use client";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/Searchbar";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.data);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="justify-items-center bg-gray-600">
        <SearchBar onSearch={setSearchInput} />
      </div>
      <div className="bg-[#cacdca] min-h-screen">
        {" "}
        {/* Asegura el fondo gris incluso cuando no haya productos */}
        {/* Título del Catálogo */}
        <div className="flex justify-center py-6">
          <h1 className="text-4xl font-bold text-[#02242d] text-center shadow-lg">
            Catálogo
          </h1>
        </div>
        {/* Productos filtrados */}
        <div className="flex flex-wrap justify-center gap-4 py-6">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-lg text-[#02242d]">
              No hay productos disponibles
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={
                  product.image
                    ? `${product.image}`
                    : "/images/default-image.jpg"
                }
                title={product.name}
                price={product.price}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
