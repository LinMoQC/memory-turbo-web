import { redirect } from "next/navigation";

// 默认路由
export default function TemplatesPage() {
  return redirect("/proxy/templates/list")
}