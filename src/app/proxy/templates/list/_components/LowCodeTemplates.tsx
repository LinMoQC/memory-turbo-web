'use client'

import React, { Fragment, startTransition, useEffect, useState, useTransition } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, Edit, MoreHorizontal, SquarePlus, Trash, Send, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LowCodeTemplateType } from "@/types/editor"
import dayjs from "dayjs"
import Loading from "../loading"
import { useRouter } from "next/navigation"
import ApprovalFlow from "./ApprovalFlow"
import { templateStatus, templateStatusRender } from "@/constants/templateSatus"
import SubmitDialog from "./SubmitDialog"
import { useLowCodeTemplateStore } from "@/stores/lowcode-template"
import DeletDialog from "./DeletDialog"
import useInit from "@/hooks/useInit"
import Badge from "@/app/proxy/_components/badge/Badge"
import EmptyState from "@/app/common/Empty"

export default function LowCodeTemplateList() {
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'updated_at', desc: true },
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const { templateList } = useLowCodeTemplateStore()
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [isLoading, setIsLoading] = useState(true); 
    const { initTemplateList } = useInit()
    const router = useRouter()
    const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [curTemplateKey, setCurTemplateKey] = useState<string>('')
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({})

    // 审批流展开
    const handleToggleRow = (rowId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }))
    }

    // 删除弹窗
    const handleDelete = (templateKey: string) => {
        setCurTemplateKey(templateKey)
        setDeleteDialogOpen(true)
    }

    // 提交审批弹窗
    const handleSubmit = (templateKey: string) => {
        setCurTemplateKey(templateKey)
        setSubmitDialogOpen(true)
    }

    // 编辑
    const handleEdit = (key: string) => {
        router.push(`/proxy/templates/create?template_key=${key}`)
    }

    // 新建
    const handleNew = () => {
        router.push(`/proxy/templates/create`)
    }

    const columns: ColumnDef<LowCodeTemplateType>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "template_name",
            header: "模版名称",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("template_name")}</div>
            ),
        },
        {
            accessorKey: "username",
            header: "创建者",
            cell: ({ row }) => <div>{row.getValue("username")}</div>,
        },
        {
            accessorKey: "status",
            header: "状态",
            cell: ({ row }) => {
                const status = row.getValue("status") as templateStatus;
                return (
                    <div className={`max-w-max rounded-xl`}>
                        <Badge {...templateStatusRender[status]} />
                    </div>
                )
            },
        },
        {
            accessorKey: "created_at",
            header: "创建时间",
            cell: ({ row }) => (
                <div>{dayjs(row.getValue("created_at")).format("YYYY-MM-DD HH:mm:ss")}</div>
            ),
        },
        {
            accessorKey: "updated_at",
            header: "最后更新",
            sortingFn: (rowA, rowB, columnId) => {
                const a = new Date(rowA.getValue(columnId));
                const b = new Date(rowB.getValue(columnId));
                return a.getTime() - b.getTime();
            },
            cell: ({ row }) => (
                <div>{dayjs(row.getValue("updated_at")).format("YYYY-MM-DD HH:mm:ss")}</div>
            ),
        },
        {
            id: "actions",
            header: "操作",
            enableHiding: false,
            cell: ({ row }) => {
                const template = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(template.template_key)}>
                                <Edit className="mr-1" size={16} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(template.template_key)}>
                                <Trash className="mr-1" size={16} /> Delete
                            </DropdownMenuItem>
                            {template.status === templateStatus.DRAFT && <Fragment>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleSubmit(template.template_key)}>
                                    <Send className="mr-1" size={16} /> Submit
                                </DropdownMenuItem>
                            </Fragment>}

                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        },
        {
            id: "flow",
            header: "审批流",
            enableHiding: false,
            cell: ({ row }) => {
                const project = row.original
                return (
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => handleToggleRow(row.id)}
                    >
                        {expandedRows[row.id] ? (
                            <ChevronUp />
                        ) : (
                            <ChevronDown />
                        )}
                    </Button>
                )
            }
        },
    ]

    useEffect(() => {
        startTransition(async () => {
            setIsLoading(true)
            await initTemplateList()
            setIsLoading(false)
        })
    }, [])

    const table = useReactTable({
        data: templateList,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <>
            <div className="flex items-center justify-between py-4 gap-x-3">
                <div className="flex gap-2 flex-1">
                    {(!isLoading) ? <Input
                        placeholder="Filter project by template_name..."
                        value={(table.getColumn("template_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("template_name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    /> : <div className="w-full animate-pulse flex flex-col space-y-4">
                        <div className="bg-gray-200 h-6 rounded-md w-full"></div></div>}
                    {(!isLoading) ? <Input
                        placeholder="Filter project by username..."
                        value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("username")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    /> : <div className="w-full animate-pulse flex flex-col space-y-4">
                        <div className="bg-gray-200 h-6 rounded-md w-full"></div></div>}
                </div>
                <DropdownMenu>
                    <div className="flex gap-2">

                        <Button variant="outline" className="ml-auto" onClick={handleNew}>
                            <SquarePlus />New
                        </Button>

                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loading />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow className="border-t transition-all hover:bg-muted">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {expandedRows[row.id] && (
                                        <TableRow>
                                            <TableCell colSpan={row.getVisibleCells().length}>
                                                <div className="w-full h-[200px]">
                                                    <ApprovalFlow status={row.getValue("status")} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            // 数据加载完成但为空时，显示空状态
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <EmptyState
                                        icon={<Inbox className="w-12 h-12 text-gray-400" />}
                                        title="没有数据"
                                        description="模版目前是空的"
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getRowModel().rows.length} Rows
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Prev
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <SubmitDialog isOpen={submitDialogOpen} setOpen={setSubmitDialogOpen} templateKey={curTemplateKey} />
            <DeletDialog isOpen={deleteDialogOpen} setOpen={setDeleteDialogOpen} templateKey={curTemplateKey} />
        </>
    )
}
