import SubmitButton from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LowCodeSaveAction } from "@/lib/action"
import { useLowCodeTemplateStore } from "@/stores/lowcode-template"
import { useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { startTransition } from 'react';
import { useLowCodeStore } from "@/stores/lowcode-store"
import dynamic from "next/dynamic"

const ReactJson = dynamic(() => import('react-json-view'), {
  ssr: false, 
});

export default function LowCodeSaveForm() {
  const { components } = useLowCodeStore()
  const { setTemplateTitle, curTemplate } = useLowCodeTemplateStore()
  const [state, action] = useActionState(LowCodeSaveAction, undefined);
  const [isOpen, setOpen] = useState(false)

  const searchParams = useSearchParams();
  
  const templateKey = searchParams.get('template_key'); 

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message)
      setOpen(false)
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('template_json',JSON.stringify(components))
    if (templateKey) {
      formData.append('template_key', templateKey.toString());
    }
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>保存</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Memory LowCode</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template_name" className="text-right">
                模版名称
              </Label>
              <Input
                id="template_name"
                name="template_name"
                value={curTemplate?.template_name || ''}
                onChange={(e) => setTemplateTitle({ template_name: e.target.value })}
                placeholder="请输入..."
                required
                className="col-span-3"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-500">{state.error.template_name}</p>
            )}

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="template_json" className="text-right">
                模版JSON
              </Label>
              <div className="col-span-3 w-full h-[40rem] overflow-auto border rounded-lg p-2 bg-gray-50">
                <ReactJson
                  src={components}
                  collapsed={false}
                  enableClipboard={true}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  style={{ whiteSpace: "pre", overflowX: "auto",minHeight: '100%' }}
                />
              </div>

            </div>
            {state?.error && (
              <p className="text-sm text-red-500">{state.error.template_json}</p>
            )}

            <div className="ml-auto">
              <Button
                onClick={() => setOpen(false)}
                className="mr-2"
                color={'red'}
                type="button"
              >
                取消
              </Button>
              <SubmitButton className="max-w-[max-content] px-4">提交</SubmitButton>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
