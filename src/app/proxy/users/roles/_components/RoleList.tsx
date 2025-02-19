'use client'

import React, { useEffect, useState, useTransition } from "react"
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
import { ChevronDown, Edit, MoreHorizontal, Trash } from "lucide-react"
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { RolesRender } from "@/constants/user"
import Loading from "../loading"
import { Roles } from "@memory/shared";
import Badge from "@/app/proxy/_components/badge/Badge"
import { getRoles } from "@/actions/role.action"

export default function RoleList() {
    const [sorting, setSorting] = useState<SortingState>();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [roleList, setRoleList] = useState<Role[]>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [curTemplateKey, setCurTemplateKey] = useState<string>('')

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

    const columns: ColumnDef<Role>[] = [
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
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <div>{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "name",
            header: "角色名",
            cell: ({ row }) => {
                const status = row.getValue("id") as Roles;
                return <div className={`max-w-max rounded-xl`}>
                    <Badge {...RolesRender[status]} />
                </div>
            },
        },
        {
            accessorKey: "description",
            header: "角色描述",
            cell: ({ row }) => {
                return <div>
                    <div>{row.getValue("description")}</div>
                </div>
            }
        },
        {
            accessorKey: "role_permissions",
            header: "权限点",
            cell: ({ row }) => {
                const status = row.getValue("role_permissions") as RolePermission[];
                return <div className={`max-w-max rounded-xl`}>
                    {status.map((item,index) => <span key={index}>{item.permission_id}</span>)}
                </div>
            }
        },
        // {
        //     accessorKey: "created_at",
        //     header: "创建时间",
        //     cell: ({ row }) => (
        //         <div>{dayjs(row.getValue("created_at")).format("YYYY-MM-DD HH:mm:ss")}</div>
        //     ),
        // },
        // {
        //     accessorKey: "updated_at",
        //     header: "最后更新",
        //     sortingFn: (rowA, rowB, columnId) => {
        //         const a = new Date(rowA.getValue(columnId));
        //         const b = new Date(rowB.getValue(columnId));
        //         return a.getTime() - b.getTime();
        //     },
        //     cell: ({ row }) => (
        //         <div>{dayjs(row.getValue("updated_at")).format("YYYY-MM-DD HH:mm:ss")}</div>
        //     ),
        // },
        {
            id: "actions",
            header: "操作",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original
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
                            <DropdownMenuItem>
                                <Edit className="mr-1" size={16} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Trash className="mr-1" size={16} /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    useEffect(() => {
        startTransition(async () => {
            setRoleList(await getRoles())
        })
    }, [])

    const table = useReactTable({
        data: roleList,
        columns,
        // onSortingChange: setSorting,
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
                {/* <div className="flex gap-2 flex-1">
                    {(table.getRowModel().rows?.length && !isPending) ? <Input
                        placeholder="Filter project by role..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    /> : <div className="w-full animate-pulse flex flex-col space-y-4">
                        <div className="bg-gray-200 h-6 rounded-md w-full"></div></div>}
                </div> */}
                <DropdownMenu>
                    <div className="flex gap-2">
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                属性 <ChevronDown />
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
                        {(table.getRowModel().rows?.length && !isPending) ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        className="border-t transition-all hover:bg-muted"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loading />
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
                        上一页
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        下一页
                    </Button>
                </div>
            </div>

            {/* <DeletDialog isOpen={deleteDialogOpen} setOpen={setDeleteDialogOpen} templateKey={curTemplateKey} /> */}
        </>
    )
}
