import { Metadata } from "next"
import LowCodeTemplateList from "./_components/LowCodeTemplates"

export const metadata: Metadata = {
  title: 'Memory Flow - 模版列表',
}

export default async function LowCodeTemplatePage() {
  return (
    <div className="w-full">
      <LowCodeTemplateList/> 
    </div>
  )
}
