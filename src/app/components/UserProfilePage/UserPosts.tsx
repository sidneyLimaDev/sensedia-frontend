import { User } from "@/app/types/user";
import { getInitials } from "../../../lib/utils";

type UserPostsProps = {
    user: User;
};

export function UserPosts({ user }: UserPostsProps) {


    return (
        <div className="space-y-6">
            {user.posts && user.posts.length > 0 ? (
                user.posts.map((post) => (
                    <div key={post.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xs">
                                {getInitials(user.name)}
                            </div>
                            <div>
                                <div className="font-medium">@{user.username || user.email.split("@")[0]}</div>
                                <div className="text-gray-500 text-xs">
                                    {new Date(post.created_at || Date.now()).toLocaleDateString() +
                                        ", " +
                                        new Date(post.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">{post.body || post.title}</p>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p>Este usuário não possui posts.</p>
                </div>
            )}
        </div>
    );
}