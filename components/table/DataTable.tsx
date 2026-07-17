"use client";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { columns } from "@/components/table/columns";

interface DataTableProps<TData> {
    data: TData[];
}

export function DataTable<TData>({ data }: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="data-table">
            <Table className="shad-table">
                <TableHeader className="bg-dark-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="shad-table-row-header">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="shad-table-row"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const cellId = cell.column.id;
                                    const mobileCellClass = cn(
                                        cellId === "primaryPhysician" && "max-w-[10rem] whitespace-normal md:whitespace-nowrap",
                                        cellId === "actions" && "whitespace-normal md:whitespace-nowrap"
                                    );

                                    return (
                                        <TableCell key={cell.id} className={mobileCellClass}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="table-actions">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="shad-gray-btn"
                >
                    <Image
                        src="/assets/icons/arrow.svg"
                        alt="previous arrow"
                        height={30}
                        width={30}
                    />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="shad-gray-btn"
                >
                    <Image
                        src="/assets/icons/arrow.svg"
                        className="rotate-180"
                        alt="previous arrow"
                        height={30}
                        width={30}
                    />
                </Button>
            </div>
        </div>
    );
}
