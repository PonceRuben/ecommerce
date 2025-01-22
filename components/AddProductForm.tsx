"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

const AddProductForm = () => {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null as File | null,
    categoryId: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();

          // Formatear nombres de categorías
          const formattedCategories = data.map((category: Category) => ({
            ...category,
            name: category.name
              .replace(/-/g, " ")
              .replace(/^./, (char) => char.toUpperCase()),
          }));

          setCategories(
            Array.isArray(formattedCategories) ? formattedCategories : []
          );
        } else {
          console.error("Error al obtener categorías");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Convertir a número si es categoryId
    setProduct((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      // Guardar el archivo en el estado
      setProduct((prev) => ({
        ...prev,
        [name]: files[0], // Guardamos el archivo seleccionado
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());
    formData.append("stock", product.stock.toString());
    formData.append("categoryId", product.categoryId.toString());
    if (product.image) {
      formData.append("image", product.image);
    }

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/editor-dashboard");
    } else {
      console.error("Error al agregar el producto");
    }
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre del Producto
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={product.name}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Precio
        </label>
        <input
          id="price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700"
        >
          Stock
        </label>
        <input
          id="stock"
          name="stock"
          type="number"
          value={product.stock}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Imagen
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700"
        >
          Categoría
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={product.categoryId || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Button type="submit">Agregar Producto</Button>
      </div>
    </form>
  );
};

export default AddProductForm;
