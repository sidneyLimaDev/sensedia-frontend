import { User } from "@/app/types/user";
import { Image } from "lucide-react";

type UserAlbumsProps = {
    user: User;
};

export function UserAlbums({ user }: UserAlbumsProps) {
    return (
        <div className="space-y-6">
            {user.albums && user.albums.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.albums.map((album) => (
                        <div key={album.id} className="border border-sensedia-gray-25 rounded-lg overflow-hidden bg-gray-50">
                            <div className="h-32 bg-sensedia-gray-25 flex items-center justify-center">
                                <Image size={48} className="text-gray-400" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium">{album.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(album.created_at || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p>Este usuário não possui álbuns</p>
                </div>
            )}
        </div>
    );
}