export interface UserInfo {
  id?: number;
  full_name: string;
  city?: string;
  country?: string;
  bio?: string;
  photo?: string;
  avatar_url?: string;
  avatar?: string;
  image?: string;
}

export interface PostListItem {
  id: number;
  title: string;
  excerpt: string;
  photo: string;
  country?: string;
  city?: string;
  location?: string; 
}

export interface CommentItemData {
  id?: number;
  post_id?: number;
  author_name: string;
  comment: string;
  created_at?: string;
}

export interface PostDetail {
  id: number;
  title: string;
  description: string;
  country: string;
  city: string;
  photo: string;
  comments: CommentItemData[];
  userInfo: UserInfo;
}

export interface AuthResponse {
  token: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name?: string;
}
