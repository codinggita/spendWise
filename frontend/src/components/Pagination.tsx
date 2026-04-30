import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg p-4">
      <p className="text-sm text-slate-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          variant="outline"
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Previous
        </Button>
        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            variant={page === currentPage ? 'default' : 'outline'}
            className={
              page === currentPage
                ? 'bg-red-500 hover:bg-red-600 text-white border-4 border-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all'
                : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700 disabled:opacity-50'
            }
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          variant="outline"
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
