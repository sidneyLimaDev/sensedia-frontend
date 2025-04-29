"use client";

import { useEffect, useState } from "react";
import { User } from "@/app/types/user";
import { useParams } from "next/navigation";
import { bffUserService } from "@/services/bffUserService";
import { LoadingSkeleton } from "@/app/components/UserProfilePage/LoadingSkeleton";
import { UserNotFound } from "@/app/components/UserProfilePage/UserNotFound";
import { UserCard } from "@/app/components/UserProfilePage/UserCard";
import { StatsCard } from "@/app/components/UserProfilePage/StatsCard";
import { ContentTabs } from "@/app/components/UserProfilePage/ContentTabs";


export default function UserProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const userId = params.id as string;

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const userData = await bffUserService.getUserById(userId);
                setUser(userData);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!user) {
        return <UserNotFound />;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <UserCard user={user} />
                <div className="lg:col-span-2">
                    <StatsCard user={user} />
                    <ContentTabs user={user} />
                </div>
            </div>
        </div>
    );
}