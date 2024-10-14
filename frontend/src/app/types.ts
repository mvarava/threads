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
  _id: string;
  content: string;
  author: User;
  likedByUser: boolean;
  createdAt: Date;
  likes: Like[];
  comments: Comment[];
};

export type Comment = {
  _id: string;
  content: string;
  user: User;
  post: Post;
  createdAt?: Date;
};

export type Like = {
  _id: string;
  user: User;
  post: Post;
};

export type Follow = {
  _id: string;
  follower: User;
  following: User;
};
