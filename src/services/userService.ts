import { CreateUserData, UpdateUserData, User } from '@/app/types/user';
import { api } from './api';

export const userService = {
    async getAll(): Promise<User[]> {
        try {
            const response = await api.get<{ users: User[] }>('/users');
            return response.data.users || [];
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw error;
        }
    },

    async getById(id: string): Promise<User> {
        try {
            const response = await api.get<{ user: User }>(`/users/${id}`);
            if (response.data && response.data.user) {
                return response.data.user;
            }
            throw new Error(`Usuário com ID ${id} não encontrado ou formato de resposta inválido`);
        } catch (error) {
            console.error(`Erro ao buscar usuário ${id}:`, error);
            throw error;
        }
    },

    async create(data: CreateUserData): Promise<User> {
        try {
            console.log('userService.create - Dados enviados para API:', data);

            // Garante que os dados estão no formato esperado pela API
            const apiData = {
                email: data.email,
                name: data.name,
                password: data.password
            };

            const response = await api.post<{ user: User }>('/users/create', apiData);
            console.log('userService.create - Resposta da API:', response.data);

            // Extrai o objeto user da resposta
            if (response.data && response.data.user) {
                return response.data.user;
            } else {
                throw new Error('Formato de resposta da API inválido');
            }
        } catch (error) {
            console.error('Erro ao criar usuário na API:', error);
            throw error;
        }
    },

    async update(id: string, data: UpdateUserData): Promise<User> {
        try {
            const response = await api.put<{ user: User }>(`/users/${id}`, data);
            if (response.data && response.data.user) {
                return response.data.user;
            }
            throw new Error(`Erro ao atualizar usuário ${id}: formato de resposta inválido`);
        } catch (error) {
            console.error(`Erro ao atualizar usuário ${id}:`, error);
            throw error;
        }
    },

    async delete(id: string): Promise<{ message: string }> {
        try {
            const response = await api.delete<{ message: string }>(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao excluir usuário ${id}:`, error);
            throw error;
        }
    },
};