'use client'

import React, { startTransition, useEffect, useState, useTransition } from "react"
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
import { ChevronDown, ChevronUp, Edit, MoreHorizontal, SquarePlus, Trash, Send, User, Inbox } from "lucide-react"
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
import dayjs from "dayjs"
import Loading from "../../roles/loading"
import { UserInfo } from "@/types/user"
import { RolesRender, UserStatusRender } from "@/constants/user"
import { Roles, UserStatusEnum } from "@memory/shared";
import SubmitDialog from "./SubmitDialog"
import DeletDialog from "./DeletDialog"
import Badge from "@/app/proxy/_components/badge/Badge"
import EmptyState from "@/app/common/Empty"
import { getUsers } from "@/actions/user.action"

export default function UserList() {
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'updated_at', desc: true },
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [userList, setUserList] = useState<UserInfo[]>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [submitDialogOpen, setSubmitDialogOpen] = useState<boolean>(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [curUser, setCurUser] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true); 

    // 删除弹窗
    const handleDelete = (user: UserInfo) => {
        setCurUser(user)
        setDeleteDialogOpen(true)
    }

    // 编辑
    const handleEdit = (user: UserInfo) => {
        setCurUser(user)
        setSubmitDialogOpen(true)
    }

    const columns: ColumnDef<UserInfo>[] = [
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
            accessorKey: "username",
            header: "用户名",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("username")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: "邮箱",
            cell: ({ row }) => (
                <div>{row.getValue("email")}</div>
            ),
        },
        {
            accessorKey: "role",
            header: "权限",
            cell: ({ row }) => {
                const roleId = row.getValue("role") as Roles;
                return <div className={`max-w-max rounded-xl`}>
                    <Badge  {...RolesRender[roleId]} />
                </div>
            }
        },
        {
            accessorKey: "status",
            header: "用户状态",
            cell: ({ row }) => {
                const status = row.getValue("status") as UserStatusEnum;
                return <div className={`max-w-max rounded-xl`}>
                    <Badge {...UserStatusRender[status]} />
                </div>
            }
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
                            <DropdownMenuItem onClick={() => {
                                handleEdit(user)
                            }}>
                                <Edit className="mr-1" size={16} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(user)}>
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
            setIsLoading(true)
            await initUserList()
            setIsLoading(false)
        })
    }, []) 

    const initUserList = async () => {
        setUserList(await getUsers()) // 从 API 获取最新用户列表
    }

    const table = useReactTable({
        data: userList,
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
                        placeholder="按角色搜索..."
                        value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("role")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    /> : <div className="w-full animate-pulse flex flex-col space-y-4">
                        <div className="bg-gray-200 h-6 rounded-md w-full"></div></div>}
                    {(!isLoading) ? <Input
                        placeholder="按用户名搜索..."
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

            {(submitDialogOpen && curUser) && <SubmitDialog isOpen={submitDialogOpen} setOpen={setSubmitDialogOpen} user={curUser} initUserList={initUserList} />}
            {(deleteDialogOpen && curUser) && <DeletDialog isOpen={deleteDialogOpen} setOpen={setDeleteDialogOpen} user={curUser} initUserList={initUserList} />}
        </>
    )
}
