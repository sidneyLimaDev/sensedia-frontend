import { Search } from "lucide-react";

type SearchBarProps = {
    searchTerm: string;
    handleSearch: (term: string) => void;
};

const SearchBar = ({ searchTerm, handleSearch }: SearchBarProps) => {
    return (
        <div className="relative mb-4">
            <input
                type="text"
                placeholder="Procurar"
                className="w-full p-2 pl-3 pr-10 border-b-1 
                border-sensedia-gray-medium-light focus:outline-none focus:border-sensedia-purple-secundary
                 bg-sensedia-gray-dark/5 rounded-t-md"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sensedia-gray-medium w-5 h-5" />
        </div>
    );
};

export default SearchBar;