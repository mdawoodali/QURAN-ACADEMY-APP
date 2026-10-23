import { redirect } from "next/navigation";

export default function DevRedirect() {
  redirect("/admin/diagnostics");
}
