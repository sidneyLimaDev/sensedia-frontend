import { Search } from "lucide-react";

type SearchBarProps = {
    searchTerm: string;
    handleSearch: (term: string) => void;
};

const SearchBar = ({ searchTerm, handleSearch }: SearchBarProps) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Buscar por nome ou username"
                className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
    );
};

export default SearchBar;
