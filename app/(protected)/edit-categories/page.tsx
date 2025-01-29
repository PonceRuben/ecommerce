"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Category {
  id: string;
  name: string;
}

export default function ManageCategories() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      if (response.ok) {
        fetchCategories();
        setNewCategory("");
      } else {
        console.error("Error adding category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategory || !editCategory.name.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      });
      if (response.ok) {
        fetchCategories();
        setEditCategory(null);
      } else {
        console.error("Error updating category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?"))
      return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchCategories();
      } else {
        console.error("Error deleting category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (
    !session ||
    (session?.user?.role !== "admin" && session?.user?.role !== "editor")
  ) {
    return (
      <div className="text-center text-red-500">
        No tienes acceso a esta sección.
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f5f5f5] text-[#02242d] rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Gestionar Categorías</h2>

      {/* Add New Category */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-4 py-2 bg-white text-[#02242d] border border-[#d1d5db] rounded-full focus:outline-none focus:ring-2 focus:ring-[#a1a1aa]"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-[#03424a] text-white rounded-full hover:bg-[#046a6a] transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Añadiendo..." : "Agregar"}
        </button>
      </div>

      {/* Category List */}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
          >
            {editCategory?.id === category.id ? (
              <input
                type="text"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                className="flex-1 px-4 py-2 bg-[#f5f5f5] text-[#02242d] border border-[#d1d5db] rounded-full focus:outline-none focus:ring-2 focus:ring-[#a1a1aa]"
              />
            ) : (
              <span>{category.name}</span>
            )}

            <div className="flex items-center gap-2">
              {editCategory?.id === category.id ? (
                <button
                  onClick={handleEditCategory}
                  className="px-3 py-1 bg-[#03424a] text-white rounded-full hover:bg-[#046a6a] transition-colors"
                >
                  Guardar
                </button>
              ) : (
                <button
                  onClick={() => setEditCategory(category)}
                  className="px-3 py-1 bg-[#03424a] text-white rounded-full hover:bg-[#046a6a] transition-colors"
                >
                  Editar
                </button>
              )}

              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-800 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
