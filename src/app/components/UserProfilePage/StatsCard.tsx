import { User } from "@/app/types/user";

type StatsCardProps = {
    user: User;
};

export function StatsCard({ user }: StatsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
            <h2 className="text-xl font-bold mb-4">Estatísticas</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-gray-600 text-sm">Posts</div>
                    <div className="font-bold text-lg">{user.posts?.length || 0}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-gray-600 text-sm">Álbuns</div>
                    <div className="font-bold text-lg">{user.albums?.length || 0}</div>
                </div>
            </div>
        </div>
    );
}