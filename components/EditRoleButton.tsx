"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const EditRoleButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("edit-role");
  };

  return (
    <div>
      <Button onClick={handleClick} variant="addProduct">
        Editar roles
      </Button>
    </div>
  );
};

export default EditRoleButton;
