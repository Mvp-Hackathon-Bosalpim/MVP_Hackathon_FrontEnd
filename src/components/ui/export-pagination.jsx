import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

const PAGE_SET_SIZE = 5;
const EXPANDED_PAGE_SIZE = 20;

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
}) {
    const setStart = Math.floor((currentPage - 1) / PAGE_SET_SIZE) * PAGE_SET_SIZE + 1;
    const setEnd = Math.min(setStart + PAGE_SET_SIZE - 1, totalPages);

    const pageNumbers = [];
    for (let page = setStart; page <= setEnd; page++) pageNumbers.push(page);

    const hasNextSet = setStart + PAGE_SET_SIZE <= totalPages;
    const hasPrevSet = setStart > 1;
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const goToFirstPage = () => onPageChange(1);
    const goToPrevSet = () => hasPrevSet && onPageChange(setStart - PAGE_SET_SIZE);
    const goToNextSet = () => hasNextSet && onPageChange(setStart + PAGE_SET_SIZE);
    const goToLastPage = () => onPageChange(totalPages);

    return (
        <div className="grid grid-cols-3 items-center px-4 py-4">
            <div />

            {/* 페이지네이션*/}
            <div className="flex items-center justify-center gap-1">
                <button
                    type="button"
                    onClick={goToFirstPage}
                    disabled={isFirstPage}
                    className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500"
                >
                    <ChevronsLeft size={16} />
                </button>
                <button
                    type="button"
                    onClick={goToPrevSet}
                    disabled={!hasPrevSet}
                    className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500"
                >
                    <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((num) => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => onPageChange(num)}
                        className={`flex h-7 w-7 items-center justify-center rounded text-sm transition-colors ${num === currentPage
                            ? "bg-primary-navy font-semibold text-white"
                            : "text-gray-500 hover:bg-surface-100"
                            }`}
                    >
                        {num}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={goToNextSet}
                    disabled={!hasNextSet}
                    className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500"
                >
                    <ChevronRight size={16} />
                </button>
                <button
                    type="button"
                    onClick={goToLastPage}
                    disabled={isLastPage}
                    className="p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => onPageSizeChange(EXPANDED_PAGE_SIZE)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                    {EXPANDED_PAGE_SIZE}개씩 보기
                    <ChevronDown size={14} />
                </button>
            </div>
        </div>
    );
}