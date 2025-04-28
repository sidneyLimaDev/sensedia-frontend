import { CreatePostData, UpdatePostData, Post } from '@/app/types/post';
import { api } from './api';

export const postService = {
    async getAll(): Promise<Post[]> {
        const response = await api.get<{ posts: Post[] }>('/posts');
        return response.data.posts;
    },

    async create(data: CreatePostData): Promise<Post> {
        const response = await api.post<Post>('/posts/create', data);
        return response.data;
    },

    async getById(id: string): Promise<Post> {
        const response = await api.get<Post>(`/posts/${id}`);
        return response.data;
    },

    async update(id: string, data: UpdatePostData): Promise<Post> {
        const response = await api.put<Post>(`/posts/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>(`/posts/${id}`);
        return response.data;
    },

    async getPostsByUserId(userId: string): Promise<Post[]> {
        const response = await api.get<{ posts: Post[] }>(`/users/${userId}/posts`);
        return response.data.posts;
    },
};

