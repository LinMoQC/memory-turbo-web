'use client'

import { approveRequest, getAllPendings, rejectRequest } from "@/lib/action"
import { LowcodeTemplate } from "@/types/template"
import { Fragment, useEffect, useState } from "react"
import { Check, Inbox, X } from "lucide-react";
import { templateStatus, templateStatusRender } from "@/constants/templateSatus";
import { Button } from "@/components/ui/button";
import ReviewSkeleton from "./ReviewSkeleton";
import Image from 'next/image';
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/stores/global-loading";
import ReviewFooter from "./ReviewFooter";
import Badge from "@/app/proxy/_components/badge/Badge";
import EmptyState from "@/app/common/Empty";

export default function ReviewList() {
    const [templatePendings, setTemplatePendings] = useState<LowcodeTemplate[]>([])
    const [hasNext, setHasNext] = useState<boolean>(false)
    const page = useSearchParams().get('page')

    const { isLoading } = useLoadingStore();

    const router = useRouter()

    useEffect(() => {
        init()
    }, [page])

    async function init() {
        const { templates, hasNext } = await getAllPendings(!page ? 1 : Number(page))
        setTemplatePendings(templates)
        setHasNext(hasNext)
    }

    function goToTemplate(key: string) {
        router.push(`/proxy/templates/create?template_key=${key}`)
    }

    //  审批通过
    const handleApprove = async (key: string) => {
        try {
            await approveRequest(key),
                await init()
        } catch (error) {
            console.error('审批请求出错:', error);
        }
    };

    //   审批拒绝
    const handleReject = async (key: string) => {
        try {
            await Promise.all([
                rejectRequest(key),
                init()
            ]);
        } catch (error) {
            console.error('驳回请求出错:', error);
        }
    };


    if (isLoading()) return <ReviewSkeleton />

    return <div className="space-y-6 relative">
        {templatePendings.length > 0 ? templatePendings.map((item) => (
            <Fragment key={item.template_key}>
                <div
                    key={item.id}
                    className="bg-white dark:bg-dark cursor-pointer p-6 rounded-xl shadow-lg flex justify-between transition-all duration-300 transform hover:scale-102 hover:shadow-xl hover:bg-gray-100"
                    onClick={() => goToTemplate(item.template_key)}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start space-y-2">
                            <span className="font-semibold">模版名称：{item.template_name}</span>
                            <div className="flex items-center gap-3">
                                <Image
                                    className="rounded-full"
                                    src={item.user.avatar}
                                    alt={item.username}
                                    width={40}
                                    height={40}
                                />
                                <div>
                                    <span className="block font-medium">{item.username}</span>
                                    <span className="block text-sm text-muted-foreground">{item.user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 justify-between">
                            <span className="font-semibold" style={{ fontSize: '15px' }}>{dayjs(item.updated_at).format("YYYY-MM-DD")}</span>
                            <Badge {...templateStatusRender[item.status]} />
                        </div>
                        {item.status === templateStatus.PENDING && (
                            <div className="flex justify-end mt-4 space-x-4" key={item.template_key}>
                                <Button
                                    variant={'outline'}
                                    className="bg-[#86EFAC] text-[#166534]] hover:bg-[#78e5a0] dark:text-[#166534]]"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleApprove(item.template_key)
                                    }}
                                >
                                    <Check /> 通过
                                </Button>
                                <Button
                                    variant={'outline'}
                                    className="bg-[#FECACA] text-[#B91C1C] hover:bg-[#efbbbb]"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleReject(item.template_key)
                                    }}
                                >
                                    <X /> 拒绝
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Fragment>
        )) : <EmptyState
            icon={<Inbox className="w-12 h-12 text-gray-400" />}
            title="没有数据"
            description="待审批模版目前是空的"
        />}

        <ReviewFooter page={page} hasNext={hasNext} />
    </div>
}