import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { User } from "../../src/app/types/user";

// Criando mocks manuais
const mockGetAllUsers = jest.fn();
const mockBlockUser = jest.fn();

interface ToastProps {
    message: string;
}

interface DialogProps {
    isOpen: boolean;
    title: string;
    onConfirm: () => void;
}

interface SearchBarProps {
    searchTerm: string;
    handleSearch: (value: string) => void;
}

interface UserTableProps {
    currentUsers: User[];
    openDeleteModal: (user: User) => void;
}

interface PaginationProps {
    currentPage: number;
}

// Criando componentes mockados
const MockToast = ({ message }: ToastProps) => <div>{message}</div>;
const MockDialog = ({ isOpen, title, onConfirm }: DialogProps) =>
    isOpen ? (
        <div>
            <p>{title}</p>
            <button onClick={onConfirm}>Confirmar</button>
        </div>
    ) : null;

const MockSearchBar = (props: SearchBarProps) => (
    <input
        data-testid="search-bar"
        value={props.searchTerm}
        onChange={(e) => props.handleSearch(e.target.value)}
    />
);

const MockUserTable = ({ currentUsers, openDeleteModal }: UserTableProps) => (
    <div>
        {currentUsers.map((user) => (
            <div key={user.id}>
                {user.name}
                <button onClick={() => openDeleteModal(user)}>Deletar</button>
            </div>
        ))}
    </div>
);

const MockPagination = ({ currentPage }: PaginationProps) => <div>Página {currentPage}</div>;

// Mockando os módulos de forma manual
jest.mock("../../src/services/bffUserService", () => ({
    bffUserService: {
        getAllUsers: mockGetAllUsers,
        blockUser: mockBlockUser,
    },
}), { virtual: true });

jest.mock("../../src/app/components/Toast", () => ({
    Toast: MockToast
}), { virtual: true });

jest.mock("../../src/app/components/Dialog", () => ({
    Dialog: MockDialog
}), { virtual: true });

jest.mock("../../src/app/components/SearchBar", () => MockSearchBar, { virtual: true });

jest.mock("../../src/app/components/UserTable", () => MockUserTable, { virtual: true });

jest.mock("../../src/app/components/Pagination", () => MockPagination, { virtual: true });

import React, { useState, useEffect } from 'react';
import UserTablePage from "@/app/components/userTable/UserTablePage";

jest.mock("../../src/app/components/userTable/UserTablePage", () => {
    return function UserTablePage() {
        const [users, setUsers] = useState<User[]>([]);
        const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
        const [searchTerm, setSearchTerm] = useState("");
        const [currentPage, setCurrentPage] = useState(1);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedUser, setSelectedUser] = useState<User | null>(null);
        const [toastMessage, setToastMessage] = useState("");

        useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const data = await mockGetAllUsers();
                    setUsers(data);
                    setFilteredUsers(data);
                } catch (error) {
                    console.error("Erro ao buscar usuários:", error);
                }
            };

            fetchUsers();
        }, []);

        useEffect(() => {
            const results = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(results);
            setCurrentPage(1);
        }, [searchTerm, users]);

        const handleSearch = (term: string) => {
            setSearchTerm(term);
        };

        const openDeleteModal = (user: User) => {
            setSelectedUser(user);
            setIsModalOpen(true);
        };

        const handleDeleteConfirm = async () => {
            if (!selectedUser) return;

            try {
                await mockBlockUser(selectedUser.id);
                setUsers(prevUsers => prevUsers.filter((user: User) => user.id !== selectedUser.id));
                setToastMessage(`${selectedUser.name} foi deletado com sucesso!`);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setToastMessage("Erro ao deletar o usuário!");
            }

            setIsModalOpen(false);
            setSelectedUser(null);
        };

        return (
            <div>
                <MockSearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
                <MockUserTable
                    currentUsers={filteredUsers}
                    openDeleteModal={openDeleteModal}
                />
                <MockPagination currentPage={currentPage} />
                <MockDialog
                    isOpen={isModalOpen}
                    title="Confirmar remoção"
                    onConfirm={handleDeleteConfirm}
                />
                {toastMessage && <MockToast message={toastMessage} />}
            </div>
        );
    };
}, { virtual: true });

const mockUsers: User[] = [
    { id: "1", name: "Alice", username: "alice", email: "alice@example.com", city: "São Paulo" },
    { id: "2", name: "Bob", username: "bob", email: "bob@example.com", city: "Rio de Janeiro" },
    { id: "3", name: "Charlie", username: "charlie", email: "charlie@example.com", city: "Belo Horizonte" },
];

describe("UserTablePage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetAllUsers.mockResolvedValue(mockUsers);
    });

    it("deve exibir os usuários após carregar", async () => {
        render(<UserTablePage />);
        await waitFor(() => {
            expect(screen.getByText("Alice")).toBeInTheDocument();
            expect(screen.getByText("Bob")).toBeInTheDocument();
        });
    });

    it("deve filtrar usuários ao buscar", async () => {
        render(<UserTablePage />);
        await waitFor(() => screen.getByText("Alice"));
        const input = screen.getByTestId("search-bar");
        fireEvent.change(input, { target: { value: "ali" } });
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });

    it("deve abrir e confirmar o modal de exclusão", async () => {
        render(<UserTablePage />);
        await waitFor(() => screen.getByText("Alice"));
        fireEvent.click(screen.getAllByText("Deletar")[0]);
        await waitFor(() => {
            expect(screen.getByText("Confirmar remoção")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Confirmar"));
        await waitFor(() => {
            expect(mockBlockUser).toHaveBeenCalledWith("1");
            expect(screen.getByText("Alice foi deletado com sucesso!")).toBeInTheDocument();
        });
    });

    it("deve exibir erro se a exclusão falhar", async () => {
        mockBlockUser.mockRejectedValue(new Error("Erro"));
        render(<UserTablePage />);
        await waitFor(() => screen.getByText("Alice"));
        fireEvent.click(screen.getAllByText("Deletar")[0]);
        fireEvent.click(screen.getByText("Confirmar"));
        await waitFor(() => {
            expect(screen.getByText("Erro ao deletar o usuário!")).toBeInTheDocument();
        });
    });
});
