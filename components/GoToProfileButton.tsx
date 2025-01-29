"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const GoToProfileButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session?.user?.id) {
      router.push(`/profile/${session.user.id}`); // Redirige a la página del perfil dinámicamente
    }
  };

  return (
    <div>
      <Button onClick={handleClick} variant="addProduct">
        Ir al Perfil
      </Button>
    </div>
  );
};

export default GoToProfileButton;
