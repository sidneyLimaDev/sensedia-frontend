type PaginationProps = {
    currentPage: number;
    totalPages: number;
    totalFilteredUsers: number;
    handlePageChange: (page: number) => void;
    getVisiblePages: () => (number | string)[];
};

const Pagination = ({ currentPage, totalPages, totalFilteredUsers, handlePageChange, getVisiblePages }: PaginationProps) => {
    const visiblePages = getVisiblePages();

    return (
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">TOTAL {totalFilteredUsers}</span>
            </div>
            <div className="flex items-center gap-4">
                <button
                    className="px-4 py-1 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ANTERIOR
                </button>

                <div className="flex">
                    {visiblePages.map((page, index) => {
                        if (typeof page === "number") {
                            // Base classes for all number buttons
                            let buttonClasses = "h-8 w-8 flex items-center justify-center border border-gray-300 text-sm ";

                            // Determine if this is part of a continuous group
                            const prevIsNumber = index > 0 && typeof visiblePages[index - 1] === "number";
                            const nextIsNumber = index < visiblePages.length - 1 && typeof visiblePages[index + 1] === "number";

                            // Rounded corners logic
                            if (!prevIsNumber && !nextIsNumber) {
                                // Standalone button
                                buttonClasses += "rounded-full ";
                            } else if (!prevIsNumber) {
                                // First button in a group
                                buttonClasses += "rounded-l-full ";
                            } else if (!nextIsNumber) {
                                // Last button in a group
                                buttonClasses += "rounded-r-full ";
                                buttonClasses += "-ml-px ";
                            } else {
                                // Middle button in a group
                                buttonClasses += "-ml-px ";
                            }

                            // Current page styling
                            if (page === currentPage) {
                                buttonClasses += "bg-gray-500 text-white border-gray-500 z-10 ";
                            } else {
                                buttonClasses += "text-gray-600 hover:bg-gray-50 ";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={buttonClasses}
                                >
                                    {page}
                                </button>
                            );
                        } else {
                            // Ellipsis styling
                            return (
                                <span key={index} className="w-6 flex items-center justify-center text-sm text-gray-600">
                                    {page}
                                </span>
                            );
                        }
                    })}
                </div>

                <button
                    className="px-4 py-1 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    PRÓXIMO
                </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">IR PARA A PÁGINA</span>
                <select
                    className="border border-gray-300 rounded-md text-sm p-1 w-12 text-center"
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