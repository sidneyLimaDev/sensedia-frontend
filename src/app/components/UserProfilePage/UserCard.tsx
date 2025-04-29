import { Mail, MapPin, Calendar, Clock } from "lucide-react";
import { User } from "@/app/types/user";
import { formatDays, getInitials } from "../../../lib/utils";

type UserCardProps = {
    user: User;
};

export function UserCard({ user }: UserCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-purple-600 rounded-full w-24 h-24 flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {getInitials(user.name)}
                </div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500">@{user.username || user.email.split("@")[0]}</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="text-gray-500 pt-1">
                        <Mail size={20} />
                    </div>
                    <div>
                        <div className="font-medium">E-mail</div>
                        <div className="text-gray-600">{user.email}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="text-gray-500 pt-1">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <div className="font-medium">Cidade</div>
                        <div className="text-gray-600">{user.city || "Não especificada"}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="text-gray-500 pt-1">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="font-medium">Dias disponíveis</div>
                        <div className="text-gray-600">{formatDays(user.days_of_week)}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="text-gray-500 pt-1">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="font-medium">Registro</div>
                        <div className="text-gray-600">
                            {new Date(user.created_at || Date.now()).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}