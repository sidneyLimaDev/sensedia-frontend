type PaginationProps = {
    currentPage: number;
    totalPages: number;
    totalFilteredUsers: number;
    handlePageChange: (page: number) => void;
    getVisiblePages: () => (number | string)[];
};

const Pagination = ({ currentPage, totalPages, totalFilteredUsers, handlePageChange, getVisiblePages }: PaginationProps) => {
    return (
        <div className="p-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">TOTAL {totalFilteredUsers}</span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ANTERIOR
                </button>
                {getVisiblePages().map((page, index) =>
                    typeof page === "number" ? (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 ${page === currentPage ? "bg-gray-100" : ""}`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-3 text-sm text-gray-600">
                            {page}
                        </span>
                    )
                )}
                <button
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    PRÓXIMA
                </button>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">IR PARA A PAGINA</span>
                <select
                    className="border border-gray-300 rounded-md text-sm p-1"
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    value={currentPage}
                >
                    {[...Array(totalPages)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Pagination;