import { redirect } from "next/navigation";

export default function LegacyProjectBoardRedirect() {
  redirect("/dashboard/projects");
}
