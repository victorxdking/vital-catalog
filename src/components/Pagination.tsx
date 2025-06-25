import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const PageButton = ({ 
    page, 
    isActive = false, 
    disabled = false, 
    children 
  }: { 
    page?: number; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode 
  }) => (
    <button
      onClick={() => page && onPageChange(page)}
      disabled={disabled}
      className={`
        relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors
        ${isActive
          ? 'z-10 bg-[#183263] text-white border-[#183263]'
          : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700'
        }
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'
        }
        border first:rounded-l-md last:rounded-r-md
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        {/* Mobile pagination */}
        <PageButton
          page={currentPage - 1}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </PageButton>
        <PageButton
          page={currentPage + 1}
          disabled={currentPage === totalPages}
        >
          Próximo
          <ChevronRight className="w-4 h-4 ml-1" />
        </PageButton>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando página{' '}
            <span className="font-medium">{currentPage}</span>
            {' '}de{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous button */}
            <PageButton
              page={currentPage - 1}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft className="w-4 h-4" />
            </PageButton>

            {/* First page */}
            {showFirstLast && (
              <PageButton
                page={1}
                isActive={currentPage === 1}
              >
                1
              </PageButton>
            )}

            {/* Left ellipsis */}
            {showLeftEllipsis && (
              <PageButton disabled>
                <MoreHorizontal className="w-4 h-4" />
              </PageButton>
            )}

            {/* Visible pages */}
            {visiblePages.map(page => (
              <PageButton
                key={page}
                page={page}
                isActive={currentPage === page}
              >
                {page}
              </PageButton>
            ))}

            {/* Right ellipsis */}
            {showRightEllipsis && (
              <PageButton disabled>
                <MoreHorizontal className="w-4 h-4" />
              </PageButton>
            )}

            {/* Last page */}
            {showFirstLast && totalPages > 1 && (
              <PageButton
                page={totalPages}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PageButton>
            )}

            {/* Next button */}
            <PageButton
              page={currentPage + 1}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </PageButton>
          </nav>
        </div>
      </div>
    </div>
  );
} 