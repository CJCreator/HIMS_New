import { ReactNode } from 'react';

interface Column {
  key: string;
  header: string | ReactNode;
  render?: (value: any, row: any) => ReactNode;
  width?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function Table({ columns, data, onRowClick }: TableProps) {
  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-lg">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-body-sm font-medium text-neutral-500 uppercase tracking-wider"
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {data.map((row, index) => (
            <tr
              key={index}
              className={`
                ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
                ${onRowClick ? 'cursor-pointer hover:bg-primary-50 transition-colors' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-body text-neutral-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}