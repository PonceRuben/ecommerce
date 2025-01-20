import { auth } from "../../../auth";
import LogoutButton from "@/components/LogoutButton";

export default async function EditorPage() {
  const session = await auth();

  if (session?.user?.role !== "editor") {
    return <div>You are not an editor</div>;
  } else {
    return (
      <div className="container">
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <LogoutButton></LogoutButton>
      </div>
    );
  }
}
