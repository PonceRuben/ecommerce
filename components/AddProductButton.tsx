"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AddProductButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("add-product");
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
