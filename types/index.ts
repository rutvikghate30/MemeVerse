export interface Meme {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  box_count?: number;
  captions?: number;
  category?: string;
  likes?: number;
  comments?: Comment[];
  createdAt?: string;
  author?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  bio: string;
  profilePicture: string;
  uploadedMemes: string[];
  likedMemes: string[];
}

export interface MemeCategory {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}