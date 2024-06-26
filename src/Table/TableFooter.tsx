import { ReactElement } from "react";
import { Table } from "@tanstack/react-table";
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi"; // Example icons from Feather Icons

interface TableFooterProps<TData extends object> {
  table: Table<TData>;
}

const TableFooter = <TData extends object>({
  table,
}: TableFooterProps<TData>): ReactElement => {
  return (
    <>
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1 hover:bg-gray-200"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FiChevronsLeft />
          </button>
          <button
            className="border rounded p-1 hover:bg-gray-200"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FiChevronLeft />
          </button>
          <button
            className="border rounded p-1 hover:bg-gray-200"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <FiChevronRight />
          </button>
          <button
            className="border rounded p-1 hover:bg-gray-200"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FiChevronsRight />
          </button>
          <span className="flex items-center gap-1">
            <div className="hidden sm:block">Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16 text-center"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border p-1 rounded"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>{table.getRowModel().rows.length} Rows</div>
      </div>
    </>
  );
};

export default TableFooter;
