"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { bffUserService } from "@/services/bffUserService"; 

export default function UserTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<any[]>([]); 
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]); 
    const [currentPage, setCurrentPage] = useState(1); 
    const usersPerPage = 5;

    // Função para buscar dados dos usuários
    const fetchUsers = async () => {
        try {
            const data = await bffUserService.getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
            console.log(data);
        } catch (error) {
            console.error("Erro ao buscar dados dos usuários:", error);
        }
    };

    // Chama a função para buscar os dados quando o componente for montado
    useEffect(() => {
        fetchUsers();
    }, []);

    // Função para atualizar a pesquisa
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    // Total de usuários filtrados e páginas
    const totalFilteredUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalFilteredUsers / usersPerPage);

    // Função para calcular a lista de páginas visíveis
    const getVisiblePages = () => {
        const visiblePages = [];
        const pageRange = 1; 

        
        if (currentPage > pageRange + 1) visiblePages.push(1);
        if (currentPage > pageRange + 2) visiblePages.push("...");

        
        for (let i = Math.max(1, currentPage - pageRange); i <= Math.min(totalPages, currentPage + pageRange); i++) {
            visiblePages.push(i);
        }

        
        if (currentPage < totalPages - pageRange - 1) visiblePages.push("...");
        if (currentPage < totalPages - pageRange) visiblePages.push(totalPages);

        return visiblePages;
    };

    // Função para navegar entre as páginas
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)} // Chama a função de pesquisa
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">USER</th>
                            <th className="px-4 py-3 text-left">Nome</th>
                            <th className="px-4 py-3 text-left">E-mail</th>
                            <th className="px-4 py-3 text-left">cidade</th>
                            <th className="px-4 py-3 text-left">Dias da semana</th>
                            <th className="px-4 py-3 text-center">POSTS</th>
                            <th className="px-4 py-3 text-center">álbuns</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/usuario/${user.id}`}
                                        className="text-purple-600 hover:underline"
                                    >
                                        {user.id}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/usuario/${user.id}`}
                                        className="hover:text-purple-600"
                                    >
                                        {user.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">{user.city}</td>
                                <td className="px-4 py-3">{user.days_of_week.join(', ')}</td>
                                <td className="px-4 py-3 text-center">{user.posts}</td>
                                <td className="px-4 py-3 text-center">{user.albums}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                        PRÓXIMO
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
        </div>
    );
}
