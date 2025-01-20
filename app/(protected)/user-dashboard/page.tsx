import LogoutButton from "@/components/LogoutButton";
import { auth } from "../../../auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  } else
    return (
      <div className="container">
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <LogoutButton></LogoutButton>
      </div>
    );
}
