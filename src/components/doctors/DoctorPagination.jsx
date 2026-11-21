
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DoctorPagination({
  currentPage,
  totalPages,
  showingStart,
  showingEnd,
  totalItems,
  onPageChange,
}) {
  if (!totalItems) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center">
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {showingStart}–{showingEnd}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
        doctors
      </p>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="btn btn-sm rounded-lg border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        <span className="min-w-[90px] text-center text-xs font-semibold text-[#102a43]">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="btn btn-sm rounded-lg border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
