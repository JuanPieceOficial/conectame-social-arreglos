export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
};

export type Post = {
  id: string;
  author: User;
  content: string;
  imageUrls?: string[];
  likes: number;
  comments: number;
  timestamp: string;
};
