export interface Post {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export type CreatePostData = {
    content: string;
    user_id: string;
};

export type UpdatePostData = {
    content: string;
    user_id: string;
};
