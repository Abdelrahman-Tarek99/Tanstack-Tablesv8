import React, { useState, useEffect } from "react";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";

export default function BasicTable({ data, columns }) {
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    const [colFiltering, setColFiltering] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);

    const tableInstance = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter: filtering,
            columnFilters: colFiltering,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        onColumnFiltersChange: setColFiltering,
    });

    useEffect(() => {
        setPageIndex(0); // Reset page index to 0 whenever the page size changes
    }, [pageSize]);

    // Function to calculate page numbers for pagination
    const getPageNumbers = () => {
        const total_pages = tableInstance.getPageCount();
        const pages = [];
        const current_page = pageIndex;
        const page_range_displayed = 5;

        let left_bound = current_page - Math.floor(page_range_displayed / 2);
        let right_bound = current_page + Math.floor(page_range_displayed / 2);

        if (left_bound < 0) {
            right_bound = right_bound - left_bound; // Adjust right bound if left is less than 0
            left_bound = 0;
        }
        if (right_bound >= total_pages) {
            left_bound -= (right_bound - total_pages + 1); // Adjust left bound if right exceeds total pages
            right_bound = total_pages - 1;
        }

        for (let i = Math.max(0, left_bound); i <= Math.min(right_bound, total_pages - 1); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="w3-container">
            <input
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                placeholder="Global Search..."
            />
            <table className="w3-table-all">
                <thead>
                    {tableInstance.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{ asc: "🔼", desc: "🔽" }[header.column.getIsSorted() ?? null]}
                                            {header.column.getCanFilter() && <TextFilter column={header.column} />}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {tableInstance.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>First</button>
                <button onClick={() => setPageIndex(pageIndex - 1)} disabled={!tableInstance.getCanPreviousPage()}>Previous</button>
                {getPageNumbers().map(number => (
                    <button
                        key={number}
                        onClick={() => setPageIndex(number)}
                        style={{ fontWeight: pageIndex === number ? 'bold' : 'normal' }}
                    >
                        {number + 1}
                    </button>
                ))}
                <button onClick={() => setPageIndex(pageIndex + 1)} disabled={!tableInstance.getCanNextPage()}>Next</button>
                <button onClick={() => setPageIndex(tableInstance.getPageCount() - 1)} disabled={pageIndex === tableInstance.getPageCount() - 1}>Last</button>
            </div>
            <div>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    <option value={10}>Show 10</option>
                    <option value={20}>Show 20</option>
                    <option value={30}>Show 30</option>
                    <option value={50}>Show 50</option>
                </select>
            </div>
        </div>
    );
}

export function TextFilter({ column }) {
    console.log("column", column);
    console.log("can get filter;", column.getCanFilter());
    // if (column.id === "first_name") {
    //     return (
    //         <input
    //             value={column.getFilterValue() ?? ""}
    //             onChange={(e) => column.setFilterValue(e.target.value)}
    //             placeholder="Search..."
    //         />
    //     );
    // } else {
    //     return null;
    // }
    return (
        <input
            value={column.getFilterValue() ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Search..."
        />
    );
}
