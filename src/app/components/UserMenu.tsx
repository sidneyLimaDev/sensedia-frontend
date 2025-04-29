"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { getInitials } from "../../lib/utils"

interface UserData {
    fullName: string
    username: string
}

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<UserData | null>(null)
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem("user_data")
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser({
                    fullName: parsedUser.name || parsedUser.fullName || "",
                    username: parsedUser.username || "",
                })
            } catch (error) {
                console.error("Erro ao ler o usuário do localStorage:", error)
            }
        }
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user")
        setUser(null)
        router.push("/user/new")
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => router.push("/user/new")}
                    className="text-sm text-purple-500 hover:underline cursor-pointer"
                >
                    Registre-se agora
                </button>
            </div>
        )
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="flex items-center gap-2 cursor-pointer hover:underline"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">
                    {getInitials(user.fullName)}
                </div>
                <span className="text-sm hidden md:inline">
                    {user.fullName}
                </span>
                <ChevronDown className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-black text-white border border-zinc-700 shadow-lg z-10">
                    <ul className="py-1">
                        {["Lista de amigos", "Artigos salvos", "Notificações", "Preferências"].map((item) => (
                            <li
                                key={item}
                                className="px-4 py-2 text-sm cursor-pointer hover:border-l-sensedia-purple-secundary border-5 rounded-l-md border-transparent"
                            >
                                {item}
                            </li>
                        ))}
                        <li
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm cursor-pointer hover:border-l-sensedia-purple-secundary border-5 rounded-l-md border-transparent"
                        >
                            Fechar Sessão
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}
