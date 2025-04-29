import { useState } from "react";
import { User } from "@/app/types/user";
import { MessageSquare, Library } from "lucide-react";
import { UserPosts } from "./UserPosts";
import { UserAlbums } from "./UserAlbums";

type ContentTabsProps = {
    user: User;
};

export function ContentTabs({ user }: ContentTabsProps) {
    const [activeTab, setActiveTab] = useState<"posts" | "albums">("posts");

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
                <div className="flex">
                    <button
                        className={`px-6 py-3 font-medium text-sm ${activeTab === "posts"
                            ? "border-b-2 border-sensedia-purple-primary text-sensedia-purple-primary"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab("posts")}
                    >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <MessageSquare size={18} />
                            Posts
                        </div>
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm ${activeTab === "albums"
                            ? "border-b-2 border-sensedia-purple-primary text-sensedia-purple-primary"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab("albums")}
                    >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Library size={18} />
                            Álbuns
                        </div>
                    </button>
                </div>
            </div>

            <div className="p-6">
                {activeTab === "posts" ? <UserPosts user={user} /> : <UserAlbums user={user} />}
            </div>
        </div>
    );
}