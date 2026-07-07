import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export type DataTableColumn<T> = {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  className?: string
  render: (row: T) => ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  density = 'default',
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T, index: number) => string
  onRowClick?: (row: T) => void
  density?: 'default' | 'compact'
}) {
  const headerPadding = density === 'compact' ? 'px-3 py-2' : 'px-3 py-2.5'
  const cellPadding = density === 'compact' ? 'px-3 py-2' : 'px-3 py-2.5'

  return (
    <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-[0.1em] text-slate-500">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'whitespace-nowrap font-semibold',
                    headerPadding,
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={getRowId(row, rowIndex)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-t border-slate-100 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-blue-50/45',
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'whitespace-nowrap text-slate-700',
                      cellPadding,
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
