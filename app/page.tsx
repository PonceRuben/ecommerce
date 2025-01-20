"use client";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/Searchbar";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="justify-items-center  bg-gray-600">
        <SearchBar onSearch={setSearchInput} />
      </div>
      <div className="flex flex-wrap justify-between bg-[#cacdca]">
        <h1>Catálogo</h1>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </>
  );
}
