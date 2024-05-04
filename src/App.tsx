/* eslint-disable react-hooks/rules-of-hooks */
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  TableMeta,
} from "@tanstack/react-table";
import { makeData, Person } from "./Table/makeData";
import React, { useEffect, useState } from "react";
import TableFooter from "./Table/TableFooter";
import Table from "./Table/Table";
interface CustomTableMeta<TData extends object> extends TableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

const defaultColumn: Partial<ColumnDef<Person>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const onBlur = () => {
      (table.options.meta as CustomTableMeta<Person>).updateData(
        index,
        id,
        value
      );
    };
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

function App() {
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: () => "First Name",
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        header: () => "Last Name",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "visits",
        header: () => "Visits",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        header: () => "Status",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "progress",
        header: () => "Profile Progress",
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(1000));
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,

    meta: {
      updateData: (rowIndex: number, columnId: string, value: string | number) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              if (row) {
                return { ...row, [columnId]: value };
              }
            }
            return row;
          })
        );
      },
    } as CustomTableMeta<Person>,
    debugTable: true,
  });

  return (
    <>
      <div className="p-2">
        <div className="h-2" />
        <Table table={table} />
        <TableFooter table={table} />
      </div>
    </>
  );
}

export default App;
