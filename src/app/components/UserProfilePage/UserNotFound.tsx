import Link from "next/link";

export function UserNotFound() {
    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col items-center gap-4 py-12">
                <h1 className="text-2xl font-bold">Usuário não encontrado</h1>
                <p className="text-gray-600">O usuário que você procura não existe ou foi excluído.</p>
                <Link href="/users" className="mt-4 text-purple-600 hover:underline">
                    Voltar para a lista de usuários
                </Link>
            </div>
        </div>
    );
}