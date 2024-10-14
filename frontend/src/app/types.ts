export type User = {
  _id: string;
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  location?: string;
  isFollowing?: boolean;
};

export type Post = {
  id: string;
  content: string;
  author: User;
  likedByUser: boolean;
  createdAt: Date;
  likes: Like[];
  comments: Comment[];
};

export type Comment = {
  id: string;
  content: string;
  user: User;
  post: Post;
  createdAt?: Date;
};

export type Like = {
  id: string;
  user: User;
  post: Post;
};

export type Follow = {
  id: string;
  follower: User;
  following: User;
};
