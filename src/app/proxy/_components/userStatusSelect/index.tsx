import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserStatusRender } from "@/constants/user";
import { useId, useState } from "react";
import Badge from "../badge/Badge";
import { UserStatusEnum } from "@memory/shared";

interface UserStatusSelectProps {
    select: (status: UserStatusEnum) => void;
    status: UserStatusEnum
}

export default function UserStatusSelect({ select,status }: UserStatusSelectProps) {
    const id = useId();
    const statusOptions = Object.entries(UserStatusEnum).filter(([key, value]) =>
        isNaN(Number(key))
    );

    const handleChange = (value: string) => {
        const selectedStatus = Number(value) as UserStatusEnum;
        select(selectedStatus);
    };

    return (
        <div className="space-y-2 min-w-[280px]">
            <Select onValueChange={handleChange} value={String(status)}>
                <SelectTrigger
                    id={id}
                    className="h-auto ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
                >
                    <SelectValue placeholder="请选择" className="text-slate-700" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                    {statusOptions.map(([key, value]) => (
                        <SelectItem value={String(value)} key={key}> 
                            <Badge {...UserStatusRender[value as UserStatusEnum]} />
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
