import { apiClient } from './client';
import type { PostListItem, PostDetail, CommentItemData } from '../types';

export const postsApi = {
  async getPosts(): Promise<PostListItem[]> {
    const res = await apiClient.get<PostListItem[]>('/api/posts');
    return res.data;
  },

  async getPostById(id: number | string): Promise<PostDetail> {
    const res = await apiClient.get<PostDetail>(`/api/posts/${id}`);
    return res.data;
  },
  
  async createPost(formData: FormData) {
  const res = await apiClient.post('/api/posts', formData);
  return res.data;
},

  async getComments(postId: number | string): Promise<CommentItemData[]> {
    const res = await apiClient.get<CommentItemData[]>(`/api/posts/${postId}/comments`);
    return res.data;
  },

  async addComment(postId: number | string, data: { full_name: string; comment: string }): Promise<CommentItemData> {
    const res = await apiClient.post<CommentItemData>(`/api/posts/${postId}/comments`, data);
    return res.data;
  },
};
