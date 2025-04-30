// components/UserTable/Pagination.tsx
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    totalFilteredUsers: number;
    handlePageChange: (page: number) => void;
    getVisiblePages: () => (number | string)[];
};

const Pagination = ({ currentPage, totalPages, totalFilteredUsers, handlePageChange, getVisiblePages }: PaginationProps) => {
    const visiblePages = getVisiblePages();
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    return (
        <div className="flex justify-between pt-6 flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Lado esquerdo com largura fixa */}
            <div className="flex items-center gap-1 w-48">
                <span className="text-sm text-sensedia-gray-medium">TOTAL {totalFilteredUsers}</span>
            </div>

            {/* Navegação de páginas centralizada */}
            <div className="flex items-center gap-4">
                <button
                    className="px-4 py-2 border cursor-pointer border-sensedia-gray-medium-light rounded-full text-sm text-sensedia-gray-medium hover:bg-gray-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ANTERIOR
                </button>

                <div className="flex">
                    {visiblePages.map((page, index) => {
                        if (typeof page === "number") {
                            let buttonClasses = "h-10 w-10 flex items-center justify-center border border-sensedia-gray-medium-light text-sm ";

                            const prevIsNumber = index > 0 && typeof visiblePages[index - 1] === "number";
                            const nextIsNumber = index < visiblePages.length - 1 && typeof visiblePages[index + 1] === "number";

                            if (!prevIsNumber && !nextIsNumber) {
                                buttonClasses += "rounded-full ";
                            } else if (!prevIsNumber) {
                                buttonClasses += "rounded-l-full ";
                            } else if (!nextIsNumber) {
                                buttonClasses += "rounded-r-full ";
                                buttonClasses += "-ml-px ";
                            } else {
                                buttonClasses += "-ml-px ";
                            }

                            if (page === currentPage) {
                                buttonClasses += " bg-sensedia-gray-medium-light text-white border-sensedia-gray-medium-light z-10 ";
                            } else {
                                buttonClasses += " cursor-pointer text-sensedia-gray-medium0 hover:bg-gray-50 ";
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
                            return (
                                <span key={index} className="w-6 flex items-center justify-center text-sm text-sensedia-gray-medium">
                                    {page}
                                </span>
                            );
                        }
                    })}
                </div>

                <button
                    className="px-4 py-2 border cursor-pointer border-sensedia-gray-medium-light rounded-full text-sm text-sensedia-gray-medium hover:bg-gray-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    PRÓXIMO
                </button>
            </div>

            {/* Lado direito com a mesma largura do lado esquerdo */}
            <div className="flex md:items-center md:justify-end w-48">
                <span className="text-sm text-gray-600 w-18">IR PARA A PÁGINA</span>
                <div className="relative">
                    <select
                        className="text-sm font-medium text-gray-700 border-0 border-b-2 border-sensedia-gray-medium-light cursor-pointer appearance-none py-1 pr-8 w-16 text-center focus:outline-none focus:border-sensedia-gray-medium-light"
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        value={currentPage}
                        onFocus={() => setIsSelectOpen(true)}
                        onBlur={() => setIsSelectOpen(false)}
                    >
                        {[...Array(totalPages)].map((_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        {isSelectOpen ? (
                            <ChevronUp size={16} className="text-gray-500" />
                        ) : (
                            <ChevronDown size={16} className="text-gray-500" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pagination;