import React from "react";

type PaginationProps = {
    currentPage: number;
    onPageChange: (page: number) => void;
    hasMoreData: Boolean;
    itemsPerPage: Number;
    data: Array;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, onPageChange, hasMoreData, itemsPerPage, data }) => {

    const totalPages = Math.ceil(data.length / itemsPerPage)

    return (
        <div className="flex justify-center item-center py-2">
            <div className="px-2">
                <button
                    onClick={() => onPageChange(currentPage - 1, 1)} disabled={currentPage === 1}
                    className="rounded px-2  text-gray-600 hover:bg-neutral-100"
                >
                    &laquo;
                </button>
            </div>
            <div>
                <span className="text-sm text-gray-600">
                    {currentPage} / {totalPages}
                </span>
            </div>
            <div className="px-2">
                <button
                    onClick={() => onPageChange(currentPage + 1)} disabled={!hasMoreData}
                    className="rounded px-2 text-gray-600 hover:bg-neutral-100"
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Pagination;