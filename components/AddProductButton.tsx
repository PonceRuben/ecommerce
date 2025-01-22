"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Necesitas importar el hook useRouter

const AddProductButton = () => {
  const router = useRouter(); // Usamos useRouter para poder hacer la redirección

  const handleClick = () => {
    router.push("add-product"); // Redirige a la página deseada
  };

  return (
    <div>
      <Button onClick={handleClick} variant="addProduct">
        Agregar Producto
      </Button>
    </div>
  );
};

export default AddProductButton;
