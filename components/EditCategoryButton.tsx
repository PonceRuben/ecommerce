"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; //

const EditCategoryButton = () => {
  const router = useRouter(); // Usamos useRouter para poder hacer la redirección

  const handleClick = () => {
    router.push("edit-categories"); // Redirige a la página deseada
  };

  return (
    <div>
      <Button onClick={handleClick} variant="addProduct">
        Editar categoría
      </Button>
    </div>
  );
};

export default EditCategoryButton;
