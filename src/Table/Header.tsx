import { flexRender, HeaderGroup } from "@tanstack/react-table";

interface HeaderProps<T> {
  headerGroup: HeaderGroup<T>;
}

function Header<T extends object>({
  headerGroup,
}: HeaderProps<T>): JSX.Element {
  return (
    <tr className="bg-gray-50">
      {headerGroup.headers.map((header) => (
        <th
          key={header.id}
          colSpan={header.colSpan}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {header.isPlaceholder ? null : (
            <div>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          )}
        </th>
      ))}
    </tr>
  );
}

export default Header;
