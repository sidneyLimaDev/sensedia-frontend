export interface Album {
    id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export type CreateAlbumData = {
    title: string;
    description: string;
};

export type UpdateAlbumData = {
    title: string;
    description: string;
};

export type SaveAlbumData = {
    album_id: string;
    user_id: string;
};
