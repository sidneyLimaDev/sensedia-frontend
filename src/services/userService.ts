import { CreateUserData, UpdateUserData, User } from '@/app/types/user';
import { api } from './api';

export const userService = {
    async getAll(): Promise<User[]> {
        const response = await api.get<{ users: User[] }>('/users');
        return response.data.users;
    },

    async getById(id: string): Promise<User> {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    async create(data: CreateUserData): Promise<User> {
        const response = await api.post<User>('/users/create', data);
        return response.data;
    },

    async update(id: string, data: UpdateUserData): Promise<User> {
        const response = await api.put<User>(`/users/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>(`/users/${id}`);
        return response.data;
    },
};
