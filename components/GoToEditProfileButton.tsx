"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const GoToEditProfileButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session?.user?.id) {
      router.push(`/profile/edit/${session.user.id}`); // Redirige a la página de edición del perfil dinámicamente
    }
  };

  return (
    <div>
      <Button onClick={handleClick} variant="addProduct">
        Ir a Editar Perfil
      </Button>
    </div>
  );
};

export default GoToEditProfileButton;
