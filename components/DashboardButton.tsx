"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const handleRedirect = () => {
    if (!session?.user?.role) {
      return;
    }

    // Redirige según el rol del usuario
    switch (session.user.role) {
      case "admin":
        router.push("/admin-dashboard");
        break;
      case "editor":
        router.push("/editor-dashboard");
        break;
      case "user":
        router.push("/user-dashboard");
        break;
      default:
        router.push("/"); // Redirigir a home o página de error
    }
  };

  return (
    <nav>
      <div>
        <button
          className="hover:text-[#03424a] transition-colors flex items-center"
          onClick={handleRedirect}
        >
          Ir a mi Dashboard
        </button>
      </div>
    </nav>
  );
}
