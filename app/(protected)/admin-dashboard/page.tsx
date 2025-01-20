import { auth } from "../../../auth";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return <div>You are not admin</div>;
  } else
    return (
      <div className="container">
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <LogoutButton></LogoutButton>
      </div>
    );
}
