/* eslint-disable react-hooks/rules-of-hooks */
/* import { useState, useEffect, FC } from "react";

interface EditableCellProps {
  value: string | number;
  row: { index: number };
  column: { id: string };
  updateData: (index: number, id: string, value: number | string) => void;
}

export const EditableCell: FC<EditableCellProps> = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    />
  );
};
 */


import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  TableMeta,
} from "@tanstack/react-table";

import React, { useEffect, useState } from "react";
import { makeData, Person } from "./makeData";
import Table from "./Table";
import TableFooter from "./TableFooter";

// Define the type of the meta object
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
      // Define other columns...
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

    // Define the updateData function in the meta object
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => {
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
    } as CustomTableMeta<Person>, // Type assertion
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
