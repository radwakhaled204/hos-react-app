import React, { useMemo } from "react";

/**
 * ReusableDataGrid
 * - Dynamic columns (compute & custom render supported)
 * - Optional selection checkbox column (controlled)
 * - Per-cell editing (number/text/select)
 * - Pagination (controlled)
 * - RTL/LTR support
 * - Sticky header + scroll wrappers via classNames
 * - Context menu passthrough
 *

// Types (JS Doc for DX)
/**
 * @typedef {Object} Column
 * @property {string} key - field key in row (ignored if compute provided)
 * @property {string|React.ReactNode} header
 * @property {number|string=} width - e.g. 120 or "150px"
 * @property {boolean=} editable - if true, renders editor
 * @property {"text"|"number"|"select"=} inputType - editor type
 * @property {Array<{label:string, value:any>}=} options - for select editors
 * @property {(value:any, row:any, rowIndex:number)=>React.ReactNode=} format - cell display formatter
 * @property {(row:any, rowIndex:number)=>any=} compute - compute cell value from row
 * @property {(value:any, row:any, rowIndex:number)=>React.CSSProperties=} style - style for TD
 * @property {(row:any, rowIndex:number)=>React.ReactNode=} renderCell - full custom renderer (takes precedence)
 * @property {string=} thClassName
 * @property {string=} tdClassName
 */

/**
 * @param {Object} props
 * @param {Array<Column>} props.columns
 * @param {Array<any>} props.rows
 * @param {(next:any)=>void=} props.onToggleAll - called when header checkbox toggled (if selectionColumn)
 * @param {(row:any, checked:boolean, index:number)=>void=} props.onToggleRow
 * @param {Set<string|number>=} props.selectedKeys - keys of selected rows (controlled)
 * @param {string=} props.rowKey - field in row to use as key (default "id" or row index)
 * @param {(rowIndex:number, key:string, next:any)=>void=} props.onEdit
 * @param {boolean=} props.rtl - sets dir="rtl"
 * @param {boolean=} props.stickyHeader
 * @param {string=} props.tableClassName - class for <table>
 * @param {string=} props.scrollWrapperClassName - class for scroll wrapper div that bounds height, sticky header, etc.
 * @param {(e:React.MouseEvent, row:any, index:number)=>void=} props.onRowContextMenu
 * @param {{ page:number, pageSize:number, total:number, onPageChange:(p:number)=>void }=} props.pagination
 * @param {{ show:boolean, headerLabel?:string }=} props.selectionColumn - show a selection checkbox column
 */
export default function ReusableDataGrid({
  columns,
  rows,
  onToggleAll,
  onToggleRow,
  selectedKeys,
  rowKey = "id",
  onEdit,
  rtl,
  stickyHeader,
  tableClassName,
  scrollWrapperClassName,
  onRowContextMenu,
  pagination,
  selectionColumn,
}) {
  const dirProps = rtl ? { dir: "rtl" } : {};

  const start = pagination ? (pagination.page - 1) * pagination.pageSize : 0;
  const end = pagination ? start + pagination.pageSize : rows.length;
  const pageRows = pagination ? rows.slice(start, end) : rows;

  const allSelected = useMemo(() => {
    if (!selectionColumn?.show || !selectedKeys) return false;
    if (pageRows.length === 0) return false;
    return pageRows.every((r, idx) => selectedKeys.has(resolveKey(r, idx, rowKey)));
  }, [selectionColumn, selectedKeys, pageRows, rowKey]);

  function resolveKey(row, idx, keyField) {
    const key = row?.[keyField];
    return key != null ? key : idx;
  }

  function renderCell(col, row, rowIndex) {
    const rawValue = col.compute ? col.compute(row, rowIndex) : row?.[col.key];

    // Custom renderer takes precedence
    if (col.renderCell) return col.renderCell(row, rowIndex);

    // Editable cell
    if (col.editable && onEdit) {
      const commonProps = {
        value: rawValue ?? "",
        onChange: (e) => onEdit(rowIndex + start, col.key, e.target.value),
        className: "table-input",
      };
      if (col.inputType === "number") {
        return <input type="number" step="any" {...commonProps} />;
      }
      if (col.inputType === "select") {
        return (
          <select
            value={rawValue ?? ""}
            onChange={(e) => onEdit(rowIndex + start, col.key, e.target.value)}
            className="table-input"
          >
            {(col.options || []).map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }
      return <input type="text" {...commonProps} />;
    }

    // Display cell
    const shown = col.format ? col.format(rawValue, row, rowIndex) : rawValue;
    return shown ?? "-";
  }

  const Table = (
    <table className={tableClassName || "data-grid"} {...dirProps}>
      <thead>
        <tr>
          {selectionColumn?.show && (
            <th style={{ width: 60 }} className={"select-col"}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onToggleAll && onToggleAll(e.target.checked)}
              />
              {selectionColumn?.headerLabel || "اختيار"}
            </th>
          )}
          {columns.map((c, i) => (
            <th
              key={i}
              className={c.thClassName}
              style={{ width: c.width }}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pageRows.map((row, i) => (
          <tr
            key={String(resolveKey(row, i + start, rowKey))}
            onContextMenu={onRowContextMenu ? (e) => onRowContextMenu(e, row, i + start) : undefined}
          >
            {selectionColumn?.show && (
              <td className={"select-col"}>
                <input
                  type="checkbox"
                  checked={!!selectedKeys?.has(resolveKey(row, i + start, rowKey))}
                  onChange={(e) => onToggleRow && onToggleRow(row, e.target.checked, i + start)}
                />
              </td>
            )}

            {columns.map((c, ci) => (
              <td key={ci} className={c.tdClassName} style={c.style?.(row, i) || undefined}>
                {renderCell(c, row, i)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={scrollWrapperClassName || "table-scroll-wrapper"} {...dirProps}>
      {stickyHeader ? (
        // Sticky header is done via CSS on thead th; wrapper just bounds height
        Table
      ) : (
        Table
      )}

      {pagination ? (
        <Pager
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
          rtl={rtl}
        />
      ) : null}
    </div>
  );
}

function Pager({ page, pageSize, total, onPageChange, rtl }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < pages;
  const numbers = [];
  for (let i = 1; i <= pages; i++) numbers.push(i);

  return (
    <div className="dg-pager" style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: rtl ? "flex-start" : "flex-end", padding: 8 }} dir={rtl ? "rtl" : "ltr"}>
      <button disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        {rtl ? "التالي" : "Prev"}
      </button>
      {numbers.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          style={{ fontWeight: n === page ? 700 : 400 }}
        >
          {n}
        </button>
      ))}
      <button disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        {rtl ? "السابق" : "Next"}
      </button>
    </div>
  );
}
