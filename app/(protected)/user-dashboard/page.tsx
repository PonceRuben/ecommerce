import LogoutButton from "@/components/LogoutButton";
import { auth } from "../../../auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await auth();
      if (session) {
        setRole(session.user.role); // Guarda el rol del usuario
      }
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Si el rol no es "user", redirige a la página de login o dashboard correspondiente
  if (role !== "user") {
    router.push("/login"); // Redirige a login si el usuario no tiene el rol "user"
    return <div>Redirecting...</div>;
  }

  return (
    <div className="container">
      <pre>{JSON.stringify(role, null, 2)}</pre>
      <LogoutButton />
    </div>
  );
}
