import { useState, useEffect } from "react";
import DeleteProductButton from "./DeleteProductButton";
import Image from "next/image";

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   image: string | null;
//   categoryId: number;
// }

interface Category {
  id: number;
  name: string;
}

interface EditProductFormProps {
  productId: string; // Recibe el ID del producto como string
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null as File | null,
    categoryId: 0,
  });

  const [categories, setCategories] = useState<Category[]>([]); // Estado para las categorías
  const [error, setError] = useState<string | null>(null); // Estado para los errores
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  // Fetch de categorías y del producto
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data); // Asumiendo que la respuesta es un array de categorías
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        setError("No se pudieron cargar las categorías.");
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
        );
        const data = await response.json();
        const product = data.data;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image: product.image || "",
          categoryId: product.categoryId, // Asigna la categoría del producto
        });
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false); // Termina de cargar
      }
    };

    fetchCategories();
    fetchProduct();
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value, // Convertimos a número si es "categoryId"
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files[0]) {
      console.log("Imagen seleccionada:", files[0]); // Verificar el archivo

      setFormData((prev) => ({
        ...prev,
        image: files[0], // Guardamos el archivo en el estado
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.name ||
      !formData.description ||
      formData.price <= 0 ||
      formData.stock < 0 ||
      formData.categoryId === 0
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name || "");
    form.append("description", formData.description || "");
    form.append("price", (formData.price || 0).toString());
    form.append("stock", (formData.stock || 0).toString());
    form.append("categoryId", (formData.categoryId || "").toString());
    if (formData.image) {
      form.append("image", formData.image);
    }

    console.log("Datos del formulario a enviar:", formData); // Ver los datos antes de enviarlos

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: "PUT",
          body: form, // Enviar el FormData en lugar de JSON
        }
      );
      const data = await response.json();
      console.log("Respuesta del servidor:", data); // Ver la respuesta del servidor

      if (response.ok) {
        alert("Producto actualizado con éxito");
      } else {
        alert(data.message || "Hubo un error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Hubo un error al actualizar el producto");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contenedor de los detalles del producto */}
      <div className="flex justify-center gap-12 px-6 py-10">
        {/* Imagen del Producto */}
        <div className="w-full max-w-lg p-4 bg-white rounded-xl shadow-2xl overflow-hidden transition-transform transform hover:scale-105">
          <div className="w-full h-[450px] overflow-hidden rounded-xl border border-[#03424a] shadow-xl">
            <Image
              src={
                formData.image
                  ? formData.image instanceof Blob
                    ? URL.createObjectURL(formData.image)
                    : formData.image // Asume que formData.image es una URL
                  : "/images/default-image.jpg"
              }
              alt={formData.name}
              width={500}
              height={500}
            />
          </div>
        </div>

        {/* Detalles editables */}
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl space-y-6">
          <div>
            <label className="block font-semibold">Nombre del Producto</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Descripción</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Imagen</label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Categoría</label>
            <select
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <DeleteProductButton productId={parseInt(productId, 10)} />
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full p-2 bg-indigo-600 text-white rounded-md"
          >
            Actualizar Producto
          </button>
        </div>
      </div>
    </form>
  );
}
