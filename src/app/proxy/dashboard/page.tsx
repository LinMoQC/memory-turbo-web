import { Metadata } from "next"
import {ProjectTaskStatus} from "../_components/analyze/ProjectTaskStatus"
import {UserBehavior} from "../_components/analyze/UserBehavior"

export const metadata: Metadata = {
    title: 'Memory Flow - 仪表盘',
}

export default function DashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-white shadow-sm border-2 dark:bg-dark" />
                <div className="aspect-video rounded-xl bg-white shadow-sm border-2 dark:bg-dark" />
                <div className="aspect-video rounded-xl bg-white shadow-sm border-2 dark:bg-dark" />
            </div>
            <div className="h-[100vh] flex flex-col lg:flex-row gap-3 flex-1 rounded-xl md:min-h-min">
                <div className="flex-1">
                    <ProjectTaskStatus />
                </div>
                <div className="flex-1">
                    <UserBehavior />
                </div>
            </div>
        </div>
    )
}
