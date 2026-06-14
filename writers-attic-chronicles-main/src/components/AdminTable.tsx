import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export type Column<T> = { header: string; cell: (row: T) => ReactNode; className?: string };

export function AdminTable<T extends { id: string | number }>({
  rows,
  columns,
  onDelete,
  emptyText = "Nothing here.",
}: {
  rows: T[];
  columns: Column<T>[];
  onDelete?: (row: T) => void;
  emptyText?: string;
}) {
  return (
    <div className="paper-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-paper/40">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className={`px-5 py-3 text-left font-type text-[11px] uppercase tracking-[0.2em] text-coffee/70 ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
            {onDelete && <th className="w-16" />}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (onDelete ? 1 : 0)} className="px-5 py-10 text-center font-body italic text-muted-foreground">
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-border/50 transition-colors hover:bg-paper/20">
              {columns.map((c) => (
                <td key={c.header} className={`px-5 py-3 font-body text-sm text-ink ${c.className ?? ""}`}>
                  {c.cell(row)}
                </td>
              ))}
              {onDelete && (
                <td className="px-3 py-3">
                  <Button variant="ghost" size="icon" onClick={() => onDelete(row)} className="text-coffee/70 hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
