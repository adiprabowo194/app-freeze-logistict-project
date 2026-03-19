import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import DashboardToast from "@/components/DashboardToast";

export default async function Dashboard() {
  const cookieStore = await cookies(); // ✅ WAJIB await
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  const user = JSON.parse(session.value);

  return (
    <div>
      <DashboardToast />
      <h1>Dashboard</h1>
      <p>Welcome: {user.email}</p>
      <LogoutButton />
    </div>
  );
}
