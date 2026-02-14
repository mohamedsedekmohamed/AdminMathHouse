import React, { useState } from 'react';
import { Pencil, Trash2, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import TruncatedText from "./TruncatedText";

const ReusableTable = ({ 
  title, 
  columns, 
  data = [], 
  onAddClick, 
  titleAdd, 
  onEdit,     // دالة التعديل
  onDelete,   // دالة الحذف
  extraActions // دالة لإضافة أي أزرار أخرى
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 1. Search Logic
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key] || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="w-full space-y-4 p-4 bg-background text-left">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {title && <h2 className="text-xl text-one md:text-2xl font-semibold">{title}</h2>}
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-one outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Add Button */}
          {titleAdd && (
            <button
              onClick={onAddClick}
              className="w-full md:w-auto bg-one hover:bg-one/90 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add {titleAdd}
            </button>
          )}
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground border-b border-border">
                {columns.map((col, index) => (
                  <th key={index} className="p-4 font-bold text-one uppercase text-[11px] tracking-widest">
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete || extraActions) && (
                  <th className="p-4 font-bold text-one uppercase text-[11px] tracking-widest text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-one/5 transition-colors border-b border-border last:border-0">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="p-4 text-foreground text-sm">
                        {col.render ? (
                          col.render(row[col.key], row)
                        ) : (
                          <TruncatedText text={String(row[col.key] || "")} />
                        )}
                      </td>
                    ))}

                    {/* Actions Column */}
                    {(onEdit || onDelete || extraActions) && (
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          {/* Extra Custom Actions */}
                          {extraActions && extraActions(row)}

                          {/* Default Edit Button */}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}

                          {/* Default Delete Button */}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="p-10 text-center text-muted-foreground italic">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-muted/10 rounded-lg border border-border gap-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="text-foreground font-bold">{currentRows.length}</span> of <span className="text-foreground font-bold">{filteredData.length}</span> results
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={currentPage}
              onChange={(e) => setCurrentPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
              className="w-12 text-center border border-border rounded bg-card py-1 font-bold outline-none focus:ring-1 focus:ring-one"
            />
            <span>of {totalPages || 1}</span>
          </div>
          
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 border border-border rounded bg-card hover:bg-muted disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 border border-border rounded bg-card hover:bg-muted disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;