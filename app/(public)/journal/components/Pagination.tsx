'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  // Build URL preserving existing filters (q, categoria, orden)
  function buildPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return `/journal${qs ? `?${qs}` : ''}`;
  }

  // Generate page numbers with ellipsis for large sets
  function getPageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');

    // Always show last page
    pages.push(totalPages);

    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Paginación de noticias" className="mt-12 flex items-center justify-center gap-1.5">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gris-texto transition-all hover:bg-white hover:text-negro hover:shadow-sm"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-300 cursor-not-allowed">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-gris-texto select-none">
              ···
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-azul-acropolis text-sm font-bold text-white shadow-md"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildPageUrl(page)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-sm font-medium text-gris-texto transition-all hover:bg-white hover:text-negro hover:shadow-sm"
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gris-texto transition-all hover:bg-white hover:text-negro hover:shadow-sm"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-300 cursor-not-allowed">
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
