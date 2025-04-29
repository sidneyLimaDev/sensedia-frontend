import { User } from "@/app/types/user";
import { Trash2 } from "lucide-react";
import Link from "next/link";

type UserTableProps = {
    users: User[];
    isLoading: boolean;
    currentUsers: User[];
    openDeleteModal: (user: User) => void;
};

const UserTable = ({ isLoading, currentUsers, openDeleteModal }: UserTableProps) => {
    return (
        <div className="overflow-x-auto border-b-[1px] border-sensedia-gray-25" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table className="w-full text-sm">
                <thead className=" uppercase text-xs sticky -top-1 ">
                    <tr className="bg-gray-50 text-[#919191] border-y-[1px] border-gray-200">
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
                <tbody className="divide-y divide-gray-200 ">
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
                                    <Link href={`/user/${user.id}`} className="font-bold  hover:text-purple-600 hover:underline">
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
    );
};

export default UserTable;
