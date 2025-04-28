import { Album, CreateAlbumData, UpdateAlbumData, SaveAlbumData } from '@/app/types/album';
import { api } from './api';

export const albumService = {
    async getAll(): Promise<Album[]> {
        const response = await api.get<{ albums: Album[] }>('/albums');
        return response.data.albums;
    },

    async create(data: CreateAlbumData): Promise<Album> {
        const response = await api.post<Album>('/albums', data);
        return response.data;
    },

    async saveAlbumToUser(data: SaveAlbumData): Promise<{ album_id: string; user_id: string; added_at: string }> {
        const response = await api.post<{ album_id: string; user_id: string; added_at: string }>('/albums/save', data);
        return response.data;
    },

    async getById(id: string): Promise<Album> {
        const response = await api.get<Album>(`/albums/${id}`);
        return response.data;
    },

    async update(id: string, data: UpdateAlbumData): Promise<Album> {
        const response = await api.put<Album>(`/albums/${id}`, data);
        return response.data;
    },

    async getAlbumsByUserId(userId: string): Promise<Album[]> {
        const response = await api.get<{ albums: Album[] }>(`/users/${userId}/albums`);
        return response.data.albums;
    },
};
