'use client';
import { useState, useEffect, useCallback } from "react";
import { bffUserService } from "@/services/bffUserService";
import { Toast } from "@/app/components/Toast";
import { Dialog } from "@/app/components/Dialog";
import { User } from "@/app/types/user";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import Pagination from "./Pagination";

export default function UserTablePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [isLoading, setIsLoading] = useState(true);

    const usersPerPage = 10;

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await bffUserService.getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Erro ao buscar dados dos usuários:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const lowerTerm = term.toLowerCase();

        const filtered = users.filter((user) => {
            const name = user.name?.toLowerCase() || '';
            const username = user.username?.toLowerCase() || '';
            return name.includes(lowerTerm) || username.includes(lowerTerm);
        });

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

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

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalFilteredUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalFilteredUsers / usersPerPage);

    const openDeleteModal = (user: User) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setUserToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await bffUserService.blockUser(userToDelete.id);
            setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
            setFilteredUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
            setToastMessage(`${userToDelete.name} foi deletado com sucesso!`);
            setToastType("success");
            closeModal();
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            setToastMessage("Erro ao deletar o usuário!");
            setToastType("error");
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
            <Dialog
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
                title={`Confirmar remoção`} description={`Tem certeza que quer deletar o usuário ${userToDelete?.name}?`} />
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
            <UserTable
                users={users}
                isLoading={isLoading}
                currentUsers={currentUsers}
                openDeleteModal={openDeleteModal}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalFilteredUsers={totalFilteredUsers}
                handlePageChange={handlePageChange}
                getVisiblePages={getVisiblePages}
            />
        </div>
    );
}
