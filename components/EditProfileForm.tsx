import Image from "next/image";
import { useState, useEffect } from "react";

interface EditProfileFormProps {
  userId: string; // Recibe el ID del usuario como string
}

export default function EditProfileForm({ userId }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postalCode: "",
    photo: null as File | null,
  });

  const [error, setError] = useState<string | null>(null); // Estado para los errores
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  // Fetch del perfil
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${userId}`);
        const data = await response.json();
        const user = data.data;

        setFormData({
          name: user.name,
          email: user.email,
          addressLine1: user.address?.line1 || "",
          addressLine2: user.address?.line2 || "",
          city: user.address?.city || "",
          country: user.address?.country || "",
          postalCode: user.address?.postalCode || "",
          photo: user.photo || "", // Asignar foto si existe
        });
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false); // Termina de cargar
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        photo: files[0], // Guardamos la foto en el estado
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.name || !formData.email) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("addressLine1", formData.addressLine1 || "");
    form.append("addressLine2", formData.addressLine2 || "");
    form.append("city", formData.city || "");
    form.append("country", formData.country || "");
    form.append("postalCode", formData.postalCode || "");
    if (formData.photo) {
      form.append("photo", formData.photo);
    }

    try {
      const response = await fetch(`/api/profiles/${userId}`, {
        method: "PUT",
        body: form, // Enviar el FormData en lugar de JSON
      });
      const data = await response.json();

      if (response.ok) {
        alert("Perfil actualizado con éxito");
      } else {
        alert(data.message || "Hubo un error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un error al actualizar el perfil");
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
      <div className="flex justify-center gap-12 px-6 py-10">
        <div className="w-full max-w-lg p-4 bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="w-full h-[450px] overflow-hidden rounded-xl border border-[#03424a] shadow-xl">
            <Image
              src={
                formData.photo
                  ? formData.photo instanceof Blob
                    ? URL.createObjectURL(formData.photo)
                    : formData.photo // Asume que formData.photo es una URL
                  : "https://storage.googleapis.com/ecommerce-product-images-ruben-ponce/products/1737988750260-default-image.jpg"
              }
              alt={formData.name}
              width={500}
              height={500}
            />
          </div>
        </div>

        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl space-y-6">
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Dirección Línea 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1 || "Agregar"}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Dirección Línea 2</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2 || "Agregar"}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city || "Agregar"}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">País</label>
            <input
              type="text"
              name="country"
              value={formData.country || "Agregar"}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Código Postal</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode || "Agregar"}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold">Foto</label>
            <input
              type="file"
              name="photo"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-indigo-600 text-white rounded-md"
          >
            Actualizar Perfil
          </button>
        </div>
      </div>
    </form>
  );
}
