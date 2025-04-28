"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { bffUserService } from "@/services/bffUserService";
import { Toast } from "@/app/components/Toast";
import { Dialog } from "@/app/components/Dialog";
import { User } from "../types/user";

export default function UserTable() {
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
  }, []);

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
        title="Confirmar remoção"
        description={`Tem certeza que deseja bloquear o usuário ${userToDelete?.name}?`}
      />

      <div className="p-4">
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
      </div>

      <div className="overflow-x-auto" style={{ maxHeight: "300px", overflowY: "auto" }}>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">USER</th>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">E-mail</th>
              <th className="px-4 py-3 text-left">Cidade</th>
              <th className="px-4 py-3 text-left">Dias da Semana</th>
              <th className="px-4 py-3 text-center">Posts</th>
              <th className="px-4 py-3 text-center">Álbuns</th>
              <th className="px-4 py-3 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <td key={i} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
              : currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 group">
                  <td className="px-4 py-3">
                    <Link href={`/user/${user.id}`} className="text-purple-600 hover:underline">
                      {user.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/user/${user.id}`} className="hover:text-purple-600">
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.city}</td>
                  <td className="px-4 py-3">{user.days_of_week?.join(", ")}</td>
                  <td className="px-4 py-3 text-center">{Array.isArray(user.posts) ? user.posts.length : 0}</td>
                  <td className="px-4 py-3 text-center">{Array.isArray(user.albums) ? user.albums.length : 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      aria-label={`Deletar usuário ${user.name}`}
                    >
                      <Trash2 className="w-5 h-5 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && (
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
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 ${page === currentPage ? "bg-gray-100" : ""
                    }`}
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
      )}
    </div>
  );
}
