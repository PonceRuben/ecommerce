import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  categoryId: number;
}

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
    image: "",
    categoryId: 0, // Inicializa la categoría
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    const body = {
      id: productId, // Añadimos el ID del producto
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      image: formData.image,
      categoryId: formData.categoryId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Producto actualizado con éxito");
      } else {
        alert(data.message || "Hubo un error al actualizar el producto");
      }
    } catch (error) {
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
            <img
              src={formData.image || "/images/default-image.jpg"}
              alt={formData.name}
              className="w-full h-full object-cover object-center"
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
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Categoría</label>
            <select
              name="categoryId"
              value={formData.categoryId}
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

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md mt-4"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </form>
  );
}
